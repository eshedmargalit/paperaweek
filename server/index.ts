import dotenv from 'dotenv';
dotenv.config();

import { mongoURI } from './config/keys';

import mongoose from 'mongoose';
import createApp from './utils';

import './models/User';
import './models/Paper';
import './models/Review';

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
