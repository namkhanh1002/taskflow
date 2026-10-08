# TaskFlow – Quản lý công việc thông minh

Ứng dụng **To-Do List / Task Management** dạng SaaS: đăng ký – đăng nhập, quản lý công việc theo danh mục, ưu tiên, thời hạn, thống kê tiến độ và cài đặt tài khoản. Xây dựng với **Next.js (App Router) + TypeScript + Tailwind CSS + Prisma ORM + PostgreSQL (Neon)**.

Giao diện hoàn toàn bằng **tiếng Việt**, tối ưu cho cả máy tính và di động, hỗ trợ dark mode, điều hướng bàn phím và trạng thái tải/lỗi rõ ràng.

---

## Tính năng

**Tài khoản & bảo mật**
- Đăng ký / đăng nhập / đăng xuất (Server Actions + Zod validation)
- Mật khẩu băm bằng `bcryptjs` (12 rounds)
- Phiên đăng nhập bằng JWT (`jose`) trong cookie `httpOnly` + `SameSite=Lax`
- Bảo vệ ownership: mọi truy vấn đều lọc theo `userId` – không thể xem/sửa/xóa dữ liệu người khác
- Trang được bảo vệ đều redirect `307 → /login` khi chưa đăng nhập

**Quản lý công việc**
- Tạo / chỉnh sửa / xóa công việc (dialog có xác nhận xóa)
- Đánh dấu hoàn thành / khôi phục (tự ghi `completedAt`)
- Tìm kiếm theo từ khóa (debounce 350ms), lọc theo trạng thái / ưu tiên / danh mục, sắp xếp (mới nhất, cũ nhất, hạn, ưu tiên), phân trang
- Trang **Hôm nay** (đến hạn hôm nay), **Sắp tới**, **Đã hoàn thành**
- Trang chi tiết công việc (`/tasks/[id]`) + 404 đúng chuẩn khi id không tồn tại
- Tag (nhãn) linh hoạt cho từng công việc

**Danh mục**
- CRUD danh mục với màu sắc và biểu tượng (18 biểu tượng Lucide, 10 màu)
- Đếm số công việc theo danh mục
- Khi xóa danh mục, công việc không bị xóa (`onDelete: SetNull`)

**Dashboard & cài đặt**
- Thống kê: tổng, đang chờ, hoàn thành, quá hạn, tỷ lệ hoàn thành
- Danh sách công việc đến hạn hôm nay, sắp tới, hoàn thành gần đây
- Cài đặt: đổi tên hiển thị, bật/tắt thông báo, chọn giao diện Sáng / Tối / Hệ thống, đăng xuất
- Toast thông báo (`sonner`) cho mọi thao tác thành công / thất bại

**Trải nghiệm người dùng**
- Trạng thái tải (`loading.tsx`), lỗi (`error.tsx`), trống (`EmptyState`) cho mọi khu vực
- Skeleton loading, dark mode (`next-themes`), skip-link “Bỏ qua nội dung chính”
- Responsive: sidebar desktop, drawer mobile
- Accessibility: focus ring, `aria-*`, label rõ ràng, dialog có focus trap + Escape

---

## Công nghệ

| Thành phần | Công nghệ |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack, Server Actions) |
| Ngôn ngữ | TypeScript (strict) |
| UI | React 19, Tailwind CSS 4, Lucide React |
| Database | PostgreSQL (Neon) |
| ORM | Prisma 7 (`prisma-client` generator + `@prisma/adapter-pg`) |
| Auth | `jose` (JWT), `bcryptjs` |
| Validate | Zod 4 |
| Toast | `sonner` |
| Theme | `next-themes` |

---

## Bắt đầu nhanh

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Cấu hình biến môi trường

```bash
cp .env.example .env
```

Sửa file `.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@ep-xxxx.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://USER:PASSWORD@ep-xxxx.aws.neon.tech/neondb?sslmode=require"
AUTH_SECRET="<32 bytes hex ngẫu nhiên>"
AUTH_SESSION_TTL="604800"
```

Lấy `DATABASE_URL` (pooled) và `DIRECT_URL` (direct) từ **Neon Dashboard → Connection Details**.

