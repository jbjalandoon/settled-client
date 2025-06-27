import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { mapPlayerStats } from "../../helper/games";
import { PlayerDetail } from "../../routes/$room";

export type MemoryGameDetails = {
  sequence: number[];
  startTime: number | null;
  winner: string | null;
};
export type MemoryGameStats = {
  correctTiles: number;
  level: number;
  timeFinished: number | null;
};
export type MemoryGame = {
  stats: { [key in string]: MemoryGameStats };
  details: MemoryGameDetails;
};

const initialState: MemoryGame | null = null as MemoryGame | null;

export const memorySlice = createSlice({
  name: "memory",
  initialState,
  reducers: {
    initializedMemory: (
      _state,
      action: PayloadAction<{
        players: { [key: string]: PlayerDetail };
        gameDetails: MemoryGameDetails;
      }>,
    ) => {
      const players = action.payload.players;
      const gameDetails = action.payload.gameDetails;

      const playerStats = mapPlayerStats("memory", players) as {
        [key in string]: MemoryGameStats;
      };

      return { stats: playerStats, details: gameDetails };
    },
    memoryReset: () => {
      return null;
    },
    startMemoryGame: (state, action: PayloadAction<number>) => {
      state!.details.startTime = action.payload;
    },
    nextLevel: (state, action: PayloadAction<string>) => {
      state!.stats[action.payload].level++;
      return state;
    },
    memoryWinner: (
      state,
      action: PayloadAction<{
        winner: string | null;
        timeFinished: number | null;
      }>,
    ) => {
      if (!action.payload.winner) {
        return state;
      }
      state!.details.winner = action.payload.winner;
      if (action.payload.timeFinished) {
        state!.stats[action.payload.winner].timeFinished =
          action.payload.timeFinished;
      }

      return state;
    },
  },
});

export const {
  initializedMemory,
  startMemoryGame,
  nextLevel,
  memoryWinner,
  memoryReset,
} = memorySlice.actions;

export const selectMemory = (state: RootState) => state.memory;
export default memorySlice.reducer;
