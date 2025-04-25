// src/router/Router.js
const AuthRoutes = require("./Auth");
const PlaylistRoutes = require("./Playlist");
module.exports = (app) => {
    app.use("/api/auth", AuthRoutes);
    app.use("/api/playlists", PlaylistRoutes);
};
