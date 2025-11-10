---

sidebar_label: Multi-Token  
sidebar_position: 4  

---

# Vara Multi-Token (VMT) Standard

:::note  
The Vara Multi-Token (VMT) Standard is analogous to ERC-1155 on Ethereum.  
:::

The VMT Standard establishes a unified API for multi-token functionality in applications. It details the core VMT service, which includes operations such as batch token transfers and balance queries, along with the contract's state, interface, and key methods. The source code for the core service can be found on [GitHub](https://github.com/gear-foundation/standards/tree/master/vmt-service).

:::tip
The project code is developed using the [Sails](../../build/sails/sails.mdx) framework.
::: 

## Core VMT Service

### Functions

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

- `Approval(from, to)`
- `Transfer(from, to, ids, amounts)`

### Key Methods

#### `Approve`

```rust
pub fn approve(&mut self, to: ActorId) -> bool
```

Allows one account to authorize another to manage its tokens. Upon success, it triggers the `Approval` event.

#### `TransferFrom`

```rust
pub fn transfer_from(&mut self, from: ActorId, to: ActorId, id: TokenId, amount: U256)
```

Transfers a specified amount of a token from one account to another. The caller must be authorized to manage the tokens. It triggers the `Transfer` event upon success.

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

Transfers multiple token types from one account to another, triggering a `Transfer` event for each.

### Query Methods

#### `BalanceOf`

Returns the balance of a specific token for a given account.

```rust
pub fn balance_of(&self, account: ActorId, id: TokenId) -> U256
```

#### `BalanceOfBatch`

Returns the balances for specified accounts and token IDs.

```rust
pub fn balance_of_batch(&self, accounts: Vec<ActorId>, id: Vec<TokenId>) -> Vec<U256>
```

#### `IsApproved`

Checks if an operator is approved to manage an account's tokens.

```rust
pub fn is_approved(&self, account: ActorId, operator: ActorId) -> bool
```

### Conclusion

The core VMT service forms the foundation for multi-token contracts and can be extended for more advanced functionalities like minting and burning. The complete code is available on [GitHub](https://github.com/gear-foundation/standards/tree/master/vmt-service).
