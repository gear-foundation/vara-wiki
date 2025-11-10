---
sidebar_label: Fungible Token
sidebar_position: 2
---

# Vara Fungible Token (VFT)

:::note
The Vara Fungible Token Standard is the analogue of ERC-20 on Ethereum.
:::

The Vara Fungible Token Standard provides a unified API for programs to implement token functionalities. It encompasses critical operations like token transfer and approvals for third-party spending on the blockchain. Below is a detailed look at the state of the program, its interface, and key methods to facilitate these operations.

:::tip
The project code is developed using the [Sails](../../build/sails/sails.mdx) framework.
::: 

## Functions

```
  Approve(spender, value)
  Transfer(to, value)
  TransferFrom(from, to, value)
  Allowance(owner, spender)
  BalanceOf(owner) 
  Decimals()
  Name()
  Symbol()
  TotalSupply()

```

## Events

```
    Approval(owner, spender, value);
    Transfer(from, to, value);
```

## Key methods

### `Approve`

```rust
pub fn approve(&mut self, spender: ActorId, value: U256) -> bool
```

This function allows a designated spender (`spender`) to withdraw up to an `value` of tokens from your account, multiple times up to the amount limit. Resets allowance to `value` with a subsequent call. Returns a boolean value indicating whether the operation succeeded.

Upon successful execution, triggers the event:

```rust
Approval {
    owner: ActorId,
    spender: ActorId,
    value: U256,
}
```

### `Transfer`

```rust
pub fn transfer(&mut self, to: ActorId, value: U256) -> bool
```


Transfers the specified `value` of tokens to the account `to`. Returns a boolean value indicating whether the operation 

Upon successful execution, triggers the event:

```rust
Transfer {
    from: ActorId,
    to: ActorId,
    value: U256,
}
```

### `TransferFrom`

```rust
pub fn transfer_from(&mut self, from: ActorId, to: ActorId, value: U256) -> bool
```
Transfers a specified `value` of tokens `from` one account `to` another, using the allowance mechanism. Value is then deducted from the caller’s allowance. Returns a boolean value indicating whether the operation succeeded.

Upon successful execution, triggers the event:

```rust
Transfer {
    from: ActorId,
    to: ActorId,
    value: U256,
}
```

## Query methods

### `name`

Returns the name of the token.

```rust
pub fn name(&self) -> String 
```

### `symbol`

Returns the symbol of the token.

```rust
pub fn symbol(&self) -> String 
```

### `decimals`

Returns the decimals of the token.

```rust
pub fn decimals(&self) -> u8
```

### `total_supply`

Returns the total supply of the token.

```rust
pub fn total_supply(&self) -> U256
```

### `balance_of`

Returns the token balance of the `owner` address.

```rust
pub fn balance_of(&self, account: ActorId) -> U256
```

### `allowance`

Returns the number of tokens the `spender` account is authorized to spend on behalf of the `owner`.

```rust
pub fn allowance(&self, owner: ActorId, spender: ActorId) -> U256 
```

## Conclusion 

The provided service is a foundational base for creating your own token, rather than a complete application. It can be extended and inherited to add additional functionality, allowing developers to build upon this framework. The code for this service is available on [GitHub](https://github.com/gear-foundation/standards/tree/master/vft-service).

By adhering to this standard, programs ensure interoperability and a consistent user experience across platforms and applications within the blockchain ecosystem. dApp developers can also ensure that their in-app tokens, built on this standard, will be natively displayed in user wallets without additional integration efforts, as long as wallet applications support this standard.
