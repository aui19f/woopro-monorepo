import { EnumExpenseMethod } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

export type { EnumExpenseMethod };

export async function createExpense(data: {
  date: string;
  amount: number;
  method: EnumExpenseMethod;
  memo?: string;
  storeId?: string;
}) {
  return prisma.expense.create({ data });
}

export async function findExpenses(params: {
  fromDate?: string;
  toDate?: string;
  storeId?: string;
}) {
  return prisma.expense.findMany({
    where: {
      ...(params.fromDate || params.toDate
        ? {
            date: {
              ...(params.fromDate && { gte: params.fromDate }),
              ...(params.toDate  && { lte: params.toDate  }),
            },
          }
        : {}),
      ...(params.storeId ? { storeId: params.storeId } : {}),
    },
    orderBy: { created_at: "desc" },
  });
}
