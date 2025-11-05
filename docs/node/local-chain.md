---
sidebar_label: Local Chain Setup
sidebar_position: 9
---

# Building and Running a Local Vara Chain for Development and Testing

If you're experimenting with runtime logic, benchmarking smart contracts, or just exploring how blockchain consensus actually works under the hood, running a local Vara chain is one of the best ways to do it.

While Vara offers ready-to-use public networks like testnet and mainnet, local environments give you more control. You can modify chain parameters, test custom runtimes, or simulate multi-validator behavior without relying on any external infrastructure.

In this guide, you'll learn how to set up and operate a full Vara blockchain network locally, from compiling the runtime to launching validators and connecting through Polkadot.js.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
  - [System Requirements](#system-requirements)
  - [Required Software](#required-software)
  - [Verification Steps](#verification-steps)
- [Quick Start for Experienced Users](#quick-start-for-experienced-users)
- [Architecture Overview](#architecture-overview)
- [Detailed Setup Guide](#detailed-setup-guide)
  - [Step 1: Install Dependencies](#step-1-install-dependencies)
  - [Step 2: Install Rust Toolchain](#step-2-install-rust-toolchain)
  - [Step 3: Clone and Build Gear](#step-3-clone-and-build-gear)
  - [Step 4: Generate Chain Specification](#step-4-generate-chain-specification)
  - [Step 5: Update Runtime in Chain Spec](#step-5-update-runtime-in-chain-spec)
  - [Step 6: Generate Validator Configuration](#step-6-generate-validator-configuration)
  - [Step 7: Generate Node Keys](#step-7-generate-node-keys)
  - [Step 8: Convert Chain Spec to Raw Format](#step-8-convert-chain-spec-to-raw-format)
  - [Step 9: Start Validator Network](#step-9-start-validator-network)
- [Validation and Testing](#validation-and-testing)
- [Monitoring and Health Checks](#monitoring-and-health-checks)
- [Troubleshooting](#troubleshooting)
- [Cleanup and Teardown](#cleanup-and-teardown)
- [Security Considerations](#security-considerations)
- [Performance and Resources](#performance-and-resources)
- [Common Use Cases](#common-use-cases)
- [Advanced Configuration](#advanced-configuration)
- [Conclusion](#conclusion)

## Overview

This guide walks you through building and running a local Vara blockchain network for development and testing purposes. While Vara provides testnet and mainnet environments, local development offers complete control over chain parameters, consensus mechanisms, and runtime modifications.

### When to Use This Approach

- **Custom runtime modifications** - Test changes to block time, consensus parameters, or governance
- **Private testing environments** - Develop and test without external network dependencies
- **Performance testing** - Benchmark your programs under controlled conditions
- **Educational purposes** - Learn blockchain internals without risking real assets
- **CI/CD integration** - Automated testing in build pipelines

### Key Benefits

- Full control over all network parameters
- Instant block production for rapid development
- No external dependencies or network connectivity required
- Cost-free testing environment
- Customizable validator count and network topology

## Prerequisites

### System Requirements

- **Operating System**: Linux, macOS, or Windows with WSL2
- **RAM**: Minimum 4GB (8GB+ recommended for multi-validator setups)
- **Storage**: 10GB+ free space
- **CPU**: 2+ cores (4+ recommended for validator networks)

### Required Software

**Container Runtime** (choose one):

- Podman (recommended)
- Docker

> **Note**: Throughout this guide, we use `ghcr.io/gear-tech/node:v1.9.2` as an example. Always check the [latest releases](https://github.com/gear-tech/gear/releases) for the most recent version.

**Development Tools**:

- Git
- Rust toolchain with WASM target
- `jq` (JSON processor)
- `xxd` (hex dump utility)

**Optional but Recommended**:

- Polkadot.js extension for wallet management
- Terminal multiplexer (tmux/screen) for managing multiple nodes

### Verification Steps

```bash
# Verify container runtime
podman --version || docker --version

# Verify Rust installation
rustc --version
rustup target list --installed | grep wasm

# Verify required utilities
jq --version
xxd -v
```

## Quick Start for Experienced Users

If you're already familiar with Substrate-based chains and have all prerequisites installed:

```bash
# 1. Clone and build
git clone https://github.com/gear-tech/gear.git
cd gear
cargo build --release -p vara-runtime --features dev

# 2. Generate chain spec
podman run --rm -v $(pwd):/data ghcr.io/gear-tech/node:v1.9.2 \
  gear build-spec --disable-default-bootnode --chain local > customSpec.json

# 3. Update runtime (example: 5-minute epochs)
sed -i 's/EPOCH_DURATION_IN_BLOCKS: BlockNumber = 2 \* HOURS/EPOCH_DURATION_IN_BLOCKS: BlockNumber = 5 * MINUTES/' \
  runtime/vara/src/constants.rs

# 4. Generate validator setup
COUNT=3 bash generate-for-chain-spec.sh
bash generate-node-keys.sh

# 5. Start network
bash start-local-node.sh

# 6. Connect via Polkadot.js
# Open https://polkadot.js.org and connect to ws://localhost:41000
```

> **Note**: Replace `podman` with `docker` if using Docker. See detailed sections below for explanations and troubleshooting.

## Architecture Overview

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│ Gear Node 1 │◄───────►│ Gear Node 2 │◄───────►│ Gear Node N │
└─────────────┘         └─────────────┘         └─────────────┘
      ▲                       ▲                       ▲
      │                       │                       │
      │     WebSocket         │                       │
      └───────────────────────┴───────────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │  Polkadot.js UI   │
                    └───────────────────┘
```

### Key Components

- **Runtime WASM**: Contains your custom blockchain logic
- **Chain Specification**: Defines network parameters and initial state
- **Validator Nodes**: Produce blocks and maintain consensus
- **Session Keys**: Cryptographic keys for validator operations
- **Consensus Protocol**: BABE (block production) + GRANDPA (finality)

## Detailed Setup Guide

### Step 1: Install Dependencies

#### Ubuntu/Debian

```bash
sudo apt update
sudo apt install -y git clang curl libssl-dev llvm libudev-dev \
  cmake protobuf-compiler jq xxd
```

#### macOS

```bash
# Install Homebrew if necessary
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"

brew update
brew install openssl jq
```

#### Windows (WSL2)

Follow Ubuntu instructions within the WSL2 environment.

**Validation**: Run `git --version && jq --version && xxd -v` to confirm installation.

### Step 2: Install Rust Toolchain

```bash
# Install Rust if not present
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env

# Add WASM target
rustup target add wasm32-unknown-unknown

# Verify installation
rustc --version && rustup target list --installed | grep wasm
```

### Step 3: Clone and Build Gear

```bash
git clone https://github.com/gear-tech/gear.git
cd gear

# Optional: Apply custom patches
# Example: Change epoch duration to 5 minutes
sed -i 's/EPOCH_DURATION_IN_BLOCKS: BlockNumber = 2 \* HOURS/EPOCH_DURATION_IN_BLOCKS: BlockNumber = 5 * MINUTES/' \
  runtime/vara/src/constants.rs

# Verify the change
grep -n "EPOCH_DURATION_IN_BLOCKS" runtime/vara/src/constants.rs

# Build runtime (this will take 10-30 minutes)
cargo build --release -p vara-runtime --features dev

# Verify build output
ls -la target/release/wbuild/vara-runtime/vara_runtime.compact.compressed.wasm
```

**Expected Output**: You should see the WASM file containing the runtime of the network.

---

### Step 4: Generate Chain Specification

```bash
# Generate base specification
podman run --rm -v $(pwd):/data ghcr.io/gear-tech/node:v1.9.2 \
  gear build-spec --disable-default-bootnode --chain local > customSpec.json

# Verify file creation
ls -la customSpec.json
jq '.name' customSpec.json  # Should show "Vara Local Testnet"
```

### Step 5: Update Runtime in Chain Spec

```bash
# Convert WASM to hex
xxd -p target/release/wbuild/vara-runtime/vara_runtime.compact.compressed.wasm | tr -d '\n' > vara_runtime.hex

# Update chain spec with new runtime
jq --rawfile data vara_runtime.hex \
  '.genesis.runtimeGenesis.code="0x" + $data' customSpec.json > customSpec.tmp && \
  mv customSpec.tmp customSpec.json

# Verify update
jq '.genesis.runtimeGenesis.code' customSpec.json | head -c 100  # Should start with "0x"
```

### Step 6: Generate Validator Configuration

Create `generate-for-chain-spec.sh` with the following content:

```bash
#!/bin/sh

COUNT_=${COUNT:-2}

# Initialize arrays
balances_array="[]"
session_keys_array="[]"
stakers_array="[]"
invulnerables_array="[]"

for NODE in `seq 0 $(( $COUNT_ - 1 ))`; do
    echo "Generating configuration for validator $NODE"
    SURI="bottom drive obey lake curtain smoke basket hold race lonely fit walk//validator-$NODE"

    GRANDPA=`podman run --platform linux/amd64 --rm ghcr.io/gear-tech/node:v1.9.2 \
      gear key inspect --output-type json --scheme ed25519 "$SURI" | jq --raw-output .ss58Address`

    STASH=`podman run --platform linux/amd64 --rm ghcr.io/gear-tech/node:v1.9.2 \
      gear key inspect --output-type json "$SURI//stash" | jq --raw-output .ss58Address`

    BABE=`podman run --platform linux/amd64 --rm ghcr.io/gear-tech/node:v1.9.2 \
      gear key inspect --output-type json "$SURI" | jq --raw-output .ss58Address`

    # Add to balances array
    balances_array=$(echo "$balances_array" | jq ". += [[\"$STASH\", 100000000000000], [\"$BABE\", 100000000000000000000]]")

    # Add to session keys array
    session_keys_array=$(echo "$session_keys_array" | jq ". += [[\"$STASH\", \"$STASH\", {\"authority_discovery\": \"$BABE\", \"babe\": \"$BABE\", \"grandpa\": \"$GRANDPA\", \"im_online\": \"$BABE\"}]]")

    # Add to stakers array
    stakers_array=$(echo "$stakers_array" | jq ". += [[\"$STASH\", \"$BABE\", 100000000000000, \"Validator\"]]")

    # Add to invulnerables array
    invulnerables_array=$(echo "$invulnerables_array" | jq ". += [\"$STASH\"]")
done

echo "Generated $COUNT_ validators"
echo "Updating chain specification..."

# Update customSpec.json with all arrays at once
jq -M ".genesis.runtimeGenesis.patch.staking.validatorCount = $COUNT_ | \
  .genesis.runtimeGenesis.patch.balances.balances += $balances_array | \
  .genesis.runtimeGenesis.patch.session.keys = $session_keys_array | \
  .genesis.runtimeGenesis.patch.staking.stakers = $stakers_array | \
  .genesis.runtimeGenesis.patch.staking.invulnerables = $invulnerables_array" \
  customSpec.json > customSpec.tmp && mv customSpec.tmp customSpec.json

echo "Chain specification updated successfully"
```

Run the script:

```bash
chmod +x generate-for-chain-spec.sh
COUNT=3 ./generate-for-chain-spec.sh  # Creates 3 validators
```

### Step 7: Generate Node Keys

Create `generate-node-keys.sh`:

```bash
#!/bin/sh

COUNT_=${COUNT:-2}

for NODE in `seq 0 $(( $COUNT_ - 1 ))`; do
    echo "Generating keys for node-$NODE"
    mkdir -p node-$NODE
    cp ./customSpec.raw ./node-$NODE/

    SURI="bottom drive obey lake curtain smoke basket hold race lonely fit walk//validator-$NODE"

    # Insert session keys
    podman run --platform linux/amd64 --rm -v ./node-$NODE:/base-path \
      ghcr.io/gear-tech/node:v1.9.2 gear key insert \
      --base-path /base-path --chain /base-path/customSpec.raw \
      --scheme Sr25519 --suri "$SURI" --key-type audi

    podman run --platform linux/amd64 --rm -v ./node-$NODE:/base-path \
      ghcr.io/gear-tech/node:v1.9.2 gear key insert \
      --base-path /base-path --chain /base-path/customSpec.raw \
      --scheme Sr25519 --suri "$SURI" --key-type babe

    podman run --platform linux/amd64 --rm -v ./node-$NODE:/base-path \
      ghcr.io/gear-tech/node:v1.9.2 gear key insert \
      --base-path /base-path --chain /base-path/customSpec.raw \
      --scheme Sr25519 --suri "$SURI" --key-type imon

    podman run --platform linux/amd64 --rm -v ./node-$NODE:/base-path \
      ghcr.io/gear-tech/node:v1.9.2 gear key insert \
      --base-path /base-path --chain /base-path/customSpec.raw \
      --scheme Ed25519 --suri "$SURI" --key-type gran

    podman run --platform linux/amd64 --rm -v ./node-$NODE:/base-path \
      ghcr.io/gear-tech/node:v1.9.2 gear key generate-node-key \
      --base-path /base-path --chain /base-path/customSpec.raw
done

echo "Node keys generated successfully"
```

Run the script:

```bash
chmod +x generate-node-keys.sh
./generate-node-keys.sh
```

### Step 8: Convert Chain Spec to Raw Format

```bash
podman run --platform linux/amd64 --rm -v $(pwd):/data \
  ghcr.io/gear-tech/node:v1.9.2 gear build-spec \
  --disable-default-bootnode --chain=/data/customSpec.json --raw > customSpec.raw

# Verify raw spec
ls -la customSpec.raw
jq '.name' customSpec.raw  # Should show "Vara Local Testnet"
```

### Step 9: Start Validator Network

Create `start-local-node.sh`:

```bash
#!/bin/sh

# Configuration
IP='127.0.0.1'  # Use your machine's IP address
BASE_PORT_RPC=41000
BASE_PORT_P2P=42000

echo "Starting local Gear validator network..."

# Start first node (bootnode)
NODE=0
PORT_P2P=$(( $BASE_PORT_P2P + $NODE ))
PORT_RPC=$(( $BASE_PORT_RPC + $NODE ))

echo "Starting bootnode (validator-0) on RPC port $PORT_RPC, P2P port $PORT_P2P"

podman run --replace --platform linux/amd64 --detach --name validator-$NODE \
  -v $(pwd)/node-$NODE:/base-path ghcr.io/gear-tech/node:v1.9.2 \
  gear --base-path /base-path --chain /base-path/customSpec.raw \
  --validator --rpc-cors all --rpc-external --rpc-methods=unsafe \
  --name node-$NODE --rpc-port $PORT_RPC --port $PORT_P2P \
  --no-telemetry --no-prometheus --allow-private-ip --in-peers 256 \
  --no-mdns --no-hardware-benchmarks --state-pruning archive \
  --blocks-pruning archive --public-addr "/ip4/$IP/tcp/$PORT_P2P"

# Wait for bootnode to start
sleep 5

# Get bootnode ID
BOOTNODE_ID=`podman run --platform linux/amd64 -v $(pwd)/node-$NODE:/base-path \
  ghcr.io/gear-tech/node:v1.9.2 gear key inspect-node-key \
  --file /base-path/chains/vara_local_testnet/network/secret_ed25519`

echo "Bootnode ID: $BOOTNODE_ID"

# Start remaining nodes
COUNT_=${COUNT:-2}
for NODE in `seq 1 $(( $COUNT_ - 1 ))`; do
    PORT_P2P=$(( $BASE_PORT_P2P + $NODE ))
    PORT_RPC=$(( $BASE_PORT_RPC + $NODE ))

    echo "Starting validator-$NODE on RPC port $PORT_RPC, P2P port $PORT_P2P"

    podman run --replace --platform linux/amd64 --detach --name validator-$NODE \
      -v $(pwd)/node-$NODE:/base-path ghcr.io/gear-tech/node:v1.9.2 \
      gear --base-path /base-path --chain /base-path/customSpec.raw \
      --validator --rpc-cors all --rpc-external --rpc-methods=unsafe \
      --name validator-$NODE --rpc-port $PORT_RPC --port $PORT_P2P \
      --no-telemetry --no-prometheus --allow-private-ip --in-peers 256 \
      --no-mdns --no-hardware-benchmarks \
      --bootnodes /ip4/$IP/tcp/$BASE_PORT_P2P/p2p/$BOOTNODE_ID \
      --state-pruning archive --blocks-pruning archive
done

echo "All validators started successfully!"
echo "RPC endpoints available at: ws://localhost:41000, ws://localhost:41001, etc."
```

Run the script:

```bash
chmod +x start-local-node.sh
./start-local-node.sh
```

## Validation and Testing

### Check Node Status

```bash
# List running containers
podman ps

# Check logs for first validator
podman logs validator-0 | tail -20

# Look for these key messages:
# - "Idle (1 peers)" - indicates network connectivity
# - "Imported" - shows block production
# - "Starting consensus session" - validator is active
```

### Test RPC Connection

```bash
# Test RPC endpoint (requires curl and jq)
curl -H "Content-Type: application/json" \
  -d '{"id":1,"jsonrpc":"2.0","method":"system_health","params":[]}' \
  http://localhost:41000

# Expected response should show:
# {"jsonrpc":"2.0","result":{"isSyncing":false,"peers":2,"shouldHavePeers":true},"id":1}
```

### Connect via Polkadot.js

1. Open [https://polkadot.js.org/apps](https://polkadot.js.org/apps)
2. Click on the network selector (top left)
3. Choose "Development" → "Local Node"
4. If using custom ports, select "Custom" and enter `ws://localhost:41000`
5. You should see the chain name and block number

## Monitoring and Health Checks

### Key Metrics to Monitor

- **Block Production**: Blocks should be produced regularly
- **Peer Count**: Each node should connect to other validators
- **Finalization**: GRANDPA finality should be working
- **Memory Usage**: Monitor for memory leaks
- **Disk Usage**: Archive nodes store full history

### Useful Monitoring Commands

```bash
# Check all validators are running
podman ps | grep validator

# Monitor logs in real-time
podman logs -f validator-0

# Check network connectivity
for port in 41000 41001 41002; do
    echo "Testing port $port"
    curl -s -H "Content-Type: application/json" \
      -d '{"id":1,"jsonrpc":"2.0","method":"system_health","params":[]}' \
      http://localhost:$port | jq '.result.peers'
done

# Check block height across all nodes
for port in 41000 41001 41002; do
    echo "Node on port $port:"
    curl -s -H "Content-Type: application/json" \
      -d '{"id":1,"jsonrpc":"2.0","method":"chain_getHeader","params":[]}' \
      http://localhost:$port | jq '.result.number'
done
```

### Setting Up Prometheus Monitoring (Optional)

For production-like monitoring, you can enable Prometheus metrics by removing `--no-prometheus` flag and configuring Prometheus to scrape the metrics endpoint.

## Troubleshooting

### Common Issues

#### 1. Port Already in Use

**Error**: `Address already in use`

**Solution**:

```bash
# Find process using port
sudo lsof -i :41000
# Kill process or change port in start script
```

#### 2. Container Startup Failures

**Error**: `Error: unable to start container`

**Solution**:

```bash
# Check container logs
podman logs validator-0

# Check disk space
df -h

# Check memory usage
free -h
```

#### 3. Nodes Not Connecting

**Error**: `0 peers` or `Syncing 0 peers`

**Solution**:

```bash
# Verify bootnode ID is correct
podman run --platform linux/amd64 -v $(pwd)/node-0:/base-path \
  ghcr.io/gear-tech/node:v1.9.2 gear key inspect-node-key \
  --file /base-path/chains/vara_local_testnet/network/secret_ed25519

# Check network connectivity between containers
# Ensure all nodes use the same IP address in startup script
```

#### 4. Chain Spec Issues

**Error**: `Chain specification is invalid`

**Solution**:

```bash
# Verify JSON syntax
jq . customSpec.json > /dev/null && echo "Valid JSON" || echo "Invalid JSON"

# Check required fields are present
jq '.genesis.runtimeGenesis | keys' customSpec.json
```

#### 5. Runtime WASM Issues

**Error**: `Runtime construction failed`

**Solution**:

```bash
# Verify WASM file exists and is valid
ls -la target/release/wbuild/vara-runtime/vara_runtime.compact.compressed.wasm
file target/release/wbuild/vara-runtime/vara_runtime.compact.compressed.wasm

# Rebuild runtime if necessary
cargo build --release -p vara-runtime --features dev
```

### Getting Help

- **Check logs first**: `podman logs validator-0 | tail -50`
- **Verify file permissions**: `ls -la node-0/`
- **Check system resources**: `htop` or `top`
- **Gear Discord**: Join the [official Gear Discord](https://discord.gg/gear) for community support
- **GitHub Issues**: Report bugs at [https://github.com/gear-tech/gear/issues](https://github.com/gear-tech/gear/issues)

## Cleanup and Teardown

### Stop Network Gracefully

Create `stop-local-node.sh`:

```bash
#!/bin/sh

echo "Stopping local Gear validator network..."

# Stop and remove all validator containers
for NODE in $(podman ps --format "{{.Names}}" | grep validator); do
    echo "Stopping $NODE"
    podman stop $NODE
    podman rm $NODE
done

echo "All validators stopped and removed"
```

Run:

```bash
chmod +x stop-local-node.sh
./stop-local-node.sh
```

### Complete Cleanup

```bash
# Remove all generated files
rm -rf node-*/ customSpec.* vara_runtime.hex

# Optional: Remove built runtime
rm -rf target/release/wbuild/

# Optional: Remove cloned repository
cd ..
rm -rf gear/

# Remove container images (if no longer needed)
podman rmi ghcr.io/gear-tech/node:v1.9.2
```

### Data Backup (Optional)

Before cleanup, you might want to back up:

```bash
# Chain state
cp -r node-0/chains/ ~/gear-backup/

# Keys
cp -r node-0/keystore/ ~/gear-backup/

# Logs
podman logs validator-0 > validator-0.log
```

## Security Considerations

### ⚠️ Important Security Warnings

- **Unsafe RPC Methods**: The `--rpc-methods=unsafe` flag enables dangerous RPC calls. Never use this in production.
- **CORS Settings**: `--rpc-cors all` allows cross-origin requests from any domain. Restrict this in production.
- **Private Keys**: The mnemonic `bottom drive obey lake curtain smoke basket hold race lonely fit walk` is publicly known. Never use this for mainnet or valuable testnet assets.
- **Network Isolation**: Run local networks in isolated environments to prevent accidental connections to mainnet.
- **Port Exposure**: Be careful about exposing RPC ports to public networks.

### Best Practices

```bash
# Use specific CORS origins instead of "all"
--rpc-cors "https://polkadot.js.org"

# Restrict RPC methods in production
--rpc-methods safe

# Use proper firewall rules
# Allow only specific IP ranges
# Block external access to validator ports

# Regular security updates
podman pull ghcr.io/gear-tech/node:v1.9.2  # Get latest security patches
```

## Performance and Resources

### Resource Requirements by Network Size

| Validators | CPU Cores | RAM (GB) | Storage (GB/day) | Network |
| ---------- | --------- | -------- | ---------------- | ------- |
| 1          | 2         | 4        | 1-2              | Local   |
| 3          | 4         | 8        | 3-5              | Local   |
| 6          | 8         | 16       | 6-10             | Local   |
| 12         | 16        | 32       | 12-20            | LAN     |

### Performance Optimization Tips

- Use SSD storage for better I/O performance
- Increase container memory limits for large networks
- Use state pruning for non-archive nodes (`--state-pruning 256`)
- Limit peer connections if network becomes unstable (`--in-peers 50`)
- Monitor system resources and adjust validator count accordingly

### Benchmarking Your Setup

```bash
# Measure block production time
curl -s -H "Content-Type: application/json" \
  -d '{"id":1,"jsonrpc":"2.0","method":"chain_getBlock","params":[]}' \
  http://localhost:41000 | jq '.result.block.header.timestamp'

# Monitor transaction throughput
# Use Polkadot.js to submit multiple transactions and measure processing time

# Test finality speed
# GRANDPA should finalize blocks within 2-3 seconds of production
```

## Common Use Cases

### 1. Smart Contract Development

- Deploy test contracts locally
- Test contract interactions
- Debug contract execution
- Measure gas consumption

### 2. Runtime Development

- Test runtime upgrades
- Experiment with governance parameters
- Debug consensus issues
- Validate economic models

### 3. Integration Testing

- Test dApp frontend connectivity
- Simulate network conditions
- Test wallet integrations
- Validate transaction flows

### 4. Educational Purposes

- Learn blockchain consensus
- Understand validator mechanics
- Experiment with cryptography
- Study network protocols

### 5. CI/CD Pipelines

- Automated contract testing
- Regression testing
- Performance benchmarking
- Integration testing

## Advanced Configuration

### Custom Runtime Modifications

Beyond epoch duration, you can modify:

- **Block time**: Change `MILLISECS_PER_BLOCK` in constants
- **Governance parameters**: Voting periods, thresholds
- **Staking rewards**: Inflation rate, validator set size
- **Transaction fees**: Weight calculations, fee multipliers
- **Account balances**: Initial token distribution

### Network Topology Options

- **Single node**: Simplest setup for development
- **Multi-validator**: Test consensus and finality
- **Bootnode topology**: Star network with central bootnode
- **Mesh network**: All nodes connect to each other
- **Hybrid setups**: Mix of validator and full nodes

### Integration with External Tools

- **Prometheus/Grafana**: Advanced monitoring
- **Kubernetes**: Container orchestration
- **Docker Compose**: Multi-container management
- **Terraform**: Infrastructure as code
- **Ansible**: Configuration management
- **Gear IDEA**: You can point [Gear IDEA](https://idea.gear-tech.io/) to your custom network and get a user-friendly UX for interacting with the network.

## Conclusion

Running a local Vara chain is one of the most effective ways to experiment safely and understand how different components interact. Once everything is configured, it becomes a flexible tool for contract testing, runtime upgrades, and integration checks.

### Remember to:

- ✅ Always validate each step before proceeding
- ✅ Monitor your network's health regularly
- ✅ Follow security best practices
- ✅ Clean up resources when finished
- ✅ Keep software updated for security patches

### For more details and community help:

- Visit the [Gear Documentation](https://docs.gear.foundation/) for technical guidance
- Explore the [GitHub repository](https://github.com/gear-tech/gear) to track updates or report issues
- Connect with developers in the [Gear Discord community](https://discord.gg/gear)

Happy building! 🚀
