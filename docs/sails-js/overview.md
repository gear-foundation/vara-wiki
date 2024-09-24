---
sidebar_position: 1
sidebar_label: Library Overview
---

# Library Overview

The `sails-js` library workflow begins by creating a `Sails` object through parsing a provided IDL description. This process maps the interface defined by the IDL to corresponding objects in the `Sails` instance, including:

- Constructors
- Services
- Functions (referred to as Commands in the Sails framework)
- Queries
- Events

The library also offers methods for decoding information from payloads and encoding data to be sent to a program via transactions. The `TransactionBuilder` class facilitates the building and sending of these transactions to the blockchain. For further details, refer to the [Transaction Builder](transaction-builder.md) section.

## Parsing an IDL Description

```javascript
import { Sails } from 'sails-js';
import { SailsIdlParser } from 'sails-js-parser';

const parser = await SailsIdlParser.new();
const sails = new Sails(parser);

const idl = '<idl content>';

sails.parseIdl(idl);
```

The `sails` object now contains all the constructors, services, functions, and events available in the IDL file.

To send messages, create programs, and subscribe to events using `Sails`, you need to connect to the chain using `@gear-js/api` and set the `GearApi` instance using the `setApi` method. For further details, refer to the [Gear-JS](/docs/api) API section.


```javascript
import { GearApi } from '@gear-js/api';

const api = await GearApi.create();

sails.setApi(api);
```
## The `Sails` Class
### Constructors

The `sails.ctors` property contains an object with all the constructors available in the IDL file. The keys are the constructor names, and each value is an object with the following properties:

```javascript
{
  args: Array<{ name: string, type: string }>, // Array of arguments with their names and SCALE codec types
  encodePayload: (...args: any) => HexString,  // Function to encode the payload
  decodePayload: (bytes: HexString) => any,    // Function to decode the payload
  fromCode: (
    code: Uint8Array | Buffer,
    ...args: unknown[]
  ) => TransactionBuilder,                     // Function to create a transaction builder to deploy the program using code bytes
  fromCodeId: (
    codeId: string,
    ...args: unknown[]
  ) => TransactionBuilder                      // Function to create a transaction builder to deploy the program using a code ID
}
```

To get a constructor object, use `sails.ctors.ConstructorName`.

The `fromCode` and `fromCodeId` methods return an instance of the `TransactionBuilder` class, which can be used to build and send the transaction to the chain.

### Services

The `sails.services` property contains an object with all the services available in the IDL file. The keys are the service names, and each value is an object with the following properties:

```javascript
{
  functions: Record<string, SailsServiceFunc>, // Object with all the functions available in the service
  queries: Record<string, SailsServiceQuery>,  // Object with all the queries available in the service
  events: Record<string, SailsServiceEvent>,   // Object with all the events available in the service
}
```

To get a service object, use `sails.services.ServiceName`.

### Functions

The `sails.services.ServiceName.functions` property contains an object with all the functions from the IDL file that can be used to send messages to the program. The keys are the function names, and each value can be used either as a function that accepts arguments and returns an instance of the `TransactionBuilder` class, or as an object with the following properties:

```javascript
{
  args: Array<{ name: string, type: string }>, // Array of arguments with their names and SCALE codec types
  returnType: any,                             // SCALE codec definition of the return type
  encodePayload: (...args: any) => Uint8Array, // Function to encode the payload
  decodePayload: (bytes: Uint8Array) => any,   // Function to decode the payload
  decodeResult: (result: Uint8Array) => any    // Function to decode the result
}
```

It's necessary to provide a program ID so that the function can be called. You can set the program ID using the `.setProgramId` method of the `Sails` class:

```javascript
sails.setProgramId('0x...');
```

To create a transaction for a function call, you can do the following:

```javascript
const transaction = sails.services.ServiceName.functions.FunctionName(arg1, arg2);
```

### Queries

The `sails.services.ServiceName.queries` property contains an object with all the queries from the IDL file that can be used to read the program state. The keys are the query names. The values include the same properties as described in the [Functions](#functions) section above. Note that the query function returns the result of the query, not a transaction builder.

*The query function accepts three additional arguments beyond those specified in the IDL:*

- **`originAddress`**: The address of the account that is calling the function.
- **`value`**: *(Optional, default is `0`)* The amount of tokens sent with the function call.
- **`atBlock`**: *(Optional)* The block at which the query is executed.

**Example:**

```javascript
const alice = 'kGkLEU3e3XXkJp2WK4eNpVmSab5xUNL9QtmLPh8QfCL2EgotW';
// functionArg1, functionArg2 are the arguments of the query function from the IDL file
const result = await sails.services.ServiceName.queries.QueryName(
  alice,
  null,
  null,
  functionArg1,
  functionArg2
);

console.log(result);
```

In this example, `alice` is the origin address, and `functionArg1`, `functionArg2` are the arguments specific to the query function as defined in your IDL file. The `null` values indicate that the optional `value` and `atBlock` parameters are not being specified.

### Events

The `sails.services.ServiceName.events` property contains an object with all the events available in the IDL file. The keys are the event names, and each value is an object with the following properties:

```javascript
{
  type: any,                            // SCALE codec definition of the event
  is: (event: UserMessageSent) => bool, // Function to check if the event is of the specific type
  decode: (data: Uint8Array) => any,    // Function to decode the event data
  subscribe: (callback: (data: any) => void | Promise<void>) => void // Function to subscribe to the event
}
```

To subscribe to an event, use the `subscribe` method of the event object:

```javascript
sails.services.ServiceName.events.EventName.subscribe((data) => {
  console.log(data);
});
```

This will call the provided callback function whenever the event occurs, with `data` containing the decoded event data.

### Get Function Name and Decode Bytes

You can extract service and function names from payload bytes and decode messages using the following methods:

- Use the `getServiceNamePrefix` function to get the service name from the payload bytes.
- Use the `getFnNamePrefix` method to get the function or event name from the payload bytes.
- Use the `sails.services.ServiceName.functions.FunctionName.decodePayload` method to decode the payload bytes of the sent message.
- Use the `sails.services.ServiceName.functions.FunctionName.decodeResult` method to decode the result bytes of the received message.

**Example:**

```javascript
import { getServiceNamePrefix, getFnNamePrefix } from 'sails-js';

const payloadOfSentMessage = '0x<some bytes>';
const serviceName = getServiceNamePrefix(payloadOfSentMessage);
const functionName = getFnNamePrefix(payloadOfSentMessage);

console.log(
  sails.services[serviceName].functions[functionName].decodeResult(payloadOfSentMessage)
);

const payloadOfReceivedMessage = '0x<some bytes>';

console.log(
  sails.services[serviceName].functions[functionName].decodePayload(payloadOfReceivedMessage)
);
```

**Note:** Ensure that you use `sails.services[serviceName]` when accessing services.

### Encode and Decode Constructors and Events

You can use the same approach to encode and decode bytes of constructors or events:

```javascript
// Encoding and decoding constructor payloads
sails.ctors.ConstructorName.encodePayload(arg1, arg2);
sails.ctors.ConstructorName.decodePayload('<some bytes>');

// Decoding event data
sails.events.EventName.decode('<some bytes>');
```

### Encode Payload

Use the `sails.services.ServiceName.functions.FunctionName.encodePayload` method to encode the payload for a specific function. The bytes returned by this method can be used to send a message to the program.

**Example:**

```javascript
const payload = sails.services.ServiceName.functions.FunctionName.encodePayload(arg1, arg2);
```

In this example, `arg1` and `arg2` are the arguments required by the function as defined in your IDL file. The encoded `payload` can then be sent in a transaction to the program.