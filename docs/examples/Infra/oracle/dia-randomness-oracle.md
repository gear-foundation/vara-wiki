---
sidebar_label: Dia Randomness Oracle
sidebar_position: 2
---

# Dia Randomness Oracle

## Randomness in Blockchain

Randomness in blockchains is crucial for a fair and unpredictable distribution of validator responsibilities. Computers are deterministic devices, meaning the same input always produces the same output, making true randomness difficult to achieve. What is commonly referred to as random numbers on a computer are actually pseudo-random. These numbers depend on a sufficiently random seed provided by the user or another type of oracle, such as a weather station for atmospheric noise, heart rate, or even lava lamps. From this seed, a series of seemingly random numbers can be generated, but given the same seed, the same sequence will always be produced.

However, there are distributed systems that try to solve the problem of "predictability" of randomness, one of which is [drand](https://drand.love/).

The given dia-oracle implementation is an example of safe randomization. The source code, developed using the [Sails](../../build/sails/sails.mdx) framework, is available on [GitHub](https://github.com/gear-foundation/dapps/tree/master/contracts/oracle/randomness).


## State

The `Random` structure stores a random value, its cryptographic signature, and the signature of the previous value, ensuring integrity and traceability.

```rust title="oracle/randomness/app/src/lib.rs"
pub struct Random {
    pub randomness: RandomSeed,
    pub signature: String,
    pub prev_signature: String,
}
```

The `RandomnessOracle` structure maintains the overall oracle state, tracking ownership, stored random values, the last updated round, and the manager responsible for updates.

```rust title="oracle/randomness/app/src/lib.rs"
pub struct RandomnessOracle {
    pub owner: ActorId,
    pub values: HashMap<u128, Random>,
    pub last_round: u128,
    pub manager: ActorId,
}
```

## Actions

```rust title="oracle/randomness/app/src/lib.rs"
    pub fn set_random_value(&mut self, round: u128, value: Random);
    pub fn get_last_round_with_random_value(&mut self) -> (u128, u128);
    pub fn update_manager(&mut self, new_manager: ActorId);
```
- The `set_random_value` method securely assigns a new random value to a specific round, ensuring sequential updates.
- The `get_last_round_with_random_value` method retrieves the most recent round and its associated random value.
- The `update_manager` method changes the manager, allowing controlled delegation of responsibility.

```rust title="oracle/randomness/app/src/lib.rs"
    pub fn get_owner(&self) -> ActorId;
    pub fn get_last_round(&self) -> u128;
    pub fn get_manager(&self) -> ActorId;
    pub fn get_values(&self) -> Vec<(u128, Random)>;
```
Methods like `get_owner`, `get_last_round`, `get_manager`, and `get_values` provide convenient access to the oracle's current state.


## Events

The `Event` enum defines key events: updating the manager, adding a new random value, and retrieving the last round's random value, ensuring clear system behavior tracking.

```rust title="oracle/randomness/app/src/lib.rs"

    pub enum Event {
        NewManager(ActorId),
        NewRandomValue { round: u128, value: Random },
        LastRoundWithRandomValue { round: u128, random_value: u128 },
    }
```

## Initialisation 

The `init` method initializes the oracle with the given manager and sets up its default state, defining ownership and control.

```rust
    pub async fn init(manager: ActorId) -> Self {
        unsafe {
            RANDOMNESS_ORACLE = Some(RandomnessOracle {
                owner: msg::source(),
                manager,
                ..Default::default()
            });
        }
        Self(())
    }
```

## Conclusion

The source code of this example of a Dia Randomness Oracle program is available on GitHub: [oracle/randomness/](https://github.com/gear-foundation/dapps/blob/master/contracts/oracle/randomness).

See also an example of the program testing implementation based on `gtest`: [oracle/randomness/tests/gtest.rs](https://github.com/gear-foundation/dapps/blob/master/contracts/oracle/randomness/tests/gtest.rs).

For more details about testing programs written on Vara, refer to this article: [Program Testing](/docs/build/testing).
