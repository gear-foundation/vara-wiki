---
sidebar_label: Create Program
sidebar_position: 8
---

# Create a Program from a Program

The business logic of any decentralized application may necessitate enabling the program to create, initialize, and launch one or multiple other programs within the network. This capability becomes crucial when external parties, such as users, require access to their unique instance of a standard program.

For example, consider a program that implements loan functionality. In this case, the program developer can create a loan factory program that will create instances of loan programs on demand and operate them.

Firstly, to create a program, submit the program code to the network using an extrinsic [`gear.uploadCode`](https://docs.gear.rs/pallet_gear/pallet/struct.Pallet.html#method.upload_code) and obtain its code hash. Submitting the program code does not initialize the program.

:::info

To submit code, use the [Gear IDEA](https://idea.gear-tech.io/) application or submit it via the @gear-js/api library. The `Gear Program` CLI can also be used - https://github.com/gear-tech/gear/tree/master/gcli.

:::

After the code has been submitted, it can be used to create a new program:

```rust
use gstd::{prog::ProgramGenerator, CodeHash, msg};

#[no_mangle]
extern "C" fn handle() {
    let submitted_code: CodeHash =
        hex_literal::hex!("abf3746e72a6e8740bd9e12b879fbdd59e052cb390f116454e9116c22021ae4a")
            .into();

    // ProgramGenerator returns ProgramId

    let program_id = ProgramGenerator::create_program_with_gas(submitted_code, b"payload", 10_000_000_000, 0)
        .expect("Unable to create program");

    msg::send(program_id, b"hello", 0).expect("Unable to send message");
}
```

More information about the `gstd::prog` module can be found at https://docs.rs/gstd/latest/gstd/prog/index.html.