import express from "express";
import path from "path";
import fs from "fs/promises";
import { createServer as createViteServer } from "vite";

const PORT = 3000;
const SUBMISSIONS_FILE = "submissions.json";

async function startServer() {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Ensure submissions file exists
  try {
    await fs.access(SUBMISSIONS_FILE);
  } catch {
    await fs.writeFile(SUBMISSIONS_FILE, JSON.stringify([]));
  }

  // API Route: Handle form submissions
  app.post("/api/submit", async (req, res) => {
    try {
      const { name, phone, address, quantity, note } = req.body;
      
      if (!name || !phone || !address || !quantity) {
        return res.status(400).json({ error: "Vui lòng điền đầy đủ các trường bắt buộc." });
      }

      const submissionDate = new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
      const newEntry = {
        name,
        phone,
        address,
        quantity,
        note: note || "",
        date: submissionDate,
      };

      // 1. Luôn lưu bản sao dự phòng tại máy chủ local
      const submissions = JSON.parse(await fs.readFile(SUBMISSIONS_FILE, "utf-8"));
      submissions.push({ id: submissions.length + 1, ...newEntry });
      await fs.writeFile(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2));

      // 2. Đẩy dữ liệu trực tiếp lên Google Sheet qua Webhook
      if (process.env.GOOGLE_SHEET_WEBHOOK) {
        try {
          const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK;
          // Sử dụng fetch để gửi dữ liệu dạng POST tới Apps Script
          const response = await fetch(webhookUrl, {
            method: "POST",
            body: JSON.stringify(newEntry),
          });
          console.log("Forwarded to Google Sheet:", response.status);
        } catch (webhookError) {
          console.error("Lỗi gửi dữ liệu lên Google Sheet:", webhookError);
          // Vẫn trả về success cho khách hàng vì dữ liệu đã được lưu tại server dự phòng
        }
      }

      res.json({ success: true, message: "Đã ghi nhận thông tin thành công. Chúng tôi sẽ liên hệ bạn ngay!" });
    } catch (error) {
      console.error("Submission error:", error);
      res.status(500).json({ error: "Lỗi hệ thống khi xử lý yêu cầu." });
    }
  });

  // API Route: Export as CSV (Simple Admin endpoint)
  // For security in a real app, this should have authentication.
  app.get("/api/export", async (req, res) => {
    try {
      const submissions = JSON.parse(await fs.readFile(SUBMISSIONS_FILE, "utf-8"));
      
      let csv = "STT,Họ Tên,Số điện thoại,Địa Chỉ,Số lượng,Ghi chú,Ngày gửi\n";
      submissions.forEach((entry: any, index: number) => {
        csv += `${index + 1},"${entry.name}","${entry.phone}","${entry.address}",${entry.quantity},"${entry.note}","${entry.date}"\n`;
      });

      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename=don-hang-sam-${new Date().toISOString().split('T')[0]}.csv`);
      res.status(200).send(csv);
    } catch (error) {
      res.status(500).send("Lỗi xuất file CSV");
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
