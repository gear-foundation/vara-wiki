---
sidebar_label: Mental Poker
sidebar_position: 8
---

# Mental Poker on Vara Network

:::note
**Who this article is for**: This article targets blockchain developers, cryptographers, and poker enthusiasts interested in how cryptography and blockchain enable secure and decentralized online poker.
:::

Mental poker is a unique cryptographic concept first introduced in the landmark 1979 paper ["Mental Poker"](https://people.csail.mit.edu/rivest/pubs/SRA81.pdf) by Ron Rivest, Adi Shamir, and Leonard Adleman (the creators of RSA). It enables players to play poker remotely without trusting each other or relying on intermediaries such as dealers or arbiters. Imagine playing poker online with a friend, but neither party trusts the platform or each other. Mental poker solves this trust issue by leveraging mathematics and cryptography to ensure cards are dealt fairly, remain hidden from other players, and enforce game rules purely through code. In an era where decentralization and secure remote interactions have become essential, mental poker addresses the critical need for trustless, secure, and fair online gaming.

The original RSA paper proposed a mental poker protocol based on commutative encryption—a cryptographic method where encryption and decryption can occur in any order. This ensures that the deck of cards is shuffled and dealt fairly without revealing card identities prematurely. To illustrate this intuitively, imagine a box locked by multiple padlocks, each belonging to a different player. The box can only open once all padlocks are removed, but the order in which they're unlocked doesn't matter.

Today, thanks to advancements in zero-knowledge proofs (ZKPs), elliptic curve cryptography, and blockchain technology, the vision outlined in the original Mental Poker paper is more achievable and practical than ever before. In this article, modern cryptographic tools combined with innovative blockchain architectures, such as Vara Network, will be explored. Importantly, these techniques are applicable not only to poker but can also be generalized to create secure, decentralized versions of many other games and trustless multi-party interactions.

## How Does the Original Protocol Work?

![img alt](../img/mental-poker-diagram.svg)

A deck of 52 cards is represented by unique identifiers that are encrypted and shuffled by multiple players.

**Example scenario**: `Alice` and `Bob` playing poker remotely:

**Alice encrypts** each card with her secret key $A$:
   
$$
A(C_1), A(C_2), \dots, A(C_{52})
$$
   
- Then Alice randomly shuffles the deck.

**Bob receives the encrypted deck**, encrypts it again with his key $B$:
   
$$
B(A(C_1)), B(A(C_2)), \dots, B(A(C_{52}))
$$
   
- Bob then randomly shuffles this doubly-encrypted deck.

**Card dealing**:
   
**Alice selects a card for Bob**, removes her encryption layer:
$$
B(A(C_i)) \rightarrow B(C_i)
$$
sends it to Bob. Bob removes his encryption layer:
$$
B(C_i) \rightarrow C_i
$$

**Bob selects a card for Alice**, removes his encryption layer:
$$
A(B(C_j)) \rightarrow A(C_j)
$$
sends it to Alice. Alice removes her encryption layer:
$$
A(C_j) \rightarrow C_j
$$

**Verification at the end**: Players reveal keys $A$ and $B$ publicly to verify fairness of the game.

Multiple encryption and shuffling layers ensure no player knows card positions until fully decrypted.

### Pseudocode for Encryption and Card Dealing

```python
# Deck of 52 cards
deck = [C1, C2, ..., C52]

alice_key = generate_secret_key()  # Alice's secret key
bob_key = generate_secret_key()    # Bob's secret key

# Alice encrypts and shuffles the deck
alice_encrypted_deck = [encrypt(card, alice_key) for card in deck]
shuffle(alice_encrypted_deck)  # Shuffling (verified via ZK later)

# Bob encrypts and shuffles again
bob_encrypted_deck = [encrypt(card, bob_key) for card in alice_encrypted_deck]
shuffle(bob_encrypted_deck)  # Shuffling (verified via ZK later)

# Dealing a card to Alice
alice_card = select_card(bob_encrypted_deck)  # Bob selects for Alice
alice_card = decrypt(alice_card, bob_key)     # Bob removes his layer
alice_card = decrypt(alice_card, alice_key)   # Alice removes her layer
print(f"Alice receives card: {alice_card}")

# Dealing a card to Bob
bob_card = select_card(bob_encrypted_deck)    # Alice selects for Bob
bob_card = decrypt(bob_card, alice_key)       # Alice removes her layer
bob_card = decrypt(bob_card, bob_key)         # Bob removes his layer
print(f"Bob receives card: {bob_card}")

# Fairness verification (via ZK-circuits, explained later)
verify_shuffle(alice_encrypted_deck, bob_encrypted_deck)
```
:::note
The pseudocode is simplified. Real implementations use cryptographic libraries and ZK-proofs, which will be explored later.
:::

## Modern Advances: ZK-Circuits and Smart Contracts

The original SRA protocol provides a foundational concept for mental poker, but modern implementations significantly expand on these ideas by using advanced cryptographic methods such as ZKP, elliptic curve cryptography, and blockchain-based smart contracts. These advances address key limitations in the original RSA-based scheme, such as efficiency, verification complexity, and practical scalability.

### ZKP’s Role

In mental poker, Zero-Knowledge Proofs enable players to demonstrate the correctness and fairness of actions—such as shuffling and dealing cards—without revealing sensitive information like card identities or their order. For example, a **Zero-Knowledge Shuffle Proof** mathematically guarantees the fairness of shuffling without exposing the shuffled order.

### Why zk-SNARKs?

Mental poker demands cryptographic guarantees balanced with practical efficiency, making zk-SNARKs (Succinct Non-Interactive Arguments of Knowledge) particularly suitable due to:

- **Compact Proofs**: zk-SNARK proofs are small, reducing on-chain verification costs.
- **Rapid Verification**: Proofs verify quickly (milliseconds), essential for responsive gameplay.
- **Off-chain Proof Generation**: Players perform complex proof generation off-chain, minimizing blockchain computational overhead.
- **Privacy with Integrity**: zk-SNARKs provide robust privacy without sacrificing cryptographic soundness, crucial in competitive games.

:::note
These claims about zk-SNARKs are accurate and reflect real-world performance. Typical zk-SNARK proofs (such as Groth16) are extremely compact—approximately **200 bytes** per proof. Even more recent zk-SNARK systems like PLONK typically produce proofs rarely exceeding **400–600 bytes**. For comparison, other zero-knowledge systems such as **Bulletproofs** (used in Monero) usually generate proofs of **1–2 KB** or larger.  

Additionally, the rapid verification claim is valid as well. zk-SNARK proofs generally verify within just a few milliseconds (often **1–10 ms**), even in constrained blockchain environments like Ethereum's EVM or WebAssembly-based runtimes.
:::

### Cryptographic Commitments with Elliptic Curves

A core mechanism of mental poker is cryptographic commitments, analogous to locking a card in a secure box. Modern protocols often use **Pedersen Commitments**:

$$
C = m \cdot G + r \cdot H
$$

where:  
- **m**: hidden card value (e.g., ace of spades),  
- **r**: random value ensuring secrecy,  
- **G, H**: publicly known elliptic curve points.

Pedersen Commitments offer:

- **Perfect hiding**: No leakage of card identity.
- **Computational binding**: Ensures cards cannot be altered without detection.

Elliptic curves provide computationally efficient arithmetic required by these commitments.

### Elliptic Curves: Selecting Optimal Curves

Elliptic curve selection critically influences ZKP efficiency. Two prominent curves stand out:

- **Baby Jubjub (BN-254 Curve)**:
  - Compatible with traditional zk-SNARK systems common in Ethereum-like blockchain environments.
  - Optimized for frequent operations such as commitments, encrypting, and shuffling cards.
  - Well-established tooling and library support.

- **Bandersnatch (BLS12-381 Curve)**:
  - Optimized for advanced zk-SNARK proving systems (Groth16, Plonk), providing faster arithmetic and smaller proofs.
  - Ideal for high-frequency actions (multiple rounds of shuffling, dealing, frequent proof verification).
  - Reduced gas costs due to smaller proofs and faster verification, making it optimal for scalable and interactive gameplay.

### Key Performance Factors

Practical online poker requires cryptographic efficiency and minimal latency. For zk-SNARK-based mental poker implementations, the most crucial performance metrics are:

- **Off-chain Proof Generation Speed**: Proofs for shuffling and dealing must be rapidly computed by players, typically within seconds or milliseconds, to sustain seamless gameplay.

- **On-chain Verification Latency and Cost**: zk-SNARK’s small proof size ensures minimal verification latency and lower gas fees, crucial for frequent blockchain interactions.

- **Minimal Proof Size**: Smaller proofs reduce on-chain data storage requirements and network overhead, directly contributing to lower transaction fees and faster processing.

In sum, zk-SNARK proofs utilizing elliptic curve cryptography deliver the ideal combination of privacy, fairness, and performance, establishing them as the optimal solution for decentralized mental poker.

## Mental Poker in the Vara Context

As we know, Vara is a WASM-based blockchain platform that applies the actor model at its core. The combination of actor-based logic, message-driven design, and a secure WASM runtime enables modular, scalable games—each poker table, lobby, or supporting service is an independent actor. Global state or blocking limitations are avoided entirely: each actor maintains its own state, and all cross-component coordination is handled through explicit message passing and events. This allows thousands of games to run in parallel with no data conflicts, and naturally simplifies integration with front-ends and analytics.

**Elliptic Curve Cryptography:**  
All cryptographic operations—commitments, encryption, public keys (ElGamal keys for poker), and all arithmetic on encrypted cards—are performed over the Bandersnatch curve (on BLS12-381). This curve is natively supported by the underlying cryptographic libraries (`ark-ed-on-bls12-381-bandersnatch`) and by Vara’s built-in primitives for pairing-based cryptography, including efficient serialization and deserialization.

**Pairing-Friendly Architecture:**  
All verification logic relies on pairing-friendly cryptography using BLS12-381 and Bandersnatch, providing compatibility with modern proof systems such as Groth16 and Plonk.

**Built-in Contracts for Verification:**  
On-chain zk-SNARK proof verification (Groth16/Plonk) is always performed by a dedicated zk-verification contract, never inside the game contract itself. Vara exposes built-in contracts that provide highly optimized cryptographic operations—multi-scalar multiplication, pairing checks, and related primitives. This approach accelerates verification, minimizes gas usage, and isolates security-sensitive code.

**Zero-Knowledge Proofs:**  
ZK proofs are generated off-chain by players (typically on client device). Only the compact proof and required public inputs are sent on-chain, avoiding network congestion and keeping user experience responsive.

**Gas Reservation:**  
Gas reservation is explicitly used in all important phases (lobby creation, game start, zk verification, and so on), guaranteeing that no key operation is left incomplete or interrupted. The WASM runtime enforces atomic execution of each transition.

## Implementation Details

The full source code is available in the public repository: [zk-mental-poker](https://github.com/gear-foundation/zk-mental-poker/tree/master)

The application consists of two main parts: on-chain smart contracts and the client-side UI.

### Client-Side Responsibilities

In addition to handling the standard poker game logic (moves, turns, etc.), the client is responsible for all sensitive cryptographic operations:

- **ElGamal Key Generation:**  
  Each player generates their own ElGamal keypair locally (in the browser). These keys are used for encrypting cards and sharing public keys between players.

- **Card Encryption/Decryption:**  
  All card encryption and decryption—including every intermediate encryption layer during shuffling—is performed locally on the client. This ensures that card privacy always remains under player control.

- **ZK-Proof Generation:**  
  All zk-SNARK proofs (for shuffling, dealing, etc.) are generated by the player on their device, using WASM cryptographic libraries.

- **On-Chain Data Submission:**  
  Only public data is sent to the blockchain: encrypted cards, public keys, zk-proofs, and required public inputs for proof verification.

:::note
*ElGamal keys* are asymmetric cryptographic key pairs used to enable multi-party encryption and decryption of cards, so that the order and value of cards remain private until revealed.
:::

### Programs Overview

The implementation consists of several main contracts/programs:

- **Mental Poker:**  
  The core contract for managing the state of each game, player moves, commitments, shuffling, and phase transitions.

- **Poker Factory:**  
  The factory contract used for creating new game instances and keeping a registry of active games.

- **ZK Verification Contract:**  
  Specialized contract for verifying zk-SNARK proofs (such as shuffle and deal proofs) on-chain.

- **PTS (Points/Token Service):**  
  Optional utility for tracking player points, balances, or in-game rewards.

### Typical Workflow

1. **Game Creation:**  
   The Poker Factory contract deploys a new game instance (Mental Poker contract) and handles player registration.

2. **Player Registration:**  
   Players join the lobby and are assigned to game instances.

3. **Shuffling and Dealing:**  
   Each player shuffles and encrypts the deck, generating a zk-SNARK proof (in-browser). The proof and updated deck are submitted on-chain for verification.

4. **Proof Verification:**  
   zk-SNARK proofs are verified by the ZK Verification contract before the next phase can proceed.

5. **Gameplay:**  
   All in-game actions (betting, card dealing, revealing) are orchestrated by the Mental Poker contract. Players continue to generate and submit zk-proofs as required by protocol.

6. **UI Synchronization:**  
   The client UI subscribes to events from the blockchain to update the game state in real-time.

---

**Try it now:**  
You can play decentralized mental poker on Vara here: [zk-mental-poker DApp](https://zk-mental-poker.gear-tech.io)