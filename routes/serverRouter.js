const express = require("express");
const {
  getServerDetails,
  piggie_stats,
  piggie_user_stats,
  piggie_server_stats,
  piggie_channel_stats,
  piggie_stats_controller,
  piggie_server_stats_controller,
  piggie_user_stats_controller,
  piggie_channel_stats_controller,
} = require("../controllers/serverController");
const serverRouter = express.Router();

serverRouter.use(express.urlencoded({ extended: false }));

serverRouter.route("/:id").get(getServerDetails);
serverRouter.route("/:id/piggie-stats").get(piggie_stats_controller);
serverRouter.route("/:id/piggie-user-stats").get(piggie_user_stats_controller);
serverRouter
  .route("/:id/piggie-server-stats")
  .get(piggie_server_stats_controller);
serverRouter
  .route("/:id/piggie-channel-stats")
  .get(piggie_channel_stats_controller);

module.exports = serverRouter;
