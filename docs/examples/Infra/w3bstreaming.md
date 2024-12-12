---
sidebar_label: P2P Streaming
sidebar_position: 6
---

# P2P streaming

![streaming](../img/streaming.png)

P2P streaming is an example of a decentralized application, akin to the widely popular streaming applications in the Web2 realm. Users of this application can connect and watch the live stream of one or more users. A Web2 equivalent could be the Twitch platform.

In this example of the application, a user creates a schedule for an upcoming stream broadcast at a designated time in advance. Other users can view a list of scheduled streams and subscribe to one or more. At the appointed time, the streamer commences the broadcast, and other users join it.

The application comprises three primary components:
- On-chain program: This component is responsible for storing the stream schedule and managing user subscriptions  
The source code, developed using the [Sails](../../build/sails/sails.mdx) framework, is available on [GitHub](https://github.com/gear-foundation/dapps/tree/master/contracts/w3bstreaming).
- Frontend: This component serves as the application's user interface ([GitHub](https://github.com/gear-foundation/dapps/tree/master/frontend/apps/w3bstreaming))
- Signaling server: This component is responsible for establishing peer-to-peer (P2P) connections between the streamer and viewers ([GitHub](https://github.com/gear-foundation/dapps/tree/master/backend/w3bstreaming)).

This article details the program interface, data structure, fundamental functions, and their intended purposes. It can be used as is or customized to suit individual scenarios.

Also, anyone can test the application using this link: [P2P Streaming](https://w3bstreaming.vara.network) (VARA tokens are requred for gas fees).

## How to run

1. ⚒️ **Build a program**: For detailed instructions on this step, please refer to the [README](https://github.com/gear-foundation/dapps/blob/master/contracts/w3bstreaming/README.md) directory within the program's codebase.

2. 🏗️ **Upload the program** to the [Vara Network Testnet](https://idea.gear-tech.io/programs?node=wss%3A%2F%2Ftestnet.vara.network): For further guidance on program uploading, please visit the [Getting Started](/docs/getting-started-in-5-minutes#deploy-your-program-to-the-testnet) section.

3. 🔀 **Build and run the backend service**: For more information on this step, please consult the [README](https://github.com/gear-foundation/dapps/blob/master/backend/w3bstreaming/README.md) file within the codebase of the backend service.

4. 🖥️ **Build and run user interface**: For more information on this step, please consult the [README](https://github.com/gear-foundation/dapps/blob/master/frontend/apps/w3bstreaming/README.md) directory within the frontend codebase.

## Implementation details

The P2P streaming program contains the following information:

```rust title="w3bstreaming/app/src/lib.rs"
pub struct Program {
    pub streams: HashMap<String, Stream>,
    pub users: HashMap<ActorId, Profile>,
    pub admins: Vec<ActorId>,
    pub dns_info: Option<(ActorId, String)>,
}
```
* `streams` - contains a pair of values such as identifier and stream information 
* `users` - contains a pair of values such as user address and profile information
* `admins` - admins addresses
* `dns_info` - optional field that stores the [dDNS](../Infra/dein.md) address and the program name

Сonsider in detail the information about the `Stream` 

```rust title="w3bstreaming/app/src/utils.rs"
pub struct Stream {
    pub broadcaster: ActorId,
    pub start_time: u64,
    pub end_time: u64,
    pub title: String,
    pub img_link: String,
    pub description: Option<String>,
}
```

* `broadcaster` - the address of the creator of the stream
* `start_time` - stream start time
* `end_time` - stream end time
* `title` - streaming title
* `img_link` - link to the stream banner image
* `description` - streaming description

`Profile` information is as follows:

```rust title="w3bstreaming/app/src/utils.rs"
pub struct Profile {
    pub name: Option<String>,
    pub surname: Option<String>,
    pub img_link: Option<String>,
    pub time_zone: Option<String>,
    pub stream_ids: Vec<String>,
    pub subscribers: Vec<ActorId>,
    pub subscriptions: Vec<Subscription>,
}
```

* `name` - user name
* `surname` - user surname
* `img_link` - user logo link
* `time_zone` - time zone
* `stream_ids` - list of all stream identifiers of the user
* `subscribers` - list of all subscribers of a user
* `subscriptions` - list of all subscribed users

### Action

The streaming program contains the following functions:

```rust title="w3bstreaming/app/src/lib.rs"
pub fn new_stream(
    &mut self,
    title: String,
    description: Option<String>,
    start_time: u64,
    end_time: u64,
    img_link: String,
);
pub fn delete_stream(&mut self, stream_id: String);
pub fn edit_stream(
    &mut self,
    stream_id: String,
    start_time: Option<u64>,
    end_time: Option<u64>,
    title: Option<String>,
    img_link: Option<String>,
    description: Option<String>,
);
pub fn subscribe(&mut self, account_id: ActorId);
pub fn edit_profile(
    &mut self,
    name: Option<String>,
    surname: Option<String>,
    img_link: Option<String>,
    time_zone: Option<String>,
);
pub fn add_admin(&mut self, new_admin_id: ActorId);
pub async fn kill(&mut self, inheritor: ActorId);
```

### Event

```rust title="w3bstreaming/app/src/lib.rs"
pub enum Event {
    StreamIsScheduled { id: String },
    StreamDeleted { id: String },
    StreamEdited,
    Subscribed,
    ProfileEdited,
    AdminAdded { new_admin_id: ActorId },
    Killed { inheritor: ActorId },
}
```

### Logic

Before starting the stream, it is necessary to register a profile, this can be done using the `edit_profile` function (this function also allows to edit the profile)

```rust title="w3bstreaming/app/src/lib.rs"
pub fn edit_profile(
    &mut self,
    name: Option<String>,
    surname: Option<String>,
    img_link: Option<String>,
    time_zone: Option<String>,
) {
    let storage = self.get_mut();

    storage
        .users
        .entry(msg::source())
        .and_modify(|profile| {
            profile.name.clone_from(&name);
            profile.surname.clone_from(&surname);
            profile.img_link.clone_from(&img_link);
            profile.time_zone.clone_from(&img_link);
        })
        .or_insert_with(|| Profile {
            name,
            surname,
            img_link,
            time_zone,
            stream_ids: Vec::new(),
            subscribers: Vec::new(),
            subscriptions: Vec::new(),
        });

    self.notify_on(Event::ProfileEdited)
        .expect("Notification Error");
}
```

After successfully registering a profile, a stream can be scheduled. In order to create a stream it is necessary to enter the following information: title name, stream description, start time, end time and stream picture link

```rust title="w3bstreaming/app/src/lib.rs"
pub fn new_stream(
    &mut self,
    title: String,
    description: Option<String>,
    start_time: u64,
    end_time: u64,
    img_link: String,
) {
    let stream_id = exec::block_timestamp().to_string() + &title;
    let msg_src = msg::source();
    let storage = self.get_mut();
    if let Some(profile) = storage.users.get_mut(&msg_src) {
        profile.stream_ids.push(stream_id.clone());
    } else {
        panic!("Account is no registered");
    }
    storage.streams.insert(
        stream_id.clone(),
        Stream {
            broadcaster: msg_src,
            img_link,
            start_time,
            end_time,
            title,
            description,
        },
    );
    self.notify_on(Event::StreamIsScheduled { id: stream_id })
        .expect("Notification Error");
}
```
The unique stream identifier is composed of the time stamp of the current block and the title name. After successful stream creation the program sends a reply where the identifier is specified.

This program also allows deleting information about a scheduled stream or editing it using the stream id.

In case of stream deletion, a number of checks are performed to ensure that only the stream creator can delete the stream and the stream with the given identifier exists.

```rust title="w3bstreaming/app/src/lib.rs"
pub fn delete_stream(&mut self, stream_id: String) {
    let storage = self.get_mut();
    let msg_src = msg::source();
    let profile = storage
        .users
        .get_mut(&msg_src)
        .expect("Account is no registered");
    let index = profile
        .stream_ids
        .iter()
        .position(|x| *x == stream_id)
        .expect("Id is not exist");
    profile.stream_ids.remove(index);

    let stream = storage.streams.get(&stream_id).expect("Id is not exist");
    if stream.broadcaster == msg_src {
        storage.streams.remove(&stream_id);
    } else {
        panic!("You are not broadcaster");
    }
    self.notify_on(Event::StreamDeleted { id: stream_id })
        .expect("Notification Error");
}
```

Stream data fields can be modified selectively and only the creator of the stream can do that.

```rust title="w3bstreaming/app/src/lib.rs"
pub fn edit_stream(
    &mut self,
    stream_id: String,
    start_time: Option<u64>,
    end_time: Option<u64>,
    title: Option<String>,
    img_link: Option<String>,
    description: Option<String>,
) {
    let storage = self.get_mut();
    let msg_src = msg::source();

    if let Some(stream) = storage.streams.get_mut(&stream_id) {
        if stream.broadcaster == msg_src {
            if let Some(start_time) = start_time {
                stream.start_time = start_time;
            }
            if let Some(end_time) = end_time {
                stream.end_time = end_time;
            }
            if let Some(title) = title {
                stream.title = title;
            }
            if let Some(img_link) = img_link {
                stream.img_link = img_link;
            }
            stream.description = description;
        } else {
            panic!("You are not broadcaster");
        }
    } else {
        panic!("Id is not exist");
    }

    self.notify_on(Event::StreamEdited)
        .expect("Notification Error");
}
```

To subscribe to another account it is necessary to send a message `subscribe` to the program. Subscription may fail if registration has not been completed or the specified account does not exist in the registered accounts

```rust title="w3bstreaming/app/src/lib.rs"
pub fn subscribe(&mut self, account_id: ActorId) {
    let storage = self.get_mut();
    if !storage.users.contains_key(&account_id) {
        panic!("The user is not found");
    }

    let msg_src = msg::source();

    if !storage.users.contains_key(&msg_src) {
        panic!("You are not registered");
    }

    storage
        .users
        .entry(account_id)
        .and_modify(|profile| profile.subscribers.push(msg_src));

    storage.users.entry(msg_src).and_modify(|profile| {
        profile.subscriptions.push(Subscription {
            account_id,
            sub_date: exec::block_timestamp(),
        })
    });

    self.notify_on(Event::Subscribed)
        .expect("Notification Error");
}
```

## Query

The `get_state` function returns all program information:

```rust title="w3bstreaming/app/src/lib.rs"
pub fn get_state(&self) -> ProgramState {
    self.get().clone().into()
}
```

## Source code

The source code of this example of P2P streaming program and the example of an implementation of its testing is available on [gear-foundation/dapp/contracts/w3bstreaming](https://github.com/gear-foundation/dapps/tree/master/contracts/w3bstreaming).

See also an example of the program testing implementation based on `gtest`: [gear-foundation/dapps/w3bstreaming/tests](https://github.com/gear-foundation/dapps/tree/master/contracts/w3bstreaming/tests).

For more details about testing programs written on Vara, refer to the [Program Testing](/docs/build/testing) article.
