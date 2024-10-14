---
sidebar_label: DEX
sidebar_position: 4
---

# Decentralized Exchange (DEX)

## Introduction
A decentralized exchange (DEX) is a peer-to-peer marketplace where transactions occur directly between cryptocurrency traders. Unlike centralized exchanges like Binance, DEXs exclusively trade cryptocurrency tokens for other cryptocurrency tokens, without allowing exchanges between fiat and cryptocurrencies.

Decentralized exchanges are essentially a set of smart contracts. They establish the prices of various cryptocurrencies algorithmically and use "liquidity pools," in which investors lock funds in exchange for interest-like rewards, to facilitate trades.

While transactions on a centralized exchange are recorded in that exchange's internal database, DEX transactions are settled directly on the blockchain.

DEXs are usually built on open-source code, allowing anyone interested to see exactly how they work. This also means that developers can adapt existing code to create new competing projects, as seen with Uniswap's code being adapted by various DEXs like Sushiswap and Pancakeswap.

The exchange uses [Vara fungible tokens (VFT)](/docs/examples/Standards/vft) for the tokens and the [Gear-lib FT wrapper](https://github.com/gear-foundation/dapps/tree/a357635b61e27c52f46908885fecb048dc8424e5/contracts/gear-lib-old/src/fungible_token) for the pair to track liquidity.

### Math
All prices are algorithmically calculated. Investors provide funds to the liquidity pools, and the price is calculated according to the amount of tokens in the reserves using the following formula:
$$reserve0 * reserve1 = K$$
where $$reserve0$$ and $$reserve1$$ are the reserves of token0 and token1, respectively, provided by the investors, and $$K$$ is the constant.
All prices/amounts are calculated so that $$K$$ **MUST** remain constant. This means that the more token0 in the pool, the lower the price of token1 will be when performing a swap.

## Factory Program Description
Given the potential large number of trading pairs, there should be a way to monitor and deploy new pairs. This is where a factory comes into play. The factory helps to create new pairs and monitor all existing pairs.

### Actions

All actions are straightforward. There is an action to initialize a factory, create a pair, and modify fee-related parameters.

```rust
pub type TokenId = ActorId;

/// Initializes a factory.
///
#[derive(Debug, Encode, Decode, TypeInfo)]
pub struct InitFactory {
    /// The address that can set the fee.
    pub fee_to_setter: ActorId,
    /// Code hash to successfully deploy a pair with this program.
    pub pair_code_hash: [u8; 32],
}

#[derive(Debug, Encode, Decode, TypeInfo)]
pub enum FactoryAction {
    /// Creates an exchange pair
    ///
    /// Deploys a pair exchange program and saves the info about it.
    /// # Requirements:
    /// * both `TokenId` MUST be non-zero addresses and represent the actual fungible-token contracts
    ///
    /// On success returns `FactoryEvery::PairCreated`
    CreatePair(TokenId, TokenId),

    /// Sets fee_to variable
    ///
    /// Sets an address where the fees will be sent.
    /// # Requirements:
    /// * `fee_to` MUST be a non-zero address
    /// * action sender MUST be the same as `fee_to_setter` in this program
    ///
    /// On success returns `FactoryEvery::FeeToSet`
    SetFeeTo(ActorId),

    /// Sets fee_to_setter variable
    ///
    /// Sets an address that will be able to change fee_to
    /// # Requirements:
    /// * `fee_to_setter` MUST be a non-zero address
    /// * action sender MUST be the same as `fee_to_setter` in this program
    ///
    /// On success returns `FactoryEvery::FeeToSetterSet`
    SetFeeToSetter(ActorId),

    /// Returns a `fee_to` variable.
    ///
    /// Returns the `fee_to` variable from the state.
    ///
    /// On success returns `FactoryEvery::FeeTo`
    FeeTo,
}
```

### Events

All actions above have corresponding events:
```rust
#[derive(Debug, Encode, Decode, TypeInfo)]
pub enum FactoryEvent {
    PairCreated {
        /// The first token address
        token_a: TokenId,
        /// The second token address
        token_b: TokenId,
        /// Pair address (the pair exchange program).
        pair_address: ActorId,
        /// The number of pairs deployed through this factory.
        pairs_length: u32,
    },
    FeeToSet(ActorId),
    FeeToSetterSet(ActorId),
    FeeTo(ActorId),
}
```

### Program Metadata and State
Metadata interface description:

```rust
pub struct ContractMetadata;

impl Metadata for ContractMetadata {
    type Init = In<InitFactory>;
    type Handle = InOut<FactoryAction, FactoryEvent>;
    type Reply = ();
    type Others = ();
    type Signal = ();
    type State = Out<State>;
}
```
To display the full program state information, the `state()` function is used:

```rust
#[no_mangle]
extern "C" fn state() {
    reply(common_state())
        .expect("Failed to encode or reply with `<ContractMetadata as Metadata>::State` from `state()`");
}
```
To display only specific values from the state, write a separate crate. In this crate, specify functions that will return the desired values from the `State` struct. For example, see [gear-foundation/dapps/dex/factory/state](https://github.com/gear-foundation/dapps/tree/a357635b61e27c52f46908885fecb048dc8424e5/contracts/dex/factory/state):

```rust
#[metawasm]
pub trait Metawasm {
    type State = dex_factory_io::State;

    fn fee_to(state: Self::State) -> ActorId {
        state.fee_to
    }

    fn fee_to_setter(state: Self::State) -> ActorId {
        state.fee_to_setter
    }

    fn pair_address(pair: Pair, state: Self::State) -> ActorId {
        state.pair_address(pair.0, pair.1)
    }

    fn all_pairs_length(state: Self::State) -> u32 {
        state.all_pairs_length()
    }

    fn owner(state: Self::State) -> ActorId {
        state.owner_id
    }
}

type Pair = (FungibleId, FungibleId);
```

### Interfaces
Functions to cover all interfaces are based on the list of actions:
```rust
/// Sets a fee_to address
/// `fee_to` MUST be a non-zero address
/// Message source MUST be a fee_to_setter of the program
/// Arguments:
/// * `fee_to` is a new fee_to address
fn set_fee_to(&mut self, fee_to: ActorId);

/// Sets a fee_to_setter address
/// `fee_to_setter` MUST be a non-zero address
/// Message source MUST be a fee_to_setter of the program
/// Arguments:
/// * `fee_to_setter` is a new fee_to_setter address
fn set_fee_to_setter(&mut self, fee_to_setter: ActorId);

/// Creates and deploys a new pair
/// Both token addresses MUST be different and non-zero
/// The pair MUST not be created already
/// Arguments:
/// * `token_a` is the first token address
/// * `token_b` is the second token address
async fn create_pair(&mut self, mut token_a: ActorId, mut token_b: ActorId);
```

### Source Code
The source code of this DEX factory program example and its testing implementation is available on [gear-foundation/dapps/dex/factory](https://github.com/gear-foundation/dapps/tree/a357635b61e27c52f46908885fecb048dc8424e5/contracts/dex/factory).

See also an example of the program testing implementation based on `gtest`: [tests/utils/factory.rs](https://github.com/gear-foundation/dapps/tree/a357635b61e27c52f46908885fecb048dc8424e5/contracts/dex/tests/utils/factory.rs).

For more details about testing programs written on Vara, refer to the [Program Testing](/docs/build/testing) article.

## Pair Program Description
The pair program is where all the exchange magic happens. Each pair program handles the liquidity provided to this pair only. All swap operations are performed using the formula in the Math section.

### Actions
```rust
pub type TokenId = ActorId;

/// Initializes a pair.
///
/// # Requirements:
/// * both `TokenId` MUST be fungible token programs with non-zero addresses.
/// * factory MUST be a non-zero address.
#[derive(Debug, Encode, Decode, TypeInfo)]
pub struct InitPair {
    /// Factory address which deployed this pair.
    pub factory: ActorId,
    /// The first FT token address.
    pub token0: TokenId,
    /// The second FT token address.
    pub token1: TokenId,
}

#[derive(Debug, Encode, Decode, TypeInfo)]
pub enum PairAction {
    /// Adds liquidity to the pair.
    ///
    /// Adds a specified amount of both tokens to the pair program.
    /// # Requirements:
    /// * all the values MUST be non-zero positive numbers.
    /// * `to` MUST be a non-zero address.
    ///
    /// On success returns `PairEvent::AddedLiquidity`.
    AddLiquidity {
        /// The amount of token 0 desired by a user.
        amount0_desired: u128,
        /// The amount of token 1 desired by a user.
        amount1_desired: u128,
        /// The minimum amount of token 0 a user is willing to add.
        amount0_min: u128,
        /// The minimum amount of token 1 a user is willing to add.
        amount1_min: u128,
        /// Who is adding the liquidity.
       