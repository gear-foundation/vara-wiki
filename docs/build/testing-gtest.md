---
sidebar_position: 17
---

# Testing with `gtest`

`gtest` simulates a real network by providing mockups of the user, program, balances, mailbox, etc. Since it does not include parts of the actual blockchain, it is fast and lightweight. However, as a model of the blockchain network, `gtest` cannot be a complete reflection of the actual network.

`gtest` is excellent for unit and integration testing and is also helpful for debugging Vara program logic. Running tests based on `gtest` only requires the Rust compiler, making its use in continuous integration predictable and robust.

## Import `gtest` Library

To use the `gtest` library, import it into the `Cargo.toml` file in the `[dev-dependencies]` block to fetch and compile it for tests only:

```toml
[package]
name = "first-gear-app"
version = "0.1.0"
authors = ["Your Name"]
edition = "2021"

[dependencies]
gstd = { git = "https://github.com/gear-tech/gear.git", tag = "v1.1.1" }

[build-dependencies]
gear-wasm-builder = { git = "https://github.com/gear-tech/gear.git", tag = "v1.1.1" }

[dev-dependencies]
gtest = { git = "https://github.com/gear-tech/gear.git", tag = "v1.1.1" }
```

## `gtest` Capabilities

- Initialization of the common environment for running programs:
```rust
// This emulates node's and chain's behavior.
// By default, sets:
// - current block equals 0
// - current timestamp equals UNIX timestamp of your system.
// - minimal message id equal 0x010000..
// - minimal program id equal 0x010000..
let sys = System::new();
```

- Program initialization:
```rust
// Initialization of program structure from file.
// Takes as arguments reference to the related `System` and the path to wasm binary relative to the root of the crate where the test was written.
// Sets free program id from the related `System` to this program. For this case it equals 0x010000..
// Next program initialized without id specification will have id 0x020000.. and so on.
let _ = Program::from_file(
    &sys,
    "./target/wasm32-unknown-unknown/release/demo_ping.wasm",
);

// Also, use the `Program::current()` function to load the current program.
let _ = Program::current(&sys);

// Check the id of the program by calling `id()` function.
// It returns `ProgramId` type value.
let ping_pong_id = ping_pong.id();

// Manually specify the id of the program using `from_file_with_id` constructor.
let _ = ProgramBuilder::from_file("./target/wasm32-unknown-unknown/release/demo_ping.wasm")
    .with_id(105)
    .build(&sys);
```

- Getting the program from the system:
```rust
// Retrieve the object from the system by id.
let _ = sys.get_program(105);
```

- Initialization of styled `env_logger`:
```rust
// Initialization of styled `env_logger` to print logs (only from `gwasm` by default) into stdout.
// To specify printed logs, set the env variable `RUST_LOG`:
// `RUST_LOG="target_1=logging_level,target_2=logging_level" cargo test`
// Vara programs use `gwasm` target with `debug` logging level
sys.init_logger();
```

- Sending messages:
```rust
// To send a message to the program, call `send()` or `send_bytes()` (or `send_with_value` and `send_bytes_with_value` if you need to send a message with attached funds).
// Both methods require the sender id as the first argument and the payload as the second.
// The first method requires payload to be CODEC Encodable, while the second requires payload to implement `AsRef<[u8]>`.
// First message to the initialized program structure is always the init message.
let res = program.send_bytes(100001, "INIT MESSAGE");
```

- Processing the result of the program execution:
```rust
// Sending functions return `RunResult` structure containing the final result of the processing message and others created during execution.
// It has 4 main functions:

// Returns the reference to the Vec produced to users messages.
assert!(res.log().is_empty());

// Returns bool indicating if there was panic during the execution of the main message.
assert!(!res.main_failed());

// Returns bool indicating if there was panic during the execution of the created messages during the main execution.
assert!(!res.others_failed());

// Returns bool indicating if logs contain a given log.
assert!(!res.contains(&Log::builder()));

// Build a log for assertion using `Log` structure with its builders.
// All fields are optional. Assertions with Logs from core are made on the Some(..) fields.
// Constructor for success log.
let _ = Log::builder();

// Constructor for error reply log. Note that error reply never contains payload.
let _ = Log::error_builder();

// Send a new message after the program has been initialized.
let res = ping_pong.send_bytes(100001, "PING");

// Other fields are set optionally by `dest()`, `source()`, `payload()`, `payload_bytes()`.
// The logic for `payload()` and `payload_bytes()` is the same as for `send()` and `send_bytes()`.
let log = Log::builder()
    .source(ping_pong_id)
    .dest(100001)
    .payload_bytes("PONG");

assert!(res.contains(&log));

let wrong_log = Log::builder().source(100001);

assert!(!res.contains(&wrong_log));

// Log also has `From` implementations from (ID, T) and from (ID, ID, T),
// where ID: Into<ProgramIdWrapper>, T: AsRef<[u8]>.
// Examples:
let x = Log::builder().dest(5).payload_bytes("A");
let x_from: Log = (5, "A").into();
assert_eq!(x, x_from);

let y = Log::builder().dest(5).source(15).payload_bytes("A");
let y_from: Log = (15, 5, "A").into();
assert_eq!(y, y_from);

assert!(!res.contains(&(ping_pong_id, ping_pong_id, "PONG")));
assert!(res.contains(&(1, 100001, "PONG")));
```

- Spending blocks:
```rust
// Control time in the system by spending blocks.
// It adds the amount of blocks passed as arguments to the current block of the system.
// Note that 1 block in Vara network is 1 sec duration.
sys.spend_blocks(150);
```

<!-- - Reading the program state:
```rust
// Read the program state using `meta_state()` or `meta_state_with_bytes()`.
// These methods require the payload as the input argument.
// The first method requires payload to be CODEC Encodable, while the second requires payload to implement `AsRef<[u8]>`.
// Example:
#[derive(Encode, Decode, TypeInfo)]
pub struct ContractState {
    a: u128,
    b: u128,
}

pub enum State {
    A,
    B,
}

pub enum StateReply {
    A(u128),
    B(u128),
}

#[no_mangle]
unsafe extern "C" fn meta_state() -> *mut [i32; 2] {
    let query: State = msg::load().expect("Unable to decode `State`");
    let encoded = match query {
        State::A => StateReply::A(STATE.a),
        State::B => StateReply::B(STATE.b),
    }.encode();
    gstd::util::to_leak_ptr(encoded)
}

// Send a query from gtest:
let reply: StateReply = self
        .meta_state(&State::A)
        .expect("Meta_state failed");
let expected_reply = StateReply::A(10);
assert_eq!(reply,expected_reply);

// If `meta_state` function doesn't require input payloads, use `meta_state_empty` or `meta_state_empty_with_bytes` functions without any arguments.
``` -->

- Balance:
```rust
// To send a message with value, mint balance for the message sender:
let user_id = 42;
sys.mint_to(user_id, 5000);
assert_eq!(sys.balance_of(user_id), 5000);

// To give the balance to the program, use the `mint` method:
let prog = Program::current(&sys);
prog.mint(1000);
assert_eq!(prog.balance(), 1000);
```
