---
sidebar_label: Proxy
sidebar_position: 3
---

# Proxy

:::note
**ActorId (32 bytes):**  
`0x8263cd9fc648e101f1cd8585dc0b193445c3750a63bf64a39cdf58de14826299`
:::

The [Proxy Built-in Actor](https://github.com/gear-tech/gear/blob/master/pallets/gear-builtin/src/proxy.rs) serves as an intermediary that allows Gear programs to interact with the [Proxy pallet](https://paritytech.github.io/polkadot-sdk/master/pallet_proxy/index.html). It translates proxy-related requests into dispatchable calls, enabling programs to manage proxy relationships dynamically. This actor allows programs to define and manage delegation of account actions securely and efficiently.

Proxy relationships can be created or revoked with a specified type, providing granular control over delegated actions. Currently, all proxies managed through this actor do not require an announcement or delay for delegate actions, simplifying the delegation process. The `ProxyType` enum defines the types of actions a proxy can perform, mirroring the proxy pallet's `ProxyType`. This provides flexibility for use cases such as governance participation, staking, and identity verification.

```rust
pub enum ProxyType {
    Any,
    NonTransfer,
    Governance,
    Staking,
    IdentityJudgement,
    CancelProxy,
}
```

## Supported Proxy Operations

The `Request` enum specifies the operations that the Proxy Built-in Actor can handle. Each variant represents a different proxy action a program can request. Below, each operation and its parameters are detailed.

### `AddProxy`

Adds a delegate as a proxy for the sender's account. The `proxy_type` defines the types of actions the delegate is authorized to perform.

```rust
AddProxy {
    delegate: ActorId,
    proxy_type: ProxyType,
}
```

### `RemoveProxy`

Removes a delegate from the sender's list of proxies for a specific `proxy_type`.

```rust
RemoveProxy {
    delegate: ActorId,
    proxy_type: ProxyType,
}
```