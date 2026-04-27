import http from 'node:http'
import { getDataFromDB } from './database/db.js'
 
const PORT = 8000

const server = http.createServer(async (req, res) => {
  const destinations = await getDataFromDB()

  function handleResponse(contentType, statusCode, body) {
    res.setHeader('Content-Type', contentType)
    res.statusCode = statusCode
    res.end(JSON.stringify(body))
  }

  function filterData(destinations) {
    const filterBy = req.url.split('/').at(2)
    const searchParam = req.url.split('/').at(3)
    const filteredData = destinations.filter((destination) => destination[filterBy].toLowerCase() === searchParam)
    
    if (filteredData.length > 0) {
      handleResponse('application/json', 200, filteredData)
    } else {
      const errorReturn = { error: 'not found', message: 'Invalid request: continent' }
      handleResponse('application/json', 404, errorReturn)
    }
  }

  if (req.url === '/api' && req.method === 'GET') { 
    handleResponse('application/json', 200, destinations)
  } else if (req.url.startsWith('/api/continent') || req.url.startsWith('/api/country')) {
    filterData(destinations)
  }
  else {
    const errorReturn = { error: 'not found', message: 'The requested route does not exist' }
    handleResponse('application/json', 404, errorReturn)
  }
})

server.listen(PORT, () => console.log(`Connected on port: ${PORT}`))