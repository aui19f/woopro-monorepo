"use server";

import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@repo/auth/admin";
import { signupSchema } from "@/lib/validations/auth";
import { prisma } from "@/lib/prisma";

export type SignupState = { status: number; message: string } | null;

export async function signupAction(
  _prev: SignupState,
  formData: FormData
): Promise<SignupState> {
  const result = await signupSchema.safeParseAsync({
    username: formData.get("username"),
    password: formData.get("password"),
    nickname: formData.get("nickname"),
  });

  if (!result.success) {
    return { status: 400, message: result.error.errors[0]?.message ?? "입력값을 확인해주세요." };
  }

  const { username, password, nickname } = result.data;

  // 아이디 중복 확인
  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    return { status: 409, message: "이미 사용 중인 아이디입니다." };
  }

  const email = `${username}@app.pickbaker`;

  try {
    const supabase = createSupabaseAdminClient();

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      if (authError.status && authError.status >= 500) throw authError;
      return { status: 400, message: authError.message };
    }

    if (!authData.user) throw new Error("유저 생성 실패");

    await prisma.user.create({
      data: {
        auth_id: authData.user.id,
        username,
        nickname,
      },
    });
  } catch (error) {
    console.error("signupAction error:", error);
    return { status: 500, message: "회원가입 중 오류가 발생했습니다." };
  }

  redirect("/login");
}
