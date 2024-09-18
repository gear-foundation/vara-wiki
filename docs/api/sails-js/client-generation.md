---
sidebar_position: 1
sidebar_label: Client Generation
---

# Client Generation

One of the key features of the `sails-js` library is its ability to generate working client code from IDL files. This page outlines the various options available to developers when using TypeScript. In short, client code can either be generated manually by parsing an IDL file or automatically with the `sails-js-cli` command-line tool.

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

If you prefer not to install the package globally, you can achieve the same with `npx`:

```bash
npx sails-js-cli generate path/to/sails.idl -o path/to/out/dir
```

To generate only the `lib.ts` file without the full project structure, use the `--no-project` flag:

```bash
sails-js generate path/to/sails.idl -o path/to/out/dir --no-project
```

## Manually Parse IDL

```js
import { Sails } from 'sails-js';
import { SailsIdlParser } from 'sails-js-parser';

const parser = await SailsIdlParser.new();
const sails = new Sails(parser);

const idl = '<idl content>';

sails.parseIdl(idl);
```

The `sails` object contains all the constructors, services, functions and events available in the IDL file.
To send messages, create programs and subscribe to events using `Sails` it is necessary [to connect to the chain using `@gear-js/api`](https://github.com/gear-tech/gear-js/blob/main/api/README.md) and set a `GearApi` instance using `setApi` method.
