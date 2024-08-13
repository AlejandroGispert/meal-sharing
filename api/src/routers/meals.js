import express from "express";

// This router can be deleted once you add your own router
const mealsRouter = express.Router();

mealsRouter.get("/", (req, res) => {
  res.json({ message: "Hello nested router" });
});

export default mealsRouter;
