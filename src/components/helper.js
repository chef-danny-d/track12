import axios from 'axios'

export function entryFetch(setEntry) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  axios
    .get(process.env.REACT_APP_URL, config)
    .then((res) => {
      if (res.status == 200) {
        const result = res.data
        setEntry(result)
      }
    })
    .catch((err) => console.error(err))
}

export const fetchLocation = (lat, lng) => {
  axios
    .get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_GOOGLE_MAPS}`
    )
    .then((res) => {
      if (res.status == 200) {
        const result = res.data.results[0].formatted_address
        return result
      }
    })
    .catch((err) => {
      console.error(err)
    })
}
