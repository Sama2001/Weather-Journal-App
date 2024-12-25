//server
projectData = {};

// Require Express to run server and routes
const express = require('express');

const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const cors = require('cors');
app.use(cors());

app.use(express.static('website'));

// Setup Server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on localhost:${port}`);
});

app.post('/add', (req, res) => {
    console.log('Received POST request with data:', req.body);
    projectData = req.body;
    res.send({ message: 'Data added successfully!' });
});

app.get('/all', (req, res) => {
    console.log('Received GET request for /all');
    res.send(projectData);
});
