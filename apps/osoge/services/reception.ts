import {
  EnumPaymentMethod,
  EnumPaymentTiming,
  EnumReceptionStatus,
} from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

export type { EnumReceptionStatus, EnumPaymentTiming, EnumPaymentMethod };

// ----------------------------------------------------------------
// Queries
// ----------------------------------------------------------------

export async function countTodayReceptions(date: string) {
  return prisma.reception.count({ where: { date } });
}

export async function findReceptionById(id: string) {
  return prisma.reception.findUnique({ where: { id } });
}

export async function findReceptions(params: {
  fromDate?: string;           // YYYYMMDD
  toDate?: string;             // YYYYMMDD
  status?: EnumReceptionStatus[];
  storeId?: string;
  sortField?: "date" | "created";
  sortDir?: "asc" | "desc";
}) {
  const field  = params.sortField ?? "created";
  const dir    = params.sortDir   ?? "desc";
  const orderBy = field === "date" ? { date: dir } : { created_at: dir };

  return prisma.reception.findMany({
    where: {
      ...(params.fromDate || params.toDate
        ? {
            date: {
              ...(params.fromDate && { gte: params.fromDate }),
              ...(params.toDate && { lte: params.toDate }),
            },
          }
        : {}),
      ...(params.status?.length ? { status: { in: params.status } } : {}),
      ...(params.storeId ? { storeId: params.storeId } : {}),
    },
    orderBy,
  });
}

// ----------------------------------------------------------------
// Mutations
// ----------------------------------------------------------------

export async function createReception(data: {
  id: string;
  phone: string;
  date: string;
  time: string;
  agreed: boolean;
  storeId?: string;
}) {
  return prisma.reception.create({ data });
}

export async function updateReceptionStatus(
  id: string,
  status: EnumReceptionStatus
) {
  return prisma.reception.update({ where: { id }, data: { status } });
}

export async function updateReceptionPayment(
  id: string,
  data: {
    payment_amount?: number;
    payment_timing?: EnumPaymentTiming;
    payment_method?: EnumPaymentMethod;
    quantity?: number;
  }
) {
  return prisma.reception.update({ where: { id }, data });
}

export async function updateReceptionImages(id: string, images: string[]) {
  return prisma.reception.update({ where: { id }, data: { images } });
}

export async function incrementMessageSentCount(id: string) {
  return prisma.reception.update({
    where: { id },
    data: { message_sent_count: { increment: 1 } },
  });
}

export async function createAdminReception(data: {
  id: string;
  phone?: string;
  name?: string;
  date: string;
  time: string;
  quantity: number;
  payment_amount?: number;
  payment_timing?: EnumPaymentTiming;
  memo?: string;
  storeId?: string;
  images?: string[];
}) {
  return prisma.reception.create({ data: { ...data, agreed: true } });
}

export async function updateReceptionDetail(
  id: string,
  data: {
    date?: string;
    status?: EnumReceptionStatus;
    payment_amount?: number | null;
    payment_timing?: EnumPaymentTiming | null;
    payment_method?: EnumPaymentMethod | null;
    memo?: string | null;
    updated_by?: string;
    storeId?: string;
  }
) {
  return prisma.reception.update({ where: { id }, data });
}
