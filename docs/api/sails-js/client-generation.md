---
sidebar_position: 3
sidebar_label: Client Generation
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Client Generation

One of the key features of the `sails-js` library is its ability to generate working client code from IDL files. In particular for smaller projects or for application testing this approach offers a quick way for developers to start interacting with their application on Vara Network.

## Generation with `sails-js-cli`

The `sails-js-cli` is a command-line tool designed to generate TypeScript client libraries from Sails IDL files. It automates the process of creating fully functional client libraries based on the interfaces defined in the Sails framework, streamlining development and ensuring consistency between client and on-chain programs.

### Installation
To install the `sails-js-cli` package globally, use the following command:

```bash
npm install -g sails-js-cli
```

Alternatively, you can run the command without installing the package by using `npx`:

```bash
npx sails-js-cli command <args>
```

### Usage
To generate a TypeScript client library, run the following command:

```bash
sails-js generate path/to/sails.idl -o path/to/out/dir
```

To generate only the `lib.ts` file without the full project structure, use the `--no-project` flag:

```bash
sails-js generate path/to/sails.idl -o path/to/out/dir --no-project
```

## Using a Generated Client Library

The generated library consists of a `program` class, which represents the Sails application and handles initialization and deployment and one additional class for each service of the application.

### The `program` Class
The `program` class initializes the connection to the Sails program. It manages the program's ID and provides methods to deploy the program to Vara Network. The constructor accepts a `GearApi` instance for interacting with Vara Network and an optional `programId` representing the address of the deployed application.
```js
constructor(public api: GearApi, public programId?: `0x${string}`) { ... }
```
The `newCtorFromCode` method creates a `TransactionBuilder` to deploy the program using the provided code bytes, setting the `programId` upon deployment.
```js
newCtorFromCode(code: Uint8Array | Buffer): TransactionBuilder<null> { ... }
```
Similarly, the `newCtorFromCodeId` method deploys the program using an existing `codeId` on Vara Network and sets the `programId` after deployment.
```js
newCtorFromCodeId(codeId: `0x${string}`): TransactionBuilder<null> { ... }
```

### Example: Querying a Sails Application

The following code snippet shows how to instantiate a `program` object using a `GearApi` instance and issuing a call to a simple query as implemented by the `varaApp` service.

<Tabs>
  <TabItem value="TypeScript" label="TypeScript" default>
    ```js
    import { GearApi } from '@gear-js/api';
    import { program } from './lib'; // Import Program from lib.ts

    async function main() {
        const api = await GearApi.create({ providerAddress: 'wss://testnet.vara.network' });

        // Use the Program class
        const programId = '0x<something>';
        const prgm = new program(api, programId);

        // Access varaApp and call getSomething
        const alice = 'kGkLEU3e3XXkJp2WK4eNpVmSab5xUNL9QtmLPh8QfCL2EgotW';
        const result = await prgm.varaApp.getSomething(alice);
    
        console.log(result);
    }
    main().catch(console.error);
    ```
  </TabItem>
  <TabItem value="idl" label="IDL">
    ```rust
    constructor {
        New : ();
    };

    service VaraApp {
        DoSomething : () -> str;
        query getSomething : () -> str;
    };
    ```
  </TabItem>
</Tabs>





