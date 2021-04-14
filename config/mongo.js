const mongoose = require('mongoose');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () =>
  console.log('MongoDB db connection successfully established'),
);
db.once('close', () =>
  console.log('MongoDB db connection successfully terminated'),
);

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

module.exports.connectToMongoose = function connectToMongoose(dbURI) {
  mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};
