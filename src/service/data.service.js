export const DataService = {
  get(url, params) {
    return fetch(url, {
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(res => res.json())
  },
  post(url, params) {
    return fetch(url, {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      data: JSON.stringify(params.data)
    })
    .then(res => res.json())
  }
}