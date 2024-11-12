---
sidebar_label: Multisig Wallet
sidebar_position: 1
---

# Multisig Wallet

## Introduction

Multisignature wallets are cryptocurrency wallets that require multiple private keys to sign and authorize a transaction.

To illustrate, think of a bank vault that demands multiple keys to unlock; this analogy captures how multisignature cryptocurrency wallets operate.

Advocates of multisignature wallets argue that they offer the most secure and fail-proof method for storing cryptocurrency. Even if a thief were to obtain one of the wallet keys, they would still be unable to access the account without the keys associated with the other wallets in the setup.

This article provides an explanation of the programming interface, data structure, basic functions, and their respective purposes. It can be used as-is or customized to fit specific needs. Anyone can create an application and deploy it on the Gear Network. The source code, developed using the [Sails](../../build/sails/sails.mdx) framework, is available on [GitHub](https://github.com/gear-foundation/dapps/tree/master/contracts/multisig-wallet).

## Logic

The wallet belongs to one or more owners. For any significant action to occur, the necessary number of owners must confirm it.

The contract deployer can determine the permitted number of owners who can initiate a transaction from the wallet and specify the minimum required owners for the transaction. For instance, they can opt for a 2-of-3 multisig, where two out of three assigned private keys are necessary. The flexibility extends to configurations like 3-of-5, 5-of-7, and so forth.

To send a transaction through the multisig wallet, one of the owners should send a transaction to the wallet with a `SubmitTransaction` action in the payload, and other owners should approve this transaction by the `ConfirmTransaction` action until the required amount is reached.

The transaction description allows the owner to include helpful information.

> The wallet offers flexibility, enabling users to oversee the list of owners and determine the necessary confirmations. Security is a priority in the contract, restricting actions like adding, removing, or replacing owners and altering confirmation counts to only be executed with the requisite confirmations from other owners.

The transaction approval logic is complex, for example:
1. When the owner submits a transaction requiring only one confirmation for execution, the contract adds it to the storage, obtains confirmation from the submitting owner, and then automatically executes the transaction.
2. For transactions needing two or more confirmations, the contract follows a similar process. Initially, it adds the transaction to the storage and secures confirmation from the submitting owner. To execute the transaction, the wallet still requires one or more confirmations. Subsequently, another owner sends a `ConfirmTransaction` action to the contract. If all is well, the transaction is executed automatically.

> Transactions usually happen automatically when all confirmations are done. However, if a transaction was confirmed `n` times, and the contract needs `n + 1` or more confirmations, and then the owners change it to `n` or less, they can either wait for the next confirmation or just call `ExecuteTransaction` with the transaction ID to execute it.

## Interface

### Program description

The program contains the following information

```rust title="multisig-wallet/app/src/utils.rs"
pub struct MultisigWallet {
    pub transactions: HashMap<TransactionId, Transaction>,
    pub confirmations: HashMap<TransactionId, HashSet<ActorId>>,
    pub owners: HashSet<ActorId>,
    pub required: u32,
    pub transaction_count: U256,
}
```

* `transactions` - a mapping of `TransactionId` to `Transaction` that stores all transactions in the wallet
* `confirmations` - a mapping of `TransactionId` to a set of `ActorIds`, representing confirmations by each owner for specific transactions
* `owners` - a set of `ActorIds` representing the authorized owners of the wallet
* `required` - the number of confirmations required to execute a transaction
* `transaction_count` - a counter tracking the number of transactions

Where `Transaction` is defined as follows:

```rust title="multisig-wallet/app/src/utils.rs"
pub struct Transaction {
    pub destination: ActorId,
    pub payload: Vec<u8>,
    pub value: u128,
    pub description: Option<String>,
    pub executed: bool,
}
```

* `destination` - the account where the transaction funds or actions are directed
* `payload` - data related to the transaction, potentially containing specific instructions or actions
* `value` - the amount of funds or value to transfer
* `description` - an optional description providing context for the transaction
* `executed` - a boolean indicating if the transaction has been executed

### Initialization

During program initialization, the following variables are set: the list of wallet owners and the minimum number of confirmations required to execute a transaction.

```rust title="multisig-wallet/app/src/lib.rs"
fn init(owners: Vec<ActorId>, required: u32) -> Self {
    let owners_count = owners.len();

    validate_requirement(owners_count, required);

    let mut wallet = MultisigWallet::default();

    for owner in &owners {
        if wallet.owners.contains(owner) {
            panic!("The same owner contained twice")
        } else {
            wallet.owners.insert(*owner);
        }
    }

    wallet.required = required;

    unsafe { STORAGE = Some(wallet) };
    Self(())
}
```

### Actions

```rust title="multisig-wallet/app/src/lib.rs"
pub fn add_owner(&mut self, owner: ActorId);
pub fn remove_owner(&mut self, owner: ActorId);
pub fn replace_owner(&mut self, old_owner: ActorId, new_owner: ActorId);
pub fn change_required_confirmations_count(&mut self, count: u32);
pub fn submit_transaction(
    &mut self,
    destination: ActorId,
    data: Vec<u8>,
    value: u128,
    description: Option<String>,
);
pub fn confirm_transaction(&mut self, transaction_id: U256);
pub fn revoke_confirmation(&mut self, transaction_id: U256);
pub fn execute_transaction(&mut self, transaction_id: U256);
```

- `add_owner` is an action to add a new owner. The action has to be used through `submit_transaction`.
- `remove_owner` is an action to remove an owner. The action has to be used through `submit_transaction`.
- `replace_owner` is an action to replace an owner with a new owner. The action has to be used through `submit_transaction`.
- `change_required_confirmations_count` is an action to change the number of required confirmations. The action has to be used through `submit_transaction`.
- `submit_transaction` is an action that allows an owner to submit and automatically confirm a transaction.
- `confirm_transaction` is an action that allows an owner to confirm a transaction. If this is the last confirmation, the transaction is automatically executed.
- `revoke_confirmation` is an action that allows an owner to revoke a confirmation for a transaction.
- `execute_transaction` is an action that allows anyone to execute a confirmed transaction.

### Events

```rust title="multisig-wallet/app/src/lib.rs"
pub enum Event {
    Confirmation {
        sender: ActorId,
        transaction_id: U256,
    },
    Revocation {
        sender: ActorId,
        transaction_id: U256,
    },
    Submission {
        transaction_id: U256,
    },
    Execution {
        transaction_id: U256,
    },
    OwnerAddition {
        owner: ActorId,
    },
    OwnerRemoval {
        owner: ActorId,
    },
    OwnerReplace {
        old_owner: ActorId,
        new_owner: ActorId,
    },
    RequirementChange(U256),
}
```

- `Confirmation` is an event that occurs when the `ConfirmTransaction` action is successfully used.
- `Revocation` is an event that occurs when the `RevokeConfirmation` action is successfully used.
- `Submission` is an event that occurs when the `SubmitTransaction` action is successfully used.
- `Execution` is an event that occurs when the `ExecuteTransaction` action is successfully used.
- `OwnerAddition` is an event that occurs when the wallet uses the `AddOwner` action successfully.
- `OwnerRemoval` is an event that occurs when the wallet uses the `RemoveOwner` action successfully.
- `OwnerReplace` is an event that occurs when the wallet uses the `ReplaceOwner` action successfully.
- `RequirementChange` is an event that occurs when the wallet uses the `ChangeRequiredConfirmationsCount` action successfully.

### Query

```rust title="multisig-wallet/app/src/lib.rs"
pub fn get_state(&self) -> State {
    self.get().clone().into()
}
```
Where `State` is defined as follows:

```rust title="multisig-wallet/app/src/utils.rs"
pub struct State {
    pub transactions: Vec<(TransactionId, Transaction)>,
    pub confirmations: Vec<(TransactionId, Vec<ActorId>)>,
    pub owners: Vec<ActorId>,
    pub required: u32,
    pub transaction_count: U256,
}
```

## Source Code

The source code of this example of a Multisig Wallet program and an implementation of its testing is available on [GitHub](https://github.com/gear-foundation/dapps/tree/master/contracts/multisig-wallet).

See also an example of the program testing implementation based on `gtest`: [multisig-wallet/tests](https://github.com/gear-foundation/dapps/tree/master/contracts/multisig-wallet/tests).

For more details about testing program written on Vara, refer to the [Program Testing](/docs/build/testing) article.
