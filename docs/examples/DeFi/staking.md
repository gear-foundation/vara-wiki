---
sidebar_label: Staking
sidebar_position: 5
---

# Staking

## Introduction

Staking is an analogue of a bank deposit, providing passive earnings through the simple storage of cryptocurrency tokens. The percentage of income may vary depending on the term of the deposit.

Anyone can create a Staking program and run it on the Gear Network. The source code, developed using the [Sails](../../build/sails/sails.mdx) framework, is available on [GitHub](https://github.com/gear-foundation/dapps/tree/master/contracts/staking).

The staking program interacts with the [Vara Fungible Token (VFT)](/docs/examples/Standards/vft.md) standard to handle token transfers seamlessly, enabling staking deposits, reward distributions, and withdrawals through secure and efficient transfer operations. These transfers are executed via asynchronous calls to the VFT contract, ensuring accurate state synchronization and error handling during token movements.

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

The staking program is initialized by the admin using the `StakingProgram::new` method, which sets up the reward token address, the distribution time, and the total reward to be distributed.

The admin can view the list of stakers and their staking details using the `stakers()` method and can update the reward token address, distribution time, or total reward through the `update_staking` function.

Users can participate in the program by staking tokens using the `stake` function, which transfers tokens from the user's account to the contract and updates their staking balance. Accumulated rewards can be claimed on demand via the `get_reward` function. Users can also partially or fully withdraw their staked tokens using the `withdraw` function, which adjusts their balance and returns the specified tokens to their account.

### Structs

The program has the following structs:

```rust title="staking/app/src/lib.rs"
    struct Staking {
        owner: ActorId,
        reward_token_address: ActorId,
        tokens_per_stake: u128,
        total_staked: u128,
        distribution_time: u64,
        produced_time: u64,
        reward_total: u128,
        all_produced: u128,
        reward_produced: u128,
        stakers: HashMap<ActorId, Staker>,
    }
```
where:

- `owner` - the owner of the staking program
- `reward_token_address` - address of the reward token program
- `tokens_per_stake` - the calculated value of tokens per stake
- `total_staked` - total amount of deposits
- `distribution_time` - time of distribution of reward
- `reward_total` - the reward to be distributed within distribution time
- `produced_time` - time of `reward_total` update
- `all_produced` - the reward received before the update `reward_total`
- `reward_produced` - the reward produced so far
- `stakers` - map of the stakers

```rust title="staking/app/src/lib.rs"
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

### Event

```rust title="staking/app/src/lib.rs"
    pub enum Event {
        StakeAccepted(u128),
        Updated,
        Reward(u128),
        Withdrawn(u128),
    }
```

### Functions

Thе `produced` function determines the total rewards generated since the last update. It ensures the reward does not exceed the total defined by the `distribution_time`.

```rust title="staking/app/src/lib.rs"
    fn produced(&mut self) -> u128 {
        let mut elapsed_time = exec::block_timestamp() - self.produced_time;

        if elapsed_time > self.distribution_time {
            elapsed_time = self.distribution_time;
        }

        self.all_produced
            + self.reward_total.saturating_mul(elapsed_time as u128)
                / self.distribution_time as u128
    }
```

Thе `update_reward` function  updates the state to reflect the latest reward distribution and recalculates the `tokens_per_stake` based on new rewards and the total staked amount.

```rust title="staking/app/src/lib.rs"
    fn update_reward(&mut self) {
        let reward_produced_at_now = self.produced();
        if reward_produced_at_now > self.reward_produced {
            let produced_new = reward_produced_at_now - self.reward_produced;
            if self.total_staked > 0 {
                self.tokens_per_stake = self
                    .tokens_per_stake
                    .saturating_add((produced_new * DECIMALS_FACTOR) / self.total_staked);
            }

            self.reward_produced = self.reward_produced.saturating_add(produced_new);
        }
    }
```

Thе `get_max_reward` function calculates the theoretical maximum reward for a given staked amount based on `tokens_per_stake`.

```rust title="staking/app/src/lib.rs"
    fn get_max_reward(&self, amount: u128) -> u128 {
        (amount * self.tokens_per_stake) / DECIMALS_FACTOR
    }
```

Thе `calc_reward` function the reward that a specific staker is eligible to claim. It factors in:
- Current staked balance.
- Rewards already allowed, debt, and previously distributed amounts.

```rust title="staking/app/src/lib.rs"
    fn calc_reward(&self, id: &ActorId) -> u128 {
        match self.stakers.get(id) {
            Some(staker) => {
                self.get_max_reward(staker.balance) + staker.reward_allowed
                    - staker.reward_debt
                    - staker.distributed
            }
            None => panic!("Staker not found"),
        }
    }
```

Thе `update_staking` function allows the admin to modify key parameters like the reward token, distribution time, and total reward.  Resets reward tracking fields and recalculates staking-related variables. It ensures the program remains adaptable to changing requirements.

```rust title="staking/app/src/lib.rs"
    pub fn update_staking(
        &mut self,
        reward_token_address: ActorId,
        distribution_time: u64,
        reward_total: u128,
    ) {
        if reward_total == 0 {
            panic!("Reward is zero");
        }

        if distribution_time == 0 {
            panic!("Distribution time is zero");
        }

        let storage = self.get_mut();

        if msg::source() != storage.owner {
            panic!("Not owner");
        }

        storage.reward_token_address = reward_token_address;
        storage.distribution_time = distribution_time;

        storage.update_reward();
        storage.all_produced = storage.reward_produced;
        storage.produced_time = exec::block_timestamp();
        storage.reward_total = reward_total;
        self.notify_on(Event::Updated).expect("Notification Error");
    }
```

The `stake` function enables users to deposit tokens into the staking program. Its operations include:

- Transferring the specified amount of tokens from the user's account to the contract.
- Updating the user's staking balance and associated reward debt in the program's state.

```rust title="staking/app/src/lib.rs"
    pub async fn stake(&mut self, amount: u128) {
        if amount == 0 {
            panic!("Amount is zero");
        }
        let storage = self.get_mut();
        let msg_src = msg::source();

        let request = vft_io::TransferFrom::encode_call(msg_src, exec::program_id(), amount.into());

        msg::send_bytes_with_gas_for_reply(
            storage.reward_token_address,
            request,
            5_000_000_000,
            0,
            0,
        )
        .expect("Error in sending a message")
        .await
        .expect("Error in transfer Fungible Token");

        storage.update_reward();

        let amount_per_token = storage.get_max_reward(amount);

        storage
            .stakers
            .entry(msg_src)
            .and_modify(|stake| {
                stake.reward_debt = stake.reward_debt.saturating_add(amount_per_token);
                stake.balance = stake.balance.saturating_add(amount);
            })
            .or_insert(Staker {
                reward_debt: amount_per_token,
                balance: amount,
                ..Default::default()
            });
        storage.total_staked = storage.total_staked.saturating_add(amount);
        self.notify_on(Event::StakeAccepted(amount))
            .expect("Notification Error");
    }
```

The `get_reward` function enables users to claim their accumulated rewards. Its operations include:

- Calculating the eligible reward amount using the `calc_reward` method.
- Transferring the calculated reward to the user's account.
- Updating the program's state to reflect the distribution of the reward.

```rust title="staking/app/src/lib.rs"
    pub async fn get_reward(&mut self) {
        let storage = self.get_mut();
        storage.update_reward();

        let msg_src = msg::source();

        let reward = storage.calc_reward(&msg_src);
        if reward == 0 {
            panic!("Zero reward")
        }

        let request = vft_io::Transfer::encode_call(msg_src, reward.into());

        msg::send_bytes_with_gas_for_reply(
            storage.reward_token_address,
            request,
            5_000_000_000,
            0,
            0,
        )
        .expect("Error in sending a message")
        .await
        .expect("Error in transfer Fungible Token");

        storage
            .stakers
            .entry(msg::source())
            .and_modify(|stake| stake.distributed = stake.distributed.saturating_add(reward));

        self.notify_on(Event::Reward(reward))
            .expect("Notification Error");
    }
```

The `withdraw` function enables users to withdraw their staked tokens, either partially or in full. Its operations include:

- Validating the requested withdrawal amount to ensure it does not exceed the user’s available balance.
- Transferring the specified amount of tokens back to the user’s account.
- Updating the user’s staking balance and associated reward debt in the program's state.

```rust title="staking/app/src/lib.rs"
    pub async fn withdraw(&mut self, amount: u128) {
        if amount == 0 {
            panic!("Amount is zero");
        }
        let storage = self.get_mut();
        storage.update_reward();
        let amount_per_token = storage.get_max_reward(amount);
        let msg_src = msg::source();

        let staker = storage.stakers.get_mut(&msg_src).expect("Staker not found");

        if staker.balance < amount {
            panic!("Insufficent balance");
        }

        let request = vft_io::Transfer::encode_call(msg_src, amount.into());

        msg::send_bytes_with_gas_for_reply(
            storage.reward_token_address,
            request,
            5_000_000_000,
            0,
            0,
        )
        .expect("Error in sending a message")
        .await
        .expect("Error in transfer Fungible Token");

        staker.reward_allowed = staker.reward_allowed.saturating_add(amount_per_token);
        staker.balance = staker.balance.saturating_sub(amount);
        storage.total_staked = storage.total_staked.saturating_sub(amount);

        self.notify_on(Event::Withdrawn(amount))
            .expect("Notification Error");
    }
```

Query

The following functions are provided to read the current state of the staking program. These queries allow both administrators and users to retrieve information about the program's configuration, status, and individual staking details without modifying its state:

```rust title="tic-tac-toe/app/services/game/mod.rs"
    pub fn owner(&self) -> ActorId {
        self.get().owner
    }
    pub fn reward_token_address(&self) -> ActorId {
        self.get().reward_token_address
    }
    pub fn tokens_per_stake(&self) -> u128 {
        self.get().tokens_per_stake
    }
    pub fn total_staked(&self) -> u128 {
        self.get().total_staked
    }
    pub fn distribution_time(&self) -> u64 {
        self.get().distribution_time
    }
    pub fn produced_time(&self) -> u64 {
        self.get().produced_time
    }
    pub fn reward_total(&self) -> u128 {
        self.get().reward_total
    }
    pub fn all_produced(&self) -> u128 {
        self.get().all_produced
    }
    pub fn reward_produced(&self) -> u128 {
        self.get().reward_produced
    }
    pub fn stakers(&self) -> Vec<(ActorId, Staker)> {
        self.get().stakers.clone().into_iter().collect()
    }
    pub fn calc_reward(&self, id: ActorId) -> u128 {
        self.get().calc_reward(&id)
    }
```

- `owner`: Returns the `ActorId` of the staking program's owner.  
- `reward_token_address`: Retrieves the `ActorId` of the reward token associated with the staking program.  
- `tokens_per_stake`: Returns the number of reward tokens allocated per unit of stake, adjusted dynamically.  
- `total_staked`: Provides the total amount of tokens currently staked in the program.  
- `distribution_time`: Returns the time period (in milliseconds) over which rewards are distributed.  
- `produced_time`: Retrieves the timestamp of the last reward calculation or update.  
- `reward_total`: Returns the total reward allocated for the entire distribution period.  
- `all_produced`: Provides the cumulative rewards generated before the most recent reward update.  
- `reward_produced`: Returns the total rewards produced up to the current moment.  
- `stakers`: Retrieves a list of all stakers, including their `ActorId` and corresponding staking details.  
- `calc_reward`: Calculates and returns the reward amount available for a specific staker identified by their `ActorId`.  

## Conclusion

The source code of this example of a staking program is available on GitHub: [gear-foundation/dapp/contracts/staking](https://github.com/gear-foundation/dapps/tree/master/contracts/staking).

See also an example of the smart contract testing implementation based on `gtest`: [gear-foundation/dapps/contracts/staking/tests](https://github.com/gear-foundation/dapps/tree/master/contracts/staking/tests).

For more details about testing programs written on Vara, refer to this article: [Program testing](/docs/build/testing).
