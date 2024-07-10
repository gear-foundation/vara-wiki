---
sidebar_label: Program Testing
sidebar_position: 16
---

# How to Test a Vara Program

## Basics

Vara uses the standard testing mechanism for Rust programs: building and running testing executables using `cargo`.

Following the basic concepts and testing methods described in the [Rustbook](https://doc.rust-lang.org/book/ch11-00-testing.html), tests can be organized into two main categories: **unit tests** and **integration tests**.

**Unit tests** enable testing of each unit of code in isolation from the rest of the code. This helps quickly identify where the code works as expected and where it does not. Unit tests should be placed in the `src` directory in each file containing the code they test.

Even when code units work correctly, it is crucial to test if several library parts work together correctly. For **integration tests**, a separate `tests` directory is required at the top level of the project directory, next to `src`. Multiple test files can be created in this directory, and `cargo` will compile each file as an individual crate.

## How to Test a Program

There are at least two ways to test and debug Vara programs.

The first is off-chain testing using the low-level [`gtest`](https://docs.gear.rs/gtest/) crate. This approach is recommended for unit and integration tests.

The second is on-chain testing with the higher-level [`gclient`](https://docs.gear.rs/gclient/) crate, which is well-suited for end-to-end testing.

Although `gclient` is oriented towards end-to-end testing, tests can be written as unit or integration tests in Rust. It is recommended to use an integration-like approach with separate test files in the `tests` directory when utilizing the `gclient` crate.

## Building a Program in Test Mode

First, ensure a compiled Wasm file of the program to be tested. Refer to [Getting Started](getting-started-in-5-minutes.md) for additional details.

1. Usually, the following command is used for the regular compilation of Vara programs:

    ```bash
    cd ~/gear/contracts/first-gear-app/
    cargo build --release
    ```

    The nightly compiler is required if some unstable features have been used:

    ```bash
    cargo +nightly build --release
    ```

2. The minimal command for running tests is:

    ```bash
    cargo test
    ```

    The nightly compiler is required if the program uses unstable Rust features, and the compiler will prompt to enable `nightly` if necessary:

    ```bash
    cargo +nightly test
    ```

    Build tests in release mode to run faster:

    ```bash
    cargo test --release
    ```

## Dig Deeper

The following sections outline testing a Vara program using both the `gtest` and `gclient` crates.