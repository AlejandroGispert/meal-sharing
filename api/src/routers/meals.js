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
  const { title, description, location, max_reservations, price } = req.query;
  try {
    await knex.transaction(async (trx) => {
      await trx("Meal").insert({
        title,
        description,
        location,
        max_reservations,
        price,
        created_date: new Date(),
      });
    });
    res.status(201).send("New Meal created successfully.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating reservation.");
  }
});

mealsRouter.get("/:id", async (req, res) => {
  const id = req.params.id;

  const fetchedItem = await knex.select("*").from("Meal").where("id", id);

  if (fetchedItem.length > 0) {
    res.send(fetchedItem);
  } else {
    res.send("No data found in that meal ID");
  }
});
export default mealsRouter;
