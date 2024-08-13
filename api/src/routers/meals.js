import express from "express";
import knex from "../database_client.js";

// This router can be deleted once you add your own router
const mealsRouter = express.Router();

mealsRouter.get("/", async (req, res) => {
  const allMeals = await knex.select("*").from("Meal").orderBy("ID", "ASC");

  if (allMeals.length > 0) {
    res.send(allMeals);
  } else {
    res.send([]);
  }
});

export default mealsRouter;
