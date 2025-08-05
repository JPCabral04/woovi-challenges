import { GraphQLNonNull, GraphQLString } from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";

import { Account } from "../AccountModel";
import { accountField } from "../accountFields";

export type AccountAddInput = {
  name: string;
};

const mutation = mutationWithClientMutationId({
  name: "AccountAdd",
  inputFields: {
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async (args: AccountAddInput) => {
    const account = await new Account({
      name: args.name,
    }).save();

    return {
      account: account._id.toString(),
    };
  },
  outputFields: {
    ...accountField("account"),
  },
});

export const AccountAddMutation = {
  ...mutation,
};
