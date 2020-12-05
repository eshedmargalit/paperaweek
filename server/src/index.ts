import mongoose from 'mongoose';

import createApp from './utils';

import './models/User';
import './models/Paper';
import './models/Review';
import { getEnvironmentVariable } from './config/keys';

require('dotenv').config();

mongoose.connect(getEnvironmentVariable('mongoURI'), {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// from https://mongoosejs.com/docs/deprecations.html#-findandmodify-
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

const PORT = 5000;

createApp().listen(PORT, () => {
  console.log(`📝 Listening on port: ${PORT}`);
});
