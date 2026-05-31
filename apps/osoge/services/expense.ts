import { EnumExpenseMethod } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

export type { EnumExpenseMethod };

export async function createExpense(data: {
  date: string;
  amount: number;
  method: EnumExpenseMethod;
  memo?: string;
  storeId?: string;
  subcategoryId?: string;
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
    include: { subcategory: { include: { category: true } } },
    orderBy: { created_at: "desc" },
  });
}

export async function getExpenseCategories() {
  return prisma.expense_category.findMany({
    orderBy: { order: "asc" },
    include: {
      subcategories: { orderBy: { order: "asc" } },
    },
  });
}

export async function createExpenseCategory(name: string) {
  const maxOrder = await prisma.expense_category.aggregate({ _max: { order: true } });
  return prisma.expense_category.create({
    data: { name, order: (maxOrder._max.order ?? -1) + 1 },
  });
}

export async function updateExpenseCategory(id: string, name: string) {
  return prisma.expense_category.update({ where: { id }, data: { name } });
}

export async function deleteExpenseCategory(id: string) {
  return prisma.expense_category.delete({ where: { id } });
}

export async function createExpenseSubcategory(categoryId: string, name: string, description?: string) {
  const maxOrder = await prisma.expense_subcategory.aggregate({
    where: { categoryId },
    _max: { order: true },
  });
  return prisma.expense_subcategory.create({
    data: { name, description, categoryId, order: (maxOrder._max.order ?? -1) + 1 },
  });
}

export async function updateExpenseSubcategory(id: string, data: { name?: string; description?: string }) {
  return prisma.expense_subcategory.update({ where: { id }, data });
}

export async function deleteExpenseSubcategory(id: string) {
  return prisma.expense_subcategory.delete({ where: { id } });
}
