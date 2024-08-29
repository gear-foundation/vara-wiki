---
sidebar_label: Events
sidebar_position: 2
---

# Events

Sails offers a mechanism to emit events from your service while processing commands.
These events serve as a means to notify off-chain subscribers about changes in
the application state. 

In Sails, events are configured and emitted on a per-service basis using the `events` argument in the `#[service]` attribute. These events are defined by a Rust `enum`, with each variant representing a distinct event and its optional data. Note that event `enums` must derive the `Encode` and `TypeInfo` traits provided by the SCALE codec. When a service specifies that it emits events, the `#[service]` attribute automatically generates the `notify_on` method, which the service can call to emit an event. For example:

```rust
fn counter_mut() -> &'static mut u32 {
    static mut COUNTER: u32 = 0;
    unsafe { &mut COUNTER }
}

struct MyCounter;

#[derive(Encode, TypeInfo)]
enum MyCounterEvent {
    Incremented(u32),
}

#[service(events = MyCounterEvent)]
impl MyCounter {
    pub fn new() -> Self {
        Self
    }

    pub fn increment(&mut self) {
        *counter_mut() += 1;
        self.notify_on(MyCounterEvent::Incremented(*counter_mut())).unwrap();
    }

    // This method is generated by the `#[service]` attribute
    fn notify_on(&mut self, event: MyCounterEvent) -> Result<()> {
        ...
    }
}
```

It's important to note that, internally, events use the same mechanism as any other
message transmission in the Gear Protocol. This means an event is only published
upon the successful completion of the command that emitted it.