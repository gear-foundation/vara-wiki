---
sidebar_label: Core Concepts
sidebar_position: 1
---

# Core Concepts

The Sails architecture for Gear applications is based on **three** key concepts.

## Service - `#[gservice]`

The first one is *__service__* which is represented by an impl of some Rust struct
marked with the `#[gservice]` attribute. The service main responsibility is
implementing some aspect of application business logic. A set of its __public__
methods defined by the impl is essentially a set of remote calls the service exposes
to external consumers. Each such method working over a `&mut self` is treated as
a command changing some state, whereas each method working over a `&self` is
treated as a query keeping everything unchanged and returning some data. Both
types of methods can accept some parameters passed by a client and can be synchronous
or asynchronous. All the other service's methods and associated functions are treated
as implementation details and ignored. The code generated behind the service by the
`#[gservice]` attribute decodes an incoming request message and dispatches it to the
appropriate method based on the method's name. On the method's completion, its result
is encoded and returned as a response to a caller.

```rust
#[gservice]
impl MyService {
    // This is a command
    pub fn do_something(&mut self, p1: u32, p2: String) -> &'static [u8] {
        ...
    }

    // This is a query
    pub fn some_value(&self, p1: Option<bool>) -> String {
        ...
    }
}
```

## Program - `#[gprogram]`

The second key concept is *__program__* which is similarly to the service represented
by an impl of some Rust struct marked with the `#[gprogram]` attribute. The program
main responsibility is hosting one or more services and exposing them to the external
consumers. A set of its associated __public__ functions returning `Self` are
treated as application constructors. These functions can accept some parameters
passed by a client and can be synchronous or asynchronous. One of them will be called
once at the very beginning of the application lifetime, i.e. when the application is
loaded onto the network. The returned program instance will live until the application
stays on the network. A set of program's __public__ methods working over `&self` and
having no other parameters are treated as exposed service constructors and are called
each time when an incoming request message needs be dispatched to a selected service.
All the other methods and associated functions are treated as implementation details
and ignored. The code generated behind the program by the `#[gprogram]` attribute
receives an incoming request message from the network, decodes it and dispatches it to
a matching service for actual processing. After that, the result is encoded and returned
as a response to a caller. Only one program is allowed per application.

```rust
#[gprogram]
impl MyProgram {
    // Application constructor
    pub fn new() -> Self {
        ...
    }

    // Yet another application constructor
    pub fn from_u32(p1: u32) -> Self {
        ...
    }

    // Service constructor
    pub fn ping_svc(&self) -> MyPing {
        ...
    }
}
```

## Routing - `#[groute]`

And the final key concept is message *__routing__*. This concept doesn't have a
mandatory representation in code, but can be altered by using the `#[groute]`
attribute applied to those public methods and associated functions described above.
The concept itself is about rules for dispatching an incoming request message to
a specific service's method using service and method names. By default, every
service exposed via program is exposed using the name of the service constructor
method converted into *PascalCase*. For example:

```rust
#[gprogram]
impl MyProgram {
    // The `MyPing` service is exposed as `PingSvc`
    pub fn ping_svc(&self) -> MyPing {
        ...
    }
}
```

This behavior can be changed by applying the `#[groute]` attribute:

```rust
#[gprogram]
impl MyProgram {
    // The `MyPing` service is exposed as `Ping`
    #[groute("ping")] // The specified name will be converted into PascalCase
    pub fn ping_svc(&self) -> MyPing {
        ...
    }
}
```

The same rules are applicable to service method names:

```rust
#[gservice]
impl MyPing {
    // The `do_ping` method is exposed as `Ping`
    #[groute("ping")]
    pub fn do_ping(&mut self) {
        ...
    }

    // The `ping_count` method is exposed as `PingCount`
    pub fn ping_count(&self) -> u64 {
        ...
    }
}
```