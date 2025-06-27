import { Games } from "../features/room/roomSlice";
import { PlayerDetail } from "../routes/$room";

export const mapPlayerStats = (
  game: Games,
  players: { [key: string]: PlayerDetail },
) => {
  try {
    return Object.fromEntries(
      Object.entries(players).map(([key, value]) => {
        if (!value.gameStats) {
          throw new Error();
        }

        return [key, { ...value.gameStats[game] }];
      }),
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    return null;
  }
};