Tạo `AUTH_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

> `DATABASE_URL` dùng cho runtime (Prisma Client), `DIRECT_URL` dùng cho Prisma Migrate/CLI (xem `prisma.config.ts`).

### 3. Tạo bảng & dữ liệu mẫu

```bash
npm run db:migrate   # prisma migrate dev
npm run db:seed      # seed tài khoản demo + dữ liệu mẫu
```

### 4. Chạy ứng dụng

```bash
npm run dev
```

Mở <http://localhost:3000>.

**Tài khoản demo (sau khi seed):**

| Email | Mật khẩu |
| --- | --- |
| `demo@taskflow.app` | `Demo1234!` |

> Trang đăng nhập có nút **“Điền”** để tự động điền tài khoản demo.

---

## Chạy bằng PostgreSQL cục bộ (tùy chọn, không cần Neon)

Nếu muốn phát triển offline, repo có script khởi chạy PostgreSQL nhúng (chỉ cần Node):

```bash
npm run db:local      # khởi động PostgreSQL trên cổng 5432 (postgres/password, db todo_app)
npm run db:migrate
npm run db:seed
```

Dữ liệu cục bộ nằm trong `.local-pg/` (đã ignore). Khi có Neon, chỉ cần đổi `DATABASE_URL`/`DIRECT_URL` trong `.env`.

---

## Các script hữu ích

| Script | Mô tả |
| --- | --- |
| `npm run dev` | Chạy dev server (Turbopack) |
| `npm run build` | Build production |
| `npm run start` | Chạy production server |
| `npm run lint` | ESLint |
| `npm run typecheck` | Kiểm tra kiểu (`tsc --noEmit`) |
| `npm run db:migrate` | Tạo/applied migration (dev) |
| `npm run db:deploy` | Áp dụng migration đã có (production) |
| `npm run db:seed` | Seed dữ liệu mẫu |
| `npm run db:studio` | Prisma Studio |
| `npm run db:reset` | Reset migration + seed lại |
| `npm run db:local` | Khởi động PostgreSQL cục bộ nhúng |

---

## Cấu trúc dự án

```
prisma/
  schema.prisma          # User, UserSettings, Category, Task, Tag, TaskTag
  migrations/            # migration SQL đã commit
  seed.ts                # tài khoản demo + danh mục + công việc mẫu
src/
  app/
    (auth)/              # /login, /register
    (app)/               # khu vực đăng nhập: dashboard, tasks, today, upcoming,
                         # completed, categories, settings
    error.tsx, not-found.tsx
  components/
    ui/                  # button, input, dialog, confirm-dialog, switch, skeleton...
    layout/              # sidebar, topbar, app-shell, page-header
    tasks/               # task-card, task-form-dialog, task-filters, task-detail...
    categories/          # category-manager
    dashboard/           # stat-card, dashboard-sections
    auth/, settings/
  lib/
    actions/             # Server Actions: auth, tasks, categories, settings
    data/                # truy vấn dữ liệu (luôn lọc theo userId)
    validators.ts        # schema Zod
    auth.ts              # JWT session cookie
    guards.ts            # requireUser()
  hooks/                 # use-debounce, use-hydrated
  types/index.ts         # DTO, enum, ActionResult
```

---

## Ghi chú kỹ thuật

- **Prisma 7**: client được generate về `src/generated/prisma`, PrismaClient khởi tạo với `PrismaPg` adapter (xem `src/lib/prisma.ts`).
- **Server Actions**: mọi mutation đều qua `src/lib/actions/*`, validate bằng Zod, trả `{ ok, data | error }`, gọi `revalidateApp()` sau khi đổi dữ liệu.
- **Bộ lọc công việc nằm trên URL** (`/tasks?status=…&q=…`) nên chia sẻ được link và giữ nguyên focus khi gõ tìm kiếm (debounce trong trang, không reload).
- **Ngày tháng**: xử lý theo ngày thuần túy ở UTC (`timeZone: "UTC"`), tránh lệch ngày do timezone máy.
- **Auth flow**: trang bảo vệ kiểm tra phiên ngay trong layout → redirect `307`; cookie `httpOnly` không thể đọc từ JS.
- **Guard test**: đã kiểm chứng bằng HTTP thật (đăng nhập/đăng xuất/đăng ký, 404, các trang bảo vệ, ownership isolation).

## Triển khai (Vercel)

1. Import repo vào Vercel.
2. Thêm environment variables: `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET` (và `AUTH_SESSION_TTL` nếu muốn).
3. Build command mặc định (`next build`); chạy `npx prisma migrate deploy` trong **Install Command** nếu muốn migrate tự động:

```bash
npm install && npx prisma migrate deploy && npm run build
```

---

## Xử lý sự cố

| Lỗi | Cách xử lý |
| --- | --- |
| `Environment variable not found: DATABASE_URL` | Chưa tạo/sai file `.env` (xem mục 2) |
| `character ... has no equivalent in encoding WIN1252` | Database không phải UTF-8 – với Neon không gặp; cục bộ dùng `npm run db:local` (UTF-8) hoặc tạo lại DB với `ENCODING 'UTF8'` |
| `P2025` khi migrate | Chuỗi kết nối sai hoặc DB chưa tồn tại – kiểm tra `DIRECT_URL` |
| Muốn seed lại từ đầu | `npm run db:reset` |
