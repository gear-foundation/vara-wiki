---
title: Getting Started
sidebar_position: 4
---

# Getting started in 5 minutes

This guide provides a general overview of running programs on the [Vara Network](https://vara.network/). It guides you through how to write a program, compile it to Wasm and deploy it to the network.

:::important
Want to take your blockchain development skills to the next level? Don't miss this opportunity to become a pro Vara blockchain developer. 🔥 Try out the interactive [Sails tutorial](https://sails-tutorials.vara.network/hello-world/hello-world).
:::

## Prerequisites

1. Linux users should generally install `GCC` and `Clang` according to their distribution's documentation.

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
rustup target add wasm32v1-none
```

:::note
Since Gear release 1.8.0, the new target `wasm32v1-none` is required for building programs for the Vara Network.  
The old target `wasm32-unknown-unknown` is only needed for legacy projects.
:::

**_Note:_** If you use Windows, download and install [Build Tools for Visual Studio](https://visualstudio.microsoft.com/downloads/?q=build+tools).

## Creating your first Vara program

To get started, install the `sails-cli` tool using the following command:

    ```bash
    cargo install sails-cli
    ```

After installation, you can create a new Vara project named `vara-app` by running:

    ```bash
    cargo sails program vara-app
    ```

Your `vara-app` directory tree should look like this:

    ```
    vara-app
    │
    ├── app
    │   └── src
    │       └── lib.rs
    │
    ├── client
    │   └── ...
    │
    ├── src
    │   └── lib.rs     
    │
    ├── tests
    │   └── gtest.rs
    │
    ├── build.rs
    │
    ├── Cargo.lock
    │
    ├── Cargo.toml
    │
    └──  README.md
    ```
    
In `Cargo.toml`, the essential libraries required for building your first project have been included, for example:

    ```rust title="vara-app/Cargo.toml"
    [package]
    name = "vara-app"
    version = "0.1.0"
    edition = "2024"

    [dependencies]
    sails-rs = "0.9.1"
    vara-app-app = { version = "0.1.0", path = "app" }

    [workspace]
    resolver = "3"
    members = ["app", "client"]

    [workspace.package]
    version = "0.1.0"
    edition = "2024"

    [build-dependencies]
    sails-rs = { version = "0.9.1", features = ["build"] }
    vara-app-app = { version = "0.1.0", path = "app" }

    [dev-dependencies]
    sails-rs = { version = "0.9.1", features = ["gtest", "gclient"] }
    tokio = { version = "1.47.1", features = ["rt", "macros"] }
    vara-app-app = { path = "app" }
    vara-app-client = { path = "client" }

    ```

Let's move on to the main code:

This Rust code defines a simple program for the Vara Network, now updated with a new structure. The program consists of a `VaraAppProgram` struct with a method to instantiate it and another method to return a `VaraAppService` struct. The `VaraAppService` struct has a service method that returns the string *"Hello from VaraApp!"*. This example demonstrates the basic structure and functionality of a Vara program using the `sails_rs` library.

    ```rust title="vara-app/app/src/lib.rs"
    #![no_std]

    use sails_rs::prelude::*;

    struct Service(());

    impl Service {
        pub fn new() -> Self {
            Self(())
        }
    }

    #[sails_rs::service]
    impl Service { 
        // Service's method (command)
        #[export]
        pub fn do_something(&mut self) -> String {
            "Hello from Service!".to_string()
        }
    }

    #[derive(Default)]
    pub struct Program(());

    #[sails_rs::program]
    impl Program {
        // Program's constructor
        pub fn new() -> Self {
            Self(())
        }

        // Exposed service
        pub fn service(&self) -> Service {
            Service::new()
        }
    }
    ```

Build your program with a single command:

    ```bash
    cargo build --release
    ```

After a successful build, you can execute your tests to verify that everything is functioning correctly:

    ```bash
    cargo test --release
    ```

If everything has been executed successfully, your working directory should now contain a `target` directory structured as follows:

    ```
    vara-app
    ├── ...
    ├── target
        ├── ...
        └── wasm32-gear
            └── release
                ├── vara_app.wasm       <---- this is our built .wasm file
                ├── vara_app.opt.wasm   <---- this is optimized .wasm file
                └── vara_app.idl        <---- this is our application interface .idl file
    ```

- `vara_app.wasm` is the output Wasm binary built from source files
- `vara_app.opt.wasm` is the optimized Wasm aimed to be uploaded to the blockchain  
(Optimization include reducing the file size and improving performance)
- `vara_app.idl` is the Interface Definition Language (IDL) file that describes the application's interface, defining the structure and methods callable on the `vara_app` program. It's essential for interacting with the application on the blockchain, specifying available functions and their inputs and outputs. This file is crucial for developers and clients to ensure they use the correct method signatures and data types when interacting with the deployed program.

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

4. Specify the program name, click the <kbd>Calculate Gas</kbd> button to set the gas limit automatically, and then click the <kbd>Submit</kbd> button.

    ![Upload program form](/assets/getting-started/interface.png)

5. Sign the `gear.uploadProgram` transaction to Vara. It is recommended to set the checkbox `Remember my password for the next 15 minutes` for your convenience.

    ![Sign transaction](/assets/getting-started/sign-transaction.png)

6. Once your program is uploaded, go to the `Programs` section, find your program, and select it.

    ![Recently uploaded programs](/assets/getting-started/recent.png)

7. Click on your program to see more information, such as `Metadata/Sails`, `Messages`, `Events`, and the `Vouchers` pane.

    ![Main page program](/assets/getting-started/main-page-program.png)

### Send message to a program

1. Send your newly uploaded program a message to see how it responds! Click the <kbd>Send message</kbd> button.

2. Click the <kbd>Calculate Gas</kbd> button to set the gas limit automatically, then click the <kbd>Send Message</kbd> button.

    ![Send form](/assets/getting-started/send-request.png)

3. Sign the `gear.sendMessage` transaction as it is shown in step 5 of the section **Upload Program**.

4. After your message has been successfully processed, you will see corresponding notifications:

    ![Log](/assets/getting-started/message-log.png)

    You have just sent a `DoSomething` command to your program!

5. Go back to your program by either clicking the <kbd>Cancel</kbd> button or using the browser's back button. 

6. In the message pane, you can view the corresponding response.

    ![Log](/assets/getting-started/messages.png)

7. Click on the message response to see more information. The expected "**Hello from VaraApp!**" response can be seen in the `Payload`.

    ![Log](/assets/getting-started/reply.png)

---

## Further reading

For more info about writing programs for Vara and the specifics behind the program implementation, refer to [this article](/docs/build/introduction.md).
