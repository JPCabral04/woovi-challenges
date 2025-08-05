import mongoose, { Document, Model, Types } from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const AccountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      description: 'The name of the account holder',
    },
  },
  {
    timestamps: true,
    collection: 'Account',
  }
);


export interface IAccount extends Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export const Account: Model<IAccount> = mongoose.models['Account'] || mongoose.model('Account', AccountSchema);
