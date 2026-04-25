// ============================================
// BUỔI 06 — Backend: Express Server
// Xây dựng server + form đăng ký người dùng
// ============================================

require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// --- Biến đếm ID tự tăng cho đăng ký ---
let currentId = 0;

// ============================================
// STATIC — Serve file HTML từ thư mục public
// ============================================
app.use(express.static('public'));

// ============================================
// Middleware parse JSON body (cho POST request)
// ============================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// MW Logger — Ghi log [time] METHOD /path
// Đặt TRƯỚC các route
// ============================================
app.use((req, res, next) => {
  const now = new Date().toLocaleTimeString('vi-VN');
  console.log(`[${now}] ${req.method} ${req.path}`);
  next();
});

// ============================================
// MW checkAge — Kiểm tra tuổi >= 18
// Middleware riêng, gắn cho route GET /api/info
// ============================================
function checkAge(req, res, next) {
  const age = parseInt(req.query.age);

  if (!age || age < 18) {
    return res.status(400).json({
      error: 'Tuổi phải từ 18 trở lên!'
    });
  }

  next();
}

// ============================================
// GET /api/info?name=&age=
// Gắn middleware checkAge riêng cho route này
// ============================================
app.get('/api/info', checkAge, (req, res) => {
  const { name, age } = req.query;

  res.json({
    name: name,
    age: Number(age),
    message: `Xin chào ${name}, bạn ${age} tuổi. Chào mừng bạn!`
  });
});

// ============================================
// POST /api/register
// Nhận body: name, age, email
// Validate không được bỏ trống
// Trả lại thông tin + id tự tăng
// ============================================
app.post('/api/register', (req, res) => {
  const { name, age, email } = req.body;

  // Validate không được bỏ trống
  if (!name || !age || !email) {
    return res.status(400).json({
      error: 'Vui lòng điền đầy đủ: name, age, email!'
    });
  }

  // Tăng ID
  currentId++;

  res.json({
    id: currentId,
    name: name,
    age: Number(age),
    email: email,
    message: `Đăng ký thành công cho ${name}!`
  });
});

// ============================================
// Khởi động server
// ============================================
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
