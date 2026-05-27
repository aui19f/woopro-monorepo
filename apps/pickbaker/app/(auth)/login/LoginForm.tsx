"use client";

import { startTransition, useActionState, useEffect } from "react";
import Link from "next/link";
import { loginAction } from "./actions";

export default function LoginForm() {
  const [state, dispatch, isPending] = useActionState(loginAction, null);

  useEffect(() => {
    if (state && state.status !== 200) {
      const el = document.querySelector<HTMLInputElement>('input[name="username"]');
      el?.focus();
    }
  }, [state]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(() => dispatch(formData));
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        name="username"
        type="text"
        placeholder="아이디"
        autoCapitalize="none"
        autoComplete="username"
        className="w-full h-12 px-4 rounded-xl bg-white border border-stone-200 text-sm text-stone-800 placeholder:text-stone-300 outline-none focus:border-point transition-colors"
      />
      <input
        name="password"
        type="password"
        placeholder="비밀번호"
        autoComplete="current-password"
        className="w-full h-12 px-4 rounded-xl bg-white border border-stone-200 text-sm text-stone-800 placeholder:text-stone-300 outline-none focus:border-point transition-colors"
      />

      {state?.message && (
        <p className="text-xs text-error px-1">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full h-12 rounded-xl bg-point text-white text-sm font-semibold mt-1 disabled:opacity-60 transition-opacity"
      >
        {isPending ? "로그인 중..." : "로그인"}
      </button>

      <p className="text-center text-xs text-stone-400 mt-2">
        계정이 없으신가요?{" "}
        <Link href="/signup" className="text-point font-medium">
          회원가입
        </Link>
      </p>
    </form>
  );
}
