import axios, { AxiosResponse } from 'axios'

export async function getGuestToken(): Promise<AxiosResponse> {
  const data = await axios.get('http://localhost:3000/auth/guest', {
    withCredentials: true,
  })

  return data
}
