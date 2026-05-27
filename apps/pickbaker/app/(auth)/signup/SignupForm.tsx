"use client";

import { startTransition, useActionState, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { signupAction } from "./actions";
import { usernameSchema } from "@/lib/validations/auth";

export default function SignupForm() {
  const [state, dispatch, isPending] = useActionState(signupAction, null);
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!username) { setUsernameError(""); return; }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const result = usernameSchema.safeParse(username);
      setUsernameError(result.success ? "" : (result.error.errors[0]?.message ?? ""));
    }, 300);
  }, [username]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(() => dispatch(formData));
  };

  const inputClass =
    "w-full h-12 px-4 rounded-xl bg-white border border-stone-200 text-sm text-stone-800 placeholder:text-stone-300 outline-none focus:border-point transition-colors";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div>
        <input
          name="username"
          type="text"
          placeholder="아이디 (소문자, 숫자, _ / 3글자 이상)"
          autoCapitalize="none"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value.toLowerCase())}
          className={`${inputClass} ${usernameError ? "border-error" : ""}`}
        />
        {usernameError && (
          <p className="text-xs text-error mt-1 px-1">{usernameError}</p>
        )}
      </div>

      <input
        name="password"
        type="password"
        placeholder="비밀번호 (6글자 이상)"
        autoComplete="new-password"
        className={inputClass}
      />

      <input
        name="nickname"
        type="text"
        placeholder="닉네임"
        autoComplete="nickname"
        className={inputClass}
      />

      {state?.message && (
        <p className="text-xs text-error px-1">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={isPending || !!usernameError}
        className="w-full h-12 rounded-xl bg-point text-white text-sm font-semibold mt-1 disabled:opacity-60 transition-opacity"
      >
        {isPending ? "가입 중..." : "회원가입"}
      </button>

      <p className="text-center text-xs text-stone-400 mt-2">
        이미 계정이 있으신가요?{" "}
        <Link href="/login" className="text-point font-medium">
          로그인
        </Link>
      </p>
    </form>
  );
}
