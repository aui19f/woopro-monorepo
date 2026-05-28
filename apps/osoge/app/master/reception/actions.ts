"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@repo/auth/server";
import { receptionSchema } from "@/schemas/reception";
import {
  createReception,
  createAdminReception,
  countTodayReceptions,
} from "@/services/reception";
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

export async function getCountByDate(dateYYYYMMDD: string): Promise<number> {
  return countTodayReceptions(dateYYYYMMDD);
}

export async function adminRegisterReception(
  _prev: ReceptionState,
  formData: FormData
): Promise<ReceptionState> {
  const phone = (formData.get("phone") as string) || undefined;
  const name = (formData.get("name") as string) || undefined;
  const rawAmount = formData.get("amount") as string;
  const payment_amount = rawAmount ? parseInt(rawAmount.replace(/,/g, "")) : undefined;
  const rawTiming = formData.get("paymentTiming") as string | null;
  const payment_timing =
    rawTiming === "PREPAID" || rawTiming === "POSTPAID"
      ? (rawTiming as EnumPaymentTiming)
      : undefined;
  const memo = (formData.get("memo") as string) || undefined;

  const adminPhoneRegex = /^\d{3}-(\d{3,4}|\*{4})-\d{4}$/;

  const phoneProvided = !!phone && adminPhoneRegex.test(phone);
  const nameProvided = !!name?.trim();

  if (!phoneProvided && !nameProvided) {
    return { status: 400, message: "전화번호 또는 이름을 입력해주세요." };
  }
  if (phone && !adminPhoneRegex.test(phone)) {
    return { status: 400, message: "올바른 전화번호 형식을 확인해주세요." };
  }

  const rawDate = formData.get("date") as string;
  const { date: todayDate, time } = getTodayKST();
  const date = /^\d{8}$/.test(rawDate) ? rawDate : todayDate;

  const count = await countTodayReceptions(date);
  const id = `${date}${String(count + 1).padStart(3, "0")}`;

  try {
    await createAdminReception({
      id,
      phone: phoneProvided ? phone : undefined,
      name: name?.trim() || undefined,
      date,
      time,
      quantity: 1,
      payment_amount,
      payment_timing,
      memo,
    });
    return { status: 200, message: "성공" };
  } catch (error) {
    console.error("adminRegisterReception error:", error);
    return { status: 500, message: "저장 실패" };
  }
}
