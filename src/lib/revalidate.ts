import { revalidatePath } from "next/cache";

/**
 * Làm mới cache của toàn bộ các trang được bảo vệ sau khi dữ liệu thay đổi.
 * Các trang đều động (cần phiên đăng nhập) nên revalidate ở mức layout là an toàn.
 */
export function revalidateApp(): void {
  revalidatePath("/", "layout");
}
