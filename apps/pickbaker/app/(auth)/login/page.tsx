import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
      <h2 className="text-lg font-bold text-stone-800 mb-5">로그인</h2>
      <LoginForm />
    </div>
  );
}
