import mongoose from 'mongoose';

import createApp from './utils';

import { getEnvironmentVariable } from './config/keys';
import './models/User';
import './models/Paper';
import './models/Review';

// Mongoose 8.x - deprecated options and methods removed
mongoose.connect(getEnvironmentVariable('MONGO_URI'));

const PORT = process.env.PORT || 5000;

createApp().listen(PORT, () => {
  console.log(`📝 Listening on port: ${PORT}`);
});
