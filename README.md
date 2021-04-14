# Project-Tyrann 👩‍⚖️
Bully Leader Election Algorithm implementation in Docker.

## Elements of the project

### Server 🗄

The server is the one that can be leader or follower at some point in the architecture, so it has both functionalities built in.

#### Checklist 📋
- [ ] Create the server in Typescript or other language.
- [ ] Generate the REST enpoints for the server, that should look something like this.
  - Request GET: /status
    ```JSON
    // response body 📤
    {
      response: 200 // OK
    }
    ```
  - Request POST: /election
    ```JSON
    // response body 📤
    {
      response: 200 // OK, and will takeover from here.
    }
    ```
  - Request PUT: /newLeaderPort
    ```JSON
    // request body 📥
    {
      newLeaderPort: 123456 // I'm the new leader, you should listen to this port.
    }
    ```
  - Request GET: /leaderPort
    ```JSON
    // response body 📤
    {
      leaderPort: 654321 // This is the current leader of the system.
    }
    ```
  - Request GET: /electionStatus
    ```JSON
    // response body 📤
    {
      electionStatus: false // An election is not ongoing yet.
    }
    ```
- [ ] Make two servers communicate with each other.
- [ ] The two servers should be sending `/status` requests every 3 or 10 seconds to the one that is the leader.
- [ ] If the leader fails to make a response, a new election is made by the server who detected the failure.
- [ ] The server should know which other nodes are more important than him.

#### Improvement 🎉
- [ ] May two or three requests be made as a Websocket, for it to be as realtime.

### Dashboard 🖥

This dashboard should be able to see the status of all of the servers in the system and their statuses.

#### Checklist 📋
 - [ ] Maybe as a websocket? For the real time of the statuses of the servers.
 - [ ] Show all of the servers in the system.
 - [ ] Get all of the statuses of the servers in the system.
 - [ ] Get the status of the leader of each server in the system.
 - [ ] Get the status of the election of each server in the system.

#### Improvement 🎉
 - [ ] Try to make it this time in Svelte for simplicity of build and stuff...
 - [ ] Show how the election is being made.
