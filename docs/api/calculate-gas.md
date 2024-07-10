---
sidebar_position: 3
sidebar_label: Calculate Gas
---

# Calculate Gas

Vara nodes charge gas fees for all network operations, including executing a program’s code or processing a message. This gas is paid for by the initiator of these actions.

To ensure successful message processing and avoid errors like `Gas limit exceeded`, simulate the execution in advance to calculate the exact amount of gas that will be consumed.

## Calculate Gas for Messages

To determine the minimum gas amount required to send an extrinsic, use `api.program.calculateGas.[method]`. Depending on the conditions, calculate gas for initializing a program or processing a message in `handle()` or `reply()`.

:::info

Gas calculation returns the GasInfo object, which contains 5 parameters:

- `min_limit` - minimum gas limit required for execution
- `reserved` - gas amount reserved for other on-chain interactions
- `burned` - number of gas units burned during message processing
- `may_be_returned` - value that can be returned in some cases
- `waited` - notification that the message will be added to the waitlist

:::

### Init (for `upload_program` extrinsic)

```javascript
const code = fs.readFileSync('demo_ping.opt.wasm');

const gas = await api.program.calculateGas.initUpload(
  '0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d', // source id
  code,
  '0x00', // payload
  0,      // value
  true,   // allow other panics
);

console.log(gas.toHuman());
```

### Init (for `create_program` extrinsic)

```javascript
const codeId = '0x…';

const gas = await api.program.calculateGas.initCreate(
  '0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d', // source id
  codeId,
  '0x00', // payload
  0,      // value
  true,   // allow other panics
);
console.log(gas.toHuman());
```

### Handle

```javascript
import { getProgramMetadata } from '@gear-js/api';
const metadata = await getProgramMetadata('0x' + fs.readFileSync('demo_new_meta.meta.txt'));
const gas = await api.program.calculateGas.handle(
  '0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d', // source id
  '0xa178362715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d', // program id
  {
    id: {
      decimal: 64,
      hex: '0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d',
    },
  },      // payload
  0,      // value
  false,  // allow other panics
  metadata,
);
console.log(gas.toHuman());
```

### Reply to a Message

```javascript
import { getProgramMetadata } from '@gear-js/api';
const metadata = await getProgramMetadata('0x' + fs.readFileSync('demo_async.meta.txt'));
const gas = await api.program.calculateGas.reply(
  '0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d', // source id
  '0x518e6bc03d274aadb3454f566f634bc2b6aef9ae6faeb832c18ae8300fd72635', // message id
  'PONG', // payload
  0,      // value
  true,   // allow other panics
  metadata,
);
console.log(gas.toHuman());
```