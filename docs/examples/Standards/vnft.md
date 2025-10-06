---
sidebar_label: VNFT (ERC-721)
sidebar_position: 2
---

# Vara Non-Fungible Token

:::note
The Vara Non-Fungible Token Standard is the analogue of ERC-721 on Ethereum.
:::

The Vara Non-Fungible Token Standard outlines a unified API for implementing non-fungible token functionalities in programs. The initial section of this document provides a comprehensive examination of the core VNFT service, which serves as a foundational framework. It covers essential operations such as token transfers and approvals for third-party spending, detailing the contract state, interface, and key methods involved. The source code of the standard-service is avaiable on the [GitHub](https://github.com/gear-foundation/standards/tree/master/vnft-service).

The subsequent section expands on how to leverage and extend this core service to develop a fully functional token application. It illustrates the process of adding advanced features like minting and burning, demonstrating how to build upon the core VNFT service to create a comprehensive and customizable token system. This extension highlights the flexibility and potential of the core standard, providing a pathway to develop more sophisticated and tailored token solutions. The source code of the extended version is avaiable on the [GitHub](https://github.com/gear-foundation/standards/tree/master/extended-vnft).

:::tip
The project code is developed using the [Sails](../../build/sails/sails.mdx) framework.
:::

## Public CodeIds

You can instantiate the extended VFT using the public CodeId below. The instantiating account becomes the initial admin/minter/burner.

- **CodeId**: `0xbba6636d3bec4f203d4ae9b58d9bc9995c7aa20344028001f22dceb43911afad`  
  * Mainnet: [link](https://idea.gear-tech.io/code/0xbba6636d3bec4f203d4ae9b58d9bc9995c7aa20344028001f22dceb43911afad?node=wss%3A%2F%2Frpc.vara.network)
  * Testnet: [link](https://idea.gear-tech.io/code/0xbba6636d3bec4f203d4ae9b58d9bc9995c7aa20344028001f22dceb43911afad?node=wss%3A%2F%2Ftestnet.vara.network)

> Open Gear IDEA → **Codes**, select the network, paste the CodeId, and click **Create Program**.


## Functions

```
  Approve(to, token_id)
  Transfer(to, token_id)
  TransferFrom(from, to, token_id)
  OwnerOf(token_id)
  BalanceOf(owner) 
  GetApproved(token_id)
  Name()
  Symbol()
```

## Events

```
    Approval(owner, approved, token_id);
    Transfer(from, to, token_id);
```

## Key Methods

### `Approve`

```rust
pub fn approve(&mut self, approved: ActorId, token_id: TokenId)
```

This function authorizes a designated account (`approved`) to transfer the specified NFT (`token_id`) on behalf of the owner. Only one account can be approved at a time for a specific NFT. If the function is called again with a different approved address, it overrides the previous approval. If the function is called with the zero address as approved, it cancels the existing approval. This action triggers the `Approval` event:

```rust
Approval {
    owner: ActorId,
    approved: ActorId,
    token_id: TokenId,
}
```

### `Transfer`

```rust
pub fn transfer(&mut self, to: ActorId, token_id: TokenId)
```

This function transfers ownership of a specific NFT (`token_id`) to another account (`to`). The caller must be the current owner of the NFT. Upon successful execution, it generates the `Transfer` event:

```rust
Transfer {
    from: ActorId,
    to: ActorId,
    token_id: TokenId,
}
```

### `TransferFrom`

```rust
pub fn transfer_from(&mut self, from: ActorId, to: ActorId, token_id: TokenId)
```

This function facilitates the transfer of an NFT from one account (`from`) to another (`to`), using the approval mechanism. It allows a third party to transfer an NFT on behalf of its owner, provided the caller has been previously approved. The function triggers the `Transfer` event upon success:

```rust
Transfer {
    from: ActorId,
    to: ActorId,
    token_id: TokenId,
}
```

## Query Methods

### `owner_of`

Returns the owner of a specified NFT (`token_id`).

```rust
pub fn owner_of(&self, token_id: TokenId) -> ActorId
```

### `balance_of`

Returns the number of NFTs owned by a specific account (`owner`).

```rust
pub fn balance_of(&self, owner: ActorId) -> U256
```

### `get_approved`

Returns the account approved to transfer a specific NFT (`token_id`), or the zero address if no approval exists.

```rust
pub fn get_approved(&self, token_id: TokenId) -> ActorId
```

### `name`

Returns the name of the NFT collection.

```rust
pub fn name(&self) -> String 
```

### `symbol`

Returns the symbol of the NFT collection.

```rust
pub fn symbol(&self) -> String 
```

:::note

The service provided here is not a complete application but serves as a foundational base or core for creating your own token. It can be extended and inherited to add additional functionality, allowing developers to build upon this framework. The code for this service is available on [GitHub](https://github.com/gear-foundation/standards/tree/master/vnft-service). The extended version demonstrates how to utilize this base service to create a fully functional application, showcasing the process of expanding its capabilities into a finished program.

:::

## Extended VNFT Implementation

### Additional Features

The extended implementation introduces new functions and events that enhance the basic VNFT service. The additional features include:

#### Functions

- `Mint(to, token_metadata)`
- `Burn(from, token_id)`
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

- `Minted(to, token_metadata)`
- `Burned(from, token_id)`

### Implementation Details

To incorporate the extended functionality, the VNFT service is first added as a dependency in the `Cargo.toml` file:

```toml
vnft-service = { git = "https://github.com/gear-foundation/standards" }
```

A new service is created that extends the existing VNFT service:

```rust
use vnft_service::Service as VnftService;

pub struct ExtendedService {
    vnft: VnftService,
}
```

The `#[service(extends = VnftService, events = Event)]` attribute is used to ensure that the `ExtendedService` inherits methods and properties from `VnftService`, making all core functionalities available within the extended service.

### Key Methods

#### `Mint`

```rust
pub fn mint(&mut self, to: ActorId, token_metadata: TokenMetadata)
```

This function mints new tokens and assigns them to a specified actor. The function checks if the caller has the minter role and triggers a `Minted` event if the minting is successful.

#### `Burn`

```rust
pub fn burn(&mut self, from: ActorId, token_id: TokenId)
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

#### `tokens for owner`

Returns a list of all tokens with metadata that the owner holds.
```rust
pub fn tokens_for_owner(&self, owner: ActorId) -> Vec<(TokenId, TokenMetadata)>
```

### Contract Interface

The extended service incorporates the following interface:

```rust
type TokenMetadata = struct {
  name: str,
  description: str,
  media: str,
  reference: str,
};

constructor {
  New : (name: str, symbol: str);
};

service Vnft {
  Burn : (from: actor_id, token_id: u256) -> null;
  GrantAdminRole : (to: actor_id) -> null;
  GrantBurnerRole : (to: actor_id) -> null;
  GrantMinterRole : (to: actor_id) -> null;
  Mint : (to: actor_id, token_metadata: TokenMetadata) -> null;
  RevokeAdminRole : (from: actor_id) -> null;
  RevokeBurnerRole : (from: actor_id) -> null;
  RevokeMinterRole : (from: actor_id) -> null;
  Approve : (approved: actor_id, token_id: u256) -> null;
  Transfer : (to: actor_id, token_id: u256) -> null;
  TransferFrom : (from: actor_id, to: actor_id, token_id: u256) -> null;
  query Admins : () -> vec actor_id;
  query Burners : () -> vec actor_id;
  query Minters : () -> vec actor_id;
  query TokenId : () -> u256;
  query TokenMetadataById : (token_id: u256) -> opt TokenMetadata;
  query TokensForOwner : (owner: actor_id) -> vec struct { u256, TokenMetadata };
  query BalanceOf : (owner: actor_id) -> u256;
  query GetApproved : (token_id: u256) -> actor_id;
  query Name : () -> str;
  query OwnerOf : (token_id: u256) -> actor_id;
  query Symbol : () -> str;

  events {
    Minted: struct { to: actor_id, token_metadata: TokenMetadata };
    Burned: struct { from: actor_id, token_id: u256 };
    Transfer: struct { from: actor_id, to: actor_id, token_id: u256 };
    Approval: struct { owner: actor_id, approved: actor_id, token_id: u256 };
  }
};
```

:::note

The Extended VNFT implementation illustrates how the core VNFT service can be expanded to incorporate advanced features like minting, burning, and role management. This extension provides a versatile framework that developers can adapt to meet specific use cases, enabling more robust and feature-rich token systems. By leveraging these additional capabilities, the Extended VNFT offers a comprehensive foundation for creating custom token solutions within the Vara ecosystem.

For a more detailed implementation, the code for the Extended VNFT can be found on [GitHub](https://github.com/gear-foundation/standards/tree/master/extended-vnft).

:::

## Conclusion

The core [VNFT service](https://github.com/gear-foundation/standards/tree/master/vnft-service) establishes a robust foundation for implementing non-fungible tokens within the Vara ecosystem, encompassing essential functionalities that adhere to recognized token standards. This service functions as a fundamental core, with the [Extended VNFT](https://github.com/gear-foundation/standards/tree/master/extended-vnft) illustrating how it can be expanded to incorporate advanced capabilities, including minting, burning, and role management. Together, these implementations provide a comprehensive framework for developers, facilitating the creation of tailored and sophisticated token systems. By utilizing both the core service and its extended functionalities, developers are well-positioned to design flexible and secure token solutions that address specific requirements and enhance overall system capabilities.

