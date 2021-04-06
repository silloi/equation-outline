import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  equation: {
    type: String,
    required: true
  },
  level1: {
    type: Number,
    required: true
  },
  level2: {
    type: Number,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
});

mongoose.models = {};

const Post = mongoose.model('Post', PostSchema);

export default Post;
