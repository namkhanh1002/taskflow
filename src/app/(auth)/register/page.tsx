import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Đăng ký",
  description: "Tạo tài khoản TaskFlow mới.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
