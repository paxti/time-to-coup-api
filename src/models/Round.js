import mongoose from 'mongoose';

const { Schema } = mongoose;

const RoundSchema = new Schema({
  winner: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    required: true
  },
  players: {
    type: Array,
    of: String,
    required: true
  }
});

const Round = mongoose.model('Round', RoundSchema);

export default Round;
