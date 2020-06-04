export function entryFetch(axios, setEntry) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  axios
    .get('http://localhost:3600/', config)
    .then((res) => {
      if (res.status == 200) {
        const result = res.data
        setEntry(result)
      }
    })
    .catch((err) => console.error(err))
}
