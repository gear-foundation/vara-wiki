---
sidebar_position: 2
sidebar_label: Transaction Builder
---

# Transaction Builder

The `TransactionBuilder` class is used to build and send transactions to the chain.

Use the `.programId` property to get the ID of the program that is used in the transaction.

### Methods to Build and Send the Transaction

- **`withAccount`** - Sets the account that is sending the message.

  *This method accepts either a `KeyringPair` instance or an address with `signerOptions`.*

  **Example using a `KeyringPair` instance:**

  ```javascript
  import { Keyring } from '@polkadot/api';
  const keyring = new Keyring({ type: 'sr25519' });
  const pair = keyring.addFromUri('//Alice');

  // Set the account using the KeyringPair instance
  transaction.withAccount(pair);
  ```

  **Example using an address and signer options (commonly used on the frontend with a connected wallet):**

  ```javascript
  // This case is mostly used on the frontend with a connected wallet.
  import { web3FromSource, web3Accounts } from '@polkadot/extension-dapp';

  // Retrieve all accounts from the wallet extension
  const allAccounts = await web3Accounts();
  const account = allAccounts[0];

  // Get the injector for the account's source
  const injector = await web3FromSource(account.meta.source);

  // Set the account address and signer in the transaction
  transaction.withAccount(account.address, { signer: injector.signer });
  ```

- **`withValue`** - Sets the value (amount) to be sent with the message.

  **Example:**

  ```javascript
  // Set the value to 10 VARA
  transaction.withValue(BigInt(10 * 1e12));
  ```

- **`calculateGas`** - Calculates the gas limit of the transaction.

  Optionally, you can provide two arguments:

  - The first argument, `allowOtherPanics`, determines whether panics in other programs are allowed to be triggered. It is set to `false` by default.
  - The second argument, `increaseGas`, is the percentage to increase the gas limit. It is set to `0` by default.

  **Example:**

  ```javascript
  // Calculate gas limit with default options
  await transaction.calculateGas();

  // Calculate gas limit allowing other panics and increasing gas limit by 10%
  await transaction.calculateGas(true, 10);
  ```

- **`withGas`** - Manually sets the gas limit of the transaction. This can be used instead of the `calculateGas` method.

  **Example:**

  ```javascript
  // Set the gas limit manually
  transaction.withGas(100_000_000_000n);
  ```

- **`withVoucher`** - Sets the voucher ID to be used for the transaction.

  **Example:**

  ```javascript
  const voucherId = '0x...'; // Replace with actual voucher ID
  transaction.withVoucher(voucherId);
  ```

- **`transactionFee`** - Retrieves the transaction fee.

  **Example:**

  ```javascript
  const fee = await transaction.transactionFee();
  console.log('Transaction fee:', fee.toString());
  ```

- **`signAndSend`** - Sends the transaction to the chain.

  This method returns an object containing:

  - `msgId`: the ID of the sent message.
  - `txHash`: the transaction hash.
  - `blockHash`: the hash of the block in which the message is included.
  - `isFinalized`: a function to check if the transaction is finalized.
  - `response`: a function that can be used to get the response from the program.

  The `response` function returns a promise with the response from the program. If an error occurs during message execution, the promise will be rejected with the error message.

  **Example:**

  ```javascript
  const { msgId, blockHash, txHash, response, isFinalized } = await transaction.signAndSend();

  console.log('Message ID:', msgId);
  console.log('Transaction hash:', txHash);
  console.log('Block hash:', blockHash);

  // Check if the transaction is finalized
  const finalized = await isFinalized;
  console.log('Is finalized:', finalized);

  // Get the response from the program
  try {
    const result = await response();
    console.log('Program response:', result);
  } catch (error) {
    console.error('Error executing message:', error);
  }
  ```