import express from "express";
import knex from "../database_client.js";

// This router can be deleted once you add your own router
const mealsRouter = express.Router();

mealsRouter.get("/", async (req, res) => {
  const allMeals = await knex.select("*").from("Meal").orderBy("ID", "ASC");

  const maxPriceApi = req.query.maxPrice;

  const availableReservationsApi = req.query.availableReservations;
  const titleApi = req.query.title;
  const dateAfterApi = req.query.dateAfter;
  const dateBeforeApi = req.query.dateBefore;
  const limitApi = req.query.limit;
  const sortKeyApi = req.query.sortKey;
  const sortDirApi = req.query.sortDir;

  if (maxPriceApi) {
    const maxPriceMeals = await knex
      .select("*")
      .from("Meal")
      .where("price", "<", maxPriceApi);

    res.send(maxPriceMeals);
  }
  if (availableReservationsApi) {
    const availableReservationsMeals = await knex("Meal")
      .join("Reservation", "Meal.id", "=", "Reservation.meal_id")
      .select("Meal.max_reservations", "Reservation.number_of_guests");

    for (const meal of availableReservationsMeals) {
      const reservationsAvailable =
        meal.max_reservations - meal.number_of_guests;

      if (reservationsAvailable > 0 && availableReservationsApi === "true") {
        console.log(meal);
        return res.send(meal);
      }
      if (reservationsAvailable === 0 && availableReservationsApi === "false") {
        console.log(meal);
        return res.send(meal);
      }
    }
  }

  if (titleApi) {
    const titleMeals = await knex("Meal").where(
      "title",
      "LIKE",
      `%${titleApi}%`
    );

    res.send(titleMeals);
  }
  if (dateAfterApi) {
    const dateAfterMeals = await knex("Meal").where(
      "created_date",
      ">",
      dateAfterApi
    );

    res.send(dateAfterMeals);
  }
  if (dateBeforeApi) {
    const dateBeforeMeals = await knex("Meal").where(
      "created_date",
      ">",
      dateBeforeApi
    );

    res.send(dateBeforeMeals);
  }

  if (limitApi) {
    const limitedMeals = await knex("Meal").limit(parseInt(limitApi));

    res.send(limitedMeals);
  }
  if (sortKeyApi) {
    if (sortDirApi) {
      const sortedMeals = await knex("Meal").orderBy(sortKeyApi, sortDirApi);

      res.send(sortedMeals);
    } else {
      const sortedMeals = await knex("Meal").orderBy(sortKeyApi, "ASC");

      res.send(sortedMeals);
    }
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

mealsRouter.put("/:id", async (req, res) => {
  const id = req.params.id;
  const { title, description, location, max_reservations, price } = req.query;

  await knex("Meal").where({ id: id }).update({
    title,
    description,
    location,
    max_reservations,
    price,
    created_date: new Date(),
  });

  res.send("The database has been updated");
});

mealsRouter.delete("/:id", async (req, res) => {
  const id = req.params.id;

  await knex("Meal").where("id", id).del();

  res.send("the item has been deleted");
});
export default mealsRouter;
