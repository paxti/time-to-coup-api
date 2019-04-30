import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    deviceId: {
      type: String,
      required: false
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model('User', UserSchema);

export default User;
