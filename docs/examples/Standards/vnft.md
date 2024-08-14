---
sidebar_label: VNFT (ERC-721)
sidebar_position: 3
---

# Vara Non-Fungible Token

:::note
The Vara Non-Fungible Token Standard is the analogue of ERC-721 on Ethereum.
:::

The Vara Non-Fungible Token Standard provides a unified API for smart contracts to implement non-fungible token (NFT) functionalities. It covers essential operations such as token ownership transfer, approval for third-party transfers, and metadata retrieval. The contract state, interface, and key methods are detailed below.

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

## Conclusion

By adhering to this standard, smart contracts can ensure interoperability and provide a consistent user experience across different platforms and applications within the blockchain ecosystem.

Utilizing this standard, developers can ensure that their NFTs are easily integrated into wallets, marketplaces, and other dApps, assuming these platforms also support the standard.
