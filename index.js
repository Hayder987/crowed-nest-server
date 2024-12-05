
require('dotenv').config()
const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
const app = express()
const port = process.env.PORT || 4000;

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASSWORD}@cluster0.7ya1e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function start() {
  try {
   
    const campaignCollection = client.db("crowedDB").collection("campaignData");
    const donationCollection = client.db("crowedDB").collection("donationData");

    app.post('/campaigns', async(req, res)=>{
        const body = req.body;
        const result = await campaignCollection.insertOne(body)
        res.send(result);
    })

    app.get('/campaigns', async(req, res)=>{
        const allData = await campaignCollection.find().toArray()
        res.send(allData)
    })

    app.get('/campaign/:id', async(req, res)=>{
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)}
        const result  = await campaignCollection.findOne(filter)
        res.send(result)
    })

    app.post('/donation', async(req, res)=>{
      const body = req.body;
      const result = await donationCollection.insertOne(body)
      res.send(result)
    })


   
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
   
  }
}
start().catch(console.dir);



app.get('/', (req, res)=>{
    res.send('Hello World! Server Is Running')
})

app.listen(port, ()=>{
    console.log(`Server Running At: ${port}`)
})