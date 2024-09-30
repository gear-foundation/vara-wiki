---
sidebar_position: 1
sidebar_label: Sails-JS
---

# Sails-JS

The Sails-JS library is a powerful tool designed to help developers interact with their [Sails](/docs/build/sails/) applications on Vara Network. It facilitates seamless communication between your TypeScript projects and on-chain programs by providing two primary methods for generating client libraries from a Sails IDL (Interface Definition Language), while relying on the [Gear-JS API](/docs/api) library for low-level communication with Vara nodes and network interactions:

1. **Parsing IDL with the Sails Class**

   Use the `.parseIdl` method of the `Sails` class to parse a string containing the IDL description of your Sails application during runtime. This method instantiates a corresponding `Sails` object, which you can use to interact directly with your deployed application. This approach offers maximal control over the interaction with your application.

   *Why Choose This Method?*

   - **Fine-Grained Control**: Developers may want to manage low-level operations or handle side effects of the library's abstractions themselves. Using the raw `Sails` object gives you the flexibility to customize interactions as needed. Parsing the IDL at runtime can be also be advantageous if you need to work with multiple IDL files.

2. **Generating Client Libraries with `sails-js-cli`**

   The `sails-js-cli` command-line tool automates the generation of TypeScript client libraries from a given IDL file. The tool produces a `lib.ts` file that you can import into your TypeScript project. This generated library provides strongly typed classes and methods corresponding to your application's services, functions, queries, and events, making it easier and faster to interact with your deployed application.

   *Why Choose This Method?*

   - **Ease of Use**: The auto-generated client library simplifies the development process, allowing you to get started quickly without worrying about low-level details.
   - **Improved Developer Experience**: By providing abstractions over complex operations, it enables you to focus on building features rather than managing underlying mechanisms.


## Installation

The `sails-js` library requires the `@gear-js/api` and `@polkadot/api` packages to be installed. To install `sails-js` using npm, run the following command:

```sh
npm install sails-js
```

or using yarn:

```sh
yarn add sails-js
```

## Getting Started

To begin using `sails-js`, choose the method that best fits your development workflow:

- **Maximum Control with Dynamic Interaction**

  If you need fine-grained control over low-level operations or wish to handle side effects yourself, consider using the `.parseIdl` method to work with the raw `Sails` object. This approach is suitable for developers who require customization beyond what the generated client library offers. Refer to the [Overview](overview.md) section, which explains how to use the `Sails` class and its methods.

- **Quick Start with Generated Client Library**

  If you prefer a faster setup and a straightforward way to interact with your application, the generated client library is an excellent starting point. It abstracts away many complexities, making it ideal for developers who want to focus on application logic. See the [Client Generation](client-generation.md) section for guidance on using the `sails-js-cli` tool and integrating the generated `lib.ts` into your project.

**The Sails-JS code is available on [GitHub](https://github.com/gear-tech/sails).**
