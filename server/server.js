require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, trim: true, unique: true, maxlength: 40 },
  name: { type: String, required: true, trim: true, maxlength: 120 },
  email: { type: String, required: true, trim: true, lowercase: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }
}, { timestamps: true });
const Student = mongoose.model("Student", studentSchema);
const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.CLIENT_URL,
].filter(Boolean);
app.use(cors({
  origin(origin, callback) {
    callback(null, !origin || allowedOrigins.includes(origin));
  },
}));
app.use(express.json({ limit: "16kb" }));
app.use((req, res, next) => {
  const startedAt = Date.now();
  res.on("finish", () => {
    console.log(`${req.method} ${req.path} ${res.statusCode} ${Date.now() - startedAt}ms`);
  });
  next();
});
app.get("/api/hello", (req, res) => res.json({ message: "Backend is running" }));
function health(_req, res) {
  res.status(200).json({ status: "UP", timestamp: new Date().toISOString(), uptime: process.uptime() });
}
app.get("/health", health);
app.get("/api/health", health);

function studentInput(req, res, next) {
  const { studentId, name, email } = req.body || {};
  if (![studentId, name, email].every(v => typeof v === "string" && v.trim())) {
    return res.status(400).json({ message: "Vui lòng nhập đủ MSSV, họ tên và email." });
  }
  req.student = { studentId: studentId.trim(), name: name.trim(), email: email.trim() };
  next();
}
app.param("id", (req, res, next, id) => {
  if (!mongoose.isObjectIdOrHexString(id)) return res.status(400).json({ message: "ID không hợp lệ." });
  next();
});
app.get("/api/students", async (req, res) => {
  res.json(await Student.find().sort({ createdAt: -1 }));
});
app.post("/api/students", studentInput, async (req, res) => {
  res.status(201).json(await Student.create(req.student));
});
app.put("/api/students/:id", studentInput, async (req, res) => {
  const student = await Student.findByIdAndUpdate(req.params.id, { $set: req.student }, { new: true, runValidators: true });
  if (!student) return res.status(404).json({ message: "Không tìm thấy sinh viên." });
  res.json(student);
});
app.delete("/api/students/:id", async (req, res) => {
  const student = await Student.findByIdAndDelete(req.params.id);
  if (!student) return res.status(404).json({ message: "Không tìm thấy sinh viên." });
  res.json({ message: "Đã xóa sinh viên." });
});
app.use((err, req, res, next) => {
  if (err.code === 11000) return res.status(409).json({ message: "MSSV đã tồn tại." });
  if (err.name === "ValidationError" || err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Dữ liệu không hợp lệ. Kiểm tra email và độ dài thông tin." });
  }
  res.status(500).json({ message: "Lỗi máy chủ. Vui lòng thử lại." });
});
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    await Student.init();
    console.log("MongoDB connected; Cloud Lab production backend is ready");
    app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
  })
  .catch(() => {
    console.error("MongoDB connection failed. Check credentials and Atlas Network Access.");
    process.exit(1);
  });
