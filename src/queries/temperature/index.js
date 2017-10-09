export default function (options) {
  const queries = {}

  queries.getTemp = (req, res) => {
    res.status(200)
    .json({
      body: 'success'
    })
  }

  return queries
}
