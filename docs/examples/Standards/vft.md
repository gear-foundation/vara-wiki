---
sidebar_label: VFT (ERC-20)
sidebar_position: 1
---

# Vara Fungible Token (VFT) Standard and Extended Implementation

:::note
The Vara Fungible Token Standard is the analogue of ERC-20 on Ethereum.
:::

The Vara Fungible Token Standard outlines a unified API for implementing fungible token functionalities in programs. The initial section of this document provides a comprehensive examination of the core VFT service, which serves as a foundational framework. It covers essential operations such as token transfers and approvals for third-party spending, detailing the contract state, interface, and key methods involved. The source code of the standard-service is avaiable on the [GitHub](https://github.com/gear-foundation/standards/tree/master/vft-service).

The subsequent section expands on how to leverage and extend this core service to develop a fully functional token application. It illustrates the process of adding advanced features like minting and burning, demonstrating how to build upon the core VFT service to create a comprehensive and customizable token system. This extension highlights the flexibility and potential of the core standard, providing a pathway to develop more sophisticated and tailored token solutions. The source code of the extended version is avaiable on the [GitHub](https://github.com/gear-foundation/standards/tree/master/extended-vft).

A frontend guide showing how to use the `React Sails Hooks` with extended VFT program is available [here](/docs/examples/Standards/vft-frontend).

:::tip
The project code is developed using the [Sails](../../build/sails/sails.mdx) framework.
::: 

## Public CodeIds

You can instantiate the extended VFT using the public CodeId below. The instantiating account becomes the initial admin/minter/burner.

- **CodeId**: `0x81663df58f48684923777cd8cf281bfd2e4ee427926abc52a1fcf4ecd41be7ad`  
  * Mainnet: [link](https://idea.gear-tech.io/code/0x81663df58f48684923777cd8cf281bfd2e4ee427926abc52a1fcf4ecd41be7ad?node=wss%3A%2F%2Frpc.vara.network)
  * Testnet: [link](https://idea.gear-tech.io/code/0x81663df58f48684923777cd8cf281bfd2e4ee427926abc52a1fcf4ecd41be7ad?node=wss%3A%2F%2Ftestnet.vara.network)

> Open Gear IDEA → **Codes**, select the network, paste the CodeId, and click **Create Program**.

## Core VFT Service

### Functions

The VFT service includes the following functions:

- `Approve(spender, value)`
- `Transfer(to, value)`
- `TransferFrom(from, to, value)`
- `Allowance(owner, spender)`
- `BalanceOf(owner)`
- `Decimals()`
- `Name()`
- `Symbol()`
- `TotalSupply()`

### Events

The core service also defines the following events:

- `Approval(owner, spender, value)`
- `Transfer(from, to, value)`

### Key Methods

#### `Approve`

```rust
pub fn approve(&mut self, spender: ActorId, value: U256) -> bool
```

This function allows a designated spender to withdraw up to a specified value of tokens from the caller's account, multiple times up to the specified amount. A subsequent call resets the allowance to the new value. A boolean value indicates the success of the operation, and the function triggers an `Approval` event upon successful execution.

#### `Transfer`

```rust
pub fn transfer(&mut self, to: ActorId, value: U256) -> bool
```

This function transfers a specified value of tokens to a designated account. It returns a boolean value indicating the success of the operation and triggers a `Transfer` event upon successful execution.

#### `TransferFrom`

```rust
pub fn transfer_from(&mut self, from: ActorId, to: ActorId, value: U256) -> bool
```

This function transfers a specified value of tokens from one account to another, using the allowance mechanism. The transferred value is deducted from the caller’s allowance. A boolean value indicates the success of the operation, and a `Transfer` event is generated upon successful execution.


### Query methods

#### `name`

Returns the name of the token.

```rust
pub fn name(&self) -> String 
```

#### `symbol`

Returns the symbol of the token.

```rust
pub fn symbol(&self) -> String 
```

#### `decimals`

Returns the decimals of the token.

```rust
pub fn decimals(&self) -> u8
```

#### `total_supply`

Returns the total supply of the token.

```rust
pub fn total_supply(&self) -> U256
```

#### `balance_of`

Returns the token balance of the `owner` address.

```rust
pub fn balance_of(&self, account: ActorId) -> U256
```

#### `allowance`

Returns the number of tokens the `spender` account is authorized to spend on behalf of the `owner`.

```rust
pub fn allowance(&self, owner: ActorId, spender: ActorId) -> U256 
```  
  


:::note

The service provided here is not a complete application but serves as a foundational base or core for creating your own token. It can be extended and inherited to add additional functionality, allowing developers to build upon this framework. The code for this service is available on [GitHub](https://github.com/gear-foundation/standards/tree/master/vft-service). The extended version demonstrates how to utilize this base service to create a fully functional application, showcasing the process of expanding its capabilities into a finished program.

:::

## Extended VFT Implementation

### Additional Features

The extended implementation introduces new functions and events that enhance the basic VFT service. The additional features include:

#### Functions

- `Mint(to, value)`
- `Burn(from, value)`
- `GrantAdminRole(to)`
- `GrantBurnerRole(to)`
- `GrantMinterRole(to)`
- `RevokeAdminRole(from)`
- `RevokeBurnerRole(from)`
- `RevokeMinterRole(from)`
- `Admins()`
- `Burners()`
- `Minters()`

#### Events

- `Minted(to, value)`
- `Burned(from, value)`

### Implementation Details

To incorporate the extended functionality, the VFT service is first added as a dependency in the `Cargo.toml` file:

```toml
vft-service = { git = "https://github.com/gear-foundation/standards" }
```

A new service is created that extends the existing VFT service:

```rust
use vft_service::Service as VftService;

pub struct ExtendedService {
    vft: VftService,
}
```

The `#[service(extends = VftService, events = Event)]` attribute is used to ensure that the `ExtendedService` inherits methods and properties from `VftService`, making all core functionalities available within the extended service.

### Key Methods

#### `Mint`

```rust
pub fn mint(&mut self, to: ActorId, value: U256) -> bool
```

This function mints new tokens and assigns them to a specified actor. The function checks if the caller has the minter role and triggers a `Minted` event if the minting is successful.

#### `Burn`

```rust
pub fn burn(&mut self, from: ActorId, value: U256) -> bool
```

This function burns tokens from a specified actor. It checks if the caller has the burner role and triggers a `Burned` event if the burning is successful.

#### Role Management

- `grant_admin_role(&mut self, to: ActorId)`
- `grant_minter_role(&mut self, to: ActorId)`
- `grant_burner_role(&mut self, to: ActorId)`
- `revoke_admin_role(&mut self, from: ActorId)`
- `revoke_minter_role(&mut self, from: ActorId)`
- `revoke_burner_role(&mut self, from: ActorId)`

These methods manage the assignment and revocation of administrative, minting, and burning roles, ensuring that only authorized actors can perform sensitive operations.

### Query methods

#### `minters`

Returns a list of all actors who have the minter role.

```rust
pub fn minters(&self) -> Vec<ActorId> 
```

#### `burners`

Returns a list of all actors who have the burner role.

```rust
pub fn burners(&self) -> Vec<ActorId> 
```

#### `admins`

Returns a list of all actors who have the admin role.

```rust
pub fn admins(&self) -> Vec<ActorId> 
```

### Contract Interface

The extended service incorporates the following interface:

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

The Extended VFT implementation illustrates how the core VFT service can be expanded to incorporate advanced features like minting, burning, and role management. This extension provides a versatile framework that developers can adapt to meet specific use cases, enabling more robust and feature-rich token systems. By leveraging these additional capabilities, the Extended VFT offers a comprehensive foundation for creating custom token solutions within the Vara ecosystem.

For a more detailed implementation, the code for the Extended VFT can be found on [GitHub](https://github.com/gear-foundation/standards/tree/master/extended-vft).

:::

## Conclusion

The core [VFT service](https://github.com/gear-foundation/standards/tree/master/vft-service) establishes a robust foundation for implementing fungible tokens within the Vara ecosystem, encompassing essential functionalities that adhere to recognized token standards. This service functions as a fundamental core, with the [Extended VFT](https://github.com/gear-foundation/standards/tree/master/extended-vft) illustrating how it can be expanded to incorporate advanced capabilities, including minting, burning, and role management. Together, these implementations provide a comprehensive framework for developers, facilitating the creation of tailored and sophisticated token systems. By utilizing both the core service and its extended functionalities, developers are well-positioned to design flexible and secure token solutions that address specific requirements and enhance overall system capabilities.
