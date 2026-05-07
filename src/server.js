import express from "express"
import fs from "fs"

const app = express()
const PORT = 3000

app.use(express.json())
app.use(express.static("public"))

// leer
function readData() {
    const data = fs.readFileSync("./src/db.json", "utf-8")
    return JSON.parse(data)
}

// guardar
function saveData(data) {
    fs.writeFileSync("./src/db.json", JSON.stringify(data, null, 2))
}


// GET
app.get("/malecon", (req, res) => {
    const data = readData()
    res.json(data)
})


// POST
app.post("/malecon", (req, res) => {
    const data = readData()

    data.push(req.body)

    saveData(data) 

    res.status(201).json({
        message: "creado con exito"
    })
})


// PUT
app.put("/malecon/:id", (req, res) => {
    const data = readData()
    const id = req.params.id

    const index = data.findIndex(r => r.id === id)

    if (index === -1) {
        return res.status(404).json({ message: "No encontrado" })
    }

    data[index] = req.body

    saveData(data)

    res.json({ message: "actualizado" })
})


// DELETE
app.delete("/malecon/:id", (req, res) => {
    let data = readData()
    const id = req.params.id

    data = data.filter(r => r.id !== id)

    saveData(data)

    res.json({ message: "eliminado" })
})


app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`)
})