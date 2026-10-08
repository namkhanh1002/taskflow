export const ERROR_MESSAGES = {
  dbConfig:
    "Không thể kết nối cơ sở dữ liệu. Vui lòng kiểm tra biến DATABASE_URL trong file .env rồi thử lại.",
  dbConnection: "Không thể kết nối cơ sở dữ liệu. Vui lòng thử lại sau giây lát.",
  generic: "Đã xảy ra lỗi, vui lòng thử lại.",
  sessionExpired: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
  unauthorized: "Bạn không có quyền thực hiện thao tác này.",
  dashboard: "Không thể tải dữ liệu bảng điều khiển.",
  taskList: "Không thể tải danh sách công việc.",
  taskLoad: "Không thể tải thông tin công việc.",
  taskCreate: "Không thể tạo công việc.",
  taskUpdate: "Không thể cập nhật công việc.",
  taskDelete: "Không thể xóa công việc.",
  categoryList: "Không thể tải danh mục.",
  categoryCreate: "Không thể tạo danh mục.",
  categoryUpdate: "Không thể cập nhật danh mục.",
  categoryDelete: "Không thể xóa danh mục.",
  settingsLoad: "Không thể tải cài đặt.",
  settingsUpdate: "Không thể lưu cài đặt.",
} as const;

const DB_ERROR_KEYWORDS = [
  "DATABASE_URL",
  "ECONNREFUSED",
  "ENOTFOUND",
  "ECONNRESET",
  "ETIMEDOUT",
  "connection terminated",
  "connection refused",
  "timeout exceeded",
  "too many connections",
  "getaddrinfo",
  "database url",
  "Connection error",
  "Can't reach database server",
];

function isDatabaseError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const name = error.name ?? "";
  const message = error.message ?? "";
  if (name.includes("PrismaClient") || name.includes("Prisma")) return true;
  return DB_ERROR_KEYWORDS.some((keyword) =>
    message.toLowerCase().includes(keyword.toLowerCase()),
  );
}

export function toFriendlyError(error: unknown, fallback: string): Error {
  if (error instanceof Error && error.name === "AppError") return error;

  if (!process.env.DATABASE_URL) {
    return new AppError(ERROR_MESSAGES.dbConfig);
  }
  if (isDatabaseError(error)) {
    return new AppError(ERROR_MESSAGES.dbConnection);
  }
  if (error instanceof Error && error.message) {
    return new AppError(fallback);
  }
  return new AppError(fallback);
}

export class AppError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AppError";
  }
}

export async function safeQuery<T>(
  operation: () => Promise<T>,
  fallback: string,
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (error instanceof Error && error.name === "AppError") throw error;
    throw toFriendlyError(error, fallback);
  }
}

export function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "P2002"
  );
}
