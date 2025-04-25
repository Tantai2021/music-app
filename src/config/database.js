
const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER, 
    password: process.env.DB_PASS, 
    database: process.env.DB_NAME, 
    waitForConnections: true,  
    connectionLimit: 10,
    queueLimit: 0 
});
(async () => {
    try {
        const conn = await db.getConnection();
        console.log('✅ [MySQL] Kết nối thành công!');
        conn.release(); // Trả lại pool
    } catch (err) {
        console.error('❌ [MySQL] Lỗi kết nối:', err.message);
    }
})();
module.exports = db;
