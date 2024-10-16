---
sidebar_label: Staking
sidebar_position: 5
---

# Staking

## Introduction

Staking is an analogue of a bank deposit, providing passive earnings through the simple storage of cryptocurrency tokens. The percentage of income may vary depending on the term of the deposit.

Anyone can create a Staking program and run it on the Gear Network. An example is available on [GitHub](https://github.com/gear-foundation/dapps/tree/a357635b61e27c52f46908885fecb048dc8424e5/contracts/staking).

This article explains the programming interface, data structure, basic functions, and their purposes. The program can be used as-is or modified to suit specific scenarios.

### Mathematics

Tokens can be deposited into the staking program and later claimed, along with rewards.

Staking involves depositing fungible tokens into a program to earn rewards. These rewards, minted at regular intervals (e.g., per minute), are distributed equitably among all stakers.

#### How Staking Works

Consider Alice staking 100 tokens and Bob staking 50 tokens. If reward tokens are minted every minute, and after one week Alice decides to unstake her tokens, the total tokens in the staking program remain 150. The duration of Alice's staking period is 7 days, and the reward tokens accumulated can be calculated based on this timeframe:

$$
R ⋅ \frac {100} {150} ⋅ 7 ⋅ 24 ⋅ 60
$$

A week later, Bob chooses to unstake his 50 tokens. In the initial week, he staked 50 tokens out of 150. In the second week, he staked 50 tokens out of 50. Here’s how to determine his reward:

$$
R ⋅ (\frac {50} {150} + \frac {50} {50}) ⋅ 7 ⋅ 24 ⋅ 60
$$

The formula can be generalized as:

$$
r(a, b) = R\sum_{t=a}^b \frac {l(t)} {L(t)}
$$

where:
-	$r(a, b)$ - reward for the user for the time interval $a \le t \le b$;
-	$R$ - rewards minted per minute;
-	$L(t)$ - total staked amount of tokens at time $t$;
-	$l(t)$ - tokens staked by the user at time $t$.

To apply the formula, $l(t)$ for each user and time interval, and $L(t)$ for each time interval must be stored. Calculating a reward involves executing a loop for each time interval, consuming significant gas and storage. A more efficient approach is feasible:

If $l(t)$ for a user is constant $k$ for $a \le t \le b$, then:

$$
r(a, b) = R\sum_{t=a}^b \frac {l(t)} {L(t)} = Rk\sum_{t=a}^b \frac {1} {L(t)}
$$

This can be further simplified:

$$
\sum_{t=a}^b \frac {1} {L(t)} = \frac {1} {L(a)} + \frac {1} {L(a + 1)} + ... + \frac {1} {L(b)} =
$$

$$
\frac {1} {L(0)} + \frac {1} {L(1)} + ... + \frac {1} {L(b)} -
(\frac {1} {L(0)} + \frac {1} {L(1)} + ... + \frac {1} {L(a - 1)}) =
$$

$$
\sum_{t=0}^b \frac {1} {L(t)} - \sum_{t=0}^{a-1} \frac {1} {L(t)}
$$

So, the equation to calculate the reward that a user will receive from t=a to t=b under the condition that the number of tokens staked is constant:

$$
Rk\sum_{t=a}^b \frac {1} {L(t)} = Rk(\sum_{t=0}^b \frac {1} {L(t)} - \sum_{t=0}^{a-1} \frac {1} {L(t)})
$$

Based on that equation, the implementation in the program can be written as:

```rust
(staker.balance * self.tokens_per_stake) / DECIMALS_FACTOR + staker.reward_allowed - staker.reward_debt - staker.distributed
```

### Program Description

The admin initializes the program by transmitting information about the staking token, reward token, and distribution time (`InitStaking` message).

The admin can view the Stakers list (`GetStakers` message) and update the reward that will be distributed (`UpdateStaking` message).

Users first stake tokens (`Stake` message), and then can receive rewards on demand (`GetReward` message). Users can withdraw part of the staked amount (`Withdraw` message).

### Source Files

1. `staking/src/lib.rs` - contains functions of the 'staking' program.
2. `staking/io/src/lib.rs` - contains enums and structs that the program receives and sends in the reply.

### Structs

The program has the following structs:

```rust title="staking/src/lib.rs"
struct Staking {
    owner: ActorId,
    staking_token_address: ActorId,
    reward_token_address: ActorId,
    tokens_per_stake: u128,
    total_staked: u128,
    distribution_time: u64,
    produced_time: u64,
    reward_total: u128,
    all_produced: u128,
    reward_produced: u128,
    stakers: HashMap<ActorId, Staker>,
    transactions: BTreeMap<ActorId, Transaction<StakingAction>>,
    current_tid: TransactionId,
}
```
where:

- `owner` - the owner of the staking program
- `staking_token_address` - address of the staking token program
- `reward_token_address` - address of the reward token program
- `tokens_per_stake` - the calculated value of tokens per stake
- `total_staked` - total amount of deposits
- `distribution_time` - time of distribution of reward
- `reward_total` - the reward to be distributed within distribution time
- `produced_time` - time of `reward_total` update
- `all_produced` - the reward received before the update `reward_total`
- `reward_produced` - the reward produced so far
- `stakers` - map of the stakers
- `transactions` - map of the transactions
- `current_tid` - current transaction identifier

```rust title="staking/io/src/lib.rs"
pub struct InitStaking {
    pub staking_token_address: ActorId,
    pub reward_token_address: ActorId,
    pub distribution_time: u64,
    pub reward_total: u128,
}
```
where:

- `staking_token_address` - address of the staking token program
- `reward_token_address` - address of the reward token program
- `distribution_time` - time of distribution of reward
- `reward_total` - the reward to be distributed within distribution time

```rust title="staking/io/src/lib.rs"
pub struct Staker {
    pub balance: u128,
    pub reward_allowed: u128,
    pub reward_debt: u128,
    pub distributed: u128,
}
```
where:

- `balance` - staked amount
- `reward_allowed` - the reward that could have been received from the withdrawn amount
- `reward_debt` - the reward that the depositor would have received if he had initially paid this amount
- `distributed` - total remuneration paid

### Enums

```rust title="staking/io/src/lib.rs"
pub enum StakingAction {
    Stake(u128),
    Withdraw(u128),
    UpdateStaking(InitStaking),
    GetReward,
}
```

```rust title="staking/io/src/lib.rs"
pub enum StakingEvent {
    StakeAccepted(u128),
    Updated,
    Reward(u128),
    Withdrawn(u128),
}
```

### Functions

The staking program interacts with the fungible token contract through the function `transfer_tokens()`. This function sends a message (the action is defined in the enum `FTAction`) and gets a reply (the reply is defined in the enum `FTEvent`).

```rust title="staking/src/lib.rs"
/// Transfers `amount` tokens from `sender` account to `recipient` account.
/// Arguments:
/// * `token_address`: token address
/// * `from`: sender account
/// * `to`: recipient account
/// * `amount_tokens`: amount of tokens
async fn transfer_tokens(
    &mut self,
    token_address: &ActorId,
    from: &ActorId,
    to: &ActorId,
    amount_tokens: u128,
) -> Result<(), Error> {
    let payload = LogicAction::Transfer {
        sender: *from,
        recipient: *to,
        amount: amount_tokens,
    };

    let transaction_id = self.current_tid;
    self.current_tid = self.current_tid.saturating_add(99);

    let payload = FTokenAction::Message {
        transaction_id,
        payload,
    };

    let result = msg::send_for_reply_as(*token_address, payload, 0, 0)?.await?;

    if let FTokenEvent::Err = result {
        Err(Error::TransferTokens)
    } else {
        Ok(())
    }
}
```

Calculates the reward produced so far

```rust title="staking/src/lib.rs"
fn produced(&mut self) -> u128
```

Updates the reward produced so far and calculates tokens per stake

```rust title="staking

/src/lib.rs"
fn update_reward(&mut self)
```

Calculates the maximum possible reward. The reward that the depositor would have received if initially paid this amount

```rust title="staking/src/lib.rs"
fn get_max_reward(&self, amount: u128) -> u128
```

Calculates the reward of the staker that is currently available. The return value cannot be less than zero according to the algorithm

```rust title="staking/src/lib.rs"
fn calc_reward(&mut self) -> Result<u128, Error>
```

Updates the staking program. Sets the reward to be distributed within the distribution time

```rust title="staking/src/lib.rs"
fn update_staking(&mut self, config: InitStaking) -> Result<StakingEvent, Error>
```

Stakes the tokens

```rust title="staking/src/lib.rs"
async fn stake(&mut self, amount: u128) -> Result<StakingEvent, Error>
```

Sends reward to the staker

```rust title="staking/src/lib.rs"
async fn send_reward(&mut self) -> Result<StakingEvent, Error>
```

Withdraws the staked tokens

```rust title="staking/src/lib.rs"
async fn withdraw(&mut self, amount: u128) -> Result<StakingEvent, Error>
```

These functions are called in `async fn main()` through the enum `StakingAction`.

This is the entry point to the program, and the program is waiting for a message in `StakingAction` format.

```rust title="staking/src/lib.rs"
#[gstd::async_main]
async fn main() {
    let staking = unsafe { STAKING.get_or_insert(Staking::default()) };

    let action: StakingAction = msg::load().expect("Could not load Action");
    let msg_source = msg::source();

    let _reply: Result<StakingEvent, Error> = Err(Error::PreviousTxMustBeCompleted);
    let _transaction_id = if let Some(Transaction {
        id,
        action: pend_action,
    }) = staking.transactions.get(&msg_source)
    {
        if action != *pend_action {
            msg::reply(_reply, 0)
                .expect("Failed to encode or reply with `Result<StakingEvent, Error>`");
            return;
        }
        *id
    } else {
        let transaction_id = staking.current_tid;
        staking.current_tid = staking.current_tid.saturating_add(1);
        staking.transactions.insert(
            msg_source,
            Transaction {
                id: transaction_id,
                action: action.clone(),
            },
        );
        transaction_id
    };
    let result = match action {
        StakingAction::Stake(amount) => {
            let result = staking.stake(amount).await;
            staking.transactions.remove(&msg_source);
            result
        }
        StakingAction::Withdraw(amount) => {
            let result = staking.withdraw(amount).await;
            staking.transactions.remove(&msg_source);
            result
        }
        StakingAction::UpdateStaking(config) => {
            let result = staking.update_staking(config);
            staking.transactions.remove(&msg_source);
            result
        }
        StakingAction::GetReward => {
            let result = staking.send_reward().await;
            staking.transactions.remove(&msg_source);
            result
        }
    };
    msg::reply(result, 0).expect("Failed to encode or reply with `Result<StakingEvent, Error>`");
}
```

### Program Metadata and State

Metadata interface description:

```rust title="staking/io/src/lib.rs"
pub struct StakingMetadata;

impl Metadata for StakingMetadata {
    type Init = In<InitStaking>;
    type Handle = InOut<StakingAction, Result<StakingEvent, Error>>;
    type Others = ();
    type Reply = ();
    type Signal = ();
    type State = Out<IoStaking>;
}
```

To display the full program state information, the `state()` function is used:

```rust title="staking/src/lib.rs"
#[no_mangle]
extern fn state() {
    let staking = unsafe { STAKING.take().expect("Unexpected error in taking state") };
    msg::reply::<IoStaking>(staking.into(), 0)
        .expect("Failed to encode or reply with `IoStaking` from `state()`");
}
```

To display only necessary specific values from the state, write a separate crate. In this crate, specify functions that will return the desired values from the `IoStaking` state. For example, see [staking/state](https://github.com/gear-foundation/dapps/tree/master/contracts/staking/state):

```rust title="staking/state/src/lib.rs"
#[gmeta::metawasm]
pub mod metafns {
    pub type State = IoStaking;

    pub fn get_stakers(state: State) -> Vec<(ActorId, Staker)> {
        state.stakers
    }

    pub fn get_staker(state: State, address: ActorId) -> Option<Staker> {
        state
            .stakers
            .iter()
            .find(|(id, _staker)| address.eq(id))
            .map(|(_, staker)| staker.clone())
    }
}
```

## Consistency of Program States

The `Staking` program interacts with the `fungible` token contract. Each transaction that changes the states of Staking and the fungible token is stored in the state until it is completed. A user can complete a pending transaction by sending a message exactly the same as the previous one, indicating the transaction id. The idempotency of the fungible token contract allows restarting a transaction without duplicate changes, ensuring the state consistency of these two programs.

## Conclusion

The source code of this example of a staking program is available on GitHub: [`staking/src/lib.rs`](https://github.com/gear-foundation/dapps/tree/a357635b61e27c52f46908885fecb048dc8424e5/contracts/staking/src/lib.rs).

See also examples of the program testing implementation based on gtest:

- [`simple_test.rs`](https://github.com/gear-foundation/dapps/tree/a357635b61e27c52f46908885fecb048dc8424e5/contracts/staking/tests/simple_test.rs).
- [`panic_test.rs`](https://github.com/gear-foundation/dapps/tree/a357635b61e27c52f46908885fecb048dc8424e5/contracts/staking/tests/panic_test.rs).

For more details about testing programs written on Vara, refer to this article: [Program testing](/docs/build/testing).
