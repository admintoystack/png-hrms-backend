import { GraphQLBoolean, GraphQLObjectType, GraphQLString } from 'graphql';

const PermissionType = new GraphQLObjectType({
  name: 'Permission',
  description: 'Permission type for school system access control',
  fields: () => ({
    id: {
      type: GraphQLString,
      description: 'Unique identifier for the permission',
    },
    name: {
      type: GraphQLString,
      description: 'Name of the permission',
    },
    description: {
      type: GraphQLString,
      description: 'Description of what this permission allows',
    },
    resource: {
      type: GraphQLString,
      description: 'Resource this permission applies to',
    },
    action: {
      type: GraphQLString,
      description: 'Action this permission allows',
    },
    canRead: {
      type: GraphQLBoolean,
      description: 'Whether this permission allows read access',
    },
    canWrite: {
      type: GraphQLBoolean,
      description: 'Whether this permission allows write access',
    },
    canUpdate: {
      type: GraphQLBoolean,
      description: 'Whether this permission allows update access',
    },
    canDelete: {
      type: GraphQLBoolean,
      description: 'Whether this permission allows delete access',
    },
    isActive: {
      type: GraphQLBoolean,
      description: 'Whether this permission is currently active',
    },
    createdAt: {
      type: GraphQLString,
      description: 'When this permission was created',
    },
    updatedAt: {
      type: GraphQLString,
      description: 'When this permission was last updated',
    },
  }),
});

export default PermissionType;
