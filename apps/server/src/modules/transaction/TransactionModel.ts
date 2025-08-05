import mongoose, { Document, Model, Schema, Types } from "mongoose";

export enum TransactionTypeEnum {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
  PIX = 'PIX'
}

const TransactionSchema = new Schema(
  {
    amount: {
      type: Number,
      min: [0.01, 'Transaction amount must be positive.'],
      description: 'The value of the transaction.',
    },
    transactionType: {
      type: String,
      enum: Object.values(TransactionTypeEnum),
      description: 'The type of the transaction (CREDIT, DEBIT, PIX).',
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
  transactionType: TransactionTypeEnum;
  fromAccountId?: Types.ObjectId;
  toAccountId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const Transaction: Model<ITransaction> = mongoose.models['Transaction'] || mongoose.model('Transaction', TransactionSchema);
