export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-[#181514] via-[#12100f] to-black">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
