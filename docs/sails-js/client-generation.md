---
sidebar_position: 3
sidebar_label: Client Generation
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Client Generation

The `sails-js-cli` is a command-line tool designed to generate TypeScript client libraries from Sails IDL files. It automates the creation of fully functional client libraries based on the interfaces defined in the Sails framework, streamlining development and ensuring consistency between client and on-chain programs.

## Installation

To install the `sails-js-cli` package globally, run the following command:

```bash
npm install -g sails-js-cli
```

Alternatively, you can use `npx` to run the command without installing the package:

```bash
npx sails-js-cli command ...args
```

## Generating a TypeScript Client Library Using an IDL File

To generate a TypeScript client library, run the following command:

```bash
sails-js generate path/to/sails.idl -o path/to/out/dir
```

If you want to avoid global installation, use `npx`:

```bash
npx sails-js-cli generate path/to/sails.idl -o path/to/out/dir
```

To generate only the `lib.ts` file without the full project structure, use the `--no-project` flag:

```bash
sails-js generate path/to/sails.idl -o path/to/out/dir --no-project
```

<!-- React hooks generation is available via the `--with-hooks` flag:

```bash
sails-js generate path/to/sails.idl -o path/to/out/dir --with-hooks
``` -->

## Using the Generated Library

### Creating an Instance

First, connect to the chain using `@gear-js/api`:

```javascript
import { GearApi } from '@gear-js/api';

const api = await GearApi.create();
```

For further details, refer to the [Gear-JS](/docs/api) API section. Next, import the `Program` class from the generated file and create an instance:

```javascript
import { Program } from './lib';

const program = new Program(api);

// If the program is already deployed, provide its ID
const programId = '0x...';
const program = new Program(api, programId);
```

The `Program` class includes all the functions defined in the IDL file.

## Methods of the `Program` Class

The `Program` class contains several types of methods:

- Query methods
- Message methods
- Constructor methods
- Event subscription methods

### Query Methods

Query methods are used to query the program's state. These methods accept the required arguments for the function call and return the result. Additionally, they accept optional parameters: `originAddress` (the caller's account address, defaulting to a zero address if not provided), `value` (an optional amount of tokens for function execution), and `atBlock` (to query the program state at a specific block).

```javascript
const alice = '0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d';
const result = await program.serviceName.queryFnName(arg1, arg2, alice);
console.log(result);
```

### Message Methods

Message methods are used to send messages to the program. These methods accept the required arguments for sending the message and return a [Transaction Builder](transaction-builder.md), which contains methods for building and sending the transaction.

```javascript
const transaction = program.serviceName.functionName(arg1, arg2);

// ## Set the account sending the message

// Using a KeyringPair instance
import { Keyring } from '@polkadot/api';
const keyring = new Keyring({ type: 'sr25519' });
const pair = keyring.addFromUri('//Alice');
transaction.withAccount(pair);

// Or using an address and signer options (common in frontend applications with connected wallets)
import { web3FromSource, web3Accounts } from '@polkadot/extension-dapp';
const allAccounts = await web3Accounts();
const account = allAccounts[0];
const injector = await web3FromSource(account.meta.source);
transaction.withAccount(account.address, { signer: injector.signer });

// ## Set the value of the message
transaction.withValue(BigInt(10 * 1e12)); // 10 VARA

// ## Calculate gas
// Optionally, you can provide two arguments:
// The first argument, `allowOtherPanics`, either allows or forbids panics in other programs (default: false).
// The second argument, `increaseGas`, is the percentage to increase the gas limit (default: 0).
await transaction.calculateGas();

// Alternatively, use `withGas` to set the gas limit manually:
transaction.withGas(100000n);

// ## Send the transaction
// `signAndSend` returns the message ID, block hash, and a `response` function for retrieving the program's response.
const { msgId, blockHash, response } = await transaction.signAndSend();
const result = await response();
console.log(result);
```

### Constructor Methods

Constructor methods, postfixed with `CtorFromCode` and `CtorFromCodeId` in the `Program` class, are used to deploy the program on the chain. These methods accept either the Wasm code bytes or the code ID and return a [Transaction Builder](transaction-builder.md) just like message methods.

```javascript
const code = fs.readFileSync('path/to/program.wasm');
// Or use the fetch function to retrieve the code in frontend environments
const transaction = program.newCtorFromCode(code);

// The same methods as message methods can be used to build and send the transaction.
```

### Event Subscription Methods

Event subscription methods allow subscribing to specific events emitted by the program.

