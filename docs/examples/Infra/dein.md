---
sidebar_label: Decentralized DNS
sidebar_position: 4
---

# Decentralized DNS

Decentralized Internet (DNS) demonstrates an on-chain server-less approach to websites and web applications hosting. Unlike server-based DNS built on centralized components and services, decentralized solutions running on the blockchain are characterized by boosted data security, enhanced data reconciliation, minimized system weak points, optimized resource allocation, and demonstrated great fault tolerance. It brings all the benefits of decentralization, such as censorship resistance, security resilience, and high transparency.

Briefly, the solution consists of a DNS program that is uploaded on-chain. It lists programs (smart contracts) that are also uploaded on-chain and registered in the DNS program as DNS records. Hosted programs may have the user interface that resides on IPFS. The DNS program stores program IDs and meta info of their interfaces (name, description, and link).

The source code of the program and frontend implementation is available on [GitHub](https://github.com/gear-foundation/dapps/tree/master/contracts/ddns). Note that its repository contains a git submodule, so cloning should be done with the `--recurse-submodules` flag, i.e.:

```
git clone --recurse-submodules "https://github.com/gear-foundation/dapps"
```

## Connect a dApp to the Decentralized DNS

1. To connect a program to the Decentralized DNS on Vara Network, it's necessary to have a variable of type `Option<DnsMeta>` in the program that will contain metadata of the DNS record:

```rust title="ddns/io/src/lib.rs"
pub struct DnsMeta {
    pub name: String,
    pub link: String,
    pub description: String,
}
```

2. Include the following enum variants:

    1. In `handle_input` type:
        - `GetDnsMeta` - it has to be the first variant of the enum
        - `SetDnsMeta(DnsMeta)` - required to set the DNS record

    2. In `handle_output` type:
        - `DnsMeta(Option<DnsMeta>)` - it also has to be the first variant of the enum

3. After the program has been uploaded on the chain, build the frontend to a single HTML file and upload it to IPFS:
    1. Download and install IPFS Desktop - https://github.com/ipfs/ipfs-desktop
    2. Upload the built web app using the 'Files' tab
    3. Get the file link by pressing the option dots button on the file and choosing 'Share link'

4. The next step is to send Metadata to the program using the `SetDnsMeta` enum variant. Set the name, link (that is the link to the HTML file on IPFS), and description.

5. To register the dApp in DNS, send a message to the DNS program. This can be done through https://idea.gear-tech.io/ - find the DNS program and send the message `Register` with the ID of the program.

## Open and use dApp

Firstly, download the `dns.html` file from Releases and open it in a browser. If the dApp is registered in the DNS program, it will appear in the list of available dApps. Click the "Open" button to open the interface in a new tab.

## Get DNS records

Using https://idea.gear-tech.io, read the state of the DNS program to get records - all or filtered by name, ID, and pattern.