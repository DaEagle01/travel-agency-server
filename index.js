const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
// middlewire
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dngm2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("allPlaces");
    const placeCollection = database.collection("places");
    const allBookingCollection = database.collection("allbooking");

    app.get("/places", async (req, res) => {
      const result = await placeCollection.find({}).toArray();
      // console.log(result);
      res.send(result);
    });

    // add places to the database
    app.post("/places", async (req, res) => {
      const result = await placeCollection.insertOne(req.body);
      console.log(result);
    });

    // get single api
    app.get("/places/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const user = await placeCollection.findOne(query);
      res.json(user);
    });

    // insert data
    app.post("/places/:id", async (req, res) => {
      const result = await allBookingCollection.insertOne(req.body);
      // console.log(result);
    });

    // all users api
    app.get("/allusers", async (req, res) => {
      const result = await allBookingCollection.find({}).toArray();
      res.send(result);
      // console.log(result);
    });

    app.get("/allusers/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await allBookingCollection.findOne(query);
      res.send(result);
    });

    app.put("/allusers/:id", async (req, res) => {
      const id = req.params.id;
      const updateStatus = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: updateStatus.status,
        },
      };

      const result = await allBookingCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    // delete a users booking
    app.delete("/allusers/:_id", async (req, res) => {
      const id = req.params._id;
      const query = { _id: ObjectId(id) };
      const result = await allBookingCollection.deleteOne(query);
      // console.log(res.body);
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World! what's going on? !");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
