if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//Models
const Appuser = require('./models/Appuser');
const Nft = require('./models/Nft');

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true,
}));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/set', async (req, res) => {
    const { username, items } = req.body;

    if (!username || !items) {
        return res.status(400).send('Invalid input');
    }

    const user = await Appuser.findOne({ username: username });

    if (!user) {
        const newUser = new Appuser({
            username: username,
            items: [items],
        });
        await newUser.save();
    }
    else {
        user.items.push(items);
        await user.save();
    }

    res.status(200).send('Set');
})

app.post('/addnft', )

mongoose.connect(process.env.MONGO_URI).then(() => {
    server.listen(process.env.PORT || 5000, () => console.log('SERVER RUNNING: http://localhost:5000'));
}).catch(err => console.log(err));
