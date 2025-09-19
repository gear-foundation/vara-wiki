---
sidebar_label: Migration
sidebar_position: 6
---

# Migration of `gstd` programs

[`Sails`](/docs/build/sails/sails.mdx) is a library for writing applications utilizing the Gear Protocol with simplicity and clarity. This powerful tool represents the next step in the evolution of the Gear Protocol.

Initially, Gear applications typically employ the less convenient [`gstd`](/docs/build/gstd/gstd.md) library for managing low-level operations and essential functionality. The `Sails` library builds programs on top of `gstd`, handling most low-level interactions under the hood. As projects grow, adopting the `Sails` framework allows developers to shift towards a more modular and service-oriented architecture. Existing dApps written with `gstd` can be effortlessly migrated to `Sails`.

This guide focuses on the key steps involved in transitioning existing gstd-based code to the `Sails` framework, outlining the necessary code transformations and architectural adjustments while leveraging the underlying `gstd` infrastructure.

## Setting Up Your Sails Project

To get started with the migration process, you can use a template to create a new project with Sails.  

- First, install the sails-cli tool using the following command:

    ```bash
    cargo install sails-cli
    ```

- After installation, you can generate a new project named "vara-app" by running:

    ```bash
    cargo sails program vara-app
    ```

## Migrating Action Handling  

- In **gstd**-based projects, actions are typically defined using enums, which are processed within a `handle` function. This function decodes incoming messages and matches them to the corresponding action:

    ```rust
    pub enum Action {
        DoA,
        DoB,
    }

    impl Metadata for ProgramMetadata {
        type Handle = In<Action>;
    }

    #[no_mangle]
    extern fn handle() {
        let action: Action = msg::load().expect("Failed to decode `Action` message.");
        match action {
            Action::DoA  => { /* Implementation for action A */ },
            Action::DoB  => { /* Implementation for action B */ },
        }
    }
    ```            

- In **`Sails`**, this approach is restructured to leverage the framework’s service-oriented architecture. While the actions are still processed through a single entry point (`handle` function), logically they are dispatched to service methods based on string identifiers rather than enum types. Each action is linked to a specific service method, which improves modularity.

    ```rust
    #[service]
    impl Service {
        pub fn do_a(&mut self) { /* Implementation for action A */ }
        pub fn do_b(&mut self) { /* Implementation for action B */ }
    }
    ```
:::note
Instead of matching enum variants as in `gstd`, the **`Sails`** framework maps string-based service identifiers  
(e.g. `do_a` or `do_b`) to the corresponding service methods, allowing for more flexible action routing.
:::

## Migrating Reply Messages  

- In the case of low-level use of **`gstd`**, sending a reply message is done manually after the action has been processed. The reply should be sent using the `msg::reply` function:

    ```rust
    #[no_mangle]
    extern fn handle() {
        let action: Action = msg::load().expect("Failed to decode `Action` message.");
        match action {
            Action::DoA  => {
                // Implementation for action A
                msg::reply(reply, 0).expect("Failed to encode `reply`");
            },
        }

    }
    ```

- When using **`Sails`**, replies are returned directly from the service function, and the framework manages the encoding and sending of the message:

    ```rust
    #[service]
    impl Service {
        #[export]
        pub fn do_a(&mut self) -> TypeOfReply {
            // Implementation for action A
            reply
        }
    }
    ```

This reduces manual work, as the framework abstracts the reply handling, resulting in more concise code.

## Migrating State Queries  

- State queries are often implemented through enums, which handle different state requests and responses manually within a `state` function:

    ```rust
    pub enum StateQuery {
        State1,
        State2,
    }

    pub enum StateReply {
        State1(...),
        State2(...),
    }

    impl Metadata for ProgramMetadata {
        type State = InOut<StateQuery, StateReply>;
    }

    #[no_mangle]
    extern fn state() {
        let query: StateQuery = msg::load().expect("Unable to load the state query");
        match query {
            StateQuery::State1 => {
                msg::reply(StateReply::State1(state), 0).expect("Unable to share the state");
            },
            StateQuery::State2 => {
                msg::reply(StateReply::State2(state), 0).expect("Unable to share the state");
            },
        }
    }
    ```

- When migrating to **`Sails`**, state-related functions are methods that take `&self` as a parameter, since they don’t modify the state but only query it:

    ```rust
    #[service]
    impl Service {
        #[export]
        pub fn state_1(&self) -> TypeOfReply {
            // Implementation for State1
            state
        }
        #[export]
        pub fn state_2(&self) -> TypeOfReply {
            // Implementation for State2
            state
        }
    }
    ```

## Conclusion

Migrating a project from the `gstd` library to the `Sails` framework is a straightforward process that primarily involves adapting the code to a more modular and service-oriented structure. Since `Sails` operates on top of `gstd`, the core functionality remains the same, but the framework provides a more organized and maintainable approach to handling actions, replies, and state queries.

By following the steps outlined in this guide, you can easily refactor your project to take advantage of the abstractions and efficiency offered by `Sails`. This migration not only simplifies code management but also enhances the long-term scalability.

With just a few adjustments to your existing codebase, such as reorganizing action handling into service methods and streamlining state queries, your project can seamlessly transition to `Sails` without sacrificing any of the functionality provided by `gstd`.
