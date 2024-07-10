---
sidebar_label: Dia Randomness Oracle
sidebar_position: 2
---

# Dia Randomness Oracle

## Randomness in Blockchain

Randomness in blockchains is crucial for a fair and unpredictable distribution of validator responsibilities. Computers are deterministic devices, meaning the same input always produces the same output, making true randomness difficult to achieve. What is commonly referred to as random numbers on a computer are actually pseudo-random. These numbers depend on a sufficiently random seed provided by the user or another type of oracle, such as a weather station for atmospheric noise, heart rate, or even lava lamps. From this seed, a series of seemingly random numbers can be generated, but given the same seed, the same sequence will always be produced.

However, there are distributed systems that try to solve the problem of "predictability" of randomness, one of which is [drand](https://drand.love/).

The given dia-oracle implementation is an example of safe randomization.

## State

```rust
/// Used to represent high and low parts of an unsigned 256-bit integer.
pub type RandomSeed = (u128, u128);
```

```rust
#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
pub struct Random {
    pub randomness: RandomSeed,
    pub signature: String,
    pub prev_signature: String,
}
```

```rust
#[derive(Debug, Default, Clone, Encode, Decode, TypeInfo)]
pub struct RandomnessOracle {
    pub owner: ActorId,
    pub values: BTreeMap<u128, Random>,
    pub last_round: u128,
    pub manager: ActorId,
}
```

## Actions

```rust
#[derive(Debug, Encode, Decode, TypeInfo)]
pub enum Action {
    SetRandomValue { round: u128, value: state::Random },
    GetLastRoundWithRandomValue,
    UpdateManager(ActorId),
}
```

## Events

```rust
#[derive(Debug, Encode, Decode, TypeInfo)]
pub enum Event {
    NewManager(ActorId),
    NewRandomValue {
        round: u128,
        value: state::Random,
    },
    LastRoundWithRandomValue {
        round: u128,
        random_value: state::RandomSeed,
    },
}
```

## Init Configuration

```rust
#[derive(Debug, Encode, Decode, TypeInfo)]
pub struct InitConfig {
    pub manager: ActorId,
}
```

## Conclusion

The source code of this example of a Dia Randomness Oracle program is available on GitHub: [oracle/randomness/src/lib.rs](https://github.com/gear-foundation/dapps/blob/master/contracts/oracle/randomness/src/lib.rs).

See also an example of the program testing implementation based on `gtest`: [oracle/tests/oracle_randomness.rs](https://github.com/gear-foundation/dapps/blob/master/contracts/oracle/tests/oracle_randomness.rs).

For more details about testing programs written on Vara, refer to this article: [Program Testing](/docs/build/testing).