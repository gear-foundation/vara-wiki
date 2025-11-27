---
sidebar_position: 17
---

# Testing with gtest

gtest simulates a real network by providing mockups of the user, program, balances, mailbox, etc. Since it does not include parts of the actual blockchain, it is fast and lightweight. However, as a model of the blockchain network, gtest cannot be a complete reflection of the actual network.

gtest is excellent for unit and integration testing and is also helpful for debugging Gear program logic. Running tests based on gtest only requires the Rust compiler, making its use in continuous integration predictable and robust.

## Import gtest Library

To use the gtest library, import it into the Cargo.toml file in the `[dev-dependencies]` block to fetch and compile it for tests only:

```toml
[package]
name = "my-gear-app"
version = "0.1.0"
authors = ["Your Name"]
edition = "2024"

[dependencies]
gstd = { git = "https://github.com/gear-tech/gear.git", tag = "v1.0.1" }

[build-dependencies]
gear-wasm-builder = { git = "https://github.com/gear-tech/gear.git", tag = "v1.0.1" }

[dev-dependencies]
gtest = { git = "https://github.com/gear-tech/gear.git", tag = "v1.0.1" }
```

Make sure you use latest version of `gtest` and other crates required for program developing.

## gtest Capabilities

### `System` - Gear node environment

The System is a per-thread singleton that represents the complete Gear blockchain environment. It maintains block height, timestamp, message queue, program storage, and user balances. Only one System instance can exist per thread - attempting to create multiple instances will panic.

```rust
let sys = System::new();
```

System provides logging configuration methods for test output control. Initialize styled env_logger to print logs (gwasm target by default) to stdout:

```rust
// Gear programs use `gwasm` target with `debug` logging level.
// `init_logger` method sets filter to handle only `gwasm` target at `debug`,
// but it can be overridden by `RUST_LOG` environment variable:
// RUST_LOG="gtest=debug,gwasm=warn" cargo test
sys.init_logger();
```

The System provides several methods for advancing blockchain state through block execution:
- `run_next_block()` - runs one block, processing messages from the queue
- `run_next_block_with_allowance(gas)` - runs one block with custom gas allowance
- `run_to_block(n)` - runs blocks until specified block number is reached
- `run_scheduled_tasks(n)` - processes only scheduled tasks for n blocks without messages

Note that 1 block in Gear network is 3 sec duration.

### `Program` - interface to interact with Gear programs

`Program` represents a Gear program and provides interface for interacting with it. There are several ways to instantiate a `Program`:

```rust
// 1. Load current crate's program (recognizes the compiled WASM binary path)
let prog = Program::current(&sys);

// 2. Load program from specific WASM file path
let prog = Program::from_file(
    &sys,
    "./target/wasm32-unknown-unknown/release/demo_ping.wasm",
);

// 3. Create program from WASM binary with custom configuration using ProgramBuilder
let prog = ProgramBuilder::from_file("./target/wasm32-unknown-unknown/release/demo_ping.wasm")
    .with_id(105)
    .build(&sys);

// 4. Create program from binary bytes
let code = std::fs::read("demo.wasm").unwrap();
let prog = Program::from_binary_with_id(&sys, 123, code);

// Get program info
let prog_id = prog.id();     // Returns program id
let balance = prog.balance(); // Returns program balance

// Getting existing program from the system by id
let existing_prog = sys.get_program(105);
```

The Program provides methods for sending messages:
- `send()` and `send_bytes()` for messages without value
- `send_with_value()` and `send_bytes_with_value()` for messages with attached funds

Both methods require sender id as first argument and payload as second:
- `send()` requires payload to be parity-scale-codec encodable
- `send_bytes()` requires payload to implement `AsRef<[u8]>`

```rust
// First message to a program is always the init message
let init_message_id = prog.send_bytes(100001, "INIT MESSAGE");

// Subsequent messages are handle messages
let handle_message_id = prog.send_bytes(100001, "PING");

// Sending messages with value (requires sufficient sender balance)
let message_id = prog.send_bytes_with_value(100001, "PING", 1000);
```

### `BlockRunResult` - processing execution results

After sending messages, they are queued in the `System`. To process messages, call one of the block execution methods. These methods return `BlockRunResult` containing the outcome of block execution.

