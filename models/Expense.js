import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  description: String,
  amount: Number,
  date: Date,
  paidBy: String,
  participants: [String],
  houseName: String,
  paidByEach: [String],
  createdBy: String
});

export default mongoose.model('Expense', expenseSchema);




