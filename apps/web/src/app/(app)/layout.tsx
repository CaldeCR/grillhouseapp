import Link from "next/link";
import { BookOpen, UtensilsCrossed, Flame, Share2, Film, Home } from "lucide-react";
import { requireUser } from "@/server/auth/require-user";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  const navItems = [
    { href: "/", label: "Inicio", icon: Home },
    { href: "/courses", label: "Cursos", icon: BookOpen },
    { href: "/recipes", label: "Recetas", icon: UtensilsCrossed },
    { href: "/techniques", label: "Técnicas", icon: Flame },
    { href: "/references", label: "Redes", icon: Share2 },
    { href: "/media", label: "Videos", icon: Film },
  ];

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-[#12100f] text-neutral-100">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:border-r md:border-charcoal-700 md:bg-charcoal-900/90 p-5 space-y-6">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ember-600/20 text-ember-500 border border-ember-500/30">
            <Flame className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight text-white">Bitácora de Asados</h1>
            <p className="text-xs text-neutral-400 truncate max-w-[150px]">{user.email}</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-300 hover:bg-charcoal-800 hover:text-white transition-colors"
              >
                <Icon className="h-5 w-5 text-ember-500/80" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 pb-20 md:pb-8 pt-4 px-4 md:px-8 max-w-6xl mx-auto w-full">
        {children}
      </main>

      {/* Mobile Bottom Navigation Bar (PWA Mobile-first) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-charcoal-700 bg-charcoal-900/95 backdrop-blur-md md:hidden px-2 pb-safe">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center text-[10px] font-medium text-neutral-400 hover:text-ember-400 active:text-ember-500"
            >
              <Icon className="h-5 w-5 mb-0.5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
