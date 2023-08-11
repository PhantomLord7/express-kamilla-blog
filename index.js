import express from "express"
import { Level } from "level"
import cors from "cors";
import crypto from "node:crypto"

const PORT = 1488

const app = express()
const db = new Level('./db', {valueEncoding: "json"})

app.use(cors({
    origin: "*"
}))
app.use(express.json())

app.get("/posts", async (req, res) => {
    const posts = [];

    const iterator = db.iterator();
    
    await new Promise((resolve, reject) => {
        const readNextValue = () => {
          iterator.next((err, key, value) => {
            if (err) {
              reject(err);
            } else if (key === undefined && value === undefined) {
              resolve();
            } else if (value !== undefined) {
              try {
                const parsedValue = JSON.parse(value);
                posts.push(parsedValue);
              } catch (e) {
                console.error("Error parsing JSON value:", e);
              }
              readNextValue();
            } else {
              readNextValue();
            }
          });
        };
      
        readNextValue();
      });
    res.json(posts);
});

app.post("/create", async (req, res) => {
    const { title, date, text } = req.body

    if(title === undefined || date === undefined || text === undefined) {
        return res.status(404).send({status: false, message: "all fields are required"})
    }

    const id = crypto.randomBytes(32).toString("hex")

    let post = {
        id: id,
        title: title,
        date: date,
        text: text
    }

    try {
        await db.put(id, JSON.stringify(post))
    } catch (error) {
        return res.status(404).send({status: false, message: `db error`})
    }

    res.send(`Kamilla, post with title: ${title} created!`)
})

app.delete("/delete/:id", async (req, res) => {
  const { id } = req.params

  if(id === undefined) {
    return res.status(400).send({status: false, message: "id is missing"})
  }

  try {
    await db.del(id)
    res.send(`post with id: ${id} deleted`)
  } catch (error) {
    res.status(404).send({status: false, message: "post with this id not found"})
  }
})

app.get("/byid/:id", async (req, res) => {
  const { id } = req.params

  if(id === undefined) {
    return res.status(400).send({status: false, message: "id is missing"})
  }

  try {
    let post = await db.get(id)
    res.send(post)
  } catch (error) {
    res.status(404).send({status: false, message: "post with this id not found"})
  }
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});