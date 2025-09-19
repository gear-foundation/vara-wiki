---
sidebar_label: Service Extending (Mixins)
sidebar_position: 4
---

# Service Extending (Mixins)

A standout feature of Sails is its capability to extend (or mix in) existing services. This is facilitated through the use of the `extends` argument in the `#[service]` attribute.

Consider you have `Service A` and `Service B`, possibly sourced from external crates, and you aim to integrate their functionalities into a new `Service C`. This integration would result in methods and events from `Services A` and `B` being seamlessly incorporated into `Service C`, as if they were originally part of it. In such a case, the methods available in `Service C` represent a combination of those from `Services A` and `B`. Should a method name conflict arise, where both `Services A` and `B` contain a method with the same name, the method from the service specified first in the extends argument takes precedence.

This strategy not only facilitates the blending of functionalities but also permits the overriding of specific methods from the original services by defining a method with the same name in the new service. With event names, conflicts are not allowed. Unfortunately, the IDL generation process is the earliest when this can be reported as an error. For example:

```rust
struct MyServiceA;

#[service]
impl MyServiceA {
    #[export]
    pub fn do_a(&mut self) {
        ...
    }
}

struct MyServiceB;

#[service]
impl MyServiceB {
    #[export]
    pub fn do_b(&mut self) {
        ...
    }
}

struct MyServiceC;

#[service(extends = [MyServiceA, MyServiceB])]
impl MyServiceC {
    // New method
    #[export]
    pub fn do_c(&mut self) {
        ...
    }

    // Overridden method from MyServiceA
    #[export]
    pub fn do_a(&mut self) {
        ...
    }

    // do_b from MyServiceB will exposed due to the extends argument
}
```
