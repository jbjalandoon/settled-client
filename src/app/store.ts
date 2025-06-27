import { configureStore } from "@reduxjs/toolkit";
import roomSliceReducer from "../features/room/roomSlice";
import memorySliceReducer from "../features/memory/memorySlice";
import typingSliceReducer from "../features/typing/typingSlice";
import connectSliceReducer from "../features/connect/connectSlice";
import tieBreakerSliceReducer from "../features/tie-breaker/tieBreakerSlice";

export const store = configureStore({
  reducer: {
    room: roomSliceReducer,
    memory: memorySliceReducer,
    typing: typingSliceReducer,
    connect: connectSliceReducer,
    tieBreaker: tieBreakerSliceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
