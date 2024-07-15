---
sidebar_position: 7
sidebar_label: Read State
---

# Read State

There are two different ways to query the program state:

1. Query the full state of the program. To read the full state of the program, you need to have only the metadata of this program. Use the `api.programState.read` method to get the state.

```javascript
import { GearApi } from '@gear-js/api';
const api = await GearApi.create({
  providerAddress: 'wss://testnet.vara.network',
});
await api.programState.read({ programId: '0x…' }, programMetadata);
```

It is also possible to read the state of the program at a specific block specified by its hash:

```javascript
await api.programState.read(
  { programId: '0x…', at: '0x…' },
  programMetadata,
);
```

2. If using custom functions to query only specific parts of the program state ([see more](/docs/build/metadata#generate-metadata)), call the `api.programState.readUsingWasm` method:

```javascript
import { getStateMetadata } from '@gear-js/api';
const stateWasm = readFileSync('path/to/state.meta.wasm');
const metadata = await getStateMetadata(stateWasm);

const state = await api.programState.readUsingWasm(
  {
    programId: '0x…',
    fn_name: 'name_of_function_to_execute',
    stateWasm,
    argument: { input: 'payload' },
  },
  metadata,
);
```

## Cookbook

To read state in JavaScript applications, use the `fetch` browser API to get the buffer from `meta.wasm`:

```javascript
const res = await fetch(metaFile);
const arrayBuffer = await res.arrayBuffer();
const buffer = await Buffer.from(arrayBuffer);
const metadata = await getStateMetadata(buffer);

// Get state of the first wallet
const firstState = await api.programState.readUsingWasm(
  { programId: '0x…', fn_name: 'first_wallet', buffer },
  metadata,
);

// Get wallet state by ID
const secondState = await api.programState.readUsingWasm(
  { programId: '0x…', fn_name: 'wallet_by_id', buffer,  argument: { decimal: 1, hex: '0x01' } },
  metadata,
);
```