```rust
// Runs one block, processing messages from the queue.
// Queue has `init` and `handle` messages sent from the
// previous example. `System::run*` methods allow to process
// the queue.
let block_result = sys.run_next_block();

// `BlockRunResult` provides information about:
// - Messages that were successfully executed
assert!(block_result.succeed.contains(&init_message_id));

// - Messages that failed during execution
assert!(block_result.failed.is_empty());

// - Messages that were skipped
assert!(block_result.skipped.is_empty());

// - Events emitted during block execution
let events = block_result.events();

// - Check if specific event exists in the result
assert!(block_result.contains(&expected_event));
```

### `UserMessageEvent` - messages not in mailbox

Messages sent from program to user can end up as events if mailbox conditions aren't met. `UserMessageEvent` represents such messages and provides access to their fields.

```rust
// Access events from `BlockRunResult`
let events = block_result.events();
for event in events {
    let source = event.source();      // Get message source
    let dest = event.destination();   // Get message destination
    let payload = event.payload();    // Get raw payload bytes
    
    // Decode payload into specific type
    let decoded: Result<String, _> = event.decode_payload();
}
```

### `UserMailbox` - managing user mailbox

`UserMailbox` is the interface for managing a particular user's mailbox. It can only be instantiated through `System::get_mailbox()` method.

```rust
let user_id = 42;
let user_mailbox = sys.get_mailbox(user_id);

// Check if mailbox contains specific message
assert!(user_mailbox.contains(&expected_message));

// Reply to messages in the mailbox
user_mailbox.reply_bytes(message_id, "REPLY", 0).unwrap();

// Claim value from message without replying
user_mailbox.claim_value(message_id).unwrap();
```

### `EventBuilder` - finding events and messages

`EventBuilder` provides a convenient way to construct events for searching in `BlockRunResult` or messages in `UserMailbox`.

```rust
// Build an event to search for in `BlockRunResult`
let expected_event = EventBuilder::new()
    .source(prog.id())
    .dest(100001)
    .payload_bytes(b"PONG")
    .build();

// Check if event exists in block result
assert!(block_result.contains(&expected_event));

// EventBuilder can be used directly without calling build()
assert!(block_result.contains(&EventBuilder::new()
    .source(prog.id())
    .dest(100001)
    .payload_bytes(b"PONG")
));

// Use EventBuilder to find messages in `UserMailbox`
let user_mailbox = sys.get_mailbox(100001);
assert!(user_mailbox.contains(&EventBuilder::new()
    .source(prog.id())
    .dest(100001)
    .payload_bytes(b"RESPONSE")
));
```

`EventBuilder` supports method chaining with various field setters:
- `with_source()` - set message source
- `with_destination()` - set message destination  
- `with_payload()` - set parity-scale-codec-encodable payload
- `with_payload_bytes()` - set raw bytes payload
- `with_reply_code()` - set reply code
- `with_reply_to()` - set reply-to message id

### Balance management

Before sending messages, ensure sufficient balance for the sender to cover existential deposit and gas costs.

```rust
let user_id = 42;
// Mint balance to a user
sys.mint_to(user_id, 5000);
assert_eq!(sys.balance_of(user_id), 5000);

// Transfer value to the program directly.
sys.transfer(user_id, prog.id(), 1000, true);

// Alternatively, use default users with preallocated balance
use gtest::constants::DEFAULT_USER_ALICE;
let message_id = prog.send_bytes(DEFAULT_USER_ALICE, "PING");
```

### Complete example

Here's a complete test example demonstrating the `gtest` API:

```rust
#[test]
fn test_ping_pong() {
    use gtest::{System, Program, EventBuilder};
    use gtest::constants::{DEFAULT_USER_ALICE, EXISTENTIAL_DEPOSIT};
    
    // Initialize the Gear node environment
    let sys = System::new();
    
    // Initialize current program
    let prog = Program::current(&sys);

    // Although ids are 32 bytes values, you can define integer ids
    let user = 42;
    
    // Ensure user has sufficient balance
    sys.mint_to(user, EXISTENTIAL_DEPOSIT * 1000);
    
    // Send init message
    let init_id = prog.send_bytes(user, b"");
    let result = sys.run_next_block();
    assert!(result.succeed.contains(&init_id));
    
    // Send handle message
    let handle_id = prog.send_bytes(DEFAULT_USER_ALICE, b"PING");
    let result = sys.run_next_block();
    
    // Verify successful execution
    assert!(result.succeed.contains(&handle_id));
    
    // Check for expected reply event
    let expected_event = EventBuilder::new()
        .source(prog.id())
        .dest(DEFAULT_USER_ALICE)
        .payload_bytes(b"PONG");
    
    assert!(result.contains(&expected_event));
}
```
