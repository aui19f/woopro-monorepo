export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] bg-base flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-point tracking-tight">pickbaker</h1>
          <p className="text-sm text-stone-400 mt-1">베이커리 커뮤니티</p>
        </div>
        {children}
      </div>
    </div>
  );
}
