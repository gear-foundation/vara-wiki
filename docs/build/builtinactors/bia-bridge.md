---
sidebar_label: Bridge
sidebar_position: 4
---

# Bridge

:::note
**ActorId (32 bytes):**  
`0xf2816ced0b15749595392d3a18b5a2363d6fefe5b3b6153739f218151b7acdbf`
:::

**The Bridge Built-in Actor** enables Gear programs to communicate with Ethereum by sending outbound messages via a standardized interface. It accepts messages of type `Request`, processes them internally, and queues them for relay to the Ethereum network. This actor provides programs with the capability to initiate cross-chain interactions securely and efficiently without requiring additional deployment logic. It is accessible at a fixed address within the Vara runtime.

## Interface

The actor exposes a unified request interface via messages.

```rust
pub enum Request {
    SendEthMessage {
        destination: H160, // destination on Ethereum
        payload: Vec<u8>,
    }
}
```

The expected response type on a successful message queuing is:

```rust
pub enum Response {
    EthMessageQueued {
        nonce: U256,     // Message nonce.
        hash: H256,      // Message hash.
    
}
```

Usage

```rust
use gbuiltin_eth_bridge::{Request, Response};

const BRIDGE_ACTOR_ID: [u8; 32] = [
    0xf2, 0x81, 0x6c, 0xed, 0x0b, 0x15, 0x74, 0x95,
    0x95, 0x39, 0x2d, 0x3a, 0x18, 0xb5, 0xa2, 0x36,
    0x3d, 0x6f, 0xef, 0xe5, 0xb3, 0xb6, 0x15, 0x37,
    0x39, 0xf2, 0x18, 0x15, 0x1b, 0x7a, 0xcd, 0xbf
];

let request = Request::SendEthMessage {
    destination,
    payload,
}.encode();

let reply_bytes = msg::send_bytes_with_gas_for_reply(
    bridge_actor_id,
    request,
    GAS_TO_SEND_REQUEST,
    FEE_BRIDGE,
    GAS_FOR_REPLY_DEPOSIT,
)
.await?;

let reply = Response::decode(&mut &reply_bytes[..])?;
match reply {
    Response::EthMessageQueued { nonce, hash } => {
        // Handle the response...
    }
}

```