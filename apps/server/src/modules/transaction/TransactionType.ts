import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLFloat,
  GraphQLNonNull,
  GraphQLEnumType,
} from 'graphql';
import { globalIdField, connectionDefinitions } from 'graphql-relay';
import type { ConnectionArguments } from 'graphql-relay';

import { ITransaction, TransactionTypeEnum } from './TransactionModel';
import { nodeInterface } from '../node/typeRegister';
import { registerTypeLoader } from '../node/typeRegister';
// import { TransactionLoader } from './TransactionLoader';
// import { AccountType } from '../account/AccountType'; // se quiser tipar os relacionamentos

// 1. Enum GraphQL para transactionType
const TransactionTypeEnumType = new GraphQLEnumType({
  name: 'TransactionTypeEnum',
  values: {
    CREDIT: { value: TransactionTypeEnum.CREDIT },
    DEBIT: { value: TransactionTypeEnum.DEBIT },
    PIX: { value: TransactionTypeEnum.PIX },
  },
});

const TransactionType = new GraphQLObjectType<ITransaction>({
  name: 'Transaction',
  description: 'Represents a bank transaction',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: (transaction) => transaction._id.toString(),
    },
    amount: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    transactionType: {
      type: new GraphQLNonNull(TransactionTypeEnumType),
    },
    fromAccountId: {
      type: GraphQLID,
      description: 'ID of the sender account',
      resolve: (transaction) => transaction.fromAccountId?.toString(),
    },
    toAccountId: {
      type: GraphQLID,
      description: 'ID of the receiver account',
      resolve: (transaction) => transaction.toAccountId?.toString(),
    },
    createdAt: {
      type: GraphQLString,
      resolve: (account) => new Date(account.createdAt).toISOString()
    },
    updatedAt: {
      type: GraphQLString,
      resolve: (account) => new Date(account.updatedAt).toISOString()
    }
  }),
  interfaces: [nodeInterface],
});

// Opcional: registro no sistema global de tipos
registerTypeLoader(TransactionType, async (id) => {
  // Retorne o TransactionLoader se usar DataLoader
  // return await TransactionLoader.load(id);
});
