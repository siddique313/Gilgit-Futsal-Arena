import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway({
  cors: { origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000" },
  path: "/realtime",
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  handleConnection() {
    // Optional: log or auth
  }

  handleDisconnect() {
    // Optional: cleanup
  }

  /** Broadcast tournament list or single tournament changed */
  broadcastTournamentUpdate(payload: { tournamentId?: string; slug?: string }) {
    this.server.emit("tournament:updated", payload);
  }

  /** Broadcast match update for a tournament */
  broadcastMatchUpdate(payload: { tournamentId: string; matchId?: string }) {
    this.server.emit("match:updated", payload);
  }

  /** Broadcast standings update for a tournament */
  broadcastStandingsUpdate(payload: { tournamentId: string }) {
    this.server.emit("standings:updated", payload);
  }
}
