import { createFileRoute } from "@tanstack/react-router";
import { getRoom } from "../api/room";
import RoomComponent from "../features/room/Room";
import {
  GameDetails,
  Games,
  GameStats,
  RoomStatus,
} from "../features/room/roomSlice";

export type PlayerDetail = {
  name: string | null;
  ready: boolean;
  avatar: number;
  score: number;
  gameStats?: GameStats | null;
};

export type LoaderData = {
  host: string;
  games: Games[];
  gameDetails?: GameDetails;
  players: { [key: string]: PlayerDetail };
  status: RoomStatus;
  phase: number;
  joined: boolean;
  winner: string | null;
};

export const Route = createFileRoute("/$room")({
  loader: async ({ params }): Promise<LoaderData | null> => {
    try {
      const { data, status } = await getRoom(params.room);

      if (status === 500) {
        return null;
      }

      return data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err) {
      return null;
    }
  },
  component: RoomComponent,
});
