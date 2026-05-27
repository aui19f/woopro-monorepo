import SignupForm from "./SignupForm";

export default function SignupPage() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
      <h2 className="text-lg font-bold text-stone-800 mb-5">회원가입</h2>
      <SignupForm />
    </div>
  );
}
