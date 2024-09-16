---
sidebar_position: 4
sidebar_label: Gasless and Signless Transactions
---

# Gasless and Signless Transactions

The **EZ-Transactions package** (aka Easy-transactions) simplifies blockchain interactions by enabling gasless and signless transactions. Anyone can use it to integrate into their dApp projects.

With gasless transactions, the dApp developer covers gas fees for their users (web2-like approach), while signless transactions allow automatic signing via temporary sub-accounts. This combination creates a seamless user experience, as they no longer need to pay gas fees or manually sign each transaction. 

Developers can easily integrate these features into their dApps using provided hooks and providers, such as `GaslessTransactionsProvider` and `SignlessTransactionsProvider`. The package also includes UI components for enabling or disabling these features.

For more details, visit the [GitHub page](https://github.com/gear-foundation/dapps/tree/master/frontend/packages/ez-transactions).

## Key Features
### Gasless Transactions

- Users no longer need to worry about paying gas fees. The [backend](https://github.com/gear-foundation/dapps/tree/master/backend/gasless) handles transaction fees, creating a more streamlined experience.
- This is particularly useful for applications targeting non-crypto-savvy users who might find gas fees confusing.

### Signless Transactions

- Signless transactions are automatically signed by a temporary sub-account on the user's behalf.
- This removes the need for users to manually sign every transaction, speeding up processes and making applications more user-friendly.

## Package Composition
The package includes several key elements that developers can leverage to integrate these features into their applications:

### Providers

- `GaslessTransactionsProvider`: Wraps components to enable gasless transaction functionality. This ensures that the backend manages all transaction costs.
- `SignlessTransactionsProvider`: Enables automatic signing of transactions, reducing user friction.

### Hooks

- `useGaslessTransaction`: Allows developers to easily implement gasless functionality in specific parts of their dApp.
- `useSignlessTransaction`: Integrates signless functionality for seamless transaction processing.

### UI Components

The package also provides UI elements that can toggle these features on or off, giving flexibility to both developers and users. These components can be customized to suit the needs of the application.

## Use Cases
- **User-friendly dApps**: Great for developers wanting to improve the user experience, especially for users unfamiliar with blockchain or unwilling to deal with gas fees or manual signing.
- **DeFi Projects**: Reduces friction for frequent transactions, such as trading or lending operations, where user experience is critical.
- **Gaming dApps**: Gamers can focus on playing without worrying about blockchain complexities.

## Conclusion
The **EZ-Transactions package** empowers developers to create smoother and more accessible blockchain applications. By integrating gasless and signless transaction capabilities, developers can remove major pain points for their users and improve overall engagement.

For detailed documentation about how to use, check the [GitHub page](https://github.com/gear-foundation/dapps/tree/master/frontend/packages/ez-transactions).