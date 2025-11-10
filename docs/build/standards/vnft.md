---
sidebar_label: Vara Non-Fungible Token
sidebar_position: 3
---

# Vara Non-Fungible Token (VNFT)

:::note
The Vara Non-Fungible Token Standard is the analogue of ERC-721 on Ethereum.
:::

The Vara Non-Fungible Token (VNFT) Standard provides a unified API for programs to implement non-fungible token (NFT) functionalities. It encompasses critical operations like token transfer and approvals for third-party spending on the blockchain. Below is a detailed look at the state of the program, its interface, and key methods to facilitate these operations.

:::tip
The project code is developed using the [Sails](../../build/sails/sails.mdx) framework.
::: 

## Functions

```
  Approve(approved, token_id)
  Transfer(to, token_id)
  TransferFrom(from, to, token_id)
  BalanceOf(owner)
  OwnerOf(token_id)
  GetApproved(token_id)
  Name()
  Symbol()
```

## Events

```
    Approval(owner, approved, token_id);
    Transfer(from, to, token_id);
```

## Key methods

### `Approve`

```rust
pub fn approve(&mut self, approved: ActorId, token_id: TokenId)
```

This function allows a designated address (`approved`) to transfer a specific token (`token_id`) on behalf of the token owner. It authorizes the `approved` address to handle the given token once. Upon successful execution, it triggers the `Approval` event.

Upon successful execution, triggers the event:

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

Transfers the specified `token_id` to the designated account `to`. This method checks the caller’s ownership before executing the transfer.

Upon successful execution, triggers the event:

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

Transfers a specified `token_id` from one account (`from`) to another (`to`), using the approval mechanism. This function ensures that the caller is authorized to make the transfer either as the owner or as an approved address.

Upon successful execution, triggers the event:

```rust
Transfer {
    from: ActorId,
    to: ActorId,
    token_id: TokenId,
}
```

## Query methods

### `name`

Returns the name of the token collection.

```rust
pub fn name(&self) -> &'static str
```

### `symbol`

Returns the symbol of the token collection.

```rust
pub fn symbol(&self) -> &'static str
```

### `balance_of`

Returns the number of tokens owned by a given `owner` address.

```rust
pub fn balance_of(&self, owner: ActorId) -> U256
```

### `owner_of`

Returns the owner of the specified `token_id`.

```rust
pub fn owner_of(&self, token_id: TokenId) -> ActorId
```

### `get_approved`

Returns the address approved for a specific `token_id`.

```rust
pub fn get_approved(&self, token_id: TokenId) -> ActorId
```

## Conclusion

The provided service is a foundational base for creating your own token, rather than a complete application. It can be extended and inherited to add additional functionality, allowing developers to build upon this framework. The code for this service is available on [GitHub](https://github.com/gear-foundation/standards/tree/master/vnft-service).

By adhering to this standard, programs ensure interoperability and a consistent user experience across platforms and applications within the blockchain ecosystem. dApp developers can also ensure that their in-app tokens, built on this standard, will be natively displayed in user wallets without additional integration efforts, as long as wallet applications support this standard.
