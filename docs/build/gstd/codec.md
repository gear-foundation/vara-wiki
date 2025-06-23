---
sidebar_label: Data Encoding/Decoding
sidebar_position: 7
---

# Data Encoding/Decoding

To optimize how data is sent and received over the network, Gear uses the [`parity-scale-codec`](https://docs.rs/parity-scale-codec) - a Rust implementation of the SCALE Codec. This codec is used by the Substrate nodes' internal runtime. SCALE is a lightweight format that enables the serialization and deserialization of data. Encoding (and decoding) data using SCALE makes it highly suitable for resource-constrained execution environments like blockchain runtimes and low-power/low-memory devices.

To use the SCALE codec in a program, add it to `Cargo.toml`:

```toml
[dependencies]

// ...
codec = { package = "parity-scale-codec", version = "3.6", default-features = false }
```

```rust
use codec::{Decode, Encode};

#[derive(Encode, Decode)]
enum MyType {
    MyStruct { field: ... },
    ...
}
```

:::info

The `Encode` and `Decode` traits are needed when using wrapped methods from `gstd`, such as: [`msg::load`](https://docs.rs/gstd/latest/gstd/msg/fn.load.html), [`msg::send`](https://docs.rs/gstd/latest/gstd/msg/fn.send.html), [`msg::reply`](https://docs.rs/gstd/latest/gstd/msg/fn.reply.html), [`msg::send_for_reply`](https://docs.rs/gstd/latest/gstd/msg/fn.send_for_reply.html), etc.

In methods like [`msg::load_bytes`](https://docs.rs/gstd/latest/gstd/msg/fn.load_bytes.html), [`msg::send_bytes`](https://docs.rs/gstd/latest/gstd/msg/fn.send_bytes.html), or [`msg::reply_bytes`](https://docs.rs/gstd/latest/gstd/msg/fn.reply_bytes.html), operations are performed with a set of bytes, so nothing needs to be decoded/encoded.

:::

Learn more about the SCALE Codec [here](https://github.com/paritytech/parity-scale-codec).

## `scale-info`

[`scale-info`](https://docs.rs/scale-info/) is a library to describe Rust types, intended for providing information about the structure of encodable SCALE types.

The definitions provide third-party tools (e.g., a UI client) with information about how to decode types agnostic of language. The interface that uses `scale-info` for Gear programs is called **metadata**. It defines incoming and outgoing types for all necessary entry points and allows programs and the client part to understand each other.

:::info
[Learn more](./metadata.md) about using metadata in a program.
:::

To use `scale-info` in a project:

```toml
[dependencies]

// ...
scale-info = { version = "2.9", default-features = false, features = ["derive"] }
```

Learn more about `scale-info` [here](https://github.com/paritytech/scale-info).