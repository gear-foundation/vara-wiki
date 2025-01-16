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

This article provides an example of the native implementation of a randomness oracle, which provides the ability to use random numbers in programs. It can be used as is or modified to suit specific scenarios. Anyone can easily create their own oracle and run it on the Vara Network.  

The source code, developed using the [Sails](../../../build/sails/sails.mdx) framework, is available on [GitHub](https://github.com/gear-foundation/dapps/tree/master/contracts/oracle).

## Storage Structure

The `Oracle` structure defines the storage for the program, including the owner, the manager responsible for operations, and optional [dDNS](../dein.md) information.

```rust title="oracle/app/src/lib.rs"
pub struct Oracle {
    owner: ActorId,
    manager: ActorId,
    dns_info: Option<(ActorId, String)>,
}
```

### `Action` 

The oracle exposes methods to interact with its state and fetch randomness values from the designated manager.

```rust title="oracle/app/src/lib.rs"
pub async fn request_value(&mut self) -> u128;
pub fn change_manager(&mut self, new_manager: ActorId);
```
- `request_value`: Asynchronously retrieves the latest random value from the manager and emits a `NewValue` event.
- `change_manager`: Updates the manager responsible for providing randomness values, ensuring operational flexibility.

The oracle also provides accessors to retrieve its internal state:

```rust title="oracle/app/src/lib.rs"
    pub fn get_owner(&self) -> ActorId;
    pub fn get_manager(&self) -> ActorId;
    pub fn get_dns_info(&self) -> Option<(ActorId, String)>;
```
- `get_owner`: Returns the oracle owner's ActorId.
- `get_manager`: Returns the current manager's ActorId.
- `get_dns_info`: Retrieves the DNS integration details.


### `Event`

The `Event` enum captures significant actions within the oracle, enabling better system monitoring and interaction.

```rust title="oracle/app/src/lib.rs"
#[derive(Debug, Encode, Decode, TypeInfo)]
pub enum Event {
    NewValue { value: u128 },
    NewManager(ActorId),
}
```
- `NewValue`: Emitted when a new random value is fetched and stored.
- `NewManager`: Triggered when the manager is changed, indicating a shift in operational responsibility.

## Conclusion

The source code of this example of a Vara Oracle program is available on GitHub: [gear-foundation/dapps/contracts/oracle](https://github.com/gear-foundation/dapps/tree/master/contracts/oracle).

See also an example of the program testing implementation based on `gtest`: [gear-foundation/dapps/contracts/oracle](https://github.com/gear-foundation/dapps-oracle/tree/wip/oracle/tests).

For more details about testing programs written on Vara, refer to this article: [Program Testing](/docs/build/testing).
