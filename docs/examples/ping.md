---
sidebar_label: PING-PONG
sidebar_position: 2
---

# PING-PONG

Explore the simplicity of coding with Vara through a minimal program that demonstrates a [Ping-Pong](https://github.com/gear-foundation/dapps/tree/master/contracts/ping-pong) service.

:::tip
The project code is developed using the [Sails](/docs/build/sails/sails.mdx) framework.
::: 

## Implementation details

The Ping-Pong program is found in the `app/src/lib.rs` file and responds with a *"Pong!"* message every time it receives a `ping` request. Additionally, it keeps a count of the pings received, allowing users to track their interactions with the service.

The code below defines a basic `PingPongService` using the `sails` framework:

```rust title="app/src/lib.rs"
#[sails_rs::service]
impl PingPongService {
    fn init() -> Self {
        unsafe {
            PING_COUNTER = Some(U256::zero());
        }
        Self(())
    }
    // Service's method (command)
    pub fn ping(&mut self) -> String {
        let ping_counter = self.get_mut();
        *ping_counter += U256::one();
        "Pong!".to_string()
    }

    // Service's query
    pub fn get_ping_count(&self) -> U256 {
        *self.get()
    }    
}
```

This code outlines the `PingPongService` with the `sails_rs::service` macro and includes the following core functions:

- `init()`: This initializes the `PingPongService` by setting a global `PING_COUNTER` to zero, preparing it for tracking future pings.
- `ping(&mut self) -> String`: This command method increments the ping counter on each call and returns the response *"Pong!"*.
- `get_ping_count(&self) -> U256`: This query method provides the current count of pings without altering the state, allowing external users to view the interaction count.

## Source code

The source code of this example of Ping-Pong program and the example of an implementation of its testing is available on [gear-foundation/dapp/contracts/ping-pong](https://github.com/gear-foundation/dapps/tree/master/contracts/ping-pong).

See also an example of the smart contract testing implementation based on `gtest`: [gear-foundation/dapps/vara-man/tests](https://github.com/gear-foundation/dapps/tree/master/contracts/ping-pong/tests).

For more details about testing programs written on Gear, refer to the [Program Testing](/docs/build/testing) article.
