---
sidebar_label: Staking
sidebar_position: 2
---

# Staking

:::note
**ActorId (32 bytes):**  
`0x77f65ef190e11bfecb8fc8970fd3749e94bed66a23ec2f7a3623e785d0816761`
:::

The [Staking Built-in Actor](https://github.com/gear-tech/gear/blob/master/gbuiltins/staking/src/lib.rs) serves as an intermediary that allows Gear programs to interact with the [Staking pallet](https://paritytech.github.io/polkadot-sdk/master/pallet_staking/index.html) by translating staking-related requests into dispatchable calls. The actor receives messages in the form of a `Request` and executes staking actions accordingly. This actor provides programs with the capability to perform staking operations like bonding, unbonding, nominating, and managing staking rewards.

The `RewardAccount` enum is used to specify where staking rewards should be accumulated when bonding or managing payouts. It is a mirror of the staking pallet's `RewardDestination` type and offers flexibility for staking reward management.

```rust
pub enum RewardAccount {
    /// Pay rewards to the sender's account, increasing the amount at stake.
    Staked,
    /// Pay rewards to the sender's account (typically derived from `program_id`)
    /// without increasing the staked amount.
    Program,
    /// Pay rewards to a specified custom account.
    Custom(ActorId),
    /// Choose not to receive any rewards.
    None,
}
```

## Supported Staking Operations
The `Request` enum defines the various staking operations that the Staking Built-in Actor can handle. Each variant represents a different staking action that a program can request. Below, each operation and its required parameters are detailed.

### `Bond`
Bonds up to the specified `value` from the sender to self as the controller, with the reward destination specified by `payee`.
```rust
Bond { value: u128, payee: RewardAccount }
 ```

### `BondExtra`
Adds up to the given `value` to the sender's already bonded amount.
```rust
BondExtra { value: u128 }
 ```

### `Unbond`
Unbonds up to the specified `value` to allow withdrawal after the unbonding period has elapsed.
```rust
Unbond { value: u128 }
 ```

### `WithdrawUnbonded`
Withdraws unbonded chunks for which the unbonding period has elapsed, based on the `specified num_slashing_spans`.
```rust
WithdrawUnbonded { num_slashing_spans: u32 }
```

### `Nominate`
Adds the sender as a nominator of the specified `targets`, or updates the existing targets.
```rust
Nominate { targets: Vec<ActorId> }
```

### `Chill`
Declares the sender's intention to temporarily stop nominating while still keeping funds bonded. No additional parameters.

### `PayoutStakers`
Requests a payout for stakers for the given `validator_stash` during the specified `era`.
```rust
PayoutStakers { validator_stash: ActorId, era: u32 }
```

### `Rebond`
Re-bonds a portion of the sender's stash scheduled to be unlocked, up to the given `value`.
```rust
Rebond { value: u128 }
```

### `SetPayee`
Sets the reward destination to the specified `payee`.
```rust
SetPayee { payee: RewardAccount }
```

## Example: Staking Broker
To help illustrate how to use the Staking Built-in Actor, we provide a basic implementation called the **Staking Broker**. This program acts as a simple example to demonstrate the concepts of bonding, unbonding, and nominating validators on behalf of users. To explore the code and learn more about the implementation details, you can visit the Staking Broker example on [GitHub](https://github.com/gear-tech/gear/tree/master/examples/staking-broker).

:::note
The Staking Broker is intended for demonstration purposes only. It accepts user messages to perform actions such as bonding tokens, unbonding funds, and nominating validators. However, it does not handle certain critical aspects, such as managing the unbonding period or other complexities involved in a real-world scenario. A production-level implementation, like a liquid staking contract, would be significantly more intricate.
:::

