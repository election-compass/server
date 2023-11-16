const cors = require("cors");
const express = require('express');
const routes = require('./routes/routes');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');
const t = require('./config/updateDB');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/general', routes);

// t();

sequelize
  .sync()
  .then(() => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
