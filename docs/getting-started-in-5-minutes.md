---
title: Getting Started
sidebar_position: 4
---

# Getting started in 5 minutes

This guide provides a general overview of running programs on the [Vara Network](https://vara.network/). It guides you through how to write a program, compile it to Wasm and deploy it to the network.

:::important
Want to take your blockchain development skills to the next level? Join **[Gear Academy's](https://academy.gear.foundation/)** free courses. Start from scratch with our [Beginner Course](https://academy.gear.foundation/courses/basic_course) or explore the implementation of programs using Gear technologies with the [Intermediate Course](https://academy.gear.foundation/courses/intermediate-course). More courses are being developed.

Don't miss this opportunity to become a pro Vara blockchain developer. Enroll now in Gear Academy's courses!
:::

## Prerequisites

1. Linux users should generally install `GCC` and `Clang` according to their distribution’s documentation.

    For example, on Ubuntu use:

    ```bash
    sudo apt install -y build-essential clang cmake curl
    ```

    On macOS, you can get a compiler toolset by running:

    ```bash
    xcode-select --install
    ```

2. Make sure you have installed all the tools required to build a program in Rust. [Rustup](https://rustup.rs/) will be used to get Rust compiler ready:

    ```bash
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
    ```

3. A Wasm compiler is necessary for compiling a Rust program to Wasm, add it to the toolchain.

    ```bash
    rustup target add wasm32-unknown-unknown
    ```

**_Note:_** If you use Windows, download and install [Build Tools for Visual Studio](https://visualstudio.microsoft.com/downloads/?q=build+tools).

## Creating your first Vara program

To get started, install the `cargo-gbuild` tool using the following command:

    ```bash
    cargo install cargo-gbuild
    ```

After installation, you can create a new Vara project named `hello_world` by running:

    ```bash
    cargo-gbuild new hello_world
    ```

Your `hello_world` directory tree should look like this:

    ```
    hello_world
    │
    ├── Cargo.toml
    ├── app
    │   ├── Cargo.toml
    │   └── src
    │       └── lib.rs
    │
    └── wasm
        ├── Cargo.toml
        ├── build.rs
        └── src
            └── lib.rs

    
    ```
    
In `Cargo.toml`, the essential libraries required for building your first project have been included:

    ```toml
    [workspace]
    resolver = "2"

    members = [
        "app", "wasm",
    ]

    [workspace.package]
    version = "0.1.0"
    edition = "2021"
    license = "GPL-3.0"

    [workspace.dependencies]
    gstd = "*"
    gear-wasm-builder = "*"
    sails-idl-gen = "*"
    sails-rs = "*"
    ```

Let's move on to the main code:

This Rust code defines a simple **Hello, World!** program for the Vara Network. It consists of a `Program` struct with a method to instantiate it and another method to return a `HelloWorld` struct. The `HelloWorld` struct has a service method that returns the string *"Hello, world!"*. This example demonstrates the basic structure and functionality of a Vara program using the `sails_rs` library.

    ```rust title="hello_world/app/src/lib.rs"
    #![no_std]
    use sails_rs::prelude::*;

    #[derive(Default)]
    pub struct Program;

    #[program]
    impl Program {
        pub fn new() -> Self {
            Self
        }
        pub fn hello_world(&self) -> HelloWorld {
            HelloWorld::default()
        }
    }

    #[derive(Default)]
    pub struct HelloWorld(());

    #[service]
    impl HelloWorld {
        pub fn hello_world(&mut self) -> &'static str {
            "Hello, world!"
        }
    }
    ```

The following code is needed to compile the project into WebAssembly and generate an **.idl** file for the program interface. It uses `gear_wasm_builder` to compile the code and the `sails_idl_gen` library to generate the **IDL** file.

    ```rust title="hello_world/wasm/build.rs"
    use app::Program;
    use sails_idl_gen::program;
    use std::{env, path::PathBuf};

    fn main() {
        gear_wasm_builder::build();

        program::generate_idl_to_file::<Program>(
            PathBuf::from(env::var("CARGO_MANIFEST_DIR").unwrap()).join("app.idl"),
        )
        .unwrap();
    }
    ```

Build your program with a single command:

    ```bash
    cargo build --release
    ```

If everything has been executed successfully, your working directory should now contain a `target` directory structured as follows:

    ```
    hello_world
    ├── ...
    ├── target
        ├── ...
        └── wasm32-unknown-unknown
            └── release
                ├── application_builder.wasm       <---- this is our built .wasm file
                └── application_builder.opt.wasm   <---- this is optimized .wasm file
    ```

- `application_builder.wasm` is the output Wasm binary built from source files
- `application_builder.opt.wasm` is the optimized Wasm aimed to be uploaded to the blockchain  
(Optimization include reducing the file size and improving performance)

In addition, the interface file `app.idl` should have been generated in the `wasm` project directory.

    ```idl title="hello_world/wasm/app.idl"
    constructor {
      New : ();
    };

    service HelloWorld {
      HelloWorld : () -> str;
    };
    ```

## Deploy your program to the Testnet

Gear provides an application for developers (Gear Idea) that implements all of the possibilities of interaction with programs in Vara networks (mainnet and testnet), available at [idea.gear-tech.io](https://idea.gear-tech.io).

### Create account

1. Download the Polkadot extension for your browser via [https://polkadot.js.org/extension/](https://polkadot.js.org/extension/). This extension manages accounts and allows the signing of transactions with those accounts. It is a secure tool that allows injecting your accounts into any Substrate-based dapp. It does not perform wallet functions, e.g send funds.

2. Once downloaded, click <kbd>+</kbd> button to create a new account:

    ![Add account](/assets/getting-started/polkadot-add-acc.png)

3. Make sure you save your 12-word mnemonic seed securely.

    ![Create account](/assets/getting-started/polkadot-add-acc-2.png)

4. Select the network that will be used for this account - choose "Allow to use on any chain". Provide any name to this account and password and click "Add the account with the generated seed" to complete account registration.

    ![Finalizing account](/assets/getting-started/polkadot-add-acc-3.png)

5. Go to **[idea.gear-tech.io](https://idea.gear-tech.io)**. You will be prompted to grant access to your account for the application, click "Yes, allow this application access".

    ![Allow access](/assets/getting-started/polkadot-access.png)

6. Make sure you are connected to the `Vara Network Testnet`. The network name is at the bottom left corner of the page.

    ![Network name](/assets/getting-started/idea-network.png)

7. You may switch the network by clicking on the network name.

    ![Switch network](/assets/getting-started/switch-network.png)

8.    Click the `Connect` button on the top-right to select an account that will be connected to Vara.

    ![Connect account](/assets/getting-started/connect-account.png)

9. In accordance with the Actor model, programs are uploaded to a network via messages. Vara node charges a gas fee during message processing. Your account balance needs to have enough funds to upload a program to the `TestNet`. Click the following button to get the test balance:

    ![Get balance](/assets/getting-started/get-balance.png)

    A notification about successful balance replenishment will appear after passing captcha at the bottom of the window. You can also see the current account balance next to the account name in the upper right corner.

    ![Transfer balance](/assets/getting-started/got-balance.png)

### Upload program

1. When your account balance is sufficient, click the <kbd>Upload program</kbd>  button to open a popup window for uploading your new program.

    ![Upload program button](/assets/getting-started/upload.png)

2. In the popup, click the <kbd>Select file</kbd> button and navigate to the `.opt.wasm` file we have pointed to above

    ![Upload new program](/assets/getting-started/upload-new-program.png)

3. After uploading the `.opt.wasm` file, you need to upload the `IDL` file. Click the <kbd>Select file</kbd> button and navigate to the `.idl` file referenced earlier.

    ![Upload idl button](/assets/getting-started/add_idl.png)

4. Specify the program name, click the <kbd>Calculate Gas</kbd> button to set the gas limit automatically, and then click the <kbd>Upload program</kbd> button.

    ![Upload program form](/assets/getting-started/interface.png)

5. Sign the `gear.uploadProgram` transaction to Vara. It is recommended to set the checkbox `Remember my password for the next 15 minutes` for your convenience.

    ![Sign transaction](/assets/getting-started/sign-transaction.png)

6. Once your program is uploaded, go to the `Programs` section, find your program, and select it.

    ![Recently uploaded programs](/assets/getting-started/recent.png)

7. Click on your program to see more information, such as `Program details`, `IDL`, and the `Messages` pane.

    ![Main page program](/assets/getting-started/main-page-program.png)

### Send message to a program

1. Send your newly uploaded program a message to see how it responds! Click the <kbd>Send message</kbd> button.

2. Click the <kbd>Calculate Gas</kbd> button to set the gas limit automatically, then click the <kbd>Send Message</kbd> button.

    ![Send form](/assets/getting-started/send-request.png)

3. Sign the `gear.sendMessage` transaction as it is shown in step 5 of the section **Upload Program**.

4. After your message has been successfully processed, you will see corresponding notifications:

    ![Log](/assets/getting-started/message-log.png)

    You have just sent a HelloWorld command to your program!

5. Go back to your program by either clicking the <kbd>Cancel</kbd> button or using the browser's back button. 

6. In the message pane, you can see the new message request (blue arrow) along with the corresponding response (green arrow).

    ![Log](/assets/getting-started/messages.png)

7. Click on the message response to see more information. The expected "**Hello, World!**" response can be seen in the `Payload`.

    ![Log](/assets/getting-started/reply.png)

---

## Further reading

For more info about writing programs for Vara and the specifics behind the program implementation, refer to [this article](/docs/build/introduction.md).
