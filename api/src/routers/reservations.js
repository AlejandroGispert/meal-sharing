import express from "express";

// This router can be deleted once you add your own router
const reservationsRouter = express.Router();

reservationsRouter.get("/", (req, res) => {
  res.json({ message: "Hello nested router" });
});

export default reservationsRouter;
