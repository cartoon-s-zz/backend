import routes from './routes';

const express = require('express')
const app = express()
const cors = require('cors');
const path = require('path');

// body parser module
// to pass json to api server
const bodyParser = require('body-parser')

app.use(cors());

app.use(express.static(path.join(__dirname, 'build')));

app.use('/.well-known', express.static('.well-known'));

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: true }))

app.use(function (req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next()
});

app.use('/api/scg', routes.scg);

// listening to port 3000 (localhost)
app.listen(3001, () => {
  console.log('Start server at port 3001.')
})
