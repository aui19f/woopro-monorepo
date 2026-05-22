"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@repo/auth/server";
import { receptionSchema } from "@/schemas/reception";
import {
  createReception,
  createAdminReception,
  countTodayReceptions,
} from "@/services/reception";
import { phoneRegex } from "@repo/schemas/regex";
import { EnumPaymentTiming } from "@/generated/prisma";

export async function logoutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export type ReceptionState = {
  status: number;
  message: string;
} | null;

export async function registerReception(
  _prev: ReceptionState,
  formData: FormData
): Promise<ReceptionState> {
  // 1. 유효성 검사
  const phone = formData.get("phone") as string;
  const agreed = formData.get("agreed") === "true";

  const result = receptionSchema.safeParse({ phone, agreed });
  if (!result.success) {
    return {
      status: 400,
      message: result.error.errors[0]?.message ?? "입력값을 확인해주세요.",
    };
  }

  // 2. 날짜·시간 추출
  const now = new Date();
  // 한국 시간 기준 YYYYMMDD
  const date = now
    .toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\. /g, "")
    .replace(".", "");
  const time = now.toTimeString().slice(0, 8);

  // 3. 당일 순번 계산 → ID 생성
  const count = await countTodayReceptions(date);
  const id = `${date}${String(count + 1).padStart(3, "0")}`;

  // 4. DB 저장
  try {
    await createReception({
      id,
      phone: result.data.phone,
      date,
      time,
      agreed: result.data.agreed ?? false,
    });
    return { status: 200, message: "성공" };
  } catch (error) {
    console.error("registerReception error:", error);
    return { status: 401, message: "실패" };
  }
}

function getTodayKST() {
  const now = new Date();
  const date = now
    .toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" })
    .replace(/\. /g, "")
    .replace(".", "");
  const time = now.toTimeString().slice(0, 8);
  return { date, time };
}

export async function adminRegisterReception(
  _prev: ReceptionState,
  formData: FormData
): Promise<ReceptionState> {
  const phone = formData.get("phone") as string;
  const quantity = Math.max(1, parseInt(formData.get("quantity") as string) || 1);
  const rawAmount = formData.get("amount") as string;
  const payment_amount = rawAmount ? parseInt(rawAmount.replace(/,/g, "")) : undefined;
  const rawTiming = formData.get("paymentTiming") as string | null;
  const payment_timing =
    rawTiming === "PREPAID" || rawTiming === "POSTPAID"
      ? (rawTiming as EnumPaymentTiming)
      : undefined;

  if (!phoneRegex.test(phone)) {
    return { status: 400, message: "올바른 전화번호를 입력해주세요." };
  }

  const { date, time } = getTodayKST();
  const count = await countTodayReceptions(date);
  const id = `${date}${String(count + 1).padStart(3, "0")}`;

  try {
    await createAdminReception({ id, phone, date, time, quantity, payment_amount, payment_timing });
    return { status: 200, message: "성공" };
  } catch (error) {
    console.error("adminRegisterReception error:", error);
    return { status: 500, message: "저장 실패" };
  }
}
