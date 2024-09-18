---
sidebar_position: 2
sidebar_label: Transaction Builder
---

## Transaction builder

`TransactionBuilder` class is used to build and send the transaction to the chain.

Use `.programId` property to get the id of the program that is used in the transaction.

### Methods to build and send the transaction

- `withAccount` - sets the account that is sending the message
<i>The method accepts either the KeyringPair instance or the address and signerOptions</i>

```javascript
import { Keyring } from '@polkadot/api';
const keyring = new Keyring({ type: 'sr25519' });
const pair = keyring.addFromUri('//Alice');
transaction.withAccount(pair)

// This case is mostly used on the frontend with connected wallet.
import { web3FromSource, web3Accounts } from '@polkadot/extension-dapp';
const allAccounts = await web3Accounts();
const account = allAccounts[0];
const injector = await web3FromSource(account.meta.source);
const signer = web3FromSource();
transaction.withAccount(account.address, { signer: injector.signer });
```

- `withValue` - sets the value of the message
```javascript
transaction.withValue(BigInt(10 * 1e12)); // 10 VARA
```

- `calculateGas` - calculates the gas limit of the transaction
Optionally you can provide 2 arguments.
  - The first argument `allowOtherPanics` either allows or forbids panics in other programs to be triggered. It's set to `false` by default.
  - The second argument `increaseGas` is percentage to increase the gas limit. It's set to `0` by default.

```javascript
await transaction.calculateGas();
```

- `withGas` - sets the gas limit of the transaction manually. Can be used instead of `calculateGas` method.
```javascript
transaction.withGas(100_000_000_000n);
```

- `withVoucher` - sets the voucher id to be used for the transaction
```javascript
const voucherId = '0x...'
transaction.withVoucher(voucherId);
```

- `transactionFee` - get the transaction fee
```javascript
const fee = await transaction.transactionFee();
console.log(fee);
```

- `signAndSend` - sends the transaction to the chain
Returns the id of the sent message, transaction hash, the block hash in which the message is included, `isFinalized` to check if the transaction is finalized and `response` function that can be used to get the response from the program.
The `response` function returns a promise with the response from the program. If an error occurs during message execution the promise will be rejected with the error message.


```javascript
const { msgId, blockHash, txHash, response, isFinalized } = await transaction.signAndSend();

console.log('Message id:', msgId);
console.log('Transaction hash:', txHash);
console.log('Block hash:', blockHash);
console.log('Is finalized:', await isFinalized);

const result = await response();
console.log(result);
```