// server.js
require('dotenv').config();
const express = require('express');
const Router = require("./src/router/Router");

const app = express();
const port = 3000;
// Cấu hình middleware cho phép nhận dữ liệu JSON
app.use(express.json());

// Sử dụng Router
Router(app);

// Lắng nghe trên cổng 3000
app.listen(port, () => {
    console.log(`Server chạy tại http://localhost:${port}`);
});
