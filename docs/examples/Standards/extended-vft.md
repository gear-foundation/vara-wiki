---
sidebar_label: EXTENDED VFT (ERC-20)
sidebar_position: 2
---

# Extended Vara Fungible Token

This article is dedicated to the extension of the VFT standard as discussed in the paper [Vara fungible tokens - VFT](vft.md). Specifically, it will implement the mint and burn functionalities. However, this example should be considered as an illustrative implementation, as extensions to the standard may take various forms.

For a more detailed implementation, the code related to this article can be found on [GitHub](https://github.com/gear-foundation/standards/tree/master/extended-vft).

## Possible additional features

```
    Mint(to, value)
    Burn(from, value)
    GrantAdminRole(to)
    GrantBurnerRole(to)
    GrantMinterRole(to)
    RevokeAdminRole(from)
    RevokeBurnerRole(from)
    RevokeMinterRole(from)
    Admins()
    Burners()
    Minters()
```

## Possible additional events

```
    Minted(to, value)
    Burned(from, value)
```

## Implementation details

To extend the functionality, it is necessary to add the existing VFT standard in the `Cargo.toml` file

```toml
vft-service = { git = "https://github.com/gear-foundation/standards" }
```

After adding the necessary dependency to `Cargo.toml`, a new service can be created in the extended version that includes the old one

```rust
use vft_service::Service as VftService;

pub struct ExtendedService {
    vft: VftService,
}
```

In order to extend the functionality it is necessary to use the extends argument in the `#[service]` attribute, *ExtendedService* then inherits the methods and properties of *VftService*. This means that all functionality provided by the *VftService* will now be available in the *ExtendedService*.

```rust
#[service(extends = VftService, events = Event)]
impl ExtendedService {
    // Realization of new functionality
}
```

The `events = Event` part indicates that *ExtendedService* will handle events specified in the `Event` structure. These events can be emitted during the execution of the service’s methods.

```rust
pub enum Event {
    Minted { to: ActorId, value: U256 },
    Burned { from: ActorId, value: U256 },
}
```

Overall, the implementation of new methods in the extended version takes the following form:

```rust
#[service(extends = VftService, events = Event)]
impl ExtendedService {
    pub fn new() -> Self {
        Self {
            vft: VftService::new(),
        }
    }
    pub fn mint(&mut self, to: ActorId, value: U256) -> bool {
        if !self.get().minters.contains(&msg::source()) {
            panic!("Not allowed to mint")
        };

        let mutated = services::utils::panicking(|| {
            funcs::mint(Storage::balances(), Storage::total_supply(), to, value)
        });
        if mutated {
            let _ = self.notify_on(Event::Minted { to, value });
        }
        mutated
    }

    pub fn burn(&mut self, from: ActorId, value: U256) -> bool {
        if !self.get().burners.contains(&msg::source()) {
            panic!("Not allowed to burn")
        };

        let mutated = services::utils::panicking(|| {
            funcs::burn(Storage::balances(), Storage::total_supply(), from, value)
        });
        if mutated {
            let _ = self.notify_on(Event::Burned { from, value });
        }
        mutated
    }

    pub fn grant_admin_role(&mut self, to: ActorId) {
        self.ensure_is_admin();
        self.get_mut().admins.insert(to);
    }
    pub fn grant_minter_role(&mut self, to: ActorId) {
        self.ensure_is_admin();
        self.get_mut().minters.insert(to);
    }
    pub fn grant_burner_role(&mut self, to: ActorId) {
        self.ensure_is_admin();
        self.get_mut().burners.insert(to);
    }

    pub fn revoke_admin_role(&mut self, from: ActorId) {
        self.ensure_is_admin();
        self.get_mut().admins.remove(&from);
    }
    pub fn revoke_minter_role(&mut self, from: ActorId) {
        self.ensure_is_admin();
        self.get_mut().minters.remove(&from);
    }
    pub fn revoke_burner_role(&mut self, from: ActorId) {
        self.ensure_is_admin();
        self.get_mut().burners.remove(&from);
    }
    pub fn minters(&self) -> Vec<ActorId> {
        self.get().minters.clone().into_iter().collect()
    }

    pub fn burners(&self) -> Vec<ActorId> {
        self.get().burners.clone().into_iter().collect()
    }

    pub fn admins(&self) -> Vec<ActorId> {
        self.get().admins.clone().into_iter().collect()
    }
}
```

## Key methods

### `Mint`

```rust
pub fn mint(&mut self, to: ActorId, value: U256) -> bool
```

Mints new tokens and assigns them to the specified actor (to). It first checks if the caller has the minter role. If the minting is successful, it triggers a `Minted` event.

### `Burn`

```rust
pub fn burn(&mut self, from: ActorId, value: U256) -> bool
```

Burns tokens from the specified actor (from). It checks if the caller has the burner role. If the burning is successful, it triggers a `Burned` event.

### `Grant admin role`

```rust
pub fn grant_admin_role(&mut self, to: ActorId)
```

Grants the admin role to the specified actor (to). This function can only be called by an existing admin.

### `Grant minter role`

```rust
pub fn grant_minter_role(&mut self, to: ActorId)
```

Grants the minter role to the specified actor (to). This function can only be called by an existing admin.

### `Grant burner role`

```rust
pub fn grant_burner_role(&mut self, to: ActorId)
```

Grants the burner role to the specified actor (to). This function can only be called by an existing admin.

### `Revoke admin role`

```rust
pub fn revoke_admin_role(&mut self, from: ActorId)
```

Revokes the admin role from the specified actor (from). This function can only be called by an existing admin.

### `Revoke minter role`

```rust
pub fn revoke_minter_role(&mut self, from: ActorId)
```

Revokes the minter role from the specified actor (from). This function can only be called by an existing admin.

### `Revoke burner role`

```rust
pub fn revoke_burner_role(&mut self, from: ActorId)
```

Revokes the burner role from the specified actor (from). This function can only be called by an existing admin.


## Query methods

### `minters`

Returns a list of all actors who have the minter role.

```rust
pub fn minters(&self) -> Vec<ActorId> 
```

### `burners`

Returns a list of all actors who have the burner role.

```rust
pub fn burners(&self) -> Vec<ActorId> 
```

### `admins`

Returns a list of all actors who have the admin role.

```rust
pub fn admins(&self) -> Vec<ActorId> 
```

## Contract Interface

```rust
constructor {
  New : (name: str, symbol: str, decimals: u8);
};

service Vft {
  Burn : (from: actor_id, value: u256) -> bool;
  GrantAdminRole : (to: actor_id) -> null;
  GrantBurnerRole : (to: actor_id) -> null;
  GrantMinterRole : (to: actor_id) -> null;
  Mint : (to: actor_id, value: u256) -> bool;
  RevokeAdminRole : (from: actor_id) -> null;
  RevokeBurnerRole : (from: actor_id) -> null;
  RevokeMinterRole : (from: actor_id) -> null;
  Approve : (spender: actor_id, value: u256) -> bool;
  Transfer : (to: actor_id, value: u256) -> bool;
  TransferFrom : (from: actor_id, to: actor_id, value: u256) -> bool;
  query Admins : () -> vec actor_id;
  query Burners : () -> vec actor_id;
  query Minters : () -> vec actor_id;
  query Allowance : (owner: actor_id, spender: actor_id) -> u256;
  query BalanceOf : (account: actor_id) -> u256;
  query Decimals : () -> u8;
  query Name : () -> str;
  query Symbol : () -> str;
  query TotalSupply : () -> u256;

  events {
    Minted: struct { to: actor_id, value: u256 };
    Burned: struct { from: actor_id, value: u256 };
    Approval: struct { owner: actor_id, spender: actor_id, value: u256 };
    Transfer: struct { from: actor_id, to: actor_id, value: u256 };
  }
};
```

:::note
It incorporates methods and events from the core standard, seamlessly integrating them into advanced functionality.
:::


## Conclusion 

This implementation exemplifies a potential extension of the standard VFT framework. It illustrates the addition of minting and burning functionalities, underscoring the flexibility for further adaptations and enhancements to the standard. Developers can leverage this example as a foundational reference for exploring and implementing custom extensions tailored to specific use cases within the VFT ecosystem.
