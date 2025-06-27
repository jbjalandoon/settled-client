import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { mapPlayerStats } from "../../helper/games";
import { PlayerDetail } from "../../routes/$room";

export type TieBreakerGameDetails = {
  status: "waiting" | "reveal";
  winner: string | null;
};

export type TieBreakerChoices = "rock" | "paper" | "scissor";

export type TieBreakerGameStats = {
  chosen: TieBreakerChoices | null;
  lockedIn: boolean;
  score: number;
};

export type TieBreakerGame = {
  stats: { [key in string]: TieBreakerGameStats };
  details: TieBreakerGameDetails;
};

const initialState: TieBreakerGame | null = null as TieBreakerGame | null;

export const tieBreakerSlice = createSlice({
  name: "tieBreaker",
  initialState,
  reducers: {
    addTieBreaker: (
      _,
      action: PayloadAction<{
        details: TieBreakerGameDetails;
        stats: { [key in string]: TieBreakerGameStats };
      }>,
    ) => {
      return action.payload;
    },
    initializedTieBreaker: (
      _,
      action: PayloadAction<{
        players: { [key: string]: PlayerDetail };
        gameDetails: TieBreakerGameDetails;
      }>,
    ) => {
      const players = action.payload.players;
      const gameDetails = action.payload.gameDetails;

      const playerStats = mapPlayerStats("tieBreaker", players) as {
        [key in string]: TieBreakerGameStats;
      };

      return { stats: playerStats, details: gameDetails };
    },
    toggleLockIn: (
      state,
      action: PayloadAction<{ id: string; chosen: TieBreakerChoices | null }>,
    ) => {
      state!.stats[action.payload.id].lockedIn =
        !state!.stats[action.payload.id].lockedIn;
      state!.stats[action.payload.id].chosen = action.payload.chosen;
      return state;
    },
    tieBreakerAddPoint: (
      state,
      action: PayloadAction<{
        winner: string;
      }>,
    ) => {
      console.log(action.payload.winner);
      state!.stats[action.payload.winner].score += 1;

      return state;
    },
    tieBreakerReset: (state) => {
      for (const key of Object.keys(state!.stats)) {
        state!.stats[key].chosen = null;
        state!.stats[key].lockedIn = false;
      }
      return state;
    },
    tieBreakerReveal: (
      state,
      action: PayloadAction<{ [key in string]: TieBreakerChoices }>,
    ) => {
      const keys = Object.keys(action.payload);
      for (const key of keys) {
        state!.stats[key].chosen = action.payload[key];
      }
    },
    tieBreakerWinner: (state, action: PayloadAction<string>) => {
      state!.details.winner = action.payload;
      return state;
    },
  },
});

export const {
  toggleLockIn,
  initializedTieBreaker,
  addTieBreaker,
  tieBreakerAddPoint,
  tieBreakerReveal,
  tieBreakerReset,
  tieBreakerWinner,
} = tieBreakerSlice.actions;

export const selectTieBreaker = (state: RootState) => state.tieBreaker;
export default tieBreakerSlice.reducer;
