
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

    app.delete('/campaigns/:id', async(req, res)=>{
      const id = req.params.id;
      console.log(id)
      const query = {_id: new ObjectId(id)}
      const result = await campaignCollection.deleteOne(query);
      res.send(result)
    })

    app.patch('/campaign/:id', async(req, res)=>{
        const id = req.params.id;
        const body = req.body;
        const filter = {_id: new ObjectId(id)}
        const {imgPath, title, campaignType, description, amount, deadline} = body
        const updateDoc = {
          $set: {
            imgPath:imgPath,
            title:title,
            campaignType:campaignType,
            description:description,
            amount:amount,
            deadline:deadline
          },
        };

        const result = await campaignCollection.updateOne(filter, updateDoc)
        res.send(result)
    })


    app.get('/user/:email', async (req, res) => {
      const email = req.params.email; 
      const query = { useremail: email }; 
      const result = await campaignCollection.find(query).toArray(); 
      res.send(result); 
    });

    
    app.get('/recent', async(req, res)=>{
      const date = new Date();
      const formatDate = (currentDate) => {
        return currentDate.toISOString().split("T")[0];
      };

      const newDate = formatDate(date);

      const query = { deadline: { $gt: newDate } };
      const options = {
        sort: { deadline: 1 }, 
        limit: 8,
      };
      const result = await campaignCollection.find(query, options).toArray();
      res.send(result)
    })


    app.post('/donation', async(req, res)=>{
      const body = req.body;
      const result = await donationCollection.insertOne(body)
      res.send(result)
    })

    app.get('/donation/:email', async(req, res)=>{
      const email = req.params.email;
      const query = {email: email}
      const result = await donationCollection.find(query).toArray()
      res.send(result)
    })

    app.delete('/donation/:email', async(req, res)=>{
      const email = req.params.email;
      const filter = {email:email}
      const result  = await donationCollection.deleteMany(filter)
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