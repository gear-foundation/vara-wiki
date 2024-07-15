---
sidebar_label: Node as a Service
sidebar_position: 2
---

# Configuring a Node as a Linux Service

## Prerequisites

Download or compile the `gear` executable file for the operating system. [See more](/docs/node/node.mdx#install-with-pre-built-binary)

## Configuration

Copy the `gear` executable to the `/usr/bin` directory:

```bash
sudo cp gear /usr/bin
```

To run the Vara node as a Linux service, configure the systemd file:

```bash
cd /etc/systemd/system
sudo nano gear-node.service
```

Configure and save:

```toml
[Unit]
Description=Vara Node
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/
ExecStart=/usr/bin/gear --name "NODE_NAME" --telemetry-url "wss://telemetry.rs/submit 0"
Restart=always
RestartSec=3
LimitNOFILE=10000

[Install]
WantedBy=multi-user.target
```

:::note
The `ExecStart` declaration points to the location of the `gear` binary file. In this case, it is in the `/usr/bin` directory. Additional launch parameters can be added after `--` but are not mandatory.
:::

## Starting the Node

Run the following command to start the service:

```sh
sudo systemctl start gear-node
```

Enable the service to start on boot:

```sh
sudo systemctl enable gear-node
```

Check the status of the gear-node service:

```sh
sudo systemctl status gear-node
```

## Checking Logs

To view the service logs, run:

```sh
journalctl -u gear-node
```

Use navigation keys to browse the logs and the <kbd>q</kbd> key to exit.

View the last 50 lines of logs by adding the `-n 50` parameter:

```sh
journalctl -u gear-node -n 50
```

See the last lines of logs in continuous mode (press Ctrl+C to exit):

```sh
journalctl -u gear-node -fn 50
```

## Updating the Node to a New Version

After running the node for a while, updating to the latest version may be necessary.

Replace the node executable (`gear`) with the latest version and restart the service. For example, if the Linux executable is located at `/usr/bin/gear` (as configured above), run:

```sh
curl https://get.gear.rs/gear-v1.1.1-x86_64-unknown-linux-gnu.tar.xz | sudo tar -xJC /usr/bin
sudo systemctl restart gear-node
```

## Removing the Node

If running the node is no longer needed, completely purge it from the disk.

:::warning
Once the node is deleted, it cannot be fully restored. Refer to the [Backup and Restore](/docs/node/backup-restore) article for important data backup information.
:::

Remove the node's storage, the service configuration, and the executable:

```sh
sudo systemctl stop gear-node
sudo systemctl disable gear-node
sudo rm -rf /root/.local/share/gear
sudo rm /etc/systemd/system/gear-node.service
sudo rm /usr/bin/gear
```