```javascript
program.subscribeToSomeEvent((data) => {
  console.log(data);
});
```

<!-- ## React Hooks

Generating the library with the `--with-hooks` flag creates custom React hooks that simplify interaction with a `sails-js` program. These hooks are wrappers around the generic hooks provided by the `@gear-js/react-hooks` library. They are generated based on the `Program` class in `lib.ts`, tailored to the specific types and names derived from it.

Refer to the `@gear-js/react-hooks` [README](https://github.com/gear-tech/gear-js/tree/main/utils/gear-hooks#sails) on GitHub for more details on these hooks.

### `useProgram`

Initializes the program with the provided parameters.

```jsx
import { useProgram } from './hooks';

const { data: program } = useProgram({ id: '0x...' });
```

### `useSend` for `serviceName` and `functionName` Transaction

Sends a transaction to a specified service and function.

```jsx
import { useProgram, useSendAdminMintTransaction } from './hooks';

const { data: program } = useProgram({ id: '0x...' });
const { sendTransaction } = useSendAdminMintTransaction({ program });
```

### `usePrepare` for `serviceName` and `functionName` Transaction

Prepares a transaction for a specified service and function.

```jsx
import { useProgram, usePrepareAdminMintTransaction } from './hooks';

const { data: program } = useProgram({ id: '0x...' });
const { prepareTransaction } = usePrepareAdminMintTransaction({ program });
```

### `use` for `serviceName` and `functionName` Query

Queries a specified service and function.

```jsx
import { useProgram, useErc20BalanceOfQuery } from './hooks';

const { data: program } = useProgram({ id: '0x...' });
const { data } = useErc20BalanceOfQuery({ program, args: ['0x...'] });
```

### `use` for `serviceName` and `functionName` Event

Subscribes to events from a specified service and event.

```jsx
import { useProgram, useAdminMintedEvent } from './hooks';

const { data: program } = useProgram({ id: '0x...' });
const { data } = useAdminMintedEvent({ program, onData: (value) => console.log(value) });
``` -->

## Example: The Demo Project

The following example demonstrates how the generated `lib.ts` can be used in conjunction with `@gear-js/api` to upload a WASM binary of an application to the chain, create and submit a service command to the deployed application, and receive its response. This example is part of the Sails GitHub repository and can be viewed [here](https://github.com/gear-tech/sails/tree/master/js/example). Although the project includes multiple services, this example focuses on interacting with the `pingPong` service. The relevant portion of the IDL looks like this:

```rust
service PingPong {
  Ping : (input: str) -> result (str, str);
};
```

The script first initializes the `GearApi` and creates a keyring to retrieve Alice’s account using the `@polkadot/api` library, which is used for signing transactions. It then reads the compiled WASM application and deploys it to the network using `newCtorFromCode` from the generated `lib.ts`, which creates a `TransactionBuilder` for constructing the deployment transaction. After deployment, the script interacts with the program by invoking the `ping` function from the `pingPong` service, constructing and sending a new transaction. Finally, the program's reply is awaited and logged to the console.

```jsx
import { GearApi } from '@gear-js/api';
import { Keyring } from '@polkadot/api';
import { Program } from './lib.js';
import { readFileSync } from 'fs';

const main = async () => {
  const api = await GearApi.create();
  const keyring = new Keyring({ type: 'sr25519', ss58Format: 137 });

  const alice = keyring.addFromUri('//Alice');

  const program = new Program(api);

  // Deploy the program

  const code = readFileSync('../../target/wasm32-unknown-unknown/release/demo.opt.wasm');

  const ctorBuilder = await program.newCtorFromCode(code, null, null).withAccount(alice).calculateGas();
  const { blockHash, msgId, txHash } = await ctorBuilder.signAndSend();

  console.log(
    `\nProgram deployed. \n\tprogram id ${program.programId}, \n\tblock hash: ${blockHash}, \n\ttx hash: ${txHash}, \n\tinit message id: ${msgId}`,
  );

  // Call the program

  const pingBuilder = await program.pingPong.ping('ping').withAccount(alice).calculateGas();
  const { blockHash: blockHashPing, msgId: msgIdPing, txHash: txHashPing, response } = await pingBuilder.signAndSend();

  console.log(
    `\nPing message sent. \n\tBlock hash: ${blockHashPing}, \n\ttx hash: ${txHashPing}, \n\tmessage id: ${msgIdPing}`,
  );
  const reply = await response();
  console.log(`\nProgram replied: \n\t${JSON.stringify(reply)}`);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
```