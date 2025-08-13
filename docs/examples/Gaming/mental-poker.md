---
sidebar_label: Mental Poker
sidebar_position: 8
---

# Mental Poker on Vara Network

:::note
**Who this article is for**: This article targets blockchain developers, cryptographers, and poker enthusiasts interested in how cryptography and blockchain enable secure and decentralized online poker.
:::

Mental poker is a unique cryptographic concept first introduced in the landmark 1979 paper ["Mental Poker"](https://people.csail.mit.edu/rivest/pubs/SRA81.pdf) by Ron Rivest, Adi Shamir, and Leonard Adleman (the creators of [RSA](https://en.wikipedia.org/wiki/RSA_cryptosystem)). It enables players to play poker remotely without trusting each other or relying on intermediaries such as dealers or arbiters. Imagine playing poker online with a friend, but neither party trusts the platform or each other. Mental poker solves this trust issue by leveraging mathematics and cryptography to ensure cards are dealt fairly, remain hidden from other players, and enforce game rules purely through code. In an era where decentralization and secure remote interactions have become essential, mental poker addresses the critical need for trustless, secure, and fair online gaming.

The original RSA paper proposed a mental poker protocol based on commutative encryption — a cryptographic method where encryption and decryption can occur in any order. This ensures that the deck of cards is shuffled and dealt fairly without revealing card identities prematurely. To illustrate this intuitively, imagine a box locked by multiple padlocks, each belonging to a different player. The box can only open once all padlocks are removed, but the order in which they're unlocked doesn't matter.

While the original RSA-based approach proved the concept, it was computationally expensive and lacked efficient, practical methods to **verify the honesty of a shuffle without revealing the permutation** — a challenge that remained open in 1979. Modern elliptic curves offer faster arithmetic with smaller keys, and **zero-knowledge** techniques provide succinct proofs of correct shuffles/deals **without** leaking card order. Together with blockchains, this makes mental poker practical at scale.

Today, thanks to advancements in zero-knowledge proofs (ZKPs), elliptic curve cryptography, and blockchain technology, the vision outlined in the original Mental Poker paper is more achievable and practical than ever before. In this article, modern cryptographic tools combined with innovative blockchain architectures, such as Vara Network, will be explored. Importantly, these techniques are applicable not only to poker but can also be generalized to create secure, decentralized versions of many other games and trustless multi-party interactions.

## How Does the Original Protocol Work?

![img alt](../img/mental-poker-diagram.svg)

A deck of 52 cards is represented by unique identifiers that are encrypted and shuffled by multiple players.

**Example scenario**: `Alice` and `Bob` playing poker remotely:

**Alice encrypts** each card with her secret key $A$:

$$
A(C_1), A(C_2), \dots, A(C_{52})
$$

Here, $begin:math:text$ C_i $end:math:text$ denotes the **unique identifier of the _i_-th card** in the deck — e.g., an integer from 1 to 52 or any internal representation that uniquely maps to a specific rank and suit.

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
alice_card = select_card(bob_encrypted_deck)      # Bob selects for Alice
alice_card = decrypt(alice_card, bob_key)         # Bob removes his layer
alice_card = decrypt(alice_card, alice_key)       # Alice removes her layer
print(f"Alice receives card: {alice_card}")

# Remove the dealt card from the deck
bob_encrypted_deck = remove_card(bob_encrypted_deck, alice_card)

# Dealing a card to Bob
bob_card = select_card(bob_encrypted_deck)        # Alice selects for Bob
bob_card = decrypt(bob_card, alice_key)           # Alice removes her layer
bob_card = decrypt(bob_card, bob_key)             # Bob removes his layer
print(f"Bob receives card: {bob_card}")

# Fairness verification (via ZK-circuits, explained later)
verify_shuffle(alice_encrypted_deck, bob_encrypted_deck)
```

:::note
The pseudocode is simplified. Real implementations use cryptographic libraries and ZK-proofs, which will be explored later.
:::

## Modern Advances: ZK-Circuits and Smart Contracts

The original SRA protocol provides a foundational concept for mental poker, but modern implementations significantly expand on these ideas by using advanced cryptographic methods such as ZKP, elliptic curve cryptography, and blockchain-based smart contracts. **While the original RSA-based approach proved the concept, it was computationally expensive and lacked efficient methods for verifiable shuffles without revealing card order.** Advances in elliptic curve cryptography and zero-knowledge proofs solve these limitations.

### ZKP’s Role

In mental poker, Zero-Knowledge Proofs enable players to demonstrate the correctness and fairness of actions — such as shuffling and dealing cards — without revealing sensitive information like card identities or their order. For example, a **Zero-Knowledge Shuffle Proof** mathematically guarantees the fairness of shuffling without exposing the shuffled order.

### Why zk-SNARKs?

Mental poker demands cryptographic guarantees balanced with practical efficiency, making zk-SNARKs (Succinct Non-Interactive Arguments of Knowledge) particularly suitable due to:

- **Compact Proofs**: zk-SNARK proofs are small, reducing on-chain verification costs.
- **Rapid Verification**: Proofs verify quickly (milliseconds), essential for responsive gameplay.
- **Off-chain Proof Generation**: Players perform complex proof generation off-chain, minimizing blockchain computational overhead.
- **Privacy with Integrity**: zk-SNARKs provide robust privacy without sacrificing cryptographic soundness, crucial in competitive games.

:::note
Typical zk-SNARK proofs (such as Groth16) are extremely compact—approximately **200 bytes** per proof. Even more recent zk-SNARK systems like PLONK typically produce proofs rarely exceeding **400–600 bytes**. For comparison, other zero-knowledge systems such as **Bulletproofs** (used in Monero) usually generate proofs of **1–2 KB** or larger.  

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
  - Optimized for advanced zk-SNARK proving systems (Groth16, PLONK), providing faster arithmetic and smaller proofs.
  - Ideal for high-frequency actions (multiple rounds of shuffling, dealing, frequent proof verification).
  - Reduced gas costs due to smaller proofs and faster verification, making it optimal for scalable and interactive gameplay.

### Key Performance Factors

Practical online poker requires cryptographic efficiency and minimal latency. For zk-SNARK-based mental poker implementations, the most crucial performance metrics are:

- **Off-chain Proof Generation Speed**: Proofs for shuffling and dealing must be rapidly computed by players, typically within seconds or milliseconds, to sustain seamless gameplay.
- **On-chain Verification Latency and Cost**: zk-SNARK’s small proof size ensures minimal verification latency and lower gas fees, crucial for frequent blockchain interactions.
- **Minimal Proof Size**: Smaller proofs reduce on-chain data storage requirements and network overhead, directly contributing to lower transaction fees and faster processing.

In sum, zk-SNARK proofs utilizing elliptic curve cryptography deliver the ideal combination of privacy, fairness, and performance, establishing them as the optimal solution for decentralized mental poker.

## Mental Poker in the Vara Context

Vara is a WASM-based blockchain platform that applies the actor model at its core. The combination of actor-based logic, message-driven design, and a secure WASM runtime enables modular, scalable games — each poker table, lobby, or supporting service is an independent actor. Global state or blocking limitations are avoided entirely: each actor maintains its own state, and all cross-component coordination is handled through explicit message passing and events. This allows thousands of games to run in parallel with no data conflicts, and naturally simplifies integration with front-ends and analytics.

**Elliptic Curve Cryptography:**  
All cryptographic operations — commitments, encryption, public keys (ElGamal keys for poker), and all arithmetic on encrypted cards — are performed over the Bandersnatch curve (on BLS12-381). This curve is natively supported by the underlying cryptographic libraries (`ark-ed-on-bls12-381-bandersnatch`) and by Vara’s built-in primitives for pairing-based cryptography, including efficient serialization and deserialization.

**Pairing-Friendly Architecture:**  
All verification logic relies on pairing-friendly cryptography using [BLS12-381](/docs/build/builtinactors/bia-bls.md) and Bandersnatch, providing compatibility with modern proof systems such as Groth16 and PLONK.

**Built-in Contracts for Verification:**  
On-chain zk-SNARK proof verification (Groth16/PLONK) is always performed by a dedicated zk-verification contract, never inside the game contract itself. Vara exposes **[built-in actors](/docs/build/builtinactors/)** that provide highly optimized cryptographic operations — multi-scalar multiplication, pairing checks, and related primitives. This approach accelerates verification, minimizes gas usage, and isolates security-sensitive code.

**Zero-Knowledge Proofs:**  
ZK proofs are generated off-chain by players (typically on client device). Only the compact proof and required public inputs are sent on-chain, avoiding network congestion and keeping user experience responsive.

**Gas Reservation:**  
Gas reservation is explicitly used in all important phases (lobby creation, game start, zk verification, and so on), guaranteeing that no key operation is left incomplete or interrupted. The WASM runtime enforces atomic execution of each transition.

## Implementation Details

The mental poker DApp consists of two main components:

- **On-chain smart contracts** — handle game state, commitments, shuffles, and phase transitions.  
- **Client-side application** — performs all sensitive cryptographic operations off-chain.

**Source code:** [zk-mental-poker repository](https://github.com/gear-foundation/zk-mental-poker/tree/master)  
**UI:** [zk-poker frontend](https://github.com/gear-foundation/dapps/tree/vt-zk-poker/frontend/apps/zk-poker)

### Programs Overview

- **Mental Poker Contract** — Core game state, commitments, shuffling, phase transitions.  
- **Poker Factory** — Creates new game instances and manages lobbies.  
- **ZK Verification Contract** — On-chain verification of zk-SNARK proofs (shuffle/deal).  
- **PTS (Points/Token Service)** — Optional player balances/rewards tracking.

### Client-Side Responsibilities

In addition to handling the standard poker game logic (moves, turns, etc.), the client is responsible for all sensitive cryptographic operations:

- **ElGamal Key Generation:**  
  Each player generates their own ElGamal keypair locally (in the browser). These keys are used for encrypting cards and sharing public keys between players.

- **Card Encryption/Decryption:**  
  All card encryption and decryption — including every intermediate encryption layer during shuffling — is performed locally on the client. This ensures that card privacy always remains under player control.

- **ZK-Proof Generation:**  
  All zk-SNARK proofs (for shuffling, dealing, etc.) are generated by the player on their device, using WASM cryptographic libraries.

- **On-Chain Data Submission:**  
  Only public data is sent to the blockchain: encrypted cards, public keys, zk-proofs, and required public inputs for proof verification.

### Client-Side Responsibilities (in game order)

1. **Elliptic Curve ElGamal Key Generation**  
   Each player generates their EC-ElGamal keypair locally.  
   - **Private key**: 256-bit scalar, stored locally and never shared.  
   - **Public key**: three 32-byte coordinates (`x`, `y`, `z`), serialized in **little-endian** for on-chain submission.

2. **Public Key Exchange**  
   Players exchange public keys. The backend collects all keys and computes an **aggregate public key** used to encrypt the initial deck.

3. **Card Encryption and Shuffling**  
   - Each card is represented as a unique elliptic curve point.  
   - The deck is encrypted with the aggregate public key.  
   - The encrypted deck is shuffled.  
   - A zk-SNARK **shuffle proof** is generated to prove correctness without revealing the permutation.

4. **zk-SNARK Proof Generation**  
   All zk-SNARK proofs (e.g., shuffle proofs, decryption proofs) are generated off-chain using WASM-based cryptography (e.g., Groth16/PLONK).

5. **Partial Decryption (repeated)**  
   - In multiple rounds, each player removes their encryption layer from **other players’** cards and produces a **zk decryption proof** for each step.  
   - **Performed twice:**  
     - At the beginning of the round for **player cards**.  
     - After each community stage (**flop**, **turn**, **river**) for **table cards**.

6. **Final Decryption**  
   When only the card owner’s layer remains, they decrypt their own cards locally. Decrypted values are **never** sent on-chain; only proofs and public inputs are submitted.

## Detailed Workflow and Code Examples

The following sequence describes how the zk-mental-poker DApp interacts with the backend and contracts, including real data formats and serialization logic.

### Data Flow (high-level)

![img alt](../img/layer-diagram.png)

### 1. ZK Key Generation

Before joining a game, a zk-proof key pair is generated locally:

```typescript
let { sk, pk } = keyGen(numBits);

// Public key format:
{ X: bigint; Y: bigint; Z: bigint }
```

The private key (`sk`) must be stored locally (`localStorage` or `sessionStorage`) and never shared.  
When registering in a game, the **public key** is sent to the smart contract in Little Endian format:

```rust
type PublicKey = struct {
  x: [u8; 32],
  y: [u8; 32],
  z: [u8; 32],
};
```

---

### 2. Player Registration and Aggregate Key

The backend listens to registration events and collects all public keys.  
Once all are gathered, it computes the **aggregate public key** to encrypt the deck.

If the contract status is `WaitingShuffleVerification`, the client requests a shuffle task:

```http
GET /get-task?lobby=0xLobbyAddress&player=0xPlayerAddress
```

**Example Response:**
```json
{
  "aggPubkey": { "X": "...", "Y": "...", "Z": "..." },
  "deck": [[ "...", "...", "..." ], ...]
}
```

### 3. Deck Encryption and Shuffle Proof

The client:

1. Encrypts the deck using the aggregate key.
2. Shuffles it.
3. Generates a zk-proof of correct shuffle & encryption.
4. Sends the proof + public signals to the backend.

The backend collects all proofs and submits them to the contract.  
If verification passes, encrypted cards are distributed to players.

### 4. Partial Decryption of Player Cards

Players must participate in partial decryption so that each card is eventually under only one encryption layer.

Example for 3 players:

| Player   | Must decrypt cards of |
|----------|-----------------------|
| Player 1 | Player 2 & Player 3   |
| Player 2 | Player 1 & Player 3   |
| Player 3 | Player 1 & Player 2   |

**This process repeats**:
- For **player cards** at the beginning of each round.  
- For **community cards** after each stage (**flop**, **turn**, **river**).

When the status is `WaitingPartialDecryptionsForPlayersCards`, the client requests tasks:

```http
GET /get-task?lobby=0xLobbyAddress&player=0xPlayerAddress
```

**Example Response:**
```json
[
  { "cardOwner": "0xPlayer2", "cardIndex": 0, "card": "CipherCard" },
  { "cardOwner": "0xPlayer2", "cardIndex": 1, "card": "CipherCard" },
  { "cardOwner": "0xPlayer3", "cardIndex": 0, "card": "CipherCard" },
  { "cardOwner": "0xPlayer3", "cardIndex": 1, "card": "CipherCard" }
]
```

For each card, the player computes:

```typescript
const dec_i = sk_i * c0;
const { proof, publicSignals } = await groth16.fullProve(
  { c0, sk: sk_i, expected: dec_i },
  decryptWasmFile,
  decryptZkeyFile
);
```

### 5. Reading and Decrypting Cards

Once cards are under a single encryption layer, a player reads them from the contract:

```rust
query PlayerCards : (player_id: actor_id) -> opt [EncryptedCard; 2];
```

The client decrypts them locally using their private key, converting coordinates from bytes (Little Endian) to `BigInt`.

---

### 6. Table Card Decryption

When the stage is:

- `WaitingTableCardsAfterPreFlop` → 3 cards  
- `WaitingTableCardsAfterFlop` → 1 card  
- `WaitingTableCardsAfterTurn` → 1 card

Cards are decrypted in the same way as player cards:

```typescript
const c0 = card.c0;
const skC0 = scalarMul(F, a, d, c0, sk);
const dec: ECPoint = {
  X: F.neg(skC0.X),
  Y: skC0.Y,
  Z: skC0.Z
};

const { proof, publicSignals } = await groth16.fullProve(
  {
    c0: [c0.X.toString(), c0.Y.toString(), c0.Z.toString()],
    sk: sk.toString(),
    expected: [dec.X.toString(), dec.Y.toString(), dec.Z.toString()]
  },
  decryptWasmFile,
  decryptZkeyFile
);
```

---

### 7. Proof Serialization for On-Chain Submission

Proofs must be encoded in the correct format before submission:

```typescript
function bigintToBytes48(x: string): Uint8Array {
  const hex = BigInt(x).toString(16).padStart(96, "0");
  return Uint8Array.from(Buffer.from(hex, "hex"));
}

function serializeG1Uncompressed([x, y]: string[]): Uint8Array {
  return new Uint8Array([...bigintToBytes48(x), ...bigintToBytes48(y)]);
}

function serializeG2Uncompressed([[x0, x1], [y0, y1]]: string[][]): Uint8Array {
  return new Uint8Array([
    ...bigintToBytes48(x1),
    ...bigintToBytes48(x0),
    ...bigintToBytes48(y1),
    ...bigintToBytes48(y0)
  ]);
}

function encodeProof(proof: { pi_a: string[], pi_b: string[][], pi_c: string[] }) {
  return {
    a: serializeG1Uncompressed(proof.pi_a),
    b: serializeG2Uncompressed(proof.pi_b),
    c: serializeG1Uncompressed(proof.pi_c)
  };
}
```

- **Frontend zk Logic:** [zk-poker/src/features/zk](https://github.com/gear-foundation/dapps/tree/vt-zk-poker/frontend/apps/zk-poker/src/features/zk)

You can play decentralized mental poker on Vara here: [zk-mental-poker DApp](https://zk-mental-poker.gear-tech.io)

## Conclusion

Mental poker combines decades-old cryptographic theory with cutting-edge blockchain and ZK technology to achieve trustless, fair, and efficient online gameplay. By leveraging elliptic curve cryptography, zk-SNARKs, and Vara’s actor-model WASM runtime (with Built-in Actors for heavy crypto), the system ensures **scalability**, **privacy**, and **verifiability**.

- **Source code:** [zk-mental-poker repository](https://github.com/gear-foundation/zk-mental-poker/tree/master)  
- **UI:** [zk-poker frontend](https://github.com/gear-foundation/dapps/tree/vt-zk-poker/frontend/apps/zk-poker)  
- **Frontend zk Logic:** [zk-poker/src/features/zk](https://github.com/gear-foundation/dapps/tree/vt-zk-poker/frontend/apps/zk-poker/src/features/zk)  
- **Built-in Actors (BLS):** [BLS12-381 Built-in Actor](https://wiki.vara.network/docs/build/builtinactors/bia-bls)