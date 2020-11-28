require('dotenv').config();

import { mongoURI } from './config/keys';

require('./models/Paper');
require('./models/User');
require('./models/Review');

const mongoose = require('mongoose');
const { createApp } = require('./utils');

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// from https://mongoosejs.com/docs/deprecations.html#-findandmodify-
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

createApp(5000);
