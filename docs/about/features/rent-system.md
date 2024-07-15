---
sidebar_label: Rent-Based System
sidebar_position: 5
---

# Rent-Based System

## Messaging Concept

Understanding the message communication model and its benefits is of utmost importance for the safety and success of developers working with Vara Network. This innovative model is built upon the principles of the [Actor Model](/docs/about/technology/actor-model.md), where all participants, including programs and users, are considered "actors." These actors interact seamlessly by exchanging messages.

## Rent-Based system

{/* ### Program rent

Vara Network introduces an innovative program life cycle management system, prioritizing sustainable and economical resource usage. Within this system, programs on the Vara Network can rent network resources for their memory storage. This rental concept is similar to a time-limited subscription that allows the program to remain active and operational within the network.

Upon program upload, each program is automatically assigned a predefined expiration date for free, typically set to last for 5,000,000 blocks, where each block lasts approximately 3 seconds (~173 days).

To extend the program's functionality beyond this period, users can increase this expiration parameter for the program. However, to ensure the program's viability throughout the chosen lifetime extension, the user must possess enough VARA tokens in their balances.

To maintain the program's functionality after the current rent period expires, the user should proactively pay more VARA tokens for the program. Any user on the network can contribute additional VARA to any program as needed.

After the rent period's expiration, the program automatically transitions to a 'paused' state, leading to the removal of its memory pages from the storage. However, important data such as the block number when the program was paused and its memory hash remain accessible on the network. Consequently, the paused program can be resumed with its state restored to the point at which it was paused, provided an archive node is connected to the network.
*/}

### Message rent

{/*Additionally,*/} Vara enables rent for messages stored in the Waitlist.

:::note 
According to the Actor Model in Gear Protocol, actors exchange messages. One of the Gear-specific entities is the Waitlist - a database where messages (not transactions) reside.
:::

A message enters payable storage with locked funds for a maximum duration in `N` blocks. In `M` blocks (where `M<N`), a message can leave storage, paying rent for `M` blocks from locked funds and freeing the rest of this lock (`N-M`) back. The Rent Pool is a synthetic address that keeps all rent payments during the current staking ERA. At the end of the ERA, the rent payment redistributes rent shares among the validator set according to their ERA points.

If the message remains in storage for its maximum duration `N`, it is automatically removed from storage, and the entire locked funds are distributed to validators (but not more than `N` in case of network congestion). Unlike programs, remaining messages in the waitlist cannot be prolonged.

### Why is this Important?

- **Efficient Resource Utilization**: The {/*program and*/} message expiration system in the Vara Network prevents the accumulation of outdated or unused programs within its storage. By automatically expiring {/*programs*/} and messages after a predetermined period, the network optimizes resource utilization, reducing clutter and ensuring a clean ecosystem for active and relevant programs.
- **Stimulating Utility Token Use**: To extend the life of their programs beyond the initial expiration date, owners must pay rent using utility tokens. This mechanism incentivizes and stimulates the use of utility tokens within the Vara ecosystem. As a result, the circulation of utility tokens increases, enhancing their overall utility and promoting a healthy token economy.
- **Promoting a Sustainable Economic Model**: Vara Network's thoughtful program life cycle approach ensures that network resources are allocated to actively maintained and useful programs. By utilizing a rent-based system, Vara fosters a sustainable economic model, wherein programs that continue to provide value can be sustained over time, leading to a healthier and more robust network.

{/*Visit [this article](/docs/build/rent-system/) to explore the technical aspects of the rent program system.*/}