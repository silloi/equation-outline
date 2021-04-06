import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  photoUrl: {
    type: String
  },
});

mongoose.models = {};

const User = mongoose.model('User', UserSchema);

export default User;
