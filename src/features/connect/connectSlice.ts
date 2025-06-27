import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export type ConnectGameDetails = {
  grid: (string | null)[][];
  currentPlayer: string;
  startTime: number | null;
  turn: number;
  winner: string | null;
};

export type ConnectGameStats = null;

export type ConnectGame = {
  stats: ConnectGameStats;
  details: ConnectGameDetails;
};

const initialState: ConnectGame | null = null as ConnectGame | null;

export const connectSlice = createSlice({
  name: "connect",
  initialState,
  reducers: {
    initializedConnect: (
      _state,
      action: PayloadAction<{
        gameDetails: ConnectGameDetails;
      }>,
    ) => {
      const gameDetails = action.payload.gameDetails;

      return { stats: null, details: gameDetails };
    },
    tokenDropped: (
      state,
      action: PayloadAction<{
        row: number;
        col: number;
        player: string;
        next: string;
      }>,
    ) => {
      state!.details.grid[action.payload.row][action.payload.col] =
        action.payload.player;
      state!.details.currentPlayer = action.payload.next;
      return state;
    },
    connectWinner: (state, action: PayloadAction<string>) => {
      state!.details.winner = action.payload;
      return state;
    },
    connectReset: (state) => {
      state!.details.turn = 0;
      const grid = new Array<(string | null)[]>(6).fill(
        new Array<string | null>(7).fill(null),
      );
      state!.details.grid = grid;
      return state;
    },
    nextTurn: (state, action: PayloadAction<string>) => {
      state!.details.currentPlayer = action.payload;
      return state;
    },
  },
});

export const {
  initializedConnect,
  tokenDropped,
  nextTurn,
  connectWinner,
  connectReset,
} = connectSlice.actions;

export const selectConnect = (state: RootState) => state.connect;
export default connectSlice.reducer;
