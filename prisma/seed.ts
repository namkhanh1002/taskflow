import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const DEMO_EMAIL = "demo@taskflow.app";
const DEMO_PASSWORD = "Demo1234!";

const DEFAULT_CATEGORIES = [
  { name: "Cá nhân", color: "#8b5cf6", icon: "user" },
  { name: "Công việc", color: "#0ea5e9", icon: "briefcase" },
  { name: "Học tập", color: "#f59e0b", icon: "graduation-cap" },
  { name: "Mua sắm", color: "#10b981", icon: "shopping-cart" },
  { name: "Khác", color: "#64748b", icon: "folder" },
];

function dayOffset(offset: number): Date {
  const now = new Date();
  const day = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
  day.setUTCDate(day.getUTCDate() + offset);
  return day;
}

async function main() {
  const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DIRECT_URL hoặc DATABASE_URL chưa được cấu hình trong .env");
  }

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });

  try {
    const password = await bcrypt.hash(DEMO_PASSWORD, 12);
    const user = await prisma.user.upsert({
      where: { email: DEMO_EMAIL },
      update: { password },
      create: { email: DEMO_EMAIL, name: "Người dùng Demo", password },
    });

    await prisma.userSettings.upsert({
      where: { userId: user.id },
      update: { taskReminders: true, overdueAlerts: true, weeklySummary: true },
      create: {
        userId: user.id,
        taskReminders: true,
        overdueAlerts: true,
        weeklySummary: true,
      },
    });

    await prisma.taskTag.deleteMany({ where: { task: { userId: user.id } } });
    await prisma.task.deleteMany({ where: { userId: user.id } });
    await prisma.tag.deleteMany({ where: { userId: user.id } });
    await prisma.category.deleteMany({ where: { userId: user.id } });

    const categories: Record<string, string> = {};
    for (const category of DEFAULT_CATEGORIES) {
      const created = await prisma.category.create({
        data: { ...category, userId: user.id },
      });
      categories[category.name] = created.id;
    }

    const tasks: {
      title: string;
      description?: string;
      status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
      priority: "LOW" | "MEDIUM" | "HIGH";
      dueDate?: Date;
      completedAt?: Date;
      category?: string;
      tags?: string[];
    }[] = [
      {
        title: "Chốt báo cáo tuần",
        description:
          "Tổng hợp kết quả làm việc của cả tuần và gửi cho quản lý trước 17h00.",
        status: "IN_PROGRESS",
        priority: "HIGH",
        dueDate: dayOffset(0),
        category: "Công việc",
        tags: ["báo cáo", "ưu tiên"],
      },
      {
        title: "Trả lời email khách hàng",
        description: "Phản hồi thắc mắc về đơn hàng #10482.",
        status: "PENDING",
        priority: "MEDIUM",
        dueDate: dayOffset(0),
        category: "Công việc",
        tags: ["email"],
      },
      {
        title: "Tập gym buổi tối",
        status: "PENDING",
        priority: "LOW",
        dueDate: dayOffset(0),
        category: "Cá nhân",
        tags: ["sức khỏe"],
      },
      {
        title: "Hoàn thành module thanh toán",
        description: "Kết nối cổng thanh toán và viết unit test cho luồng checkout.",
        status: "IN_PROGRESS",
        priority: "HIGH",
        dueDate: dayOffset(2),
        category: "Công việc",
        tags: ["dev", "ưu tiên"],
      },
      {
        title: "Học Next.js App Router",
        description: "Hoàn thành 3 bài học về Server Components và caching.",
        status: "PENDING",
        priority: "MEDIUM",
        dueDate: dayOffset(3),
        category: "Học tập",
        tags: ["học tập"],
      },
      {
        title: "Mua sắm đồ gia đình",
        description: "Danh sách: sữa, trứng, rau xanh, cà phê.",
        status: "PENDING",
        priority: "LOW",
        dueDate: dayOffset(1),
        category: "Mua sắm",
        tags: ["mua sắm"],
      },
      {
        title: "Phỏng vấn ứng viên Frontend",
        description: "Vòng kỹ thuật với anh Minh, 14h00.",
        status: "PENDING",
        priority: "HIGH",
        dueDate: dayOffset(-1),
        category: "Công việc",
        tags: ["nhân sự"],
      },
      {
        title: "Hoàn thiện hồ sơ năng suất",
        status: "COMPLETED",
        priority: "MEDIUM",
        dueDate: dayOffset(-1),
        completedAt: dayOffset(-1),
        category: "Công việc",
        tags: ["báo cáo"],
      },
      {
        title: "Dọn dẹp phòng làm việc",
        status: "COMPLETED",
        priority: "LOW",
        completedAt: dayOffset(-2),
        category: "Cá nhân",
      },
      {
        title: "Nghĩ ý tưởng side project",
        description: "Ghi lại 5 ý tưởng ứng dụng có thể làm vào cuối tuần.",
        status: "PENDING",
        priority: "LOW",
        category: "Cá nhân",
        tags: ["ý tưởng"],
      },
    ];

    for (const task of tasks) {
      await prisma.task.create({
        data: {
          userId: user.id,
          title: task.title,
          description: task.description ?? null,
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDate ?? null,
          completedAt: task.completedAt ?? null,
          categoryId: task.category ? categories[task.category] : null,
          tags: task.tags?.length
            ? {
                create: task.tags.map((name) => ({
                  tag: {
                    connectOrCreate: {
                      where: { userId_name: { userId: user.id, name } },
                      create: { name, userId: user.id },
                    },
                  },
                })),
              }
            : undefined,
        },
      });
    }

    console.log(`Seed hoàn tất: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
    console.log(`- ${DEFAULT_CATEGORIES.length} danh mục`);
    console.log(`- ${tasks.length} công việc`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("Seed thất bại:", error);
  process.exit(1);
});
