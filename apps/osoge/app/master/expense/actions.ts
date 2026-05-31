"use server";

import { EnumExpenseMethod } from "@/generated/prisma";
import { createExpense } from "@/services/expense";

export type ExpenseState = { status: number; message: string } | null;

const VALID_METHODS = new Set(["CARD", "CASH", "PAY", "OTHER"]);

export async function registerExpense(
  _prev: ExpenseState,
  formData: FormData
): Promise<ExpenseState> {
  const rawDate   = formData.get("date")   as string;
  const rawAmount = formData.get("amount") as string;
  const rawMethod = formData.get("method") as string;
  const memo      = (formData.get("memo") as string) || undefined;

  if (!/^\d{8}$/.test(rawDate))
    return { status: 400, message: "날짜를 선택해주세요." };

  const amount = parseInt(rawAmount.replace(/,/g, ""));
  if (!amount || amount <= 0)
    return { status: 400, message: "금액을 입력해주세요." };

  if (!VALID_METHODS.has(rawMethod))
    return { status: 400, message: "결제 방법을 선택해주세요." };

  try {
    await createExpense({
      date: rawDate,
      amount,
      method: rawMethod as EnumExpenseMethod,
      memo,
    });
    return { status: 200, message: "성공" };
  } catch (e) {
    console.error(e);
    return { status: 500, message: "저장 실패" };
  }
}
