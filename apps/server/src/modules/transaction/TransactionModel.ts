import mongoose, { Document, Model, Schema, Types } from "mongoose";

const TransactionSchema = new Schema(
  {
    amount: {
      type: Number,
      min: [0.01, 'Transaction amount must be positive.'],
      description: 'The value of the transaction.',
    },
    fromAccountId: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      description: 'The account where the amount originated from (sender).',
    },
    toAccountId: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      description: 'The account that received the amount (receiver).',
    }
  },
  {
    timestamps: true,
    collection: 'Transaction',
  }
);

export interface ITransaction extends Document {
  amount: number;
  fromAccountId: Types.ObjectId;
  toAccountId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const Transaction: Model<ITransaction> = mongoose.models['Transaction'] || mongoose.model('Transaction', TransactionSchema);
