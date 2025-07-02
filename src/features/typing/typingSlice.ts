import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { mapPlayerStats } from "../../helper/games";
import { PlayerDetail } from "../../routes/$room";

export interface TypingGameDetails {
  paragraph: string;
  limit: number;
  startTime: number | null;
  winner: string;
}

export interface TypingGameStats {
  wpm: number;
  mistakes: number;
  current: string;
  entry: string[];
  right: string[];
  timeFinished: number | null;
}

export type TypingGame = {
  stats: { [key in string]: TypingGameStats };
  details: TypingGameDetails;
};

const initialState: TypingGame | null = null as TypingGame | null;

export const typingSlice = createSlice({
  name: "typing",
  initialState,
  reducers: {
    initializedTyping: (
      _state,
      action: PayloadAction<{
        players: { [key: string]: PlayerDetail };
        gameDetails: TypingGameDetails;
      }>,
    ) => {
      const players = action.payload.players;
      const gameDetails = action.payload.gameDetails;

      const playerStats = mapPlayerStats("typing", players) as {
        [key in string]: TypingGameStats;
      };

      return { stats: playerStats, details: gameDetails };
    },
    typingReset: () => {
      return null;
    },
    startTypingGame(state, action: PayloadAction<number>) {
      state!.details.startTime = action.payload;
      return state;
    },
    typingEntryAdded: (
      state,
      action: PayloadAction<{ player: string; word: string }>,
    ) => {
      state!.stats[action.payload.player].entry.push(action.payload.word);
      const next = state!.stats[action.payload.player].right.shift();
      state!.stats[action.payload.player].current = next as string;
      return state;
    },
    typingUpdateData: (
      state,
      action: PayloadAction<{ player: string; gameStats: TypingGameStats }>,
    ) => {
      state!.stats[action.payload.player] = action.payload.gameStats;
      return state;
    },
    typingUpdateWPM: (
      state,
      action: PayloadAction<{ wpm: number; player: string }[]>,
    ) => {
      for (const { wpm, player } of action.payload) {
        state!.stats[player].wpm = wpm;
      }
      return state;
    },
    typingFinished(
      state,
      action: PayloadAction<{
        id: string;
        newScore: number;
        timeFinished: number;
      }>,
    ) {
      state!.details.winner = action.payload.id;
      state!.stats[action.payload.id].timeFinished =
        action.payload.timeFinished;
      return state;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    wordEntered: (state, _: PayloadAction<string>) => {
      // state!.entry.push(action.payload)
      return state;
    },
  },
});

export const {
  initializedTyping,
  startTypingGame,
  typingReset,
  typingEntryAdded,
  typingUpdateData,
  typingFinished,
  typingUpdateWPM,
} = typingSlice.actions;

// export const selectTyping = (state: RootState) => state.typing
export default typingSlice.reducer;
