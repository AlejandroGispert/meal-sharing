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

mealsRouter.post("/", async (req, res) => {
  const title = req.params.title;
  const description = req.params.description;
  const location = req.params.location;
  const maxReservations = req.params.max_reservations;
  const price = req.params.price;

  await knex.transaction(async (trx) => {
    await trx("Meal").insert({
      title: title,
      description: description,
      location: location,
      max_reservations: maxReservations,
      price: price,
      created_date: new Date(),
    });
  });
  res.send("new meal added");
});

export default mealsRouter;
