---
sidebar_label: Galactic Express
sidebar_position: 7
---

# Galactic Express Game

![galactic-express](../img/galactic-express.png)

Galactic Express is a game in which players guide a rocket into space, testing its endurance as it collides with random obstacles. An unpredictable and exciting journey, it challenges players to test their luck and adapt to ever-changing obstacles.

Taking their luck into their own hands, players guide a rocket into outer space, facing challenges such as dynamic weather conditions and varied flight circumstances, making each gameplay experience an exciting adventure.
Players' strategic decisions about fuel allocation and target gains significantly affect the rocket's path, making each playthrough of the game unique.

The article explains the programming interface, data structure, basic functions and explains their purpose. It can be used as is or modified to suit your own scenarios. Anyone can easily create their own application and run it on the Vara Network.
The source code, developed using the [Sails](../../build/sails/sails.mdx) framework, is available on [GitHub](https://github.com/gear-foundation/dapps/tree/master/contracts/galactic-express).

Everyone can play the game via this link - [Play Galactic Express](https://galactic-express.vara.network/). The game supports several simultaneous game sessions (lobbies). To start a new game, click the <kbd>Create game</kbd> button and share your account's public key with other players. To join your game, players need to click the <kbd>Find game</kbd> button and enter your account ID there.

## How to run the app locally

1. Build a program
> Additional details regarding this matter can be located within the [README](https://github.com/gear-foundation/dapps/tree/master/contracts/galactic-express/README.md) directory of the program.

2. Upload the program to the [Vara Network Testnet](https://idea.gear-tech.io/programs?node=wss%3A%2F%2Ftestnet.vara.network)
> Further details regarding the process of program uploading can be located within the [Getting Started](/docs/getting-started-in-5-minutes#deploy-your-program-to-the-testnet) section.

3. Build and run user interface
> More information about this can be found in the [README](https://github.com/gear-foundation/dapps/blob/master/frontend/apps/galactic-express/README.md) directory of the frontend.

## Implementation details

### Program description

The program contains the following information

```rust title="galactic-express/app/src/services/galactic_express/mod.rs"
pub struct Storage {
    games: HashMap<ActorId, Game>,
    player_to_game_id: HashMap<ActorId, ActorId>,
    dns_info: Option<(ActorId, String)>,
    admin: ActorId,
}
```
* `games` - list of all games according to the address of the game's creator
* `player_to_game_id` - list of players and the games in which they participate
* `dns_info` -  optional field that stores the [dDNS](../Infra/dein.md) address and the program name
* `admin` - game admin

Where the `Game` is as follows:

```rust title="galactic-express/app/src/services/galactic_express/mod.rs"
pub struct Game {
    admin: ActorId,
    admin_name: String,
    bid: u128,
    altitude: u16,
    weather: Weather,
    reward: u128,
    stage: Stage,
}
```

* `admin` - game administrator's address
* `admin_name` - administrator name
* `bid` - gaming bet 
* `altitude` - flight altitude of the session
* `weather` - session weather conditions
* `reward` - session award
* `stage` - current state of play

There are two possible states: one during the registration stage and the other when the final results are already available

```rust title="galactic-express/app/src/services/galactic_express/utils.rs"
pub enum Stage {
    Registration(HashMap<ActorId, Participant>),
    Results(Results),
}
```

The `Participant` structure stores information about its address, name, fuel and payload amount

```rust title="galactic-express/app/src/services/galactic_express/utils.rs"
pub struct Participant {
    pub id: ActorId,
    pub name: String,
    pub fuel_amount: u8,
    pub payload_amount: u8,
}
```

The `Results` record all possible events during the players' turns, the number of scores they have earned and information about the participants

```rust title="galactic-express/app/src/services/galactic_express/utils.rs"
pub struct Results {
    pub turns: Vec<Vec<(ActorId, Turn)>>,
    pub rankings: Vec<(ActorId, u128)>,
    pub participants: Vec<(ActorId, Participant)>,
}
```

In flight, a rocket can either use up some amount of fuel or be destroyed by various space conditions, which are described in `HaltReason`

```rust title="galactic-express/app/src/services/galactic_express/utils.rs"
pub enum Turn {
    Alive { fuel_left: u8, payload_amount: u8 },
    Destroyed(HaltReason),
}
// ...
pub enum HaltReason {
    PayloadOverload,
    FuelOverload,
    SeparationFailure,
    AsteroidCollision,
    FuelShortage,
    EngineFailure,
}
```

### Initialization

To initialize the game program, a DNS address and name can be specified.

```rust title="galactic-express/app/src/services/galactic_express/mod.rs"
   pub async fn init(dns_id_and_name: Option<(ActorId, String)>) -> Self {
        unsafe {
            STORAGE = Some(Storage {
                dns_info: dns_id_and_name.clone(),
                admin: msg::source(),
                ..Default::default()
            });
        }

        if let Some((id, name)) = dns_id_and_name {
            let request = [
                "Dns".encode(),
                "AddNewProgram".to_string().encode(),
                (name, exec::program_id()).encode(),
            ]
            .concat();

            msg::send_bytes_with_gas_for_reply(id, request, 5_000_000_000, 0, 0)
                .expect("Error in sending message")
                .await
                .expect("Error in `AddNewProgram`");
        }
        Self(())
    }
```

### Action

```rust title="galactic-express/app/src/services/galactic_express/mod.rs"
    pub fn create_new_session(&mut self, name: String);
    pub fn cancel_game(&mut self);
    pub fn leave_game(&mut self);
    pub fn register(&mut self, creator: ActorId, participant: Participant);
    pub fn cancel_register(&mut self);
    pub fn delete_player(&mut self, player_id: ActorId);
    pub fn start_game(&mut self, fuel_amount: u8, payload_amount: u8);
    pub fn change_admin(&mut self, new_admin: ActorId);
    pub async fn kill(&mut self, inheritor: ActorId);
```

### Event

```rust title="galactic-express/app/src/services/galactic_express/mod.rs"
pub enum Event {
    GameFinished(Results),
    NewSessionCreated {
        altitude: u16,
        weather: Weather,
        reward: u128,
        bid: u128,
    },
    Registered(ActorId, Participant),
    RegistrationCanceled,
    PlayerDeleted {
        player_id: ActorId,
    },
    GameCanceled,
    GameLeft,
    AdminChanged {
        new_admin: ActorId,
    },
    Killed {
        inheritor: ActorId,
    },
}

```

### Logic

A new game session must be set up using `create_new_session` to start the game.

Upon the inception of a new session, random values, encompassing aspects like weather conditions, altitude settings, fuel prices, and potential rewards, are dynamically generated.

```rust title="galactic-express/app/src/services/galactic_express/funcs.rs"
pub fn register(
    storage: &mut Storage,
    creator: ActorId,
    participant: Participant,
) -> Result<Event, GameError> {
    let msg_source = msg::source();
    let msg_value = msg::value();
    let reply = register_for_session(storage, creator, participant, msg_source, msg_value);
    if reply.is_err() {
        send_value(msg_source, msg_value);
    }
    reply
}

fn register_for_session(
    storage: &mut Storage,
    creator: ActorId,
    participant: Participant,
    msg_source: ActorId,
    msg_value: u128,
) -> Result<Event, GameError> {
    if storage.player_to_game_id.contains_key(&msg_source) {
        return Err(GameError::SeveralRegistrations);
    }

    if let Some(game) = storage.games.get_mut(&creator) {
        if msg_value != game.bid {
            return Err(GameError::WrongBid);
        }
        if let Stage::Results(_) = game.stage {
            return Err(GameError::SessionEnded);
        }

        let participants = game.stage.mut_participants()?;

        if participants.contains_key(&msg_source) {
            return Err(GameError::AlreadyRegistered);
        }

        if participants.len() >= MAX_PARTICIPANTS - 1 {
            return Err(GameError::SessionFull);
        }

        participant.check()?;
        participants.insert(msg_source, participant.clone());
        storage.player_to_game_id.insert(msg_source, creator);

        Ok(Event::Registered(msg_source, participant))
    } else {
        Err(GameError::NoSuchGame)
    }
}
```
This function `register_for_session` checks the game stage, the number of registered players and the participant's input data.

Input values of fuel and payload cannot be exceeded by predetermined values

```rust title="galactic-express/app/src/services/galactic_express/utils.rs"
// maximum fuel value that can be entered by the user
pub const MAX_FUEL: u8 = 100;
// maximum payload value that can be entered by the user
pub const MAX_PAYLOAD: u8 = 100;
// ...
impl Participant {
    pub fn check(&self) -> Result<(), GameError> {
        if self.fuel_amount > MAX_FUEL || self.payload_amount > MAX_PAYLOAD {
            Err(GameError::FuelOrPayloadOverload)
        } else {
            Ok(())
        }
    }
}
```

After players have successfully registered, the admin can initiate the game using the `start_game` function. This function involves several checks on the admin, the number of participants, and their data.

```rust title="galactic-express/app/src/services/galactic_express/funcs.rs"
pub fn start_game(
    storage: &mut Storage,
    fuel_amount: u8,
    payload_amount: u8,
) -> Result<Event, GameError> {
    let msg_source = msg::source();

    let game = storage
        .games
        .get_mut(&msg_source)
        .ok_or(GameError::NoSuchGame)?;

    if fuel_amount > MAX_FUEL || payload_amount > MAX_PAYLOAD {
        return Err(GameError::FuelOrPayloadOverload);
    }
    let participant = Participant {
        id: msg_source,
        name: game.admin_name.clone(),
        fuel_amount,
        payload_amount,
    };

    let participants = game.stage.mut_participants()?;

    if participants.is_empty() {
        return Err(GameError::NotEnoughParticipants);
    }
    participants.insert(msg_source, participant);

    let mut random = Random::new()?;
    let mut turns = HashMap::new();
// ...
```

Turns are automatically and randomly generated for each participant, which include three tests of luck.

These moves include both events beyond the control of the participant and events that could occur if the participant decides to take a risk by specifying more fuel and payload. More details about the math of the game can be found in the [README](https://github.com/gear-foundation/dapps/tree/master/contracts/galactic-express#math)

```rust title="galactic-express/app/src/services/galactic_express/funcs.rs"
fn turn(
    turn: usize,
    remaining_fuel: u8,
    random: &mut Random,
    weather: Weather,
    payload: u8,
) -> Result<u8, HaltReason> {
    let new_remaining_fuel =
        match remaining_fuel.checked_sub((payload + 2 * weather as u8) / TURNS as u8) {
            Some(actual_fuel) => actual_fuel,
            None => return Err(HaltReason::FuelShortage),
        };

    match turn {
        0 => {
            // values in "chance" are transmitted as percentages
            if random.chance(3) {
                return Err(HaltReason::EngineFailure);
            }
            // this trap for someone who specified a lot of fuel
            if remaining_fuel >= PENALTY_LEVEL - 2 * weather as u8 && random.chance(10) {
                return Err(HaltReason::FuelOverload);
            }
        }
        1 => {
            // this trap for someone who specified a lot of payload
            if payload >= PENALTY_LEVEL - 2 * weather as u8 && random.chance(10) {
                return Err(HaltReason::PayloadOverload);
            }

            if random.chance(5 + weather as u8) {
                return Err(HaltReason::SeparationFailure);
            }
        }
        2 => {
            if random.chance(10 + weather as u8) {
                return Err(HaltReason::AsteroidCollision);
            }
        }
        _ => unreachable!(),
    }

    Ok(new_remaining_fuel)
}
```

If a participant crashes for any reason, the player receives zero points and, accordingly, loses the game. If the player successfully completes all three parts of the game, the points are counted to determine the winner.

```rust title="galactic-express/app/src/services/galactic_express/funcs.rs"
let mut scores: Vec<(ActorId, u128)> = turns
    .iter()
    .map(|(actor, turns)| {
        let last_turn = turns.last().expect("there must be at least 1 turn");

        (
            *actor,
            match last_turn {
                Turn::Alive {
                    fuel_left,
                    payload_amount,
                } => (*payload_amount as u128 + *fuel_left as u128) * game.altitude as u128,
                Turn::Destroyed(_) => 0,
            },
        )
    })
    .collect();
```

## Query

```rust title="galactic-express/app/src/services/galactic_express/mod.rs"
    pub fn get_game(&self, player_id: ActorId) -> Option<GameState> {
        let storage = self.get();
        storage
            .player_to_game_id
            .get(&player_id)
            .and_then(|creator_id| storage.games.get(creator_id))
            .map(|game| {
                let stage = match &game.stage {
                    Stage::Registration(participants_data) => {
                        StageState::Registration(participants_data.clone().into_iter().collect())
                    }
                    Stage::Results(results) => StageState::Results(results.clone()),
                };

                GameState {
                    admin: game.admin,
                    admin_name: game.admin_name.clone(),
                    altitude: game.altitude,
                    weather: game.weather,
                    reward: game.reward,
                    stage,
                    bid: game.bid,
                }
            })
    }
    pub fn all(&self) -> State {
        self.get().into()
    }
    pub fn admin(&self) -> &'static ActorId {
        &self.get().admin
    }
    pub fn dns_info(&self) -> &'static Option<(ActorId, String)> {
        &self.get().dns_info
    }
```

- `get_game(&self, player_id: ActorId)`: Retrieves the game state for a specific player based on their `player_id`

- `all(&self)`: Provides the overall state of the storage

- `admin(&self)`: Returns the admin’s `ActorId`

- `dns_info(&self)`: Returns the optional dDNS information, including the dDNS address and program name, if available.

## Source code

The source code of this example of Galactic-Express Game program and the example of an implementation of its testing is available on [gear-foundation/dapp/contracts/galactic-express](https://github.com/gear-foundation/dapps/tree/master/contracts/galactic-express).

See also an example of the program testing implementation based on `gtest`: [gear-foundation/dapps/galactic-express/tests](https://github.com/gear-foundation/dapps/tree/master/contracts/galactic-express/app/tests).

For more details about testing programs written on Vara, refer to the [Program Testing](/docs/build/testing) article.
