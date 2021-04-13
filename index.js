if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
/* eslint-disable no-console */
const express = require('express');
const path = require('path');
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');
require('./config/passport')();
const { connectToMongoose } = require('./config/mongo');
const routes = require('./api/routes/index');

const app = express();

app.use(cors());
app.use(require('morgan')('dev'));
app.use(express.static(path.join(__dirname, 'public')));
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

app.use('/api', routes);

connectToMongoose(dbURI);
app.listen(port, () => console.log(`Server is running on port: ${port}`));

const PORT = process.env.PORT || 8080;

startServer(process.env.DB_URI, PORT);
