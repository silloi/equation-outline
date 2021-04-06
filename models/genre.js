import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const GenreSchema = new Schema({
  name: {
    type: String,
    required: true
  },
});

mongoose.models = {};

const Genre = mongoose.model('Project', GenreSchema);

export default Genre;
