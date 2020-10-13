const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();


const app = express()
app.use(bodyParser.json());
app.use(cors());

const password = '0vCOX9T5N8BgP4TZ'

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xw9hf.azure.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const serviceCollection = client.db("creativedb").collection("services");
    console.log('database connected');
    // perform actions on the collection object


});


app.get('/', (req, res) => {
    res.send('Hello World! Database is working!')
})

app.listen(3005 || process.env.PORT)