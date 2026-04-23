import { GraphQLID, GraphQLInputObjectType, GraphQLInt, GraphQLString } from 'graphql';

import { AuditLogsType } from '..';
import { getAuditLogs } from '../services';

const AuditLogFilterInputType = new GraphQLInputObjectType({
  name: 'AuditLogFilterInputType',
  fields: () => ({
    action: { type: GraphQLString },
    entityType: { type: GraphQLString },
    actorUserId: { type: GraphQLID },
  }),
});

const GetAuditLog = {
  type: AuditLogsType,
  args: {
    cursor: { type: GraphQLID },
    limit: { type: GraphQLInt },
    filters: { type: AuditLogFilterInputType },
  },
  resolve: async (_root, { cursor, limit, filters }) => getAuditLogs(cursor, limit, filters),
};

export default GetAuditLog;
