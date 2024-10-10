---
sidebar_position: 5
sidebar_label: Vara Wallet Connect
---

# Vara Wallet Connect

## Connecting Substrate-Based Wallets in React Applications Using Vara Wallet Connect

**Vara Wallet Connect** is an open-source module designed to easily integrate Substrate-based wallets into React applications. This module is part of the Gear.js library and can be used by any developer who wants to add wallet functionality to their dApp without building from scratch.

**Features**

- **Multiple Wallet Support**: The library supports connecting to various Substrate-based wallets such as Polkadot.js, Talisman, and others.
- **Ease of Use**: It provides a simple interface to connect and interact with wallets using standard Web3 APIs.
- **Flexibility**: The module allows for full customization and integration into different React applications, making it suitable for diverse use cases.

### Installation

To install the Vara Wallet Connect module, simply add it as a dependency to your React project via npm:

```bash
npm install @gear-js/wallet-connect
```

Or via yarn:

```bash
yarn add @gear-js/wallet-connect
```

### Usage

The code example below follows the structure provided in the [GitHub README](https://github.com/gear-tech/gear-js/blob/main/utils/wallet-connect/README.md), which uses React hooks to manage the wallet connection and user account selection:

```javascript
import { useWallet, Wallet } from '@gear-js/wallet-connect';
import { useState } from 'react';

function App() {
  const { accounts, connecting, activeAccount, error, connect, disconnect } = useWallet();
  const [wallet, setWallet] = useState(null);

  const handleConnect = async () => {
    const selectedWallet = await Wallet.connect();
    setWallet(selectedWallet);
    await connect(); // Initiate the connection process
  };

  return (
    <div>
      {connecting ? (
        <p>Connecting...</p>
      ) : activeAccount ? (
        <p>Connected: {activeAccount.address}</p>
      ) : (
        <button onClick={handleConnect}>Connect Wallet</button>
      )}

      {error && <p>{error.message}</p>}

      {accounts.length > 0 && (
        <ul>
          {accounts.map((account) => (
            <li key={account.address}>{account.address}</li>
          ))}
        </ul>
      )}
      {activeAccount && <button onClick={disconnect}>Disconnect</button>}
    </div>
  );
}

export default App;

```

The example provided here closely follows the official GitHub documentation and demonstrates how to handle connecting, disconnecting, and displaying multiple wallet accounts.

**API Overview:**

- `Wallet.connect()`: Initiates the connection process to available Substrate-based wallets.
- `Wallet.disconnect()`: Disconnects the currently connected wallet.
- `Wallet.getAccounts()`: Returns the list of accounts from the connected wallet.
- `Wallet.signTransaction(transaction)`: Signs a transaction using the connected wallet.

### Customization and Advanced Usage

The module allows for full customization of the wallet connection logic. Developers can set up custom wallet connection strategies, handle different wallet types, and manage multiple connections. For advanced integration scenarios, such as working with multiple wallets in a single application, the API provides hooks and methods to manage connections more granularly.

The package is available in light (Vara-styled) and dark (Gear-styled) themes, for more details refer to the [GitHub README](https://github.com/gear-tech/gear-js/blob/main/utils/wallet-connect/README.md).