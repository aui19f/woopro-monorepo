"use server";

import { createSupabaseServerClient } from "@repo/auth/server";
import {
  updateReceptionDetail,
  incrementMessageSentCount,
  type EnumReceptionStatus,
  type EnumPaymentTiming,
  type EnumPaymentMethod,
} from "@/services/reception";
import { sendCompletionMessage } from "@/services/message";

export type DetailSaveData = {
  status: EnumReceptionStatus;
  paymentTiming: EnumPaymentTiming | null;
  paymentMethod: EnumPaymentMethod | null;
  paymentAmount: number | null;
  memo: string;
};

async function getCurrentUserId(): Promise<string | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

export async function saveDetail(id: string, data: DetailSaveData): Promise<void> {
  const userId = await getCurrentUserId();

  await updateReceptionDetail(id, {
    status: data.status,
    payment_timing: data.paymentTiming,
    payment_method: data.paymentMethod,
    payment_amount: data.paymentAmount,
    memo: data.memo || null,
    updated_by: userId ?? undefined,
    storeId: userId ?? undefined,
  });
}

export async function sendAndSaveDetail(id: string, data: DetailSaveData): Promise<void> {
  const userId = await getCurrentUserId();

  await updateReceptionDetail(id, {
    status: data.status,
    payment_timing: data.paymentTiming,
    payment_method: data.paymentMethod,
    payment_amount: data.paymentAmount,
    memo: data.memo || null,
    updated_by: userId ?? undefined,
    storeId: userId ?? undefined,
  });

  await incrementMessageSentCount(id);
  await sendCompletionMessage(id);
}
