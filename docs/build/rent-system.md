---
sidebar_label: Program Rent
sidebar_position: 12
sidebar_class_name: hidden
---

# Program Rent

Vara Network utilizes a rent-based program management system. When developers upload a program to the network, an expiration date is assigned. The expiration period is measured in blocks.

After the expiration date, the program is automatically removed from storage unless the owner chooses to extend its life by paying rent. The owner must indicate the number of additional blocks they want to pay for and provide the rent in utility tokens to keep the program active beyond its initial expiration date.

:::info
Current initial rent period: ***5,000,000*** blocks (approximately 173 days on Vara).
:::

After uploading a program, a similar event can be observed:

`gear.ProgramChanged`

```json
{
    "id": "0xde76e4cf663ff825d94944d6f060204e83fbb5e24f8dfdbbdc25842df4f4135d",
    "change": {
        "Active": {
            "expiration": "12,834,248"
        }
    }
}
```

## How to Extend the Rent of the Program

To extend the rent period of a program, call the special extrinsic `gear.payProgramRent(programId, blockCount)`. [See more](/docs/api/program-rent)

## Restoring a Deleted Program

Since the blockchain stores all states for the entire history, it is possible to restore the program's state to the previous block before it was deleted.

## Reasons for Using the Program Rent System on Vara

- Optimization and efficient resource usage
- Stimulating utility token usage