---
title: Technology Aspect
sidebar_position: 1
sidebar_label: Technology Aspect
---

Gear Protocol, built on [Substrate](/docs/about/technology/substrate.md), facilitates swift dApp development. It is the most developer-friendly way to implement programs and smart contracts with arbitrary logic and of any complexity.

Vara benefits from Gear Protocol's unique tech stack that includes the Actor Model, Persistent Memory and the WebAssembly virtual machine (Wasm). 

## Actor Model

In the [Actor Model](/docs/about/technology/actor-model.md) of communication, programs and users are known as "actors." Actors maintain their state privacy and communicate through messages, enhancing network security.  All communications are asynchronous but logically guaranteed to be handled, which increases the achievable network speed and allows the building of more sophisticated dApps.

## Persistent Memory

The [Persistent Memory](/docs/about/technology/persist-memory.md) concept entails that programs do not rely on shared storage; instead, their complete state is consistently stored within their respective memory spaces. Clever and effective memory virtualization techniques allow tracking memory access and ensuring that only required pages are persisted and loaded when needed. It removes many complexities, streamlining the development process while mapping running programs and their states to more closely resemble real-life operating system primitives.

## Wasm

[WebAssembly](/docs/about/technology/WASM.md) allows the running of any bytecode in a sandboxed environment. Smart contracts in Vara are run as Wasm programs (Actors). Since Wasm can be compiled from a variety of common programming languages, it considerably lowers the barrier to entry for developers arriving from the Web2 space. Enabling native speed for deterministic cross-platform computations, Wasm is Web3 development unlocked.

## Network Upgrade

Like all software systems, blockchains require periodic updates for security patches and other code changes. In the early days, blockchains had to implement forks to make updates, causing instability and price fluctuations. Coordinating updates within a decentralized community proved challenging.

Vara, built on the Substrate blockchain development framework, offers a solution with forkless runtime upgrades. Substrate enables the deployment of enhanced runtime capabilities, introducing breaking changes without a hard fork. This is possible because the runtime definition is a component of a Substrate chain's state, allowing network participants to update it through an extrinsic.

## Gear Capabilities

Gear Protocol offers a versatile platform for building next-generation Web3 applications. Gear's true strength lies in its broader capabilities:

- **Sovereign Layer-1 Networks** tailored to developer's specific needs, escaping the limitations of pre-defined protocols, enabling complete control over governance, consensus mechanisms, and fee structures.
- **Scalable Layer-2 Solutions** seamlessly integrating with popular Layer-1 networks (like Ethereum), offloading computationally intensive tasks, significantly reducing on-chain costs and boosting transaction throughput.
- **Parallel Processing Powerhouse** - Gear scales naturally with hardware advancements, thanks to its unique parallel processing architecture. Run demanding applications on standard computers, ensuring cost-effectiveness and accessibility.
- **Modular Microservices Mastery** - allows to deploy and manage individual microservices on single nodes or custom networks, optimize resource allocation, simplify maintenance, and achieve fine-grained control over the application's functionality.
- Unleash the potential of **Zero-Knowledge Proofs** (ZKPs) with Gear's high-performance infrastructure. Develop privacy-preserving applications, including ZKML (Zero-Knowledge Machine Learning), without sacrificing scalability or performance.
- **Familiar Development Environment** - leverages developers existing skillset supporting widely adopted programming languages like Rust, C, and C++, allowing developers to seamlessly transition to the Gear ecosystem without mastering new complexities.
- **Collaborative Community** - becoming a part of a thriving developer community enables anyone access a wealth of resources and support, including a growing library of pre-built programs and smart contracts examples, tools, and documentation. Contribute to the development of a vibrant and collaborative ecosystem.
- Seamlessly deployable as a **parachain within the DotSama** ecosystem. Along with most projects in Dotsama ecosystem, the Gear Protocol uses a Substrate framework. This simplifies the creation of different parachains for specific applications. Substrate provides extensive functionality out-of-the-box and allows one to focus on creating a custom engine on top of the protocol. The majority of developers and inspirers of the Gear Protocol were directly involved in creating Polkadot and Substrate technologies. 

Anyone with a standard computer can run a [Gear node](/docs/node/node.mdx) today and always. 

For additional details, refer to the [Gear Whitepaper](https://whitepaper.gear.foundation).
