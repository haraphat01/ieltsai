import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  image: String,
  progress: {
    academic: {
      reading: [{ score: Number, date: Date }],
      writing: [{ score: Number, date: Date }],
      listening: [{ score: Number, date: Date }],
      speaking: [{ score: Number, date: Date }],
    },
    general: {
      reading: [{ score: Number, date: Date }],
      writing: [{ score: Number, date: Date }],
      listening: [{ score: Number, date: Date }],
      speaking: [{ score: Number, date: Date }],
    },
  },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);