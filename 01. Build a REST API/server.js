import http from 'http'

const PORT = 8000

const server = http.createServer((req, res) => {
    res.end('This is from the server!')
})

server.listen(PORT, () => console.log(`server connected on port ${PORT}`))