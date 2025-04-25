// src/router/Auth.js
const express = require('express');
const PlaylistController = require("../controller/Playlist");

const router = express.Router();
// API Login
router.post('/', PlaylistController.create);
router.post('/addTrack', PlaylistController.addTrack);
router.get('/:playlistId/tracks', PlaylistController.getTracksByPlaylistId);
router.get('/:userId', PlaylistController.getPlaylistByUserId);
router.delete('/:playlistId/track/:trackId', PlaylistController.deleteTrackByPlaylistId);
module.exports = router;
