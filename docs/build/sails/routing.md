---
sidebar_label: Message Routing
sidebar_position: 3
---

# Message Routing

Message **routing** doesn't have a mandatory representation in code, but can be altered by using the `#[route]`
attribute applied to the public methods of structs labelled with the `#[program]` or `#[service]` attribute.
The concept itself is about rules for dispatching an incoming request message to
a specific service's method using service and method names. By default, every
service exposed via program is exposed using the name of the service constructor
method converted into *PascalCase*. For example:

```rust
#[program]
impl MyProgram {
    // The `MyPing` service is exposed as `PingSvc`
    #[export]
    pub fn ping_svc(&self) -> MyPing {
        ...
    }
}
```

This default behavior can be changed by applying the `#[route]` attribute:

```rust
#[program]
impl MyProgram {
    // The `MyPing` service is exposed as `Ping`
    #[route("ping")] // The specified name will be converted into PascalCase
    pub fn ping_svc(&self) -> MyPing {
        ...
    }
}
```

The same rules are applicable to service method names:

```rust
#[service]
impl MyPing {
    // The `do_ping` method is exposed as `Ping`
    #[route("ping")]
    pub fn do_ping(&mut self) {
        ...
    }

    // The `ping_count` method is exposed as `PingCount`
    pub fn ping_count(&self) -> u64 {
        ...
    }
}
```
