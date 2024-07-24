---
sidebar_label: Decentralized DNS
sidebar_position: 4
---

# Decentralized DNS

Decentralized Internet (DNS) demonstrates an on-chain server-less approach to websites and web applications hosting. Unlike server-based DNS built on centralized components and services, decentralized solutions running on the blockchain are characterized by boosted data security, enhanced data reconciliation, minimized system weak points, optimized resource allocation, and demonstrated great fault tolerance. It brings all the benefits of decentralization, such as censorship resistance, security resilience, and high transparency.

Briefly, the solution consists of a DNS program that is uploaded on-chain. It lists programs (smart contracts) that are also uploaded on-chain and registered in the DNS program as DNS records. Hosted programs may have the user interface that resides on IPFS. The DNS program stores program IDs and meta info of their interfaces (name and program identifier).

The source code of the program is available on [GitHub](https://github.com/gear-foundation/dns).

## DNS Smart Contract Interface Overview

The DNS smart contract facilitates efficient management of DNS programs and their administrators, providing essential functions for adding, modifying, and querying program information, as well as handling related events.

A DNS contract has the following interface:

```rust
type ContractInfo = struct {
    admins: vec actor_id,    // List of administrator IDs for the program
    program_id: actor_id,    // Unique identifier for the program
    registration_time: str,  // Timestamp when the program was registered
};

service Dns {
    // Adds a new admin to the specified program
    AddAdminToProgram : (name: str, new_admin: actor_id) -> null;
    // Registers a new program with the given name and ID
    AddNewProgram : (name: str, program_id: actor_id) -> null;
    // Changes the program ID for the specified program    
    ChangeProgramId : (name: str, new_program_id: actor_id) -> null;
    // Deletes the smart contract instance
    DeleteMe : () -> null;
    // Deletes the specified program
    DeleteProgram : (name: str) -> null;
    // Removes an admin from the specified program
    RemoveAdminFromProgram : (name: str, admin_to_remove: actor_id) -> null;
    
    // Retrieves all registered programs and their info
    query AllContracts : () -> vec struct { str, ContractInfo };
    // Retrieves all actor IDs
    query GetAllAddresses : () -> vec actor_id;
    // Retrieves all program names                   
    query GetAllNames : () -> vec str;          
    // Retrieves contract info for the specified program name           
    query GetContractInfoByName : (name: str) -> opt ContractInfo;
    // Retrieves the program name for the specified program ID
    query GetNameByProgramId : (program_id: actor_id) -> opt str;

    events {
        // Emitted when a new program is added
        NewProgramAdded: struct { name: str, contract_info: ContractInfo };
        // Emitted when a program ID is changed
        ProgramIdChanged: struct { name: str, contract_info: ContractInfo };
        // Emitted when a program is deleted
        ProgramDeleted: struct { name: str };          
        // Emitted when an admin is added to a program                     
        AdminAdded: struct { name: str, contract_info: ContractInfo };
        // Emitted when an admin is removed from a program
        AdminRemoved: struct { name: str, contract_info: ContractInfo };
    }
};
```


## Connect a dApp to the Decentralized DNS

Options for interacting with the DNS contract:

1. Direct interaction with the DNS contract
2. Deploying a custom indexer that will process the events of the DNS contract

Let's consider the first option in detail:

1. Deploy the program on the [network](https://idea.gear-tech.io) and obtain its ActorId.

2. Use the `AddNewProgram` method of the DNS contract to register the program with its ActorId.

3. In your dApp use [sails-js](https://github.com/gear-tech/sails/blob/master/js/README.md) to interact with the DNS program:
    1. Install [sails-js](https://github.com/gear-tech/sails/blob/master/js/README.md#installation)
    2. [Generate](https://github.com/gear-tech/sails/blob/master/js/README.md#generate-library-from-idl) typescript code from the IDL file
    3. [Create program instance](https://github.com/gear-tech/sails/blob/master/js/README.md#create-an-instance) using DNS program ID
    4. Use `GetContractInfoByName` query to get your programs ActorId

## Get DNS records

Using https://idea.gear-tech.io, read the state of the DNS program to get records - all or filtered by name, ID, and pattern.
