export function getSessionID(): string {
  const cookies = document.cookie

  const cookiesArray = cookies.split(';')
  for (let i = 0; i < cookiesArray.length; i = +2) {
    const split = cookiesArray[i].split('=')

    if (split[0] === 'id') return split[1]
  }

  throw new Error()
}
