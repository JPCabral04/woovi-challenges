import mongoose, { Document, Model, Types } from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const AccountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
    collection: 'Account',
  },
)

export interface IAccount extends Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const AccountModel: Model<IAccount> = mongoose.models['Account'] || mongoose.model('Account', AccountSchema);

export default AccountModel;