import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';

import PaginationType from 'schema/pagination/pagination';

export const AuditLogType = new GraphQLObjectType({
  name: 'AuditLogType',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID), resolve: log => log.id },
    actorUserId: { type: GraphQLID, resolve: log => log.actorUserId },
    action: { type: new GraphQLNonNull(GraphQLString), resolve: log => log.action },
    entityType: { type: new GraphQLNonNull(GraphQLString), resolve: log => log.entityType },
    entityId: { type: new GraphQLNonNull(GraphQLString), resolve: log => log.entityId },
    before: { type: GraphQLString, resolve: log => (log.before ? JSON.stringify(log.before) : null) },
    after: { type: GraphQLString, resolve: log => (log.after ? JSON.stringify(log.after) : null) },
    metadata: { type: GraphQLString, resolve: log => (log.metadata ? JSON.stringify(log.metadata) : null) },
    createdAt: { type: GraphQLString },
  }),
});

export const AuditLogsType = new GraphQLObjectType({
  name: 'AuditLogsType',
  fields: () => ({
    nodes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(AuditLogType))),
      resolve: obj => obj.logs,
    },
    pageInfo: {
      type: new GraphQLNonNull(PaginationType),
      resolve: obj => obj.pageInfo,
    },
  }),
});
