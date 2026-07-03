// Dependencies
const express = require('express');
const cors = require('cors');

// Sync DB
const sequelize = require('./src/config/db');
sequelize.sync({ alter: true })
    .then(() => console.log('Database updated!'))
    .catch((err) => console.log('Database sync error: ', err));

// Models
require('./src/models/mappingContext');

const app = express();
app.use(express.json());
app.use(cors());


app.listen(3000, () => console.log('Server is listening on port 3000!'));