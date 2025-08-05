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
      resolve: async () => {
        // TODO balance account estimate
        return 0;
      }
    }
  }),
});

const AccountConnection = connectionDefinitions({
  name: 'Account',
  nodeType: AccountType,
});

registerTypeLoader(AccountType, AccountLoader.load);

export { AccountType, AccountConnection };