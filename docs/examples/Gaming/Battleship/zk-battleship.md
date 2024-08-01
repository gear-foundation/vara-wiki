---
sidebar_label: ZK-Battleship Game
sidebar_position: 2
---

# ZK-Battleship Game

## Introduction

[The previous paper](./battleship.md)  explored the implementation of a Battleship game, where all data, including the positions of players' ships, were openly stored on a blockchain. While this approach demonstrated the potential of decentralized gaming, it had a significant drawback: the ship positions were publicly accessible, undermining the strategic nature of the game.

To address this issue and preserve the confidentiality of players' data, the new version of the game integrates **Zero-Knowledge Proofs (zk-SNARKs)**. With this technology, players' boards are stored locally, and no information about ship positions is transmitted to the network, ensuring both fairness and security in gameplay.

### What Are Zero-Knowledge Proofs?

**Zero-Knowledge Proofs (zk-SNARKs)** are a cryptographic technology that allows one party to prove to another that a certain statement is true without revealing any additional information.

In simple terms, zk-proofs enable a player to prove that they possess certain information (such as the correct arrangement of ships on their board) and are performing the required actions (like responding to an opponent’s move) without disclosing the information itself. This ensures the privacy and security of the game while maintaining its functionality and fairness.


## Implementation details

### Problem Statement

The game of Battleship inherently relies on the mutual trust between players to accurately place their ships on the board and honestly record hits on their ships. The necessary guarantees for a fair game are as follows:

1. **Valid Board Configuration**: Each player's board must be valid, meaning the ships are correctly placed according to the game's rules.
2. **Board Integrity**: The board configuration of each player must remain unchanged throughout the entire game.
3. **Opponent's Board Privacy**: A player must not be able to see their opponent's board at any point in the game.
4. **Honest Reporting**: A player should not be able to lie about whether an opponent's guess was a hit or a miss.

These guarantees ensure a fair and strategic gameplay experience while maintaining the confidentiality of each player’s board. 

### Circom and Zero-Knowledge Proofs

To implement these guarantees, let 's turn to [Circom](https://iden3.github.io/circom/), a domain-specific language for creating Zero-Knowledge circuits. Circom allows us to generate zk-SNARKs, enabling us to create proofs that verify the above conditions without revealing any information about the board's configuration or the game state.

Using Circom, it is possible to create a system in which:
- Each player's board is verified to be valid at the start of the game.
- The integrity of the board is maintained, ensuring no alterations are made during gameplay.
- Players can prove the result of each opponent’s guess without revealing the underlying board configuration.
- These proofs can be verified by the opponent or a neutral party without compromising the privacy of the game.

The next section will discuss, the implementation of the necessary schemes in the Circom language to create the required zk-proofs to ensure a fair and secure Battleship game.

### Battleship Placement Proof in Circom

The provided Circom code implements a Zero-Knowledge proof to validate the placement of ships in a Battleship game. The goal is to ensure that the ships are correctly placed according to the game rules, without revealing the actual positions of the ships.

#### Inputs

```circom
template BattleshipPlacement(N1, N2, N3, N4) {
    signal input ship_1[N1];
    signal input ship_2[N2];
    signal input ship_3[N3];
    signal input ship_4[N4];
    signal input hash;
```

- **Ship Coordinates**: `ship_1`, `ship_2`, `ship_3`, and `ship_4` represent the coordinates of the ships on the board.
- **Hash**: is a cryptographic hash of all the ship coordinates combined.

Example input: 

```json
{
    "ship_1": ["4"],
    "ship_2": ["15", "20"],
    "ship_3": ["5", "6"],
    "ship_4": ["13", "18", "23"],
    "hash": "52217276415269335215074497398359620454856162108003890482549690012292772807126"
}
```

#### Key Components and Logic

1. **Uniqueness of Coordinates:**
   The code uses the `IsUniqueArray` template to ensure that each ship’s coordinates are unique, preventing overlapping or duplicate placements.

   ```circom
   template IsUniqueArray(N) {
       signal input arr[N];

       for (var i = 0; i < N; i++) {
           for (var j = i + 1; j < N; j++) {
               assert(arr[i] != arr[j]);
           }
       }
   }
   ```

