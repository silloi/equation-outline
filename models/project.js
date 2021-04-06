import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  genre: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Genre'
    }
  ],
});

mongoose.models = {};

const Project = mongoose.model('Project', ProjectSchema);

export default Project;
