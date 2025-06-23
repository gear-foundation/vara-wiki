---
sidebar_position: 9
---

# Gas Reservation

Gas reservation is a powerful feature of the Gear Protocol that enables a new approach to programming and modern [use cases](/docs/about/features/message-automation.md).

Briefly, a program can send a message using gas that was reserved beforehand instead of using gas from the currently processing message.

One of the key advantages of this feature is the ability to send [messages delayed](/docs/build/gstd/delayed-messages.md) in time automatically to any actor in the network, whether it is a user, another program, or even **itself**. In fact, a program can execute itself **an unlimited** number of blocks, provided that enough gas for execution is kept available.

A program developer can provide a special function in the program's code that takes a defined amount of gas from the amount available to the program and reserves it. A reservation gets a unique identifier that can be used by the program to retrieve this reserved gas and use it later.

To reserve the amount of gas for future use, use the [`ReservationId::reserve`](https://docs.rs/gstd/latest/gstd/trait.ReservationIdExt.html#tymethod.reserve) function:

```rust
let reservation_id = ReservationId::reserve(RESERVATION_AMOUNT, TIME)
    .expect("Reservation across executions");
```

The block count within which the reserve must be used also has to be specified. Gas reservation is not free; reserving gas for one block costs some gas. The `reserve` function returns a [`ReservationId`](https://docs.rs/gstd/latest/gstd/struct.ReservationId.html), which can be used for sending a message with that gas. To send a message using the reserved gas:

```rust
msg::send_from_reservation(reservation_id, program, payload, value)
    .expect("Failed to send message from reservation");
```

If gas is not needed within the time specified during the reservation, it can be unreserved and the gas will be returned to the user who made the reservation.

```rust
id.unreserve().expect("Unreservation across executions");
```

Programs can have different executions, change state, and evolve in various ways, but when necessary, a program can send a message using the reserved gas instead of its own gas.

For example, consider a game that works entirely on-chain. The players are programs that compete with each other by implementing various playing strategies. Typically, in these types of games, there is a master program that starts the game and controls the move order between the players.

To start the game, someone sends a message to the program. The gas attached to this message is spent on the players' programs, which in turn spend gas on their execution. Since the game can last many rounds, the attached gas may not be enough to complete the game. Instead of sending a message asking the program to continue the game, gas reservation can be used to make the play fully automatic.

Using gas reservation, the program will be able to run the game without interruption.