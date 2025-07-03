---
sidebar_position: 5
sidebar_label: React Wallet Connect
---

# Gear-JS Wallet Connect

# Description

A React library to connect supported Substrate-based wallets in a standardized and consistent way across decentralized applications.

# Installation

### npm

```sh
npm install @gear-js/wallet-connect @gear-js/react-hooks @gear-js/ui @gear-js/vara-ui
```

### yarn

```sh
yarn add @gear-js/wallet-connect @gear-js/react-hooks @gear-js/ui @gear-js/vara-ui
```

### pnpm

```sh
pnpm add @gear-js/wallet-connect @gear-js/react-hooks @gear-js/ui @gear-js/vara-ui
```

# Getting started

## Configure API

Before using `@gear-js/wallet-connect`, make sure to configure [`@gear-js/react-hooks`](https://github.com/gear-tech/gear-js/tree/main/utils/gear-hooks#readme) in your project according to its documentation. This setup is required for API connection and account management.

## Configure UI

Depending on your chosen theme, you must also install and configure the corresponding UI library styles:

- For the **`vara`** theme (default), follow the [`@gear-js/vara-ui`](https://github.com/gear-tech/gear-js/tree/main/utils/vara-ui#readme) documentation to set up global styles.
- For the **`gear`** theme, follow the [`@gear-js/ui`](https://github.com/gear-tech/gear-js/tree/main/utils/gear-ui#readme) documentation to set up global styles (typically via your `index.scss`).

# Components

## Wallet

A React component that displays the current account or wallet connection button, and (optionally) the account’s total balance. It uses [`useAccount`](https://github.com/gear-tech/gear-js/tree/main/utils/gear-hooks#useaccount) from `@gear-js/react-hooks` to manage account state and modal visibility for wallet actions.

> **Note:**  
> This is a generic component that provides ready-to-use behavior for wallet management, including connection, account display, and modal handling. For most use cases, you can simply use this component to integrate wallet functionality into your app.

### Props

- `theme` (`'gear' | 'vara'`, optional): UI theme for the wallet controls. Defaults to `'vara'`.
- `displayBalance` (`boolean`, optional): Whether to show the account’s total balance. Defaults to `true`.

### Usage Example

```jsx
import { Wallet } from '@gear-js/wallet-connect';

import Logo from './logo.svg?react';

function Header() {
  return (
    <header>
      <Logo />
      <Wallet />
    </header>
  );
}

export { Header };
```

## WalletModal

A React modal component for managing wallet connections and account selection. It provides a user interface for connecting to supported wallets, switching between accounts, copying addresses, and logging out. This component is used internally by the [Wallet](#wallet) component.

> **Note:**  
> Use this component if you need to open the wallet modal programmatically, or if you want to create a custom wallet or account button that triggers wallet or account management actions. It gives you more control over when and how the modal appears, compared to the generic `Wallet` component.

### Props

- `theme` (`'gear' | 'vara'`, optional): UI theme for the modal. Defaults to `'vara'`.
- `close` (`() => void`): Function to close the modal.

### Usage Example

```jsx
import { WalletModal } from '@gear-js/wallet-connect';

function CustomWalletButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <button onClick={openModal}>Open Wallet Modal</button>

      {isModalOpen && <WalletModal theme="vara" close={closeModal} />}
    </>
  );
}
```
