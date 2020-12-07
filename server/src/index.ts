import mongoose from 'mongoose';

import createApp from './utils';

import { getEnvironmentVariable } from './config/keys';
import './models/User';
import './models/Paper';
import './models/Review';

mongoose.connect(getEnvironmentVariable('MONGO_URI'), {
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
