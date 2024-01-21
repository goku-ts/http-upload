import http from "node:http"
import fs from "node:fs/promises"
import { pipeline } from "node:stream"

const server = http.createServer()

server.on("request", async (request, response) => {

    const index = request.rawHeaders.indexOf("Content-Type") + 1
    const subIndex = request.rawHeaders[index].indexOf("/")
    let extention = request.rawHeaders[index].substring(subIndex + 1)

    const genNumber = Math.trunc(Math.random() * 999) + 1

    const fileHandle = await fs.open(`storage/${genNumber}.${extention}`, "w")
    const writeFile = fileHandle.createWriteStream()

    pipeline(request, writeFile, (err) => {
        if (err) {
            response.end(
                JSON.stringify({ message: "problem uploading file.. try again" })
            )
        }
    })

    writeFile.on("finish", () => {
        response.end(
            JSON.stringify({ message: "file uploaded successfully" })
        )

    })
})


server.listen(10000 , () => console.log("server running"))