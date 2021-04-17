import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  equation: {
    type: String,
    required: true
  },
  section: {
    type: Number,
    required: true
  },
  line: {
    type: Number,
    required: true
  },
  // user: {
  //   type: String,
  //   ref: 'User',
  //   required: true
  // },
  // project: {
  //   type: String,
  //   ref: 'Project',
  //   required: true
  // },
});

export default mongoose.models.Post || mongoose.model('Post', PostSchema)
