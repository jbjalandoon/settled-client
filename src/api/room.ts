import { AxiosResponse } from "axios";
import { Room } from "../features/room/roomSlice";
import api from "../helper/axios";
import { LoaderData } from "../routes/$room";

export type GetRoom = {
  room: Room;
  joined: boolean;
};

export async function createRoom(
  name: string,
  avatar: number,
): Promise<AxiosResponse<{ id: string }>> {
  const data = await api.post<{ id: string }>("room", {
    name,
    avatar,
  });
  return data;
}

export async function startRoom(room: string): Promise<AxiosResponse> {
  const data = api.patch("room/start/" + room);

  return data;
}

export async function getRoom(id: string): Promise<AxiosResponse<LoaderData>> {
  const data = await api.get<LoaderData>("room/" + id);

  return data;
}

export async function setName(
  room: string,
  name: string,
): Promise<AxiosResponse<{ id: string; name: string }>> {
  const data = await api.patch<{ id: string; name: string }>(
    "room/name/" + room,
    {
      name: name,
    },
  );

  return data;
}

export async function joinRoom(
  room: string,
  nickname?: string,
  avatar?: number,
) {
  const data = await api.patch("room/join/" + room, {
    name: nickname,
    avatar,
  });
  return data;
}

export async function leaveRoom(room: string) {
  const data = await api.delete("room/leave/" + room);
  return data;
}

export async function resetRoom(room: string): Promise<AxiosResponse<Room>> {
  const data = await api.patch("room/reset/" + room);

  return data;
}
