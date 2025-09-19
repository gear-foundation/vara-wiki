---
sidebar_label: IDL Specification
sidebar_position: 5
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# IDL Specification

Applications developed with the Sails framework include an auto-generated IDL file that contains detailed information about the application, including:

- **Types**: Custom types used within the program.
- **Constructors**: The program's constructor.
- **Services**: Commands and queries for all the services exposed by the program.
- **Events**: Events utilized within the program.

## Examples
### Types

This example demonstrates how the custom Rust type `IoTrafficLightState` is represented in the corresponding IDL file.

<Tabs>
  <TabItem value="rust" label="Rust" default>
    ```rust
    // Create a struct that can be send to the user who reads state
    #[derive(Encode, Decode, TypeInfo)]
    #[codec(crate = sails_rs::scale_codec)]
    #[scale_info(crate = sails_rs::scale_info)]
    pub struct IoTrafficLightState {
      pub current_light: String,
      pub all_users: Vec<(ActorId, String)>,
    }
    ```
  </TabItem>
  <TabItem value="idl" label="IDL">
    ```rust
    type IoTrafficLightState = struct {
      current_light: str,
      all_users: vec struct { actor_id, str },
    };
    ```
  </TabItem>
</Tabs>

### Constructors, Services and Events

This code snippet can be examined to understand how more advanced Sails applications are represented in the IDL file. Note the additional keyword `query` in the IDL file for the `name` and `balance_of` methods, which use `&self` instead of `&mut self` as their first parameter.

<Tabs>
  <TabItem value="rust" label="Rust" default>
    ```rust
    #[service]
    impl Token {
        pub fn init(name: String) {
            unsafe {
                STATE = Some(State {
                    name,
                    balances: HashMap::new(),
                });
            }
        }

        #[export]
        pub fn mint(&mut self, to: ActorId, value: U256) {
            let state = State::get_mut();
            let balance = state.balances.entry(to).or_insert(U256::zero());
            *balance += value;
        }

        #[export]
        pub fn name(&self) -> &'static str {
            let state = State::get();
            &state.name
        }

        #[export]
        pub fn balance_of(&self, account: ActorId) -> U256 {
            let state = State::get();
            *state.balances.get(&account).unwrap_or(&U256::zero())
        }
    }

    pub struct MyProgram;

    #[program]
    impl MyProgram {
        pub fn new(name: String) -> Self {
            Token::init(name);
            Self
        }

        pub fn token(&self) -> Token {
            Token::default()
        }
    }
    ```
  </TabItem>
  <TabItem value="idl" label="IDL">
    ```rust
    constructor {
      New : (name: str);
    };

    service Token {
      Mint : (to: actor_id, value: u256) -> null;
      Transfer : (from: actor_id, to: actor_id, value: u256) -> null;
      query BalanceOf : (account: actor_id) -> u256;
      query Name : () -> str;
    };
    ```
  </TabItem>
</Tabs>

