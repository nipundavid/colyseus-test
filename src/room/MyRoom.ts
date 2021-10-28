import { Room, Client } from "colyseus";
import { Schema, type, MapSchema } from "@colyseus/schema";
import { json } from "express";

export class Player extends Schema {
  @type("string") name: string;
  @type("number")
  x = Math.floor(Math.random() * 400);

  @type("number")
  y = Math.floor(Math.random() * 400);
}

export class State extends Schema {
  @type({ map: Player })
  players = new MapSchema<Player>();

  something = "This attribute won't be sent to the client-side";

  createPlayer(sessionId: string) {
    this.players.set(sessionId, new Player());
  }

  removePlayer(sessionId: string) {
    this.players.delete(sessionId);
  }

  movePlayer(sessionId: string, movement: any) {
    this.players.get(sessionId).name = sessionId;
    if (movement.x) {
      this.players.get(sessionId).x += movement.x * 10;
    } else if (movement.y) {
      this.players.get(sessionId).y += movement.y * 10;
    }
  }
}
export class MyRoom extends Room {
  // When room is initialized
  onCreate(options: any) {
    console.log(`${JSON.stringify(options)} created`);
    this.setState(new State());

    this.onMessage("move", (client, data) => {
      console.log(
        "StateHandlerRoom received message from",
        client.sessionId,
        ":",
        data
      );
      this.state.movePlayer(client.sessionId, data);
    });
  }

  // When client successfully join the room
  onJoin(client: Client, options: any, auth: any) {
    console.log(`${client.sessionId} Joined`);
    this.state.createPlayer(client.sessionId);
  }

  // When a client leaves the room
  onLeave(client: Client, consented: boolean) {
    console.log(`${client.sessionId} Leaving`);
    this.state.removePlayer(client.sessionId);
  }

  // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
  onDispose() {}
}
