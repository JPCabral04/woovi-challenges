import { GraphQLError, GraphQLFloat, GraphQLID, GraphQLNonNull, GraphQLString } from "graphql";
import { fromGlobalId, mutationWithClientMutationId } from "graphql-relay";

import { redisPubSub } from '../../pubSub/redisPubSub';
import { PUB_SUB_EVENTS } from '../../pubSub/pubSubEvents';
import { Transaction } from "../TransactionModel";
import { transactionField } from "../transactionFields";
import { Account } from "../../account/AccountModel";
import { calculateBalance } from "../../account/accountCalculateBalance";

export type TransactionSendInput = {
  amount: number;
  fromAccountId: string;
  toAccountId: string;
};

const mutation = mutationWithClientMutationId({
  name: "TransactionSend",
  inputFields: {
    amount: { type: new GraphQLNonNull(GraphQLFloat) },
    fromAccountId: { type: new GraphQLNonNull(GraphQLID) },
    toAccountId: { type: new GraphQLNonNull(GraphQLID) },
  },
  mutateAndGetPayload: async (args: TransactionSendInput) => {
    const { fromAccountId, toAccountId, amount } = args;

    const fromId = fromGlobalId(fromAccountId).id;
    const toId = fromGlobalId(toAccountId).id;

    if (amount <= 0) {
      throw new GraphQLError('Transaction amount must be positive.');
    }
    if (fromId === toId) {
      throw new GraphQLError('Sender and receiver accounts cannot be the same.');
    }

    const fromAccount = await Account.findById(fromId);
    const toAccount = await Account.findById(toId);
    if (!fromAccount || !toAccount) {
      throw new GraphQLError('Invalid sender or receiver account.');
    }

    const currentBalance = await calculateBalance(fromId);
    if (currentBalance < amount) {
      throw new GraphQLError('Insufficient funds.');
    }

    const transaction = await new Transaction({
      amount,
      fromAccountId: fromId,
      toAccountId: toId,
    }).save();

    // Publica o evento com os IDs das duas contas afetadas
    await redisPubSub.publish(PUB_SUB_EVENTS.BALANCE_UPDATED, {
      affectedAccountIds: [fromId, toId],
    });

    return {
      // Retorna o ID para a fábrica 'transactionField' usar
      transaction: transaction._id.toString(),
    };
  },
  outputFields: {
    ...transactionField("transaction"),
  },
});

export const TransactionSendMutation = mutation;