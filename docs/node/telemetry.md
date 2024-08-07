---
sidebar_label: Node Monitoring
sidebar_position: 3
---

# Sending Vara node telemetry

The health of each Vara node and the entire network needs to be monitored to ensure truly decentralized and robust operations. This includes the various block production metrics as well as node uptime which is vital in PoS networks.

As any other Substrate based nodes, Vara node can be connected to an arbitrary telemetry backend using the `--telemetry-url`.

To start sending telemetry messages to the arbitrary telemetry server instance, one needs to specify an additional key during node run that will enable sending telemetry to specified http address.

If you want to participate and share your telemetry, run your node with the flag (we assume the executable is in `/usr/bin` directory):

```sh
gear --telemetry-url "wss://telemetry.rs/submit 0"
```

Also, you can provide your node name using the `--name` flag:

```sh
gear --name "NODE NAME"
```

For example, to start a node with telemetry, run the command:

```sh
gear --telemetry-url "wss://telemetry.rs/submit 0" --name "My_Gear_node_name"
```

You can send more information (e.g., the validator address) by increasing the verbosity level:

```sh
gear --telemetry-url "wss://telemetry.rs/submit 1" --name "My_validator_name"
```

To check telemetry for currently running nodes, visit the web address: [https://telemetry.rs](https://telemetry.rs).

You can find some additional information about monitoring in the [Substrate docs](https://docs.substrate.io/maintain/monitor/).
