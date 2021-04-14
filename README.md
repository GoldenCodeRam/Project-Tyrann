# Project-Tyrann 👩‍⚖️
Bully Leader Election Algorithm implementation in Docker. Using [this 🔗](https://www.cs.colostate.edu/~cs551/CourseNotes/Synchronization/BullyExample.html) page as an example of the bully algorithm.

## Elements of the project

### Server 🗄

The server is the one that can be leader or follower at some point in the architecture, so it has both functionalities built in.

#### Checklist 📋
- [ ] Create the server in Typescript or other language.
- [ ] Generate the REST enpoints for the server, that should look something like this.
  - Request GET: /status
    ```JSON
    // response body 📤
    // OK
    {
      "response": 200
    }
    ```
  - Request POST: /election
    ```JSON
    // response body 📤
    // OK, and will takeover from here.
    {
      "response": 200 
    }
    ```
  - Request PUT: /newLeaderPort
    ```JSON
    // request body 📥
    // I'm the new leader, you should listen to this port.
    {
      "newLeaderPort": 123456
    }
    ```
  - Request GET: /leaderPort
    ```JSON
    // response body 📤
    // This is the current leader of the system.
    {
      "leaderPort": 654321
    }
    ```
  - Request GET: /electionStatus
    ```JSON
    // response body 📤
    // An election is not ongoing yet.
    {
      "electionStatus": false
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
 - [ ] Try to make it this time in [Svelte 🔗](https://svelte.dev/) for simplicity of build and stuff...
 - [ ] Show how the election is being made.
