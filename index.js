const express = require('express')
const cors = require('cors')
const port = process.env.PORT || 4000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()


const app = express()
app.use(cors())
app.use(express.json())



app.get("/", (req, res) => {
    res.send("server is running")
})


const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.sinogwr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    // await client.db("admin").command({ ping: 1 });
    const database = client.db("coffee_shop(KOFI)");
    const products = database.collection("products");

    app.get('/api/v1/products', async (req, res) => {
        const page = parseInt(req.query.page)
        const size = parseInt(req.query.size)
        const result = await products.find().skip(page*size).limit(size).toArray()       
        res.send(result)
    })

    app.get("/api/v1/productcount", async (req, res) => {
        const result = await products.estimatedDocumentCount()
        console.log(result);
        res.send({result})
    })

    app.get('/api/v1/product_details/:id', async(req, res) => {
      const id = red.params.id
      console.log(id);
    })

    app.get('/api/v1/productDetails/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) };
      const result = await products.findOne(query)
      res.send(result)
    })

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);



app.listen(port, () => {
    console.log(`server is runnning at ${port}`);
})