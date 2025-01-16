---
sidebar_label: Dynamic NFT
sidebar_position: 3
---

# Gear Dynamic Non-Fungible Token

### Introduction
This is an extension of standard [Vara Non-Fungible token](/docs/examples/Standards/vnft.md). It proposes an additional dynamic part that can change or evolve over time. The source code of the Gear NFT smart contract example is available on [GitHub](https://github.com/gear-foundation/dapps/tree/master/contracts/dynamic-nft).

### Motivation

Unlike traditional NFTs that represent a static digital asset, dynamic NFTs can have various attributes, properties, or behaviors that can be modified based on certain conditions or user interactions. These changes can be triggered by external factors such as market demand, user preferences, or even real-world events. For example, a dynamic NFT representing a digital artwork may change its appearance or color scheme based on the time of day or weather conditions.

This example demonstrates Gear Protocol's unique features enabling the new user experience for totally on-chain, truly decentralized applications that do not require centralized components. [Delayed messages](/build/gstd/delayed-messages.md) allows the contract to wake itself after a specified period of time. 

:::tip
The project code is developed using the [Sails](../../build/sails/sails.mdx) framework.
:::

:::note
This contract is an extended version of the standard [vNFT](/docs/examples/Standards/vnft.md). This article focuses solely on the additional features and fields that differentiate it from the basic implementation.
:::

## Token Metadata changes

The metadata of a token is defined by the TokenMetadata structure:

```rust title="dynamic-nft/app/src/services/dynamic_nft/mod.rs"
pub struct TokenMetadata {
    pub name: String,
    pub description: String,
    pub current_media_index: u64,
    pub media: Vec<String>,
    pub reference: String,
}
```
- `name`: A descriptive name for the token
- `description`: A detailed explanation or context for the token
- `current_media_index`: Indicates the currently active media in the media list
- `media`: A collection of URLs pointing to associated media, ideally stored in decentralized, content-addressed storage like IPFS
- `reference`: A URL to an off-chain JSON file containing additional information about the token

As the metadata updates, the `current_media_index` will increment, cycling through the list of media URLs in the media field. This dynamic behavior enables the token to evolve visually or contextually over time, enhancing its interactivity and adaptability.

## Additional Functions

```
  StartMetadataUpdate(updates_count, update_period_in_blocks, token_id)
  UpdateMetadata(token_id, owner, update_period, updates_count)
```

## Additional Events

```
    MetadataStartedUpdaing(updates_count, update_period_in_blocks, token_id);
    MetadataUpdated(token_id, current_media_index);
```

## Additional Methods

### `Start Metadata Update`

This function starts a scheduled process to update the metadata of a specific token periodically. It validates the request, checks the token's ownership, and then initializes the metadata update sequence. If multiple updates are required, it schedules delayed messages to execute subsequent updates automatically.

```rust title="dynamic-nft/app/src/services/dynamic_nft/mod.rs"
pub fn start_metadata_update(
        &mut self,
        updates_count: u32,
        update_period_in_blocks: u32,
        token_id: TokenId,
    ) {
        let msg_src = msg::source();
        if updates_count == 0 {
            panic!("Updates count cannot be zero")
        }
        if update_period_in_blocks == 0 {
            panic!("Updates period cannot be zero")
        }
        services::utils::panicking(|| {
            funcs::start_metadata_update(
                self.get().gas_for_one_time_updating,
                Storage::owner_by_id(),
                &mut self.get_mut().token_metadata_by_id,
                token_id,
                msg_src,
                updates_count,
                update_period_in_blocks,
            )
        });
        self.notify_on(Event::MetadataStartedUpdaing {
            updates_count,
            update_period_in_blocks,
            token_id,
        })
        .expect("Notification Error");
    }

```

```rust title="dynamic-nft/app/src/services/dynamic_nft/funcs.rs"
pub fn start_metadata_update(
    gas_for_one_time_updating: u64,
    owner_by_id: &mut HashMap<TokenId, ActorId>,
    token_metadata_by_id: &mut HashMap<TokenId, TokenMetadata>,
    token_id: TokenId,
    msg_src: ActorId,
    updates_count: u32,
    update_period: u32,
) -> Result<()> {
    let owner = owner_by_id.get(&token_id).ok_or(Error::TokenDoesNotExist)?;

    if *owner != msg_src {
        return Err(Error::DeniedAccess);
    }
    let metadata = token_metadata_by_id
        .get_mut(&token_id)
        .ok_or(Error::TokenDoesNotExist)?;
    metadata.current_media_index =
        metadata.current_media_index.saturating_add(1) % metadata.media.len() as u64;
    if updates_count.saturating_sub(1) != 0 {
        let request = [
            "DynamicNft".encode(),
            "UpdateMetadata".to_string().encode(),
            (token_id, msg_src, update_period, updates_count - 1).encode(),
        ]
        .concat();
        msg::send_bytes_with_gas_delayed(
            exec::program_id(),
            request,
            gas_for_one_time_updating.saturating_mul(updates_count.into()),
            0,
            update_period,
        )
        .expect("Error in sending message");
    }

    Ok(())
}
```

**Key Steps**:

- Validation: Ensures updates_count and update_period_in_blocks are greater than zero
- Ownership Check: Confirms that the caller is the token's owner
- Metadata Update: Updates the `current_media_index` of the token's metadata
- Scheduling Updates: If more updates are needed, schedules delayed messages to handle the remaining updates

### `Update Metadata`

This function handles the actual metadata update for a token. It cycles through available metadata options and triggers further updates if required. Ownership verification ensures that only authorized requests proceed.

```rust title="dynamic-nft/app/src/services/dynamic_nft/mod.rs"
    pub fn update_metadata(
        &mut self,
        token_id: TokenId,
        owner: ActorId,
        update_period: u32,
        updates_count: u32,
    ) {
        if msg::source() != exec::program_id() {
            panic!("This message can only be sent by the programme")
        }

        let current_media_index = services::utils::panicking(|| {
            funcs::update_metadata(
                Storage::owner_by_id(),
                &mut self.get_mut().token_metadata_by_id,
                token_id,
                owner,
                update_period,
                updates_count,
            )
        });
        self.notify_on(Event::MetadataUpdated { token_id, current_media_index })
            .expect("Notification Error");
    }
```

```rust title="dynamic-nft/app/src/services/dynamic_nft/funcs.rs"
pub fn update_metadata(
    owner_by_id: &mut HashMap<TokenId, ActorId>,
    token_metadata_by_id: &mut HashMap<TokenId, TokenMetadata>,
    token_id: TokenId,
    owner: ActorId,
    update_period: u32,
    updates_count: u32,
) -> Result<u64> {
    let current_owner = owner_by_id.get(&token_id).ok_or(Error::TokenDoesNotExist)?;

    if owner != *current_owner {
        return Err(Error::DeniedAccess);
    }

    let metadata = token_metadata_by_id
        .get_mut(&token_id)
        .ok_or(Error::TokenDoesNotExist)?;
    metadata.current_media_index =
        metadata.current_media_index.saturating_add(1) % metadata.media.len() as u64;

    if updates_count.saturating_sub(1) != 0 {
        let request = [
            "DynamicNft".encode(),
            "UpdateMetadata".to_string().encode(),
            (token_id, owner, update_period, updates_count - 1).encode(),
        ]
        .concat();

        msg::send_bytes_with_gas_delayed(
            exec::program_id(),
            request,
            exec::gas_available().saturating_sub(1_000_000_000),
            0,
            update_period,
        )
        .expect("Error in sending message");
    }

    Ok(metadata.current_media_index )
}
```

**Key Steps**:

- Validation: Confirms that the message source is the contract itself (enforcing controlled execution)
- Ownership Check: Verifies that the provided owner matches the token's registered owner
- Metadata Update: Cycles to the next metadata option by incrementing `current_media_index`
- Scheduling Updates: If additional updates are pending, schedules the next update via a delayed message

## Source code

The source code of this example program and the example of an implementation of its testing is available on [gear-foundation/dapp/contracts/dynamic-nft](https://github.com/gear-foundation/dapps/tree/master/contracts/dynamic-nft).

See also an example of the smart contract testing implementation based on `gtest`: [gear-foundation/contracts/dynamic-nft/tests](https://github.com/gear-foundation/dapps/tree/master/contracts/dynamic-nft/tests).

For more details about testing programs written on Gear, refer to the [Program Testing](/docs/build/testing) article.


