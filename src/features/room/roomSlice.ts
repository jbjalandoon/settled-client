import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { MemoryGameDetails, MemoryGameStats } from "../memory/memorySlice";
import { TypingGameDetails, TypingGameStats } from "../typing/typingSlice";
import { ConnectGameDetails } from "../connect/connectSlice";
import {
  TieBreakerGameDetails,
  TieBreakerGameStats,
} from "../tie-breaker/tieBreakerSlice";

export type RoomStatus =
  | "lobby"
  | "in-game"
  | "pre-game"
  | "tie-breaker"
  | "ended";

export type Games = "typing" | "memory" | "connect" | "tieBreaker";

export type GameStats = {
  typing: TypingGameStats;
  memory: MemoryGameStats;
  connect: null;
  tieBreaker: TieBreakerGameStats;
};

export interface Player {
  [key: string]: PlayerDetail;
}

export type PlayerDetail = {
  name: string | null;
  ready: boolean;
  avatar: number;
  score: number;
};

export interface GameDetails {
  typing: TypingGameDetails;
  memory: MemoryGameDetails;
  connect: ConnectGameDetails;
  tieBreaker: TieBreakerGameDetails;
}

export type Room = {
  host: string;
  games: Games[];
  players: Player;
  status: RoomStatus;
  phase: number;
  joined: boolean;
  winner: string | null;
};

const initialState: Room | null = null as Room | null;

export const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    leaveRoomURL: () => {
      return null;
    },
    initializedRoom: (_state, action: PayloadAction<Room>) => {
      return action.payload;
    },
    resetRoom: (_state, action: PayloadAction<Room>) => {
      return action.payload;
    },
    changedName: (
      state,
      action: PayloadAction<{ id: string; name: string }>,
    ) => {
      state!.players[action.payload.id].name = action.payload.name;
      return state;
    },
    playerLeave: (
      state,
      action: PayloadAction<{ id: string; joined: boolean }>,
    ) => {
      if (state?.host === action.payload.id) {
        state!.host = Object.keys(state!.players).filter(
          (el) => el !== action.payload.id,
        )[0];
      }
      delete state!.players[action.payload.id];
      state!.joined = action.payload.joined;
      return state;
    },
    playerJoined: (
      state,
      action: PayloadAction<{ playerDetail: PlayerDetail; id: string }>,
    ) => {
      state!.players[action.payload.id] = action.payload.playerDetail;
      state!.joined = true;
      return state;
    },
    avatarChanged: (
      state,
      action: PayloadAction<{ player: string; avatar: number }>,
    ) => {
      state!.players[action.payload.player].avatar = action.payload.avatar;
      return state;
    },
    gameToggled: (state, action: PayloadAction<Games[]>) => {
      state!.games = action.payload;
      return state;
    },
    roomStarted: (
      state,
      action: PayloadAction<{
        gameDetails: GameDetails;
        players: Player;
        status: RoomStatus;
        phase: number;
      }>,
    ) => {
      state!.players = action.payload.players;
      state!.status = action.payload.status;
      state!.phase = action.payload.phase;
      return state;
    },
    gameEnded: (state, action: PayloadAction<string>) => {
      state!.winner = action.payload;
      state!.status = "ended";
      return;
    },
    gameTieBreaker: (state) => {
      state!.games.push("tieBreaker");
      return state;
    },
    playerReady: (
      state,
      action: PayloadAction<{ id: string; ready: boolean }>,
    ) => {
      state!.players[action.payload.id].ready = action.payload.ready;
      return state;
    },
    playerWon: (state, action: PayloadAction<string | null>) => {
      if (!action.payload) {
        for (const key in state!.players) {
          state!.players[key].score++;
        }
        return state;
      }
      state!.players[action.payload].score++;
      return state;
    },
    nextGameStarted: (state) => {
      for (const key of Object.keys(state!.players)) {
        state!.players[key].ready = false;
      }
      state!.status = "in-game";
      return state;
    },
    nextPhaseUpdated: (state, action: PayloadAction<number>) => {
      state!.phase = action.payload;
      state!.status = "pre-game";
      return state;
    },
  },
});

export const {
  leaveRoomURL,
  initializedRoom,
  changedName,
  playerJoined,
  playerLeave,
  gameToggled,
  roomStarted,
  playerReady,
  nextGameStarted,
  nextPhaseUpdated,
  playerWon,
  avatarChanged,
  gameEnded,
  resetRoom,
  gameTieBreaker,
} = roomSlice.actions;

export const selectRoom = (state: RootState) => state.room;
export default roomSlice.reducer;
