const db = require('../config/database');

module.exports = {
    getPlaylistByUserId: async (req, res) => {
        const userId = req.params.userId;

        const sql = 'SELECT * FROM playlists WHERE user_id = ?';
        try {
            const [results] = await db.query(sql, [userId]);
            res.json(results);
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    },

    create: async (req, res) => {
        const { userId, playlistName, description } = req.body;

        if (!userId || !playlistName) {
            return res.status(400).json({ message: 'Missing userId or playlistName' });
        }

        const sql = 'INSERT INTO playlists (user_id, name, description) VALUES (?, ?, ?)';
        try {
            const [result] = await db.query(sql, [userId, playlistName, description]);
            res.status(201).json({ message: 'Playlist created', playlistId: result.insertId });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    },

    addTrack: async (req, res) => {
        try {
            const { playlistId, trackId } = req.body;

            // Validate input: check if playlistId and trackId are provided
            if (!playlistId || !trackId) {
                return res.status(400).json({ message: "Thiếu thông tin playlist hoặc bài hát" });
            }

            // Kiểm tra nếu track đã có trong playlist
            const [existsInPlaylist] = await db.query(
                "SELECT * FROM playlist_tracks WHERE playlist_id = ? AND track_id = ?",
                [playlistId, trackId]
            );

            if (existsInPlaylist.length) {
                return res.status(409).json({ message: "Bài hát đã có trong playlist" });
            }

            // Thêm bài hát vào playlist
            await db.query(
                "INSERT INTO playlist_tracks (playlist_id, track_id) VALUES (?, ?)",
                [playlistId, trackId]
            );

            return res.status(200).json({ message: "Thêm bài hát vào playlist thành công" });

        } catch (error) {
            // Log the error and return a 500 status with a generic error message
            console.error("Lỗi khi thêm bài hát vào playlist:", error);
            return res.status(500).json({ message: "Lỗi server" });
        }
    },
    getTracksByPlaylistId: async (req, res) => {
        const playlistId = req.params.playlistId;

        // Kiểm tra playlistId có hợp lệ không
        if (!playlistId) {
            return res.status(400).json({ message: 'Playlist ID không hợp lệ' });
        }

        try {
            const [tracks] = await db.query('SELECT * FROM playlist_tracks where playlist_id = ?', [playlistId]);

            if (tracks.length === 0) {
                return res.status(404).json({ message: 'Không có bài hát nào trong playlist' });
            }

            return res.status(200).json(tracks); // Trả về danh sách bài hát
        } catch (err) {
            console.error("Lỗi khi lấy bài hát:", err);
            return res.status(500).json({ message: 'Lỗi server khi lấy bài hát' });
        }
    },
    deleteTrackByPlaylistId: async (req, res) => {
        try {
            const { playlistId, trackId } = req.params;
            console.log({ playlistId, trackId })

            if (!playlistId || !trackId) {
                return res.status(400).json({ message: 'Thiếu playlistId hoặc trackId' });
            }

            await db.query(
                'DELETE FROM playlist_tracks WHERE playlist_id = ? AND track_id = ?',
                [playlistId, trackId]
            );

            return res.status(200).json({ message: 'Đã xóa bài hát khỏi playlist' });
        } catch (error) {
            console.error('Lỗi khi xóa bài hát khỏi playlist:', error);
            return res.status(500).json({ message: 'Lỗi server' });
        }
    },
};
