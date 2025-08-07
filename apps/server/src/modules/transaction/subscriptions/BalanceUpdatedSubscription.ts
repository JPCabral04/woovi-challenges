import { GraphQLNonNull, GraphQLID, GraphQLInputObjectType, GraphQLString } from 'graphql';
import { subscriptionWithClientId } from 'graphql-relay-subscription';
import { withFilter } from 'graphql-subscriptions';
import { fromGlobalId } from 'graphql-relay';

import { redisPubSub } from '../../pubSub/redisPubSub';
import { PUB_SUB_EVENTS } from '../../pubSub/pubSubEvents';
import { AccountType } from '../../account/AccountType';
import { AccountLoader } from '../../account/AccountLoader';

type BalanceUpdatedPayload = {
  affectedAccountIds: string[];
};

const BalanceUpdatedInput = new GraphQLInputObjectType({
  name: 'BalanceUpdatedInput',
  fields: {
    accountId: { type: new GraphQLNonNull(GraphQLID) },
    clientSubscriptionId: { type: GraphQLString },
  },
});

const subscription = subscriptionWithClientId({
  name: 'BalanceUpdated',
  inputFields: {
    input: { type: new GraphQLNonNull(BalanceUpdatedInput) },
  },
  subscribe: withFilter(
    () => redisPubSub.asyncIterator(PUB_SUB_EVENTS.BALANCE_UPDATED),
    (payload: BalanceUpdatedPayload, args) => {
      const accountMongoId = fromGlobalId(args.input.accountId).id;
      return payload.affectedAccountIds.includes(accountMongoId);
    }
  ),
  getPayload: (payload: BalanceUpdatedPayload) => payload,
  outputFields: {
    updatedAccount: {
      type: AccountType,
      resolve: (payload, args, context) => {
        const accountMongoId = fromGlobalId(args.input.accountId).id;
        return AccountLoader.load(context, accountMongoId);
      }
    },
  },
});

export const BalanceUpdatedSubscription = subscription;