2. **Edge Constraints:**
   The `NotRightEdge`, `NotLeftEdge`, and `NotHalfEdge` templates ensure that ships do not incorrectly wrap around the edges of the board, which would violate the game's rules.

   ```circom
   template NotRightEdge() {
       signal input coord;
       signal output out;

       component is_equal_4 = IsEqual();
       is_equal_4.in[0] <== coord;
       is_equal_4.in[1] <== 4;

       // Additional edge checks...

       out <== (1 - is_equal_4.out - ...);
   }
   ```

3. **Distance Check Between Ships:**
   The `CheckDistance` template is used to ensure that ships are not placed too close to each other. This is done by checking the surrounding cells of each coordinate to ensure no other ship occupies these cells.

   ```circom
   template CheckDistance(N) {
       signal input coord;
       signal input arr[N];
       signal cells[9];

       component not_left_edge = NotLeftEdge();
       not_left_edge.coord <== coord;

       // Additional distance checks...

       for (var i = 0; i < 8; i++) {
           for (var j = 0; j < N; j++) {
               assert(cells[i] != arr[j]);
           }
       }
   }
   ```

4. **Ship Integrity:**
   The `IntegrityEdgeSize2`, `IntegrityEdgeSize3`, and `Integrity` templates ensure that each ship is placed in a continuous line either horizontally or vertically and does not "break up" due to edge constraints.

   ```circom
   template IntegrityEdgeSize2() {
       signal input arr[2];

       component not_edge = NotRightEdge();
       not_edge.coord <== arr[0];

       var horizontal = (arr[1] == arr[0] + 1) * not_edge.out;
       var vertical = (arr[1] == arr[0] + 5);
       assert((horizontal+vertical) == 1);
   }
   ```

5. **Poseidon Hash for Commitment:**
   The use of the `Poseidon` hash function allows the players to commit to their board configuration in a way that can later be verified without revealing the actual configuration.

   ```circom
   component poseidon = Poseidon(N1 + N2 + N3 + N4);
   for (var i = 0; i < N1 + N2 + N3 + N4; i++) {
       poseidon.inputs[i] <== combinedShips[i];
   }
   hash === poseidon.out;
   ```

6. **Main Circuit:**
   The `BattleshipPlacement` template brings all these components together, taking in the coordinates of the ships and producing a hash as the public output. It checks for valid ship placement, non-overlapping ships, and compliance with the game rules.

   ```circom
   component main {public [hash]} = BattleshipPlacement(1, 2, 2, 3);
   ```

