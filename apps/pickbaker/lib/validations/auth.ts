import { z } from "zod";

export const usernameSchema = z
  .string()
  .min(3, "아이디는 3글자 이상이어야 합니다")
  .regex(/^[a-z0-9_]+$/, "소문자, 숫자, _ 만 사용 가능합니다");

export const loginSchema = z.object({
  username: z.string().min(1, "아이디를 입력해주세요"),
  password: z.string().min(1, "비밀번호를 입력해주세요"),
});

export const signupSchema = z.object({
  username: usernameSchema,
  password: z.string().min(6, "비밀번호는 6글자 이상이어야 합니다"),
  nickname: z.string().min(1, "닉네임을 입력해주세요"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
