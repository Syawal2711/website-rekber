const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth')

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

app.use('/auth',authRoutes);

const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})
