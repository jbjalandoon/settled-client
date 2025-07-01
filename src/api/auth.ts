import { AxiosResponse } from "axios";
import api from "../helper/axios";

export async function getGuestToken(): Promise<AxiosResponse> {
  const data = await api.get("auth/guest");

  return data;
}
