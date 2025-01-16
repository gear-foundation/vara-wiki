---
sidebar_label: Tic-Tac-Toe
sidebar_position: 3
---

# Tic-Tac-Toe Game

A classic and simple game in which the user competes against a program operating on the blockchain network.

![Tic-Tac-Toe](../img/tictactoe.png)

Usually, the state of a program advances as the application is utilized. A <u>distinctive feature</u> of this game's program implementation is its capability to clean up its storage. In other words, as soon as the game session is completed and the results are recorded in the program, all unnecessary data structures are purged automatically through a special **delayed message**. [Delayed messages](/docs/build/gstd/delayed-messages) represent one of the various unique features of the Gear Protocol.


The game example uses the [**EZ-Transactions package**](/docs/api/tooling/gasless-txs.md) that simplifies blockchain interactions by enabling gasless and signless transactions. Anyone can use it to integrate into their dApp projects. For more details, visit the [GitHub page](https://github.com/gear-foundation/dapps/tree/master/frontend/packages/ez-transactions).  

The source code, developed using the [Sails](../../build/sails/sails.mdx) framework, is available on [GitHub](https://github.com/gear-foundation/dapps/tree/master/contracts/tic-tac-toe).
The [frontend application](https://github.com/gear-foundation/dapps/tree/master/frontend/apps/tic-tac-toe) facilitates gameplay and interacts with the smart program.
This article describes the program interface, data structure, basic functions and explains their purpose. It can be used as is or modified to suit your own scenarios.

Everyone can play the game via this link - [Play Tic-Tac-Toe](https://tictactoe.vara.network/) (VARA tokens are requred for gas fees).

## How to run

1. Build a program
> Additional details regarding this matter can be located within the [README](https://github.com/gear-foundation/dapps/tree/master/contracts/tic-tac-toe/README.md) directory of the program.

2. Upload the program to the [Vara Network Testnet](https://idea.gear-tech.io/programs?node=wss%3A%2F%2Ftestnet.vara.network)
> Initiate the process by uploading the bot program, followed by the subsequent upload of the main program. Further details regarding the process of program uploading can be located within the [Getting Started](/docs/getting-started-in-5-minutes#deploy-your-program-to-the-testnet) section.

3. Build and run user interface
> More information about this can be found in the [README](https://github.com/gear-foundation/dapps/blob/master/frontend/apps/tic-tac-toe/README.md) directory of the frontend.

## Implementation details

### Program description

The program contains the following information

```rust title="tic-tac-toe/app/services/game/mod.rs"
pub struct Storage {
    admins: Vec<ActorId>,
    current_games: HashMap<ActorId, GameInstance>,
    config: Config,
    messages_allowed: bool,
    dns_info: Option<(ActorId, String)>,
}
```

* `admins` - game admins
* `current_games` - game information for each player
* `config` - game configuration
* `messages_allowed` - access to playability
* `dns_info` -  optional field that stores the [dDNS](../Infra/dein.md) address and the program name. 

Where `GameInstance` is defined as follows:

```rust title="tic-tac-toe/app/services/game/utils.rs"
pub struct GameInstance {
    pub board: Vec<Option<Mark>>,
    pub player_mark: Mark,
    pub bot_mark: Mark,
    pub last_time: u64,
    pub game_over: bool,
    pub game_result: Option<GameResult>,
}
```
```rust title="tic-tac-toe/app/services/game/utils.rs"
pub enum Mark {
    X,
    O,
}
```

### Initialization

To initialize the game program, the game configuration and the optional DNS address and name must be provided.

```rust title="tic-tac-toe/app/services/game/mod.rs"
    pub async fn init(config: Config, dns_id_and_name: Option<(ActorId, String)>) -> Self {
        unsafe {
            STORAGE = Some(Storage {
                admins: vec![msg::source()],
                current_games: HashMap::with_capacity(10_000),
                config,
                messages_allowed: true,
                dns_info: dns_id_and_name.clone(),
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

```rust title="tic-tac-toe/app/services/game/utils.rs"
pub struct Config {
    pub s_per_block: u64,
    pub gas_to_remove_game: u64,
    pub gas_to_delete_session: u64,
    pub time_interval: u32,
    pub turn_deadline_ms: u64,
    pub minimum_session_duration_ms: u64,
}
```
* `s_per_block` - time per block in seconds
* `gas_to_remove_game` - gas to delete a game using delayed messages
* `gas_to_delete_session` - gas to delete a game session using delayed messages 
* `time_interval` - time after which the game should be deleted using delayed messages
* `turn_deadline_ms` - turnaround time
* `minimum_session_duration_ms` - minimum session duration 

### Action

```rust title="tic-tac-toe/app/services/game/mod.rs"
    // user actions
    pub fn start_game(&mut self, session_for_account: Option<ActorId>);
    pub fn turn(&mut self, step: u8, session_for_account: Option<ActorId>);
    pub fn skip(&mut self, session_for_account: Option<ActorId>);

    // action for the program itself (for delayed messages)
    pub fn remove_game_instance(&mut self, account: ActorId);

    // admin actions
    pub fn remove_game_instances(&mut self, accounts: Option<Vec<ActorId>>);
    pub fn add_admin(&mut self, admin: ActorId);
    pub fn remove_admin(&mut self, admin: ActorId);
    pub fn update_config(
        &mut self,
        s_per_block: Option<u64>,
        gas_to_remove_game: Option<u64>,
        time_interval: Option<u32>,
        turn_deadline_ms: Option<u64>,
        gas_to_delete_session: Option<u64>,
    );
    pub fn allow_messages(&mut self, messages_allowed: bool);
    pub async fn kill(&mut self, inheritor: ActorId);
```

### Event

```rust title="tic-tac-toe/app/services/game/mod.rs"
pub enum Event {
    GameFinished {
        game: GameInstance,
        player_address: ActorId,
    },
    GameStarted {
        game: GameInstance,
    },
    MoveMade {
        game: GameInstance,
    },
    GameInstanceRemoved,
    ConfigUpdated,
    AdminRemoved,
    AdminAdded,
    StatusMessagesUpdated,
    Killed {
        inheritor: ActorId,
    },
}
```

### Logic

#### Start Game

At the start of the game, the program checks its status and verifies whether the player has an unfinished game. The first move is determined randomly; if the bot is assigned the first move, it automatically plays in the center of the board.

```rust title="tic-tac-toe/app/services/game/funcs.rs"
pub fn start_game(
    storage: &mut Storage,
    sessions: &HashMap<ActorId, SessionData>,
    msg_source: ActorId,
    session_for_account: Option<ActorId>,
) -> Result<Event, GameError> {
    check_allow_messages(storage, msg_source)?;
    let player = get_player(
        sessions,
        &msg_source,
        &session_for_account,
        ActionsForSession::StartGame,
    );
    if let Some(current_game) = storage.current_games.get(&player) {
        if !current_game.game_over {
            return Err(GameError::GameIsAlreadyStarted);
        }
    }

    let turn = random_turn(player);

    let (player_mark, bot_mark) = if turn == 0 {
        (Mark::O, Mark::X)
    } else {
        (Mark::X, Mark::O)
    };
    let mut game_instance = GameInstance {
        board: vec![None; 9],
        player_mark,
        bot_mark,
        last_time: exec::block_timestamp(),
        game_result: None,
        game_over: false,
    };

    if bot_mark == Mark::X {
        game_instance.board[4] = Some(Mark::X);
    }

    storage.current_games.insert(player, game_instance.clone());

    Ok(Event::GameStarted {
        game: game_instance,
    })
}

//.. 

fn check_allow_messages(storage: &Storage, msg_source: ActorId) -> Result<(), GameError> {
    if !storage.messages_allowed && !storage.admins.contains(&msg_source) {
        return Err(GameError::NotAllowedToSendMessages);
    }
    Ok(())
}

```

#### Turn

After successfully starting a new game, players can take their turn where a series of the following checks are performed:

```rust title="tic-tac-toe/app/services/game/funcs.rs"
pub fn turn(
    storage: &mut Storage,
    sessions: &HashMap<ActorId, SessionData>,
    msg_source: ActorId,
    step: u8,
    session_for_account: Option<ActorId>,
) -> Result<Event, GameError> {
    check_allow_messages(storage, msg_source)?;
    let player = get_player(
        sessions,
        &msg_source,
        &session_for_account,
        ActionsForSession::StartGame,
    );

    let game_instance = storage
        .current_games
        .get_mut(&player)
        .ok_or(GameError::GameIsNotStarted)?;

    if game_instance.board[step as usize].is_some() {
        return Err(GameError::CellIsAlreadyOccupied);
    }
    if game_instance.game_over {
        return Err(GameError::GameIsAlreadyOver);
    }
    let block_timestamp = exec::block_timestamp();
    if game_instance.last_time + storage.config.turn_deadline_ms < block_timestamp {
        return Err(GameError::MissedYourTurn);
    }
    //..
```
After successful game status checks, the player's move is saved and the time of the last move is updated

```rust title="tic-tac-toe/app/services/game/funcs.rs"
    //..
    game_instance.board[step as usize] = Some(game_instance.player_mark);
    game_instance.last_time = block_timestamp;

    if let Some(mark) = get_result(&game_instance.board.clone()) {
        if mark == game_instance.player_mark {
            game_over(game_instance, &player, &storage.config, GameResult::Player);
        } else {
            game_over(game_instance, &player, &storage.config, GameResult::Bot);
        }
        return Ok(Event::GameFinished {
            game: game_instance.clone(),
            player_address: player,
        });
    }
    // ..
```
If the game is over, a **delayed message** will be sent to delete the game from the program

```rust title="tic-tac-toe/app/services/game/funcs.rs"
fn game_over(
    game_instance: &mut GameInstance,
    player: &ActorId,
    config: &Config,
    result: GameResult,
) {
    game_instance.game_over = true;
    game_instance.game_result = Some(result);
    send_delayed_message_to_remove_game(*player, config.gas_to_remove_game, config.time_interval);
}

fn send_delayed_message_to_remove_game(
    account: ActorId,
    gas_to_remove_game: u64,
    time_interval: u32,
) {
    let request = [
        "TicTacToe".encode(),
        "RemoveGameInstance".to_string().encode(),
        (account).encode(),
    ]
    .concat();

    msg::send_bytes_with_gas_delayed(
        exec::program_id(),
        request,
        gas_to_remove_game,
        0,
        time_interval,
    )
    .expect("Error in sending message");
}

```
But if the game is not over, the turn passes to the bot and the same actions are performed

```rust title="tic-tac-toe/app/services/game/funcs.rs"

    let bot_step = make_move(game_instance);

    if let Some(step_num) = bot_step {
        game_instance.board[step_num] = Some(game_instance.bot_mark);
    }

    if let Some(mark) = get_result(&game_instance.board.clone()) {
        if mark == game_instance.player_mark {
            game_over(
                game_instance,
                &msg_source,
                &storage.config,
                GameResult::Player,
            );
        } else {
            game_over(game_instance, &msg_source, &storage.config, GameResult::Bot);
        }
        return Ok(Event::GameFinished {
            game: game_instance.clone(),
            player_address: player,
        });
    } else if !game_instance.board.contains(&None) || bot_step.is_none() {
        game_over(
            game_instance,
            &msg_source,
            &storage.config,
            GameResult::Draw,
        );
        return Ok(Event::GameFinished {
            game: game_instance.clone(),
            player_address: player,
        });
    }
    Ok(Event::MoveMade {
        game: game_instance.clone(),
    })
}
``` 

#### Skip

If the player misses their turn, a *Skip* command must be sent to continue the game and allow the bot to make its move.

```rust title="tic-tac-toe/app/services/game/funcs.rs"
pub fn skip(
    storage: &mut Storage,
    sessions: &HashMap<ActorId, SessionData>,
    msg_source: ActorId,
    session_for_account: Option<ActorId>,
) -> Result<Event, GameError> {
    check_allow_messages(storage, msg_source)?;
    let player = get_player(
        sessions,
        &msg_source,
        &session_for_account,
        ActionsForSession::StartGame,
    );

    let game_instance = storage
        .current_games
        .get_mut(&player)
        .ok_or(GameError::GameIsNotStarted)?;

    if game_instance.game_over {
        return Err(GameError::GameIsAlreadyOver);
    }
    let block_timestamp = exec::block_timestamp();
    if game_instance.last_time + storage.config.turn_deadline_ms >= block_timestamp {
        return Err(GameError::NotMissedTurnMakeMove);
    }

    let bot_step = make_move(game_instance);
    game_instance.last_time = block_timestamp;

    match bot_step {
        Some(step_num) => {
            game_instance.board[step_num] = Some(game_instance.bot_mark);
            let win = get_result(&game_instance.board.clone());
            if let Some(mark) = win {
                if mark == game_instance.player_mark {
                    game_over(game_instance, &player, &storage.config, GameResult::Player);
                } else {
                    game_over(game_instance, &player, &storage.config, GameResult::Bot);
                }
                return Ok(Event::GameFinished {
                    game: game_instance.clone(),
                    player_address: player,
                });
            } else if !game_instance.board.contains(&None) {
                game_over(game_instance, &player, &storage.config, GameResult::Draw);
                return Ok(Event::GameFinished {
                    game: game_instance.clone(),
                    player_address: player,
                });
            }
        }
        None => {
            game_over(game_instance, &player, &storage.config, GameResult::Draw);
            return Ok(Event::GameFinished {
                game: game_instance.clone(),
                player_address: player,
            });
        }
    }
    Ok(Event::MoveMade {
        game: game_instance.clone(),
    })
}

```

## Query

```rust title="tic-tac-toe/app/services/game/mod.rs"
    pub fn admins(&self) -> &'static Vec<ActorId> {
        &self.get().admins
    }
    pub fn game(&self, player_id: ActorId) -> Option<GameInstance> {
        self.get().current_games.get(&player_id).cloned()
    }
    pub fn all_games(&self) -> Vec<(ActorId, GameInstance)> {
        self.get().current_games.clone().into_iter().collect()
    }
    pub fn config(&self) -> &'static Config {
        &self.get().config
    }
    pub fn messages_allowed(&self) -> &'static bool {
        &self.get().messages_allowed
    }
    pub fn dns_info(&self) -> Option<(ActorId, String)> {
        self.get().dns_info.clone()
    }
```

- `admins(&self)`: Returns the list of game administrators.

- `game(&self, player_id: ActorId)`: Returns the current game instance for a specific player, if it exists.

- `all_games(&self)`: Returns a list of all ongoing game instances along with their associated player IDs.

- `config(&self)`: Returns the game configuration settings.

- `messages_allowed(&self)`: Indicates whether messages are allowed in the current game state.

- `dns_info(&self)`: Returns the optional dDNS information, including the dDNS address and program name, if available.

## Source code

The source code of this example of Tic-Tac-Toe Game program and the example of an implementation of its testing is available on [gear-foundation/dapp/contracts/tic-tac-toe](https://github.com/gear-foundation/dapps/tree/master/contracts/tic-tac-toe).

See also an example of the smart contract testing implementation based on `gtest`: [gear-foundation/dapps/contracts/tic-tac-toe/tests](https://github.com/gear-foundation/dapps/tree/master/contracts/tic-tac-toe/tests).

For more details about testing programs written on Gear, refer to the [Program Testing](/docs/build/testing) article.
