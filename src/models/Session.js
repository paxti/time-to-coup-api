/* eslint-disable no-underscore-dangle */
import mongoose from 'mongoose';

const { Schema } = mongoose;

const SessionSchema = new Schema({
  name: {
    type: String,
    required: true
  }
});

const Session = mongoose.model('Session', SessionSchema);

export default Session;
