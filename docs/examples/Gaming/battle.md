---
sidebar_label: Battle
sidebar_position: 6
---

# Battle Game

The Battle game is a strategic, turn-based PvP (player-versus-player) game where players compete in combat rounds, using moves like attacks, dodges, and special abilities to outmaneuver and defeat their opponents. Each player’s stats, including attack, defense, and dodge skills, affect their chance of success in the match. The game offers a dynamic experience where players build up their characters and participate in battles to achieve victory.

This project introduces unique features, such as [gas reservations](/docs/build/gstd/gas-reservation.md) and [delayed messaging](/docs/build/gstd/delayed-messages.md), to make the gameplay more automated and engaging. Gas reservation ensures that each player reserves the necessary resources to cover the gas costs of their moves in advance, maintaining the fluidity of the game even when players might not make a move on time. Delayed messages then trigger automated actions if a player doesn't make their move within the time limit, ensuring that the match progresses without interruptions. This setup keeps battles smooth and fair, allowing each round to continue seamlessly and creating a more immersive gaming experience. Messaging automation can also be read about in this [article](/docs/about/features/message-automation.md).

<!-- ![Battle](../img/battle.png) -->


The source code, developed using the [Sails](../../build/sails/sails.mdx) framework, is available on [GitHub](https://github.com/gear-foundation/dapps/tree/master/contracts/battle).
The [frontend application](https://github.com/gear-foundation/dapps/tree/master/frontend/apps/battle) facilitates gameplay and interacts with the smart program.
This article describes the program interface, data structure, basic functions and explains their purpose. It can be used as is or modified to suit your own scenarios.

Everyone can play the game via this link - [Play Battle](https://w3w-battle.vara.network/) (VARA tokens are requred for gas fees).

## Implementation details

### Program description

The program contains the following information

```rust title="battle/app/services/game/mod.rs"
struct Storage {
    battles: HashMap<ActorId, Battle>,
    players_to_battle_id: HashMap<ActorId, ActorId>,
    admins: HashSet<ActorId>,
    config: Config,
}
```

* `battles` - a map of all active battles, associating each `ActorId` with a `Battle` structure
* `players_to_battle_id` - associates players with specific battles to quickly identify the battle each player is participating in
* `admins` -  a set containing the identifiers of administrators authorized to manage the game
* `config` - the game’s configuration, which sets primary parameters like initial health, maximum participants, etc

Where `Battle` is defined as follows:

```rust title="battle/app/services/game/utils.rs"
pub struct Battle {
    pub admin: ActorId,
    pub battle_name: String,
    pub time_creation: u64,
    pub bid: u128,
    pub participants: HashMap<ActorId, Player>,
    pub defeated_participants: HashMap<ActorId, Player>,
    pub state: State,
    pub pairs: HashMap<PairId, Pair>,
    pub players_to_pairs: HashMap<ActorId, PairId>,
    pub reservation: HashMap<ActorId, ReservationId>,
    pub waiting_player: Option<(ActorId, PairId)>,
    pub pair_id: u16,
}
```

* `admin` - the identifier of the administrator who created the battle
* `battle_name` - the name of the battle
* `time_creation` - a timestamp indicating when the battle was created
* `bid` - the bet amount for the battle
* `participants` -  participants in the current battle associated with their ActorId
* `defeated_participants` - participants who have been defeated in the battle
* `state` - the current state of the battle (Registration, Started, GameIsOver)
* `pairs` - pairs of participants who will fight against each other
* `players_to_pairs` - associates players with the pairs in which they are participating
* `reservation` - gas reservation data relating to players
* `waiting_player` - a player waiting for the next fight to start
* `pair_id` - the identifier of the current pair

### Initialization

To initialize the game program, the game configuration must be provided.

```rust title="battle/app/services/game/mod.rs"
    pub fn init(config: Config) -> Self {
        unsafe {
            STORAGE = Some(Storage {
                admins: HashSet::from([msg::source()]),
                config,
                ..Default::default()
            });
        }
        Self(())
    }
```

```rust title="battle/app/services/game/utils.rs"
pub struct Config {
    pub health: u16,
    pub max_participants: u8,
    pub attack_range: (u16, u16),
    pub defence_range: (u16, u16),
    pub dodge_range: (u16, u16),
    pub available_points: u16,
    pub time_for_move_in_blocks: u32,
    pub block_duration_ms: u32,
    pub gas_for_create_warrior: u64,
    pub gas_to_cancel_the_battle: u64,
    pub time_to_cancel_the_battle: u32,
    pub reservation_amount: u64,
    pub reservation_time: u32,
}
```
* `health` - the initial health of a player
* `max_participants` - the maximum number of participants
* `attack_range` - the range of possible attack values
* `defence_range` - the range of possible defense values
* `dodge_range` - the range of possible dodge values
* `available_points` - available points for attribute customization
* `time_for_move_in_blocks` - time allocated for making a move in blocks
* `block_duration_ms` - the duration of a block in milliseconds
* `gas_for_create_warrior` - gas cost to create a warrior
* `gas_to_cancel_the_battle` - gas cost to cancel a battle
* `time_to_cancel_the_battle` - time limit to cancel a battle
* `reservation_amount` - the amount of gas reserved for the battle
* `reservation_time` - the time allocated for reservation


### Action

```rust title="battle/app/services/game/mod.rs"
    // creates a new battle with specified parameters, such as battle name, player name, and player attributes (attack, defense, dodge)
    pub async fn create_new_battle(
        &mut self,
        battle_name: String,
        user_name: String,
        warrior_id: Option<ActorId>,
        appearance: Option<Appearance>,
        attack: u16,
        defence: u16,
        dodge: u16,
    );

    // registers a new participant in an existing battle.
    pub async fn register(
        &mut self,
        game_id: ActorId,
        warrior_id: Option<ActorId>,
        appearance: Option<Appearance>,
        user_name: String,
        attack: u16,
        defence: u16,
        dodge: u16,
    );

    // cancels a player’s registration
    pub fn cancel_register(&mut self);

    // removes a player from the battle
    pub fn delete_player(&mut self, player_id: ActorId);

    // cancels the current tournament
    pub fn cancel_tournament(&mut self);

    // cancels the current tournament with a delayed message 
    pub fn delayed_cancel_tournament(&mut self, game_id: ActorId, time_creation: u64);

    // starts the battle
    pub fn start_battle(&mut self);

    // makes a move in the battle
    pub fn make_move(&mut self, warrior_move: Move);

    // automatically makes a move for the specified player with a delayed message 
    pub fn automatic_move(&mut self, player_id: ActorId, number_of_victories: u8, round: u8);

    // starts the next round in the battle
    pub fn start_next_fight(&mut self);

    // terminates a player’s participation in the battle
    pub fn exit_game(&mut self);

    // adds a new administrator
    pub fn add_admin(&mut self, new_admin: ActorId);

    // modifies the game configuration
    pub fn change_config(&mut self, config: Config);
```

### Event

```rust title="battle/app/services/game/mod.rs"
pub enum Event {
    NewBattleCreated {
        battle_id: ActorId,
        bid: u128,
    },
    PlayerRegistered {
        admin_id: ActorId,
        user_name: String,
        bid: u128,
    },
    RegisterCanceled {
        player_id: ActorId,
    },
    BattleCanceled {
        game_id: ActorId,
    },
    BattleStarted,
    MoveMade,
    BattleFinished {
        winner: ActorId,
    },
    PairChecked {
        game_id: ActorId,
        pair_id: u8,
        round: u8,
    },
    FirstRoundChecked {
        game_id: ActorId,
        wave: u8,
    },
    NextBattleStarted,
    EnemyWaiting,
    WarriorGenerated {
        address: ActorId,
    },
    AdminAdded {
        new_admin: ActorId,
    },
    ConfigChanged {
        config: Config,
    },
    GameLeft,
    RoundAction {
        round: u8,
        player_1: (ActorId, Move, u16),
        player_2: (ActorId, Move, u16),
    },
    AutomaticMoveMade,
}
```

### Logic

#### Create Battle

The `create` function initiates a new battle, assigning a user as the battle's administrator and setting up its properties:

- **Timestamp and Config Validation**: Captures the battle’s start time and checks player attributes (attack, defence, dodge) to ensure they align with game rules.
- **Player’s Appearance**: Determines player appearance, either from an existing warrior or provided details. Throws an error if neither is provided.
- **Check for Existing Battles**: Ensures the player doesn’t already have an active battle to prevent duplicate battles.
- **Battle and Player Initialization**: Sets up battle details, adds the player as the first participant, and configures their stats.
- **Bid Setup**: Sets the entry bid
- **Scheduling Cancellation**: Sets a delayed message to cancel the tournament if inactive.
- **Event Creation**: Returns a `NewBattleCreated` event, signaling the battle setup completion.

```rust title="battle/app/services/game/funcs.rs"
    async fn create(
        storage: &mut Storage,
        warrior_id: Option<ActorId>,
        appearance: Option<Appearance>,
        user_name: String,
        battle_name: String,
        attack: u16,
        defence: u16,
        dodge: u16,
        msg_src: ActorId,
        msg_value: u128,
    ) -> Result<Event, BattleError> {
        let time_creation = exec::block_timestamp();
        check_player_settings(attack, defence, dodge, &storage.config)?;
        let appearance = if let Some(id) = warrior_id {
            check_owner(id, msg_src).await?;
            get_appearance(id).await?
        } else if let Some(app) = appearance {
            app
        } else {
            return Err(BattleError::IdAndAppearanceIsNone);
        };

        if storage.battles.contains_key(&msg_src) {
            return Err(BattleError::AlreadyHaveBattle);
        }

        let mut battle = Battle::default();
        let player = Player {
            warrior_id,
            appearance,
            owner: msg_src,
            user_name: user_name.clone(),
            player_settings: PlayerSettings {
                health: storage.config.health,
                attack,
                defence: defence * 10,
                dodge: dodge * 4,
            },
            number_of_victories: 0,
            ultimate_reload: 0,
            reflect_reload: 0,
        };
        battle.participants.insert(msg_src, player);
        battle.bid = msg_value;
        battle.admin = msg_src;
        battle.time_creation = time_creation;
        battle.battle_name = battle_name;
        storage.battles.insert(msg_src, battle);
        storage.players_to_battle_id.insert(msg_src, msg_src);

        send_delayed_message_for_cancel_tournament(
            msg_src,
            time_creation,
            storage.config.gas_to_cancel_the_battle,
            storage.config.time_to_cancel_the_battle,
        );
        Ok(Event::NewBattleCreated {
            battle_id: msg_src,
            bid: msg_value,
        })
    }
```

#### Register

The register function registers a player in an existing battle:

- **Validation of Player Settings**: Validates attack, defence, and dodge values against the configuration.
- **Appearance Setup**: Obtains appearance from either a selected warrior or direct input.
- **Pre-checks**: Ensures the player isn't already registered for the battle and verifies that the specified battle exists.
- **State and Capacity Checks**: Ensures the battle is open for registration and hasn’t exceeded participant limits.
- **Bid Verification**: Confirms the player’s bid matches the battle requirement.
- **Reservation and Participant Addition**: Adds the player to the battle, creating a reservation of gas and assigning initial settings.
- **Event Creation**: Emits a `PlayerRegistered` event, indicating successful registration.

```rust title="battle/app/services/game/funcs.rs"
    async fn register(
        storage: &mut Storage,
        admin_id: ActorId,
        warrior_id: Option<ActorId>,
        appearance: Option<Appearance>,
        user_name: String,
        attack: u16,
        defence: u16,
        dodge: u16,
        msg_src: ActorId,
        msg_value: u128,
    ) -> Result<Event, BattleError> {
        check_player_settings(attack, defence, dodge, &storage.config)?;

        let appearance = if let Some(id) = warrior_id {
            check_owner(id, msg_src).await?;
            get_appearance(id).await?
        } else if let Some(app) = appearance {
            app
        } else {
            return Err(BattleError::IdAndAppearanceIsNone);
        };

        if storage.players_to_battle_id.contains_key(&msg_src) {
            return Err(BattleError::SeveralRegistrations);
        }
        let battle = storage
            .battles
            .get_mut(&admin_id)
            .ok_or(BattleError::NoSuchGame)?;

        if battle.state != State::Registration {
            return Err(BattleError::WrongState);
        }
        if battle.participants.len() >= storage.config.max_participants.into() {
            return Err(BattleError::BattleFull);
        }
        if battle.bid != msg_value {
            return Err(BattleError::WrongBid);
        }

        let reservation_id = ReservationId::reserve(
            storage.config.reservation_amount,
            storage.config.reservation_time,
        )
        .expect("Reservation across executions");

        battle.reservation.insert(msg_src, reservation_id);
        battle.participants.insert(
            msg_src,
            Player {
                warrior_id,
                appearance,
                owner: msg_src,
                user_name: user_name.clone(),
                player_settings: PlayerSettings {
                    health: storage.config.health,
                    attack,
                    defence: defence * 10,
                    dodge: dodge * 4,
                },
                number_of_victories: 0,
                ultimate_reload: 0,
                reflect_reload: 0,
            },
        );
        storage.players_to_battle_id.insert(msg_src, admin_id);
        Ok(Event::PlayerRegistered {
            admin_id,
            user_name,
            bid: msg_value,
        })
    }
```

#### Start Battle

The `start_battle` function initiates the battle:

- **Battle Existence and Reservation**: Checks for the battle and reserves the necessary resources.
- **State Verification**: Ensures the battle is in the Registration state.
- **Player Count Validation**: Verifies the battle has enough players to start.
- **Pair Formation**: Organizes participants into pairs for combat.
- **State Transition**: Changes the battle state to `Started` and sets a timer for each move.
- **Event Creation**: Emits a `BattleStarted` event to signal the beginning of combat.

```rust title="battle/app/services/game/funcs.rs"
pub fn start_battle(storage: &mut Storage) -> Result<Event, BattleError> {
    let msg_src = msg::source();
    let battle = storage
        .battles
        .get_mut(&msg_src)
        .ok_or(BattleError::NoSuchGame)?;

    let reservation_id = ReservationId::reserve(
        storage.config.reservation_amount,
        storage.config.reservation_time,
    )
    .expect("Reservation across executions");

    battle.reservation.insert(msg_src, reservation_id);

    match battle.state {
        State::Registration => {
            battle.check_min_player_amount()?;
            battle.split_into_pairs()?;
            battle.send_delayed_message_make_move_from_reservation(
                storage.config.time_for_move_in_blocks,
            );
            battle.state = State::Started;
        }
        _ => return Err(BattleError::WrongState),
    }
    Ok(Event::BattleStarted)
}
```
:::note
In the `Start Battle` function, the function `send_delayed_message_make_move_from_reservation` is called after all the necessary checks and pair formation. This function sends a delayed message, using the reserved gas amount that each participant has allocated, to ensure an automatic move is made if a player fails to make a move within the designated time.
::: 

```rust title="battle/app/services/game/utils.rs"
    pub fn send_delayed_message_make_move_from_reservation(&mut self, time_for_move: u32) {
        let mut new_map_reservation = HashMap::new();
        self.reservation
            .iter()
            .for_each(|(actor_id, reservation_id)| {
                if let Some(waiting_player) = self.waiting_player {
                    if waiting_player.0 == *actor_id {
                        new_map_reservation.insert(waiting_player.0, *reservation_id);
                        return;
                    }
                }
                let number_of_victories = self
                    .participants
                    .get(actor_id)
                    .expect("The player must exist")
                    .number_of_victories;
                let round: u8 = 1;
                let request = [
                    "Battle".encode(),
                    "AutomaticMove".to_string().encode(),
                    (*actor_id, number_of_victories, round).encode(),
                ]
                .concat();

                msg::send_bytes_delayed_from_reservation(
                    *reservation_id,
                    exec::program_id(),
                    request,
                    0,
                    time_for_move,
                )
                .expect("Error in sending message");
            });
        self.reservation = new_map_reservation;
    }
```


This mechanism prevents the game from stalling due to player inactivity. If a player doesn’t make a move within the set time, the delayed message triggers an automatic move on their behalf, maintaining the flow of the battle and keeping it fair for all participants. It also uses the gas each player reserved during registration, which helps avoid unnecessary gas consumption from another participants.


#### Make Move

The `make_move` function handles each player's turn:

- **Player and Battle Validation**: Ensures the player is in an active battle and retrieves their current pair.
- **Time Limit Check**: Verifies that the player’s move is within the allowed time.
- *Special Move Validation*: Checks whether special moves (`Ultimate` or `Reflect`) are available, based on their cooldowns.
- **Move Resolution**:
    * If the opponent has already made a move, the function computes the round outcome.
    * If not, it stores the player’s move for later resolution.
- **Battle Outcome**:
    * Updates health values based on the result, determines if a winner is declared, and moves defeated players to `defeated_participants`.
    * Resets health and reloads if there is a draw.
    * `check_end_game` and `check_draw_end_game` functions are called to determine if the game should end based on participants' statuses or a draw condition.
- **Event Creation**: Emits a `RoundAction` or `MoveMade` event, depending on the state.

```rust title="battle/app/services/game/funcs.rs"
    pub fn make_move(storage: &mut Storage, warrior_move: Move) -> Result<Event, BattleError> {
        let player = msg::source();
        let game_id = storage
            .players_to_battle_id
            .get(&player)
            .ok_or(BattleError::NoSuchGame)?;
        let battle = storage
            .battles
            .get_mut(game_id)
            .ok_or(BattleError::NoSuchGame)?;

        battle.check_state(State::Started)?;

        let pair_id = battle
            .players_to_pairs
            .get(&player)
            .ok_or(BattleError::NoSuchPair)?;
        let pair = battle
            .pairs
            .get_mut(pair_id)
            .ok_or(BattleError::NoSuchPair)?;

        let timestamp = exec::block_timestamp();
        let time_for_move_ms =
            storage.config.block_duration_ms * storage.config.time_for_move_in_blocks;
        if timestamp.saturating_sub(pair.round_start_time) >= time_for_move_ms as u64 {
            return Err(BattleError::TimeExpired);
        }
        match warrior_move {
            Move::Ultimate => check_reload_ultimate(
                battle
                    .participants
                    .get(&player)
                    .expect("The player must exist"),
            )?,
            Move::Reflect => check_reload_reflect(
                battle
                    .participants
                    .get(&player)
                    .expect("The player must exist"),
            )?,
            Move::Attack => (),
        }

        if let Some(opponent_info) = pair.action {
            if opponent_info.0 == player {
                return Err(BattleError::MoveHasAlreadyBeenMade);
            }

            let player_1_ptr = battle
                .participants
                .get_mut(&opponent_info.0)
                .expect("The player must exist") as *mut _;
            let player_2_ptr = battle
                .participants
                .get_mut(&player)
                .expect("The player must exist") as *mut _;

            let (round_result, player_1, player_2) = unsafe {
                let player_1 = &mut *player_1_ptr;
                let player_2 = &mut *player_2_ptr;

                (
                    pair.recap_round((player_1, opponent_info.1), (player_2, warrior_move)),
                    player_1,
                    player_2,
                )
            };
            pair.action = None;
            let current_round = pair.round;
            let (player_1_health, player_2_health) = if let Some(battle_result) = round_result {
                match battle_result {
                    BattleResult::PlayerWin(winner) => {
                        let loser = pair.get_opponent(&winner);
                        let player_loser = battle
                            .participants
                            .remove(&loser)
                            .expect("The player must exist");
                        battle.defeated_participants.insert(loser, player_loser);
                        let player_winner = battle
                            .participants
                            .get_mut(&winner)
                            .expect("The player must exist");
                        let healths = if player_1.owner == winner {
                            (player_winner.player_settings.health, 0)
                        } else {
                            (0, player_winner.player_settings.health)
                        };
                        player_winner.player_settings.health = storage.config.health;
                        player_winner.reflect_reload = 0;
                        player_winner.ultimate_reload = 0;
                        player_winner.number_of_victories += 1;
                        battle.pairs.remove(pair_id);
                        battle.players_to_pairs.remove(&winner);
                        battle.players_to_pairs.remove(&loser);
                        battle.check_end_game();
                        healths
                    }
                    BattleResult::Draw(id_1, id_2) => {
                        let player_1 = battle
                            .participants
                            .get_mut(&id_1)
                            .expect("The player must exist");
                        player_1.player_settings.health = storage.config.health;
                        player_1.reflect_reload = 0;
                        player_1.ultimate_reload = 0;
                        let player_2 = battle
                            .participants
                            .get_mut(&id_2)
                            .expect("The player must exist");

                        player_2.player_settings.health = storage.config.health;
                        player_2.reflect_reload = 0;
                        player_2.ultimate_reload = 0;
                        battle.pairs.remove(pair_id);
                        battle.players_to_pairs.remove(&id_1);
                        battle.players_to_pairs.remove(&id_2);
                        battle.check_draw_end_game();
                        (0, 0)
                    }
                }
            } else {
                pair.round += 1;
                pair.round_start_time = exec::block_timestamp();
                (
                    player_1.player_settings.health,
                    player_2.player_settings.health,
                )
            };
            Ok(Event::RoundAction {
                round: current_round,
                player_1: (opponent_info.0, opponent_info.1, player_1_health),
                player_2: (player, warrior_move, player_2_health),
            })
        } else {
            pair.action = Some((player, warrior_move));
            Ok(Event::MoveMade)
        }
    }
```

#### Start Next Fight

The `start_next_fight` function initiates the next encounter between available players:

- **Battle Validation**: Confirms the battle is active and the player isn’t already in a match.
- **Reservation**: Reserves necessary resources for the player.
- **Opponent Check**: Checks if there is an opponent waiting.
- **Match Setup**:
    * If an opponent is available, starts the next fight, setting timers for both players.
    * If no opponent is available, marks the player as waiting and sets up a new pair.
- **Event Creation**: Emits either `NextBattleStarted` if the fight begins or `EnemyWaiting` if the player is queued.

```rust title="battle/app/services/game/funcs.rs"
pub fn start_next_fight(storage: &mut Storage) -> Result<Event, BattleError> {
    let player_id = msg::source();
    let game_id = storage
        .players_to_battle_id
        .get(&player_id)
        .ok_or(BattleError::NoSuchGame)?;
    let battle = storage
        .battles
        .get_mut(game_id)
        .ok_or(BattleError::NoSuchGame)?;

    battle.check_state(State::Started)?;

    if battle.players_to_pairs.contains_key(&player_id) {
        return Err(BattleError::AlreadyHaveBattle);
    }

    let reservation_id = ReservationId::reserve(
        storage.config.reservation_amount,
        storage.config.reservation_time,
    )
    .expect("Reservation across executions");

    battle.reservation.insert(player_id, reservation_id);

    let player = battle
        .participants
        .get(&player_id)
        .ok_or(BattleError::NoSuchPlayer)?;

    if let Some((opponent, pair_id)) = battle.waiting_player {
        let pair = battle
            .pairs
            .get_mut(&pair_id)
            .expect("The pair must be created");
        pair.player_2 = player.owner;
        pair.round_start_time = exec::block_timestamp();
        battle.players_to_pairs.insert(player.owner, pair_id);
        battle.waiting_player = None;
        send_delayed_message_make_move_from_reservation(
            reservation_id,
            storage.config.time_for_move_in_blocks,
            player_id,
            player.number_of_victories,
        );

        let reservation_id = battle
            .reservation
            .get(&opponent)
            .expect("Reservation must be exist");
        let opponent_player = battle
            .participants
            .get(&opponent)
            .expect("Player must be exist");
        send_delayed_message_make_move_from_reservation(
            *reservation_id,
            storage.config.time_for_move_in_blocks,
            opponent_player.owner,
            opponent_player.number_of_victories,
        );
        Ok(Event::NextBattleStarted)
    } else {
        let pair = Pair {
            player_1: player.owner,
            round: 1,
            ..Default::default()
        };
        battle.pairs.insert(battle.pair_id, pair);
        battle.players_to_pairs.insert(player.owner, battle.pair_id);
        battle.waiting_player = Some((player.owner, battle.pair_id));
        battle.pair_id += 1;
        Ok(Event::EnemyWaiting)
    }
}
```

## Query

```rust title="battle/app/services/game/mod.rs"
    pub fn get_battle(&self, game_id: ActorId) -> Option<BattleState> {
        let storage = self.get();
        storage
            .battles
            .get(&game_id)
            .cloned()
            .map(|battle| battle.into())
    }
    pub fn get_my_battle(&self) -> Option<BattleState> {
        let storage = self.get();
        if let Some(game_id) = storage.players_to_battle_id.get(&msg::source()) {
            storage
                .battles
                .get(game_id)
                .cloned()
                .map(|battle| battle.into())
        } else {
            None
        }
    }
    pub fn admins(&self) -> Vec<ActorId> {
        let storage = self.get();
        storage.admins.clone().into_iter().collect()
    }
    pub fn config(&self) -> &'static Config {
        let storage = self.get();
        &storage.config
    }
```

- `get_battle(&self, game_id: ActorId)`: returns the state of a specific battle

- `get_my_battle(&self)`: returns the battle in which the current player is participating

- `admins(&self)`: returns the list of administrators

- `config(&self)`: returns the game configuration

## Warrior

Players have the capability to create and upload their own warrior programs, enabling them to develop unique warriors for participation in battles. During the registration or creation of a battle, players can conveniently specify the address of their warrior program. This functionality ensures that each warrior reflects the creativity of its creator.

For individuals interested in crafting their own warriors, detailed instructions on how to develop a warrior program are available in the [README](https://github.com/gear-foundation/dapps/tree/master/contracts/battle/warrior). This guide outlines all the necessary steps to effectively bring a unique warrior to life within the arena.

## Source code

The source code of this example of Battle Game program and the example of an implementation of its testing is available on [gear-foundation/dapp/contracts/battle](https://github.com/gear-foundation/dapps/tree/master/contracts/battle).

See also an example of the smart contract testing implementation based on `gtest`: [gear-foundation/dapps/vara-man/tests](https://github.com/gear-foundation/dapps/tree/master/contracts/battle/tests).

For more details about testing programs written on Gear, refer to the [Program Testing](/docs/build/testing) article.
