---
sidebar_position: 4
sidebar_label: React Hooks
---

# React Hooks

# React Hooks

The [`@gear-js/react-hooks`](/docs/api/tooling/react-hooks.md) library provides React hook abstractions over `sails-js` and its [generated program library](client-generation.md). This significantly simplifies the development of front-end applications built with Sails.

[TanStack Query](https://tanstack.com/query) is used as the async state manager to handle queries and mutations, making it easier to manage asynchronous operations like fetching data (queries) and performing create/update/delete operations (mutations) against the defined program library. Therefore, most hooks' parameters and return values correspond to the library's conventions.

## Hooks

### `useSails`

The `useSails` hook returns a `Sails` instance as described in the [Library Overview](overview.md#the-sails-class) section, based on the provided `programId` and IDL description of the deployed application.

**Example:**

```js
import { useSails } from '@gear-js/react-hooks';

const programId = '0x...';
const idl = '...';

const { data } = useSails({
  programId,
  idl,
});

console.log(data);
```

### `useProgram`

The `useProgram` hook returns a `Program` instance as described in the [Client Generation](client-generation.md#methods-of-the-program-class) section using a generated library (`lib.ts`) and the `id` of a deployed application.

**Example:**

```js
import { useProgram } from '@gear-js/react-hooks';
import { Program } from './lib';

const { data } = useProgram({
  library: Program,
  id: '0x...',
});

console.log(data);
```

### `useSendProgramTransaction`

The `useSendProgramTransaction` hook is used to call a `function` (also referred to as a [command](/docs/build/sails/coreconcepts.md#service) in Sails) of a Sails `service` from the application deployed at `id`. It returns a mutation to sign and send a transaction for this purpose.

> **Note:** The returned mutation callback is essentially a wrapper over the [`TransactionBuilder`](transaction-builder.md) in `sails-js` and its `signAndSend` method, which will be called upon mutation execution. The `useSendProgramTransaction` hook abstracts this process by internally specifying an account and a [`@gear-js/api`](/docs/api/api.mdx) instance, making it a shortcut for this procedure.

**Example:**

```jsx
import { useProgram, useSendProgramTransaction } from '@gear-js/react-hooks';
import { Program } from './lib';

function SendTransaction() {
  const { data: program } = useProgram({
    library: Program,
    id: '0x...',
  });

  const { sendTransactionAsync } = useSendProgramTransaction({
    program,
    serviceName: 'service',
    functionName: 'function',
  });

  const handleClick = async () => {
    const { response } = await sendTransactionAsync({
      args: ['arg', 'anotherArg'],
      account: { addressOrPair: '0x...' }, // Defaults to the connected account from the extension if not provided
      value: 1000000n, // Defaults to 0 if not provided
      gasLimit: 1000000000n, // Automatically calculated if not provided
      voucherId: '0x...', // If not provided, the transaction will be sent without a voucher
      awaitFinalization: false // Defaults to false. If not provided, the transaction will be processed at the `inBlock` status 
    });

    console.log('response: ', response);
  };

  return (
    <button type="button" onClick={handleClick}>
      Send Transaction
    </button>
  );
}

export { SendTransaction };
```

### `useProgramQuery`

The `useProgramQuery` hook is used to call a `query` of a Sails `service` from the application deployed at `id`. It returns a query containing the program's current state.

**Example:**

```jsx
import { useProgram, useProgramQuery } from '@gear-js/react-hooks';
import { Program } from './lib';

function State() {
  const { data: program } = useProgram({
    library: Program,
    id: '0x...',
  });

  const { data } = useProgramQuery({
    program,
    serviceName: 'service',
    functionName: 'query',
    args: ['arg', 'anotherArg'],
    watch: false, // If true, initializes a subscription to the program's state changes in the Gear MessagesDispatched event. Can increase network traffic.
  });

  return <div>{JSON.stringify(data)}</div>;
}
```

### `useProgramEvent`

The `useProgramEvent` hook initializes a subscription to a specified program event.

**Example:**

The `useProgramEvent` hook below sets up a listener on the `event` function of the specified `service` and executes the `onData` callback with the new data whenever the event is triggered.

```jsx
import { useProgram, useProgramEvent } from '@gear-js/react-hooks';
import { Routing } from './pages';
import { Program } from './lib';

function App() {
  const { data: program } = useProgram({
    library: Program,
    id: '0x...',
  });

  useProgramEvent({
    program,
    serviceName: 'service',
    functionName: 'event',
    onData: (data) => console.log(data),
  });

  return (
    <main>
      <Routing />
    </main>
  );
}

export { App };
```

## Prepare Hooks

When performing long-running asynchronous work in response to a user transaction using [`useSendProgramTransaction`](#usesendprogramtransaction)) hook, the user only receives feedback on the transaction status after transaction is complete. Prepare hooks can be used to eagerly obtain values before user interaction or to perform upfront validation before sending a transaction.

### `usePrepareProgramTransaction`

The `usePrepareProgramTransaction` hook returns a mutation that retrieves the intermediate transaction state for a specified `function` and `service` of a deployed application at `id`.

This hook is useful for eagerly obtaining values such as `gasLimit`, `extrinsic`, and `transactionFee`, which are essential for providing a smoother user experience.

**Example:**

The example below shows how to obtain the `transactionFee` for a transaction, which can be used to validate or display the fee to the user before proceeding.

```jsx
import { useProgram, usePrepareProgramTransaction } from '@gear-js/react-hooks';
import { Program } from './lib';

function LogTransactionFeeButton() {
  const { data: program } = useProgram({
    library: Program,
    id: '0x...',
  });

  const { data, prepareTransactionAsync } = usePrepareProgramTransaction({
    program,
    serviceName: 'service',
    functionName: 'function',
  });

  const handleClick = async () => {
    const { fee } = await prepareTransactionAsync({
      args: ['arg', 'anotherArg'],
      account: { addressOrPair: '0x...' }, 
      value: 1000000n, 
      gasLimit: 1000000000n, 
      voucherId: '0x...',
    });

    console.log('fee: ', fee);
  };

  return (
    <button type="button" onClick={handleClick}>
      Log Transaction Fee
    </button>
  );
}

export { LogTransactionFeeButton };
```

**Example:**

Using the hook in combination with [useSendProgramTransaction](#usesendprogramtransaction):

```jsx
import { useProgram, usePrepareProgramTransaction, useSendProgramTransaction } from '@gear-js/react-hooks';
import { Program } from './lib';

function SendPreparedTransaction() {
  const { data: program } = useProgram({
    library: Program,
    id: '0x...',
  });

  const { prepareTransactionAsync } = usePrepareProgramTransaction({
    program,
    serviceName: 'service',
    functionName: 'function',
  });

  const { sendTransactionAsync } = useSendProgramTransaction({
    program,
    serviceName: 'service',
    functionName: 'function',
  });

  const handleClick = async () => {
    const { transaction, fee } = await prepareTransactionAsync({
      args: ['arg', 'anotherArg'],
      account: { addressOrPair: '0x...' }, 
      value: 1000000n, 
      gasLimit: 1000000000n, 
      voucherId: '0x...',
    });

    console.log('fee: ', fee);

    const { response } = await sendTransactionAsync({ transaction });

    console.log('response: ', response);
  };

  return (
    <button type="button" onClick={handleClick}>
      Prepare and Send Transaction
    </button>
  );
}

export { SendPreparedTransaction };
```