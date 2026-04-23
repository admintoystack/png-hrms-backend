import { getPrismaInstance } from 'datasources/prisma';
import { writeAuditLog } from 'schema/audit-log/services';
import { NotFoundException } from 'utils/errors';

const prisma = getPrismaInstance();

const getCompany = async () => {
  return prisma.company.findFirst({
    orderBy: {
      createdAt: 'asc',
    },
  });
};

const createCompany = async (input: {
  name: string;
  registrationNumber?: string;
  address?: string;
  logoUrl?: string;
  financialYearStart?: number;
  payFrequency?: string;
  currency?: string;
}, actorUserId?: string) => {
  const company = await prisma.company.create({
    data: {
      ...input,
      currency: input.currency || 'PGK',
    },
  });
  await writeAuditLog({
    actorUserId,
    action: 'CREATE',
    entityType: 'COMPANY',
    entityId: company.id,
    after: company,
  });
  return company;
};

const updateCompany = async (
  id: string,
  input: {
    name?: string;
    registrationNumber?: string;
    address?: string;
    logoUrl?: string;
    financialYearStart?: number;
    payFrequency?: string;
    currency?: string;
  },
  actorUserId?: string
) => {
  const before = await prisma.company.findUnique({
    where: { id },
  });

  if (!before) {
    throw new NotFoundException('Company', id);
  }

  const company = await prisma.company.update({
    where: { id },
    data: input,
  });
  await writeAuditLog({
    actorUserId,
    action: 'UPDATE',
    entityType: 'COMPANY',
    entityId: id,
    before,
    after: company,
  });
  return company;
};

export { createCompany, getCompany, updateCompany };
