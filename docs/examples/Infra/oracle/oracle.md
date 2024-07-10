---
sidebar_label: Vara Oracle
sidebar_position: 1
---

# Vara Oracle

## What is Oracle?

Blockchain oracles are a combination of programs (smart contracts) and off-chain entities that connect blockchains to external systems (APIs, etc.), allowing other programs to execute depending on real-world inputs and outputs. Oracles give the Web3 ecosystem a method to connect to existing legacy systems, data sources, and advanced calculations.

These programs can obtain external data which can't exist in blockchain space. In general, oracles are used for:
- Fetching aggregated token prices in fiat (USD, EUR, etc.)
- Querying Web2 APIs
- Obtaining prices for different securities

Moreover, oracles allow the creation of lending/DEX protocols, which form an important part of DeFi.

This article provides an example of the native implementation of a randomness oracle, which provides the ability to use random numbers in programs. It can be used as is or modified to suit specific scenarios. Anyone can easily create their own oracle and run it on the Vara Network. The source code is available on [GitHub](https://github.com/gear-foundation/dapps-oracle).

## Storage Structure

```rust
#[derive(Debug, Default)]
pub struct RandomnessOracle {
    pub owner: ActorId,
    pub values: BTreeMap<u128, state::Random>,
    pub last_round: u128,
    pub manager: ActorId,
}
```

### `Action` and `Event`

`Event` is generated when `Action` is triggered. The `Action` enum wraps various `Input` structs, and `Event` wraps `Reply`.

```rust
#[derive(Debug, Encode, Decode, TypeInfo)]
pub enum Action {
    RequestValue,
    ChangeManager(ActorId),
}
```

```rust
#[derive(Debug, Encode, Decode, TypeInfo)]
pub enum Event {
    NewValue { value: u128 },
    NewManager(ActorId),
}
```

## Conclusion

The source code of this example of a Vara Oracle program is available on GitHub: [oracle/oracle/src/contract.rs](https://github.com/gear-foundation/dapps-oracle/blob/wip/oracle/src/contract.rs).

See also an example of the program testing implementation based on `gtest` and `gclient`: [oracle/oracle/tests](https://github.com/gear-foundation/dapps-oracle/tree/wip/oracle/tests).

For more details about testing programs written on Vara, refer to this article: [Program Testing](/docs/build/testing).