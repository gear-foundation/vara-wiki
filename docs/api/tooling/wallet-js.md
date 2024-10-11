---
sidebar_position: 5
sidebar_label: Vara Wallet Connect
---

# Vara Wallet Connect

## Connecting Substrate-Based Wallets in React Applications Using Vara Wallet Connect

**Vara Wallet Connect** is an open-source library designed to easily integrate Substrate-based wallets into React applications. This module is part of the Gear.js utilities and can be used by any developer who wants to add wallet functionality to their dApp without building from scratch.

**Features**

- **Multiple Wallet Support**: The library supports connecting to various Substrate-based wallets such as Polkadot.js, Talisman, and others.
- **Ease of Use**: It provides a simple interface to connect and interact with wallets using standard Web3 APIs.
- **Flexibility**: The module allows for full customization and integration into different React applications, making it suitable for diverse use cases.

### Installation

To install the Vara Wallet Connect package, simply add it as a dependency to your React project via npm:

```bash
npm install @gear-js/wallet-connect
```

Or via yarn:

```bash
yarn add @gear-js/wallet-connect
```

### Usage

The code example below follows the structure provided in the [GitHub README](https://github.com/gear-tech/gear-js/blob/main/utils/wallet-connect/README.md), which uses React components to manage the wallet connection and user account selection:

```tsx
import { Wallet } from '@gear-js/wallet-connect';
import Logo from './logo.svg?react';

function Header() {
  return (
    <header>
      <Logo />

      <Wallet
        theme="vara" // 'vara' (default) or 'gear' theme variation
        displayBalance={true} // true (default) or false
      />
    </header>
  );
}

export { Header };
```

### Customization and Advanced Usage

The package is available in light (Vara-styled) and dark (Gear-styled) themes.

#### Vara UI Theme

Be aware that in order for `vara` theme to work as expected, `@gear-js/vara-ui` package should be installed with configured global styles:

```jsx
import { Wallet } from '@gear-js/wallet-connect';
import '@gear-js/vara-ui/dist/style.css';

function VaraWallet() {
  return <Wallet theme="vara" />;
}

export { VaraWallet };
```

#### Gear UI Theme

In order for `gear` theme to work as expected, `@gear-js/ui` package should be installed with configured global `index.scss`:

```scss
@use '@gear-js/ui/resets';
@use '@gear-js/ui/typography';
```

```jsx
import { Wallet } from '@gear-js/wallet-connect';
import './index.scss';

function GearWallet() {
  return <Wallet theme="gear" />;
}

export { GearWallet };
```

#### Wallet Modal

Package exports the raw `WalletModal` component. It can be useful if you want to programmatically call the modal from any place in your application.

```tsx
import { WalletModal } from '@gear-js/wallet-connect';
import { useState } from 'react';

function WalletButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <button type='submit' onClick={openModal}>
        Open Wallet Modal
      </button>

      {/* 'vara' (default) or 'gear' theme variation */}
      {isModalOpen && <WalletModal theme='vara' close={closeModal} />}
    </>
  )
}

export { WalletButton }
```
