const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

module.exports = {
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: 'Email và mật khẩu là bắt buộc' });
            }

            const results = await db.query('SELECT * FROM users WHERE email = ?', [email]);

            if (results.length === 0) {
                return res.status(404).json({ message: 'Tài khoản hoặc mật khẩu không đúng' });
            }
            const user = results[0][0];

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Tài khoản hoặc mật khẩu không đúng' });
            }
            const token = jwt.sign(
                { userId: user.id, email: user.email, username: user.username },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            return res.status(200).json({
                message: 'Đăng nhập thành công',
                token
            });
        } catch (error) {
            console.error('Lỗi truy vấn:', error);
            return res.status(500).json({ message: 'Lỗi server' });
        }
    },
    register: async (req, res) => {
        const { username, email, password } = req.body;

        // Kiểm tra dữ liệu
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Vui lòng nhập đầy đủ email và mật khẩu.' });
        }

        try {
            // Kiểm tra email đã tồn tại chưa
            const [user] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
            if (user.length > 0) {
                return res.status(400).json({ error: 'Email đã được sử dụng.' });
            }

            // Mã hóa mật khẩu
            const hashedPassword = await bcrypt.hash(password, 10);

            // Lưu vào DB
            await db.execute('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);

            return res.status(200).json({ message: 'Đăng ký thành công!' });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Lỗi máy chủ.' });
        }
    }
};
