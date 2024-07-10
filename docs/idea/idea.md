---
sidebar_label: Gear IDEA Overview
sidebar_position: 2
---

# Gear IDEA Overview

The Gear IDEA portal is a convenient tool designed to familiarize users with the Gear platform. It offers program and smart contract developers the easiest and fastest way to work with their programs on the Vara Network (mainnet and testnet) directly in their browser without additional configuration.

This application supports all interactions with programs on the network, including uploading programs and codes, reading program states, sending messages, and more. Additionally, it allows managing accounts, balances, events, vouchers, and more.

You can start experimenting right now at **https://idea.gear-tech.io/**.

![Idea main screen](./img/idea_main.jpg)

# IDEA components and microservices

[frontend](https://github.com/gear-tech/gear-js/tree/main/idea/frontend)

React application that provides the user interface for working with programs running on Vara network.

[indexer](https://github.com/gear-tech/gear-js/tree/master/idea/indexer)

Microservice is responsible for blockchain indexing and storing information about programs and their messages as well as for storing programs metadata.

[test-balance](https://github.com/gear-tech/gear-js/tree/main/idea/test-balance)

Microservice provides the opportunity to obtain test tokens.

[api-gateway](https://github.com/gear-tech/gear-js/tree/main/idea/api-gateway)

Microservice provides any interaction between `indexer` / `test-balance` services and an external user
