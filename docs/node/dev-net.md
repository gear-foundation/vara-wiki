---
sidebar_label: Dev Net Mode
sidebar_position: 5
---

# Running Gear Node in Dev Net Mode

Dev net is helpful for the development and debugging of programs. It allows direct upload of programs to a local node, sending messages to programs, and validating program logic.

To run the Vara node in dev net mode:

1. Compile or download the nightly build for the operating system as described in [Setting Up](/docs/node/node.mdx).
2. Run the node in dev mode (assuming the executable is in the `/usr/bin` directory):

```bash
gear --dev
```

3. Follow https://idea.gear-tech.io/ and connect to a local dev node. Click network selection via the left top button, choose Development -> Local node, and click the Switch button. Use the Idea portal for sending messages, reading the program's state, etc.
4. To purge any existing dev chain state, use:

```bash
gear purge-chain --dev
```

5. To start a dev chain with detailed logging, use:

```bash
RUST_LOG=debug RUST_BACKTRACE=1 gear -lruntime=debug --dev
```
