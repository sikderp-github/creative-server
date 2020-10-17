const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xw9hf.azure.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express()
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
// app.use(express.static('creativedb'));
app.use(fileUpload());

const password = '0vCOX9T5N8BgP4TZ'
const port = 5000;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const serviceCollection = client.db("creativedb").collection("services");
    console.log('database connected');

    // send data to backend server from client site(1)
    app.post('/addServices1', (req, res) => {
        const file = req.files.file;
        const title = req.body.title;
        const description = req.body.description;

        const newImg = file.data;
        const encImg = newImg.toString('base64');

        var image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };
        console.log(title, description, image);

        serviceCollection.insertOne({ title, description, image })
            .then(result => {
                console.log(result);
                res.send(result.insertedCount > 0);
            })
    })

    app.post('/addServices', (req, res) => {
        console.log(req.body);
        const service = req.body;
        serviceCollection.insertOne(service)
            .then(result => {
                console.log(result);
                res.send(result.insertedCount > 0)
            })
    });

    // app.get('/appointments', (req, res) => {
    //     appointmentCollection.find({})
    //         .toArray((err, documents) => {
    //             res.send(documents);
    //         })
    // })
    // app.post('/addAppointment', (req, res) => {
    //     const appointment = req.body;
    //     appointmentCollection.insertOne(appointment)
    //         .then(result => {
    //             res.send(result.insertedCount > 0)
    //         })
    // });

    // app.get('/appointments', (req, res) => {
    //     appointmentCollection.find({})
    //         .toArray((err, documents) => {
    //             res.send(documents);
    //         })
    // })

});


app.get('/', (req, res) => {
    res.send('Hello World! Database is working!')
})


app.listen(process.env.PORT || port)