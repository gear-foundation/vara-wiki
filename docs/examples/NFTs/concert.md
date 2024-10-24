---
sidebar_label: Concert
sidebar_position: 4
---

# Concert Program (FT to NFT transition)

## Introduction

The idea of this program is to demonstrate a real-life scenario where a fungible token (VFT) transforms into a non-fungible one (VNFT), representing the [Vara Miltiple Token Standard (VMT)](/docs/examples/Standards/vmt.md) utilization. For example, when buying a concert ticket without a specific seat, all tickets are the same and interchangeable (fungible). However, once the concert is over, the electronic ticket can turn into a unique non-fungible token, belonging solely to you and serving as a reminder of the event.

In this example, a single deployed program can hold one concert at a time. Firstly, all the tickets for the concert come as fungible-tokens. In order to buy tickets, one should provide the metadata (e.g. seat/row number) that will later be included in NFTs. When the concert ends, all the fungible tokens of all users (ticket holders) will turn into NFTs.

The idea is simple - all the internal token interactions are handled using the VMT program, which address must be provided upon initializing a concert program.

The article explains the programming interface, data structure, basic functions and explains their purpose. It can be used as is or modified to suit any custom scenarios. Anyone can easily create their own application and run it on the Vara Network. The source code is available on [GitHub](https://github.com/gear-foundation/dapps/tree/master/contracts/concert).

## Implementation details

### Events

```rust title="concert/app/src/lib.rs"
pub enum Event {
    Creation {
        creator: ActorId,
        concert_id: U256,
        number_of_tickets: U256,
        date: u128,
    },
    Hold {
        concert_id: U256,
    },
    Purchase {
        concert_id: U256,
        amount: U256,
    },
}
```
### Functions
#### Create a concert
```rust title="concert/src/lib.rs"
pub fn create(
    &mut self,
    creator: ActorId,
    name: String,
    description: String,
    number_of_tickets: U256,
    date: u128,
    token_id: U256,
)
```
- `creator` - is the creator of the concert
- `name` - is the name of an upcoming concert
- `description` - is a description of the concert
- `number_of_tickets` - is the amount of FT minted later
- `date` - is the date of the concert holding
- `token_id` - id token for multitoken transfer

#### Buy tickets
```rust title="concert/src/lib.rs"
pub async fn buy_tickets(&mut self, amount: U256, mtd: Vec<Option<TokenMetadata>>) 
```
- `amount` - is the number of tickets one is trying to purchase.
- `mtd` - is the tickets metadata (e.g. seat/row). This argument length should equal the `amount` value.

#### Hold a concert
```rust title="concert/src/lib.rs"
pub async fn hold_concert(&mut self) 
```
>Hold a concert, turning of the FT (aka tickets) into NFTs; the hold a concert functionality is only available to the creator

### Init Config
To successfully initialize a concert program, one should provide an ActorID of the [Vara Miltiple Token Standard (VMT)](/docs/examples/Standards/vmt.md) program to hold all the token manipulations.

```rust title="concert/src/lib.rs"
pub fn init(owner_id: ActorId, vmt_contract: ActorId) -> Self {
    let storage = Storage {
        owner_id,
        contract_id: vmt_contract,
        ..Default::default()
    };
    unsafe { STORAGE = Some(storage) };
    Self(())
}
```

### Contract Interface

The concert program includes the following interface:

```rust
type TokenMetadata = struct {
  title: opt str,
  description: opt str,
  media: opt str,
  reference: opt str,
};

type State = struct {
  owner_id: actor_id,
  contract_id: actor_id,
  name: str,
  description: str,
  ticket_ft_id: u256,
  creator: actor_id,
  number_of_tickets: u256,
  tickets_left: u256,
  date: u128,
  buyers: vec actor_id,
  id_counter: u256,
  concert_id: u256,
  running: bool,
  metadata: vec struct { actor_id, vec struct { u256, opt TokenMetadata } },
  token_id: u256,
};

constructor {
  New : (owner_id: actor_id, vmt_contract: actor_id);
};

service Concert {
  BuyTickets : (amount: u256, mtd: vec opt TokenMetadata) -> null;
  Create : (creator: actor_id, name: str, description: str, number_of_tickets: u256, date: u128, token_id: u256) -> null;
  HoldConcert : () -> null;
  query GetStorage : () -> State;

  events {
    Creation: struct { creator: actor_id, concert_id: u256, number_of_tickets: u256, date: u128 };
    Hold: struct { concert_id: u256 };
    Purchase: struct { concert_id: u256, amount: u256 };
  }
};
```

## Conclusion
A source code of the program example is available on GitHub: [`concert/src`](https://github.com/gear-foundation/dapps/tree/master/contracts/concert/src).

See also an example of the program testing implementation based on [gtest](https://github.com/gear-foundation/dapps/tree/master/contracts/concert/tests).

For more details about testing programs on Vara, refer to this article: [Program Testing](/docs/build/testing).
