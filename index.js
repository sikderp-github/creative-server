const express = require('express')
const bodyParser = require('body-parser')
var cors = require('cors')
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;

const app = express()
app.use(bodyParser.json())
app.use(cors())
app.use(fileUpload());

const port = 4000

const uri = `mongodb+srv://creativeUser:FOlHEtQnH2p6VDdJ@cluster0.keo8w.gcp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    // console.log(err);
    const serviceCollection = client.db("creativedb").collection("services");
    const bookingsCollection = client.db("creativedb").collection("bookServices");
    const reviewCollection = client.db("creativedb").collection("feedback");
    const adminCollection = client.db("creativedb").collection("adminPanel");

    app.post('/addServices', (req, res) => {
        const service = req.body;
        serviceCollection.insertMany(service)
            .then(result => {
                res.send(result.insertedCount > 0);

            })
    });

    // send data to server
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

        serviceCollection.insertOne({ title, image, description })
            .then(response => {
                res.send(response.insertedCount > 0)
            })
    })

    app.post('/orderServices', (req, res) => {
        const file = req.files.file;
        const name = req.body.name;
        const email = req.body.email;
        const bkService = req.body.bkService;
        const description = req.body.description;
        const price = req.body.price;

        const newImg = file.data;
        const encImg = newImg.toString('base64');

        var image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };
        bookingsCollection.insertOne({ name, email, bkService, description, price, image })
            .then(results => {
                res.send(results.insertedCount > 0);
            })
    })

    app.post('/addReview', (req, res) => {
        const file = req.files.file;
        const name = req.body.name;
        const company = req.body.company;
        const description = req.body.description;

        const newImg = file.data;
        const encImg = newImg.toString('base64');

        var image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };
        reviewCollection.insertOne({ name, company, description, image })
            .then(results => {
                res.send(results.insertedCount > 0);
            })
    })

    app.post('/addAdmin', (req, res) => {
        const email = req.body;
        adminCollection.insertOne(email)
            .then(result1 => {
                res.send(result1.insertedCount > 0);

            })
    });

    app.post('/isAdmin', (req, res) => {
        const email = req.body.email;
        // console.log(email);
        adminCollection.find({ email: email })
            .toArray((err, admins) => {
                res.send(admins.length > 0);
            })
    })


    //get data from server
    app.get('/reviews', (req, res) => {
        reviewCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.get('/services', (req, res) => {
        serviceCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.get('/allbookings', (req, res) => {
        bookingsCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.get('/allAdmin', (req, res) => {
        adminCollection.find({})
            .toArray((err, documents1) => {
                res.send(documents1);
            })
    })


});


app.get('/', (req, res) => {
    res.send('Hello World! Database is working!')
})

app.listen(port)