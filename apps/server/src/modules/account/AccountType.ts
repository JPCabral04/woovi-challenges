import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLFloat,
  GraphQLNonNull,
} from 'graphql';
import { IAccount } from './AccountModel';

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
    createdAt: {
      type: GraphQLString,
      resolve: (account) => account.createdAt.toISOString(),
    },
    updatedAt: {
      type: GraphQLString,
      resolve: (account) => account.updatedAt.toISOString(),
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
