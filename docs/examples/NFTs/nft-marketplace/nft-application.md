---
sidebar_label: NFT Frontend Application
sidebar_position: 2
---

# NFT Frontend Application

This guide explains how to create a `React` application and connect it to an [extended NFT smart contract](/docs/examples/Standards/vnft.md#extended-vnft-implementation) running in the blockchain.

### Preparation

1. First install one of the [templates](https://github.com/gear-foundation/dapps/tree/master/frontend/templates). Install [NodeJs](https://nodejs.org/en/download/) and [NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm). Make sure the latest LTS version of the NodeJs is installed.

2. Then install dependencies:

```shell
yarn install
```

3. There is an `.env.example` file. Create your own `.env` file and copy the contents of `.env.example` to your `.env` file. It contains the following variables:

   - `VITE_NODE_ADDRESS`: This variable defines the node we'll be working on.

   You have to add next varibles as well:

   - `VITE_CONTRACT_ADDRESS`: The address of the contract uploaded to the chain.
   - `VITE_IPFS_ADDRESS` and `VITE_IPFS_GATEWAY_ADDRESS`: These variables are needed when uploading and reading media files to IPFS

An example of environment variables is shown below:

```sh
VITE_NODE_ADDRESS=wss://testnet.vara.network
VITE_CONTRACT_ADDRESS=0x3d3d0b5c597d6d767294cc93e0a3489d848ae32cbf851fa40756800d28e4cd37
VITE_IPFS_ADDRESS=http://localhost:5001/api/v0
VITE_IPFS_GATEWAY_ADDRESS=https://ipfs.io/ipfs
```

4. In a root `consts.ts` file, specify newly added environment variables:

```typescript
const ADDRESS = {
  NODE: import.meta.env.VITE_NODE_ADDRESS as string,
  CONTRACT_ADDRESS: import.meta.env.VITE_CONTRACT_ADDRESS as `0x${string}`,
  IPFS_ADDRESS: import.meta.env.VITE_IPFS_ADDRESS as string,
  IPFS_GATEWAY_ADDRESS: import.meta.env.VITE_IPFS_GATEWAY_ADDRESS as string,
};
```

5. Install `kubo-rpc-client` library to handle IPFS requests:

```shell
yarn add kubo-rpc-client
```

Next, create a context to integrate IPFS in a React-friendly way. In the `context` folder, create a file named `index.tsx` and add the following code:

```tsx
import { create, KuboRPCClient } from "kubo-rpc-client";
import { createContext, ReactNode, useContext, useRef } from "react";
import { ADDRESS } from "@/consts";

type Props = {
  children: ReactNode;
};

const IPFSContext = createContext({} as KuboRPCClient);

function IPFSProvider({ children }: Props) {
  const ipfsRef = useRef(create({ url: ADDRESS.IPFS_ADDRESS }));
  const { Provider } = IPFSContext;

  return <Provider value={ipfsRef.current}>{children}</Provider>;
}

const useIPFS = () => useContext(IPFSContext);

export { IPFSProvider, useIPFS };
```

Include `IPFSProvider` in the providers array in the `hocs/index.tsx` file:

```typescript
import { IPFSProvider } from '@/context';

const providers = [..., IPFSProvider];
```

6. Build and upload the [contract](https://github.com/gear-foundation/standards/tree/master/extended-vnft#%EF%B8%8F-building) to the chain and set up the address in the `.env` file. 

Place the `extended_vnft.idl` file in the `api/sails` folder and run sails-cli command:

```shell
npx sails-js-cli generate src/api/sails/extended_vnft.idl -o src/api/sails --no-project
```

Check the newly created lib.ts file and add the following two lines at the top:

```ts
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */
```

7. Run the application:

```shell
yarn start
```

8. The main file `App.tsx` is simple.

It checks whether the application is connected to the chain:

```typescript
const { isApiReady } = useApi();
```

It checks whether the account is connected to the application through the web extension:

```typescript
const { isAccountReady } = useAccount();
```

9. If the `api` is ready and the `account` is connected, it displays the application's pages. Navigate to the pages folder. The project has only one page `Home`. The routing configuration is located in the `pages/index.tsx` file.

### Create-NFT page

1. Create a page for NFT creation using the code below:

```shell
mkdir src/pages/create-nft
touch src/pages/create-nft/CreateNft.tsx
```

2. Start writing the `CreateNft.tsx`:

```tsx
export function CreateNft() {
  return <div>Create NFT</div>;
}
```

3. Declare this page in the `index.tsx` file and also add the route for it:

```tsx
import { CreateNft } from "./create-nft/CreateNft";

const routes = [
  { path: "/", Page: Home },
  { path: "/create-nft", Page: CreateNft },
];
```

4. Create a link to the `CreateNft` page from the `Header` component. In the `src\components\layout\header\Header.tsx` file, write:

```tsx
import { Link } from "react-router-dom";
...

function Header() {
  return (
    <header className={styles.header}>
      <Logo />
      <Link to="/create-nft">
        <h3>Create NFT</h3>
      </Link>
      ...
    </header>
  );
}

export { Header };
```

5. Go back to the `CreateNft` page. Create a form that includes the NFT `title`, `description`, and `image`:

```tsx
import { Button, FileInput, Input } from "@gear-js/ui";

export function CreateNft() {
  return (
    <>
      <h2>Create NFT</h2>
      <div>
        <form>
          <Input label="Name" required />
          <Input label="Description" required />
          <FileInput label="Image" required />
          <Button type="submit" text="Create" />
        </form>
      </div>
    </>
  );
}
```

6. Create a state that will store the NFT's title, description, and image, and add the functions `handleInputChange` and `handleImageChange` that will update this state:

```tsx
import { Button, FileInput, Input } from "@gear-js/ui";
import { useState } from "react";

const NftInitialState = {
  title: "",
  description: "",
};

export function CreateNft() {
  const [nftForm, setNftForm] = useState(NftInitialState);
  const [image, setImage] = useState<File | null>();
  const { title, description } = nftForm;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNftForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  return (
    <>
      <h2>Create NFT</h2>
      <div>
        <form>
          <Input label="Name" required name="title" value={title} onChange={handleInputChange} />
          <Input label="Description" required name="description" value={description} onChange={handleInputChange} />
          <FileInput label="Image" onChange={setImage} />
          <Button type="submit" text="Create" />
        </form>
      </div>
    </>
  );
}
```

7. Add the image preview for the uploaded image:

```tsx
...
export function CreateNft() {
  ...
  return (
    <>
      <h2>Create NFT</h2>
      <div>
        <form>
          ...
          <FileInput label="Image" onChange={setImage} />
          {image ? (
            <div>
              <img
                src={URL.createObjectURL(image)}
                alt="nft"
                style={{ width: 200, height: 200 }}
              />
            </div>
          ) : (
            <p>No image set for this NFT</p>
          )}
          <Button type="submit" text="Create" />
        </form>
      </div>
    </>
  );
}
```

### Upload image and mint NFT

1. Next, upload the image to IPFS and send a `Mint` message to the contract.

Install the [IPFS Desktop App](https://docs.ipfs.tech/install/ipfs-desktop/#windows).

2.  Navigate to `Settings`:
    ![](../../img/ssgQSvY.jpg)
    Locate `IPFS config`:
    ![](../../img/nn82YO3.png)
    and configure the `API` of your node:

```json
"API": {
    "HTTPHeaders": {
        "Access-Control-Allow-Methods": [
            "PUT",
            "GET",
            "POST"
        ],
        "Access-Control-Allow-Origin": [
            "*",
            "https://webui.ipfs.io",
            "http://webui.ipfs.io.ipns.localhost:8080",
            "http://127.0.0.1:5001"
        ]
    }
},
```

3.  Now you can upload the files from the application. Start writing the function:

```tsx
...
import { useIPFS } from "@/context";
...
export function CreateNft() {
  ...
  const ipfs = useIPFS();
  const createNft = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (image) {
      try {
        const cid = await ipfs.add(image);
      } catch (error) {
        console.error(error);
      }
    }
  };
  ...
}
```

4. Continue writing the `createNft` function. Create the `payload` message and send it to the contract. The complete code of the `CreateNft` page is as follows:

```tsx
import { useAccount, useProgram, useSendProgramTransaction } from "@gear-js/react-hooks";
import { Button, FileInput, Input } from "@gear-js/ui";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Program } from "@/api/sails/lib";
import { ADDRESS } from "@/consts";
import { useIPFS } from "@/context";

const NftInitialState = {
  title: "",
  description: "",
};

export function CreateNft() {
  const [nftForm, setNftForm] = useState(NftInitialState);
  const [image, setImage] = useState<File | null>();
  const ipfs = useIPFS();
  const { account } = useAccount();
  const navigate = useNavigate();

  const { data: program } = useProgram({ library: Program, id: ADDRESS.CONTRACT_ADDRESS });
  const { sendTransactionAsync } = useSendProgramTransaction({
    program,
    serviceName: "vnft",
    functionName: "mint",
  });

  const { title, description } = nftForm;

  const resetForm = () => {
    setNftForm(NftInitialState);
    setImage(null);
  };

  const createNft = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!account?.decodedAddress) return;

    if (image) {
      try {
        const cid = await ipfs.add(image);

        const tokenMetadata = {
          name: title,
          description,
          media: cid?.cid.toString(),
          reference: "",
        };

        await sendTransactionAsync({
          args: [account.decodedAddress, tokenMetadata],
        });

        resetForm();
        navigate("/");
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNftForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  return (
    <>
      <h2>Create NFT</h2>
      <div>
        <form onSubmit={createNft}>
          <Input label="Name" required name="title" value={title} onChange={handleInputChange} />
          <Input label="Description" required name="description" value={description} onChange={handleInputChange} />
          <FileInput label="Image" onChange={setImage} />
          {image ? (
            <div className="image-preview">
              <img
                src={URL.createObjectURL(image)}
                alt="nft"
                style={{ width: 200, height: 200 }}
              />
            </div>
          ) : (
            <p>No image set for this NFT</p>
          )}
          <Button type="submit" text="Create" />
        </form>
      </div>
    </>
  );
}
```

The next section covers the creation of the `Home` page for reading and displaying the minted NFTs.

### Home page

1. Start writing the `Home` page:

```tsx
import { useAccount, useProgram, useProgramQuery } from "@gear-js/react-hooks";

import { Program } from "@/api/sails/lib";
import { Loader } from "@/components";
import { ADDRESS } from "@/consts";

function Home() {
  const { account } = useAccount();
  const { data: program } = useProgram({ library: Program, id: ADDRESS.CONTRACT_ADDRESS });

  // Read nfts from the contract
  const { data: nfts, isFetched: isNftStateRead } = useProgramQuery({
    program,
    serviceName: "vnft",
    functionName: "tokensForOwner",
    args: [account!.decodedAddress],
  });

  // Check whether the contract has tokens
  const isAnyNft = !!nfts?.length;

  return (
    <>
      <header>
        <h2>NFTs</h2>
      </header>
      {isNftStateRead ? (
        <>
          {isAnyNft && <ul>Display NFTs here</ul>}
          {!isAnyNft && <h2>There are no NFTs at the moment</h2>}
        </>
      ) : (
        <Loader />
      )}
    </>
  );
}

export { Home };
```

2. Create a component that will display the NFT:

```shell
mkdir src/pages/home/nft
touch src/pages/home/nft/Nft.tsx
```

Write the component:

```tsx
import { Link } from "react-router-dom";

import { ADDRESS } from "@/consts";

type Props = {
  id: string;
  name: string;
  media: string;
};

function NFT({ id, name, media }: Props) {
  const to = `/nft/${id}`;
  const src = `${ADDRESS.IPFS_GATEWAY_ADDRESS}/${media}`;
  const text = `#${id}`;

  return (
    <Link to={to}>
      <img src={src} alt={name} />
      <h3>{name}</h3>
      <p>{text}</p>
    </Link>
  );
}

export { NFT };
```

3. Write a function for retrieving all NFTs from the contract in the `Home.tsx` file:

```tsx
...
import { NFT } from './nft/Nft';

function Home() {
  ...
  const getNFTs = () =>
    nfts?.map(([id, { name, media }]) => (
      <li key={id}>
        <NFT id={id} name={name} media={media} />
      </li>
    ));
...
}
...
```

The whole code of the `Home` page:

```tsx
import { useAccount, useProgram, useProgramQuery } from "@gear-js/react-hooks";

import { Program } from "@/api/sails/lib";
import { Loader } from "@/components";
import { ADDRESS } from "@/consts";

import { NFT } from "./nft/Nft";

function Home() {
  const { data: program } = useProgram({
    library: Program,
    id: ADDRESS.CONTRACT_ADDRESS,
  });
  const { account } = useAccount();
  const { data: nfts, isFetched: isNftStateRead } = useProgramQuery({
    program,
    serviceName: "vnft",
    functionName: "tokensForOwner",
    args: [account!.decodedAddress],
  });

  const isAnyNft = Boolean(nfts?.length);

  const getNFTs = () =>
    nfts?.map(([id, { name, media }]) => (
      <li key={id}>
        <NFT id={id} name={name} media={media} />
      </li>
    ));

  return (
    <>
      <header>
        <h2>NFTs</h2>
      </header>
      {isNftStateRead ? (
        <>
          {isAnyNft && <ul>{getNFTs()}</ul>}
          {!isAnyNft && <h2>There are no NFTs at the moment</h2>}
        </>
      ) : (
        <Loader />
      )}
    </>
  );
}

export { Home };
```
