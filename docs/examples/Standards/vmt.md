---

sidebar_label: VMT (ERC-1155)  
sidebar_position: 3

---

# Vara Multi-Token (VMT) Standard and Extended Implementation

:::note
The Vara Multi-Token (VMT) Standard is the analogue of ERC-1155 on Ethereum.
:::

The VMT Standard outlines a unified API for implementing multi-token functionality in programs. The initial section provides an in-depth exploration of the core VMT service, covering operations like batch token transfers and token balance queries, detailing the contract state, interface, and key methods. The source code of the standard-service is avaiable on the [GitHub](https://github.com/gear-foundation/standards/tree/master/vmt-service).

The following section expands on extending this core service to develop a fully functional multi-token application. This part illustrates how to incorporate minting and burning capabilities and advanced management features, building upon the core VMT service to create a robust and flexible token system. The source code of the extended version is avaiable on the [GitHub](https://github.com/gear-foundation/standards/tree/master/extended-vmt).
 
:::tip
The project code is developed using the [Sails](../../build/sails/sails.mdx) framework.
:::

## Public CodeIds

You can instantiate the extended VFT using the public CodeId below. The instantiating account becomes the initial admin/minter/burner.

- **CodeId**: `0x3c902523c31f930a4169a5149ff439ec2574a6a6cebe3d6c06742bb254073566`  
  * Mainnet: [link](https://idea.gear-tech.io/code/0x3c902523c31f930a4169a5149ff439ec2574a6a6cebe3d6c06742bb254073566?node=wss%3A%2F%2Frpc.vara.network)
  * Testnet: [link](https://idea.gear-tech.io/code/0x3c902523c31f930a4169a5149ff439ec2574a6a6cebe3d6c06742bb254073566?node=wss%3A%2F%2Ftestnet.vara.network)

> Open Gear IDEA → **Codes**, select the network, paste the CodeId, and click **Create Program**.


## Core VMT Service

### Functions

The VMT service includes the following functions:

- `Approve(to)`
- `TransferFrom(from, to, id, amount)`
- `BatchTransferFrom(from, to, ids, amounts)`
- `BalanceOf(account, id)`
- `BalanceOfBatch(accounts, ids)`
- `IsApproved(account, operator)`
- `Name()`
- `Symbol()`
- `Decimals()`
- `TotalSupply()`


### Events

The core service also defines the following events:

- `Approval(from, to)`
- `Transfer(from, to, ids, amounts)`

### Key Methods

#### `Approve`

```rust
pub fn approve(&mut self, to: ActorId) -> bool
```

Allows an account to approve another actor (to) to manage all of its tokens. This function sets the approval status of the operator and returns a boolean indicating success. When approved, the `Approval` event is triggered.

#### `TransferFrom`

```rust
pub fn transfer_from(&mut self, from: ActorId, to: ActorId, id: TokenId, amount: U256)
```

Transfers `amount` of token with ID `id` from the `from` account to the `to` account. The caller must be approved to manage the `from` account's tokens. The `Transfer` event is triggered upon successful execution.

#### `BatchTransferFrom`

```rust
pub fn batch_transfer_from(
    &mut self,
    from: ActorId,
    to: ActorId,
    ids: Vec<TokenId>,
    amounts: Vec<U256>,
)
```

Transfers multiple token types from one account to another. The `ids` array contains token IDs, and the `amounts` array specifies how many of each token type to transfer. This method triggers the `Transfer` event for each token ID and amount.

### Query methods

#### `BalanceOf`

Returns the balance of tokens for a given account and token ID.

```rust
pub fn balance_of(&self, account: ActorId, id: TokenId) -> U256
```

#### `BalanceOfBatch`

Returns the balances of tokens for the specified accounts and token IDs.

```rust
pub fn balance_of_batch(&self, accounts: Vec<ActorId>, id: Vec<TokenId>) -> Vec<U256>
```

#### `IsApproved`

Checks if a specific operator is approved to manage the tokens of the `account`.

```rust
pub fn is_approved(&self, account: ActorId, operator: ActorId) -> bool
```

#### `Name`

Returns the name of the multi-token collection.

```rust
pub fn name(&self) -> &'static str
```

#### `Symbol`

Returns the symbol of the token collection.

```rust
pub fn symbol(&self) -> &'static str
```

#### `Decimals`

Returns the number of decimal places for the tokens.

```rust
pub fn decimals(&self) -> u8
```

#### `TotalSupply`

Returns the total supply of each token ID.

```rust
pub fn total_supply(&self) -> Vec<(TokenId, U256)>
```

:::note

The core VMT service serves as a foundational framework for multi-token contracts. It can be extended to introduce more complex functionality such as minting, burning, and role management. The code for the core service is available on [GitHub](https://github.com/gear-foundation/standards/tree/master/vmt-service).

:::

## Extended VMT Implementation

### Additional Features

The extended implementation adds new functionality to the core VMT service, including:

#### Functions

- `Mint(to, id, amount, token_metadata)`
- `MintBatch(to, ids, amounts, token_metadata)`
- `Burn(from, id, amount)`
- `BurnBatch(from, ids, amounts)`
- `GrantAdminRole(to)`
- `GrantMinterRole(to)`
- `GrantBurnerRole(to)`
- `RevokeAdminRole(from)`
- `RevokeMinterRole(from)`
- `RevokeBurnerRole(from)`
- `Admins()`
- `Minters()`
- `Burners()`


#### Events

- `Minted(to, ids, amounts)`
- `Burned(from, ids, amounts)`

### Implementation Details

The VMT core service is imported and extended:

```rust
use vmt_service::Service as VmtService;

pub struct ExtendedVmtService {
    vmt: VmtService,
}
```

The `#[service(extends = VmtService, events = Event)]` attribute ensures inheritance from `VmtService`.

### Key Methods

#### `Mint`

```rust
pub fn mint(
    &mut self,
    to: ActorId,
    id: TokenId,
    amount: U256,
    token_metadata: Option<TokenMetadata>,
)
```

Mints a new token with a specified ID and amount, assigning it to the `to` account. The optional `token_metadata` field allows storing additional information about the token (like title, description, media and reference). This function triggers the `Minted` event.

#### `MintBatch`

```rust
pub fn mint_batch(
    &mut self,
    to: ActorId,
    ids: Vec<TokenId>,
    amounts: Vec<U256>,
    token_metadata: Vec<Option<TokenMetadata>>,
)
```

Mints multiple types of tokens and assigns them to the `to` account. The function accepts arrays of token IDs and amounts, along with corresponding metadata. It triggers the `Minted` event for all tokens in the batch.

#### `Burn`

```rust
pub fn burn(&mut self, from: ActorId, id: TokenId, amount: U256)
```

Burns a specified amount of tokens with a specific ID from the `from` account. This reduces the total supply of the burned tokens and triggers the `Burned` event.

#### `BurnBatch`

```rust
pub fn burn_batch(&mut self, from: ActorId, ids: Vec<TokenId>, amounts: Vec<U256>) 
```

Burns multiple types of tokens from the `from` account. This method reduces the total supply for each token in the batch and triggers the `Burned` event.

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

The extended VMT service includes the following interface:

```rust
type TokenMetadata = struct {
  title: opt str,
  description: opt str,
  media: opt str,
  reference: opt str,
};

constructor {
  New : (name: str, symbol: str, decimals: u8);
};

service Vmt {
  Burn : (from: actor_id, id: u256, amount: u256) -> null;
  BurnBatch : (from: actor_id, ids: vec u256, amounts: vec u256) -> null;
  GrantAdminRole : (to: actor_id) -> null;
  GrantBurnerRole : (to: actor_id) -> null;
  GrantMinterRole : (to: actor_id) -> null;
  Mint : (to: actor_id, id: u256, amount: u256, token_metadata: opt TokenMetadata) -> null;
  MintBatch : (to: actor_id, ids: vec u256, amounts: vec u256, token_metadata: vec opt TokenMetadata) -> null;
  RevokeAdminRole : (from: actor_id) -> null;
  RevokeBurnerRole : (from: actor_id) -> null;
  RevokeMinterRole : (from: actor_id) -> null;
  Approve : (to: actor_id) -> bool;
  BatchTransferFrom : (from: actor_id, to: actor_id, ids: vec u256, amounts: vec u256) -> null;
  TransferFrom : (from: actor_id, to: actor_id, id: u256, amount: u256) -> null;

  query Admins : () -> vec actor_id;
  query Burners : () -> vec actor_id;
  query Minters : () -> vec actor_id;
  query BalanceOf : (account: actor_id, id: u256) -> u256;
  query BalanceOfBatch : (accounts: vec actor_id, ids: vec u256) -> vec u256;
  query Decimals : () -> u8;


  query IsApproved : (account: actor_id, operator: actor_id) -> bool;
  query Name : () -> str;
  query Symbol : () -> str;
  query TotalSupply : () -> vec struct { u256, u256 };

  events {
    Minted: struct { to: actor_id, ids: vec u256, amounts: vec u256 };
    Burned: struct { from: actor_id, ids: vec u256, amounts: vec u256 };
    Approval: struct { from: actor_id, to: actor_id };
    Transfer: struct { from: actor_id, to: actor_id, ids: vec u256, amounts: vec u256 };
  }
};


```

:::note

This extended VMT service demonstrates how the core functionality can be built upon to include features like minting, burning, and URI management. The complete implementation is available on [GitHub](https://github.com/gear-foundation/standards/tree/master/extended-vmt).

:::

## Conclusion

The core VMT service establishes a solid foundation for implementing multi-token systems within the Vara ecosystem, encompassing essential functionalities that align with recognized token standards. This service acts as a fundamental core, while the Extended VMT implementation demonstrates how it can be expanded to include advanced features such as minting, burning, and role management. Together, these implementations offer a comprehensive framework for developers, enabling the creation of versatile and feature-rich token systems. By leveraging both the core service and its extended capabilities, developers are equipped to design flexible, secure, and scalable token solutions that meet specific needs and enhance overall system functionality.
