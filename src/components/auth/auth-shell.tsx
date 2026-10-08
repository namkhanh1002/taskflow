import type { ReactNode } from "react";
import { BarChart3, CalendarCheck, CheckCheck, FolderKanban, ShieldCheck } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";

const FEATURES = [
  {
    icon: CheckCheck,
    title: "Quản lý tập trung",
    description: "Mọi công việc, danh mục và thời hạn trong một nơi.",
  },
  {
    icon: FolderKanban,
    title: "Danh mục linh hoạt",
    description: "Phân loại theo Cá nhân, Công việc, Học tập, Mua sắm...",
  },
  {
    icon: CalendarCheck,
    title: "Theo dõi tiến độ",
    description: "Dashboard trực quan với tỉ lệ hoàn thành và công việc quá hạn.",
  },
  {
    icon: ShieldCheck,
    title: "Bảo mật tài khoản",
    description: "Mật khẩu được mã hóa, dữ liệu riêng tư theo từng người dùng.",
  },
];

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="relative hidden w-full max-w-md flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-10 text-white lg:flex xl:max-w-lg">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.35) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-white/20 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-24 -left-16 size-72 rounded-full bg-fuchsia-400/30 blur-3xl"
          aria-hidden
        />

        <div className="relative flex items-center gap-2.5">
          <span className="flex size-10 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/30 backdrop-blur">
            <CheckCheck className="size-5.5" aria-hidden />
          </span>
          <span className="text-lg font-bold tracking-tight">TaskFlow</span>
        </div>

        <div className="relative space-y-7">
          <div className="space-y-3">
            <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-medium ring-1 ring-white/25">
              Ứng dụng To-Do cho người hiện đại
            </span>
            <h1 className="text-3xl font-bold leading-tight tracking-tight xl:text-[34px]">
              Tổ chức công việc.
              <br />
              Làm chủ thời gian của bạn.
            </h1>
            <p className="max-w-sm text-sm leading-relaxed text-white/80">
              TaskFlow giúp bạn lên kế hoạch, phân mức ưu tiên và theo dõi tiến độ mọi lúc,
              mọi nơi.
            </p>
          </div>

          <ul className="space-y-4">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <li key={feature.title} className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/15 ring-1 ring-white/25">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">{feature.title}</span>
                    <span className="block text-xs leading-relaxed text-white/75">
                      {feature.description}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="relative flex items-center gap-2 text-xs text-white/65">
          <BarChart3 className="size-3.5" aria-hidden />
          Dự án portfolio – Next.js · TypeScript · Prisma · PostgreSQL
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5 lg:hidden">
            <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-indigo-500 to-violet-500 text-white">
              <CheckCheck className="size-5" aria-hidden />
            </span>
            <span className="text-base font-bold tracking-tight text-foreground">TaskFlow</span>
          </div>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </header>

        <main className="flex flex-1 items-center justify-center px-4 pb-12 sm:px-6 lg:px-8">
          <div className="w-full max-w-md animate-rise-in">{children}</div>
        </main>
      </div>
    </div>
  );
}