This code provides a comprehensive circuit for verifying Battleship game board setups using zk-SNARKs. It ensures that ship placements are valid, the board configuration is committed to with a Poseidon hash, and that the integrity and distance rules of the game are upheld. This approach allows third parties or opponents to verify the board without revealing the actual positions of the ships, preserving the secrecy and fairness of the game.  
The full code discussed above can be found on [GitHub](https://github.com/gear-foundation/dapps/tree/master/contracts/zk-battleship/circom/placement.circom).

### Battleship Hit Proof in Circom

The `BattleshipHit` circuit is designed to verify if a shot fired in a game of Battleship hits a ship, misses entirely, or sinks the ship. It accepts the coordinates of multiple ships, previous hit coordinates, and a new shot coordinate, and outputs a result indicating whether the shot was a miss, a hit, or a sinking blow.

#### Inputs and Outputs

```circom
template BattleshipHit(N1, N2, N3, N4, MAX_HITS) {
    signal input ship_1[N1];
    signal input ship_2[N2];
    signal input ship_3[N3];
    signal input ship_4[N4];
    signal input hits[MAX_HITS];  // Previous hits
    signal input hit;             // Current shot coordinate
    signal input hash;            // Hash on each element of coordinates
    signal output is_hit;         // 0 = miss, 1 = hit, 2 = sunk
```

- **Ship Coordinates**: `ship_1`, `ship_2`, `ship_3`, and `ship_4` represent the coordinates of the ships on the board.
- **Hit Coordinates**: `hits` stores the coordinates of previous shots, and `hit` is the current shot coordinate.
- **Hash**: is a cryptographic hash of all the ship coordinates combined.
- **Output (`is_hit`)**: The circuit outputs `0` for a miss, `1` for a hit, and `2` for a sunk ship.

Example input: 

```json
{
    "ship_1": ["4"],
    "ship_2": ["15", "20"],
    "ship_3": ["5", "6"],
    "ship_4": ["13", "18", "23"],
    "hits": ["18", "23", "15", "5", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1"],
    "hit": "6",
    "hash": "52217276415269335215074497398359620454856162108003890482549690012292772807126"
}

```

#### Key Components and Logic

1. **Hash Verification**

The combined ship coordinates are hashed using the Poseidon hash function, and the result is compared with the provided hash to verify the validity of the ship positions.

```circom
    component poseidon = Poseidon(N1 + N2 + N3 + N4);
    for (var i = 0; i < N1 + N2 + N3 + N4; i++) {
        poseidon.inputs[i] <== combinedShips[i];
    }
    hash === poseidon.out;
```

2. **Hit Detection**

For each ship, the circuit checks whether the current shot matches any of the ship's coordinates and counts the number of hits. It also tracks previous hits on each ship.

```circom
    // Check hits on ship 1
    var hits_on_ship1 = 0;
    component is_equal_ship1[N1];
    for (var j = 0; j < N1; j++) {
        is_equal_ship1[j] = IsEqual();
        is_equal_ship1[j].in[0] <== hit;
        is_equal_ship1[j].in[1] <== ship_1[j];
        hits_on_ship1 += is_equal_ship1[j].out;
    }
    signal hit_ship1 <== hits_on_ship1;
    // ... (similarly for ship_2, ship_3, and ship_4)
```

3. **Sinking Verification**

The circuit calculates the total hits on each ship by summing previous hits with the current hit and then checks if this total equals the ship's length, indicating the ship is sunk.

```circom
    component ge_total_hits1 = GreaterEqThan(N1);
    ge_total_hits1.in[0] <== total_hits_on_ship1;
    ge_total_hits1.in[1] <== N1;
    signal sunk_ship1 <== ge_total_hits1.out;
    // ... (similarly for ship_2, ship_3, and ship_4)
```

4. **Determining the Final Result**

The circuit uses a series of `Mux1` components to determine the final output (`is_hit`). It checks whether each ship was hit or sunk and sets the output accordingly.

```circom
    component mux_main4 = Mux1();
    mux_main4.c[0] <== mux_main3.out;
    mux_main4.c[1] <== mux_hit4.out;
    mux_main4.s <== hit_ship4;
    is_hit <== mux_main4.out;
```

This circuit verifies if a shot in Battleship hits a ship and whether that ship is sunk. It uses a series of equality checks and logic gates to aggregate hits, compare them against ship coordinates, and output the correct result.  
The full code discussed above can be found on [GitHub](https://github.com/gear-foundation/dapps/tree/master/contracts/zk-battleship/circom/hit.circom).


### Proof Generation and Verification Key Details

In zk-SNARKs the proof generation and verification process is essential for maintaining privacy and integrity in decentralized systems.

#### **Proof Generation**
The process of generating a zk-SNARK proof involves compiling a circuit, calculating a witness, and then using a proving key to create the proof. For a detailed explanation of witness generation, you can refer to the steps [here](https://docs.circom.io/getting-started/computing-the-witness/#what-is-a-witness), and for the proof generation process, see this [link](https://docs.circom.io/getting-started/proving-circuits/).

#### **Verification Key Generation**
A verification key is generated during the setup phase, which corresponds to the specific circuit and proving key. This verification key is then provided to the smart contract during its initialization, enabling the contract to verify zk-SNARK proofs submitted by users.

#### **Verification Process in Smart Contracts**
When proving circuits with ZK, two key outputs are generated: proof and public.

- Proof: This is the zk-SNARK proof, a cryptographic proof that verifies the correctness of the computation.

- Public: This contains the public inputs or outputs of the circuit. These are open data that the smart contract uses for verification. For instance, this could include information about a hit or miss in a game, or a hash representing the ship placement. The contract uses this data to validate the proof and ensure consistency, such as checking that the ship placement hash remains unchanged throughout the game.

These outputs are then passed to the smart contract, which securely verifies the computations without revealing private data, ensuring transparent and fair interactions.


