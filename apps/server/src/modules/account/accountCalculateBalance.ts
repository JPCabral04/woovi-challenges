import mongoose from 'mongoose';
import { Transaction } from '../transaction/TransactionModel';

export const calculateBalance = async (accountId: string | mongoose.Types.ObjectId): Promise<number> => {
  const id = new mongoose.Types.ObjectId(accountId);

  // search all the transactions where the account is sender or receiver
  const transactions = await Transaction.find({
    $or: [{ fromAccountId: id }, { toAccountId: id }]
  })

  const balance = transactions.reduce((acc, transaction) => {
    if (transaction.toAccountId?.equals(id)) {
      return acc + transaction.amount;
    }
    if (transaction.fromAccountId?.equals(id)) {
      return acc - transaction.amount;
    }
    return acc;
  }, 0);

  return balance;
}