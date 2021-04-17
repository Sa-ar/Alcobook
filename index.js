if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
/* eslint-disable no-console */
const http = require('http');
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');
require('./config/passport')();
const { connectToMongoose } = require('./config/mongo');
const routes = require('./api/routes/index');

const app = express();

const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:8080',
    ],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Access-Control-Allow-Origin'],
    credentials: true,
  },
});

const port = process.env.PORT || 8080;

app.use(cors());
app.use(require('morgan')('dev'));
app.use(
  session({
    secret: process.env.PASSPORT_SECRET,
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

require('./socket').connect(io);

connectToMongoose(process.env.DB_URI);
server.listen(port, () => console.log(`Server is running on port: ${port}`));
