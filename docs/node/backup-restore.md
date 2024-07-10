---
sidebar_label: Backup and Restore
sidebar_position: 4
---

# Backup and Restore the Node

## Data Structure

Vara node stores its data in a dedicated directory.

- Linux: `$HOME/.local/share/gear`
- macOS: `$HOME/Library/Application Support/gear`
- Windows: `%USERPROFILE%\AppData\Local\gear.exe`

For example, if the node runs as the root user on Linux (`$HOME` = `/root`), the absolute path of the node's data directory will be:

    /root/.local/share/gear

Let's explore the data that the node stores in this directory.

```
└── gear
    └── chains
        ├── dev
        │   └── ...
        ├── gear_staging_testnet_v7
        │   ├── db
        │   │   └── full
        │   ├── keystore
        │   └── network
        └── vara_network
            ├── db
            │   └── full
            ├── keystore
            └── network
```

### Chains

The node can connect to different chains. The chain can be selected using the `--chain` argument. The default chain is the staging test network. Its data is located in the `gear/chains/gear_staging_testnet_v7` directory.

If connected to the Vara network, the chain subdirectory name will be `vara_network`, resulting in the `gear/chains/vara_network` path.

If the node starts with the `--dev` argument, the virtual network in development mode will run with the data stored in the `gear/chains/dev` directory.

### Database

The database keeps the blockchain state in the local node storage. It synchronizes with other nodes over a peer-to-peer protocol. The DB format can be selected using the `--database` argument. Possible options are:

- `rocksdb` (default): uses RocksDB as the database engine, data is stored in the `<chain>/db/full` subdirectory.
- `paritydb`: uses ParityDB as the database engine, data is stored in the `<chain>/paritydb/full` subdirectory.
- `paritydb-experimental`: deprecated experimental mode of the ParityDB engine (will be removed in future releases), data is stored in the `<chain>/paritydb/full` subdirectory.

Note that the database contents depend on the pruning mode of the node. By default, the node keeps only the last 256 blocks. To keep all the blocks, use the `--pruning=archive` argument when running the node.

The database can be deleted and synchronized from scratch at any time. Use the `gear purge-chain` command to completely delete the DB.

### Network Key

The network private key is used to calculate the unique peer identifier (starts with `12D3KooW`). This key is stored in the `<chain>/network/secret_ed25519` file. The key file is a binary file containing 32 bytes of the Ed25519 (by default) private key. Use the `hexdump` command to read the key:

```shell
hexdump -e '1/1 "%02x"' /root/.local/share/gear/chains/gear_staging_testnet_v7/network/secret_ed25519

# 42bb2fdd46edfa4f41a5f0f9c1a5a1d407a39bafbce6f07456a2c8d9963c8f5c
```

Override this key by running the node with the `--node-key` argument:

```shell
gear --node-key=42bb2fdd46edfa4f41a5f0f9c1a5a1d407a39bafbce6f07456a2c8d9963c8f5c

# Discovered new external address for our node: /ip4/127.0.0.1/tcp/30333/ws/p2p/12D3KooWMRApe2S5QMdhHwmcDapDxZ7xf2Xa3z2HfCCYoHTmjiXV
```

If there is no `--node-key` argument, the node uses the key from the `secret_ed25519` file. If it does not exist, it is created with a newly generated secret key.

The network key file cannot be recovered if lost. Therefore, keep it (or the private key itself) to have the possibility of running the node with the same peer ID.

## Moving the Node

To move the node to a new server, backup and restore the following (provided paths are for default Staging Testnet V7 node's parameters):

- The network private key of the node:

    - Linux: `$HOME/.local/share/gear/chains/gear_staging_testnet_v7/network/secret_ed25519`
    - macOS: `$HOME/Library/Application Support/gear/chains/gear_staging_testnet_v7/network/secret_ed25519`
    - Windows: `%USERPROFILE%\AppData\Local\gear.exe\chains\gear_staging_testnet_v7\network\secret_ed25519`

- (optional) The database:

    - Linux: `$HOME/.local/share/gear/chains/gear_staging_testnet_v7/db/full`
    - macOS: `$HOME/Library/Application Support/gear/chains/gear_staging_testnet_v7/db/full`
    - Windows: `%USERPROFILE%\AppData\Local\gear.exe\chains\gear_staging_testnet_v7\db\full`

- (optional) The service configuration if the node is configured as a service:

    - Linux: `/etc/systemd/system/gear-node.service`

If the database is not backed up, it can be synchronized from scratch, but this process may take some time.

:::info
Stop the node before backing up the database to avoid a corrupted database.

```shell
sudo systemctl stop gear-node
```
:::
