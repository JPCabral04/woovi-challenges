import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLFloat,
  GraphQLNonNull,
} from 'graphql';
import { globalIdField, connectionDefinitions } from 'graphql-relay';
import type { ConnectionArguments } from 'graphql-relay';

import { IAccount } from './AccountModel';
import { nodeInterface } from '../node/typeRegister';
import { registerTypeLoader } from '../node/typeRegister';
import { AccountLoader } from './AccountLoader';
import { calculateBalance } from './accountCalculateBalance';


const AccountType = new GraphQLObjectType<IAccount>({
  name: 'Account',
  description: 'Represents a bank account',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: (account) => account._id.toString(),
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    balance: {
      type: new GraphQLNonNull(GraphQLFloat),
      resolve: async (account) => {
        const accountId = account._id;
        const currentBalance = await calculateBalance(accountId);

        return currentBalance;
      }
    },
    createdAt: {
      type: GraphQLString,
      resolve: (account) => new Date(account.createdAt).toISOString()
    },
    updatedAt: {
      type: GraphQLString,
      resolve: (account) => new Date(account.updatedAt).toISOString()
    },
  }),
  interfaces: [nodeInterface],
});

const AccountConnection = connectionDefinitions({
  name: 'Account',
  nodeType: AccountType,
});

registerTypeLoader(AccountType, AccountLoader.load);

export { AccountType, AccountConnection };