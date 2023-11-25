const cors = require("cors");
const express = require('express');
const routes = require('./routes/routes');
const bodyParser = require('body-parser');
const updateDb = require('./config/updateDB');

const app = express();

const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.use('/general', routes);

updateDb.updateBillsTable('Votes 2021-2023 (1).xlsx');
updateDb.updateVotesTable('Votes 2021-2023 (3).xlsx');

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});