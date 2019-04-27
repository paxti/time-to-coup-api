/* eslint-disable no-underscore-dangle */
import mongoose from 'mongoose';

const { Schema } = mongoose;

const SessionSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  rounds: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Round'
    }
  ]
});

const Session = mongoose.model('Session', SessionSchema);

export default Session;
