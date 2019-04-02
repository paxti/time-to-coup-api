import mongoose from 'mongoose';

const { Schema } = mongoose;

const SessionSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  }
});

const Session = mongoose.model('Session', SessionSchema);

export default Session;
