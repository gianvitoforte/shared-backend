import mongoose from 'mongoose';

const HouseSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    members: [String]
});

export default mongoose.model('House', HouseSchema);

