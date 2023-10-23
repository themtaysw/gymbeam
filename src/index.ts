import htpp from "http"
import dotenv from "dotenv"
import express from "express"

import { paths } from "./utils/paths"

import find from "./routes/find"

const app = express()
dotenv.config()
app.use(express.json())

// the port is stored in the .env file but it is not included in the repository
const port = process.env.PORT || 9999

app.use(paths.PATH, find)

const server = htpp.createServer(app)

server.listen(port, () => {
    console.log("Server is running on port " + port)
})
