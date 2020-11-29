import dotenv from 'dotenv';
dotenv.config();

import { mongoURI } from './config/keys';

require('./models/Paper');
require('./models/User');
require('./models/Review');

import mongoose from 'mongoose';
import createApp from './utils';

if (!mongoURI) throw Error('gotta have a Mongo URI, man!');

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// from https://mongoosejs.com/docs/deprecations.html#-findandmodify-
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

createApp(5000);
