import express from "express";
import knex from "../database_client.js";

// This router can be deleted once you add your own router
const mealsRouter = express.Router();

mealsRouter.get("/", async (req, res) => {
  const allMeals = await knex.select("*").from("Meal").orderBy("ID", "ASC");

  const maxPriceApi = parseFloat(req.query.maxPrice);

  const availableReservationsApi = req.query.availableReservations;
  const titleApi = req.query.title?.trim();
  const dateAfterApi = req.query.dateAfter;
  const dateBeforeApi = req.query.dateBefore;
  const limitApi = parseInt(req.query.limit, 100);
  const sortKeyApi = req.query.sortKey;
  const sortDirApi = req.query.sortDir?.toLowerCase();

  if (maxPriceApi) {
    const maxPriceMeals = await knex
      .select("*")
      .from("Meal")
      .where("price", "<", maxPriceApi);

    return res.send(maxPriceMeals);
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
    const titleMeals = await knex
      .select("*")
      .from("Meal")
      .where("title", "LIKE", `%${titleApi}%`);

    return res.send(titleMeals);
  }

  if (dateAfterApi) {
    const dateAfterMeals = await knex
      .select("*")
      .from("Meal")
      .where("created_date", ">", dateAfterApi);

    return res.send(dateAfterMeals);
  }

  if (dateBeforeApi) {
    const dateBeforeMeals = await knex
      .select("*")
      .from("Meal")
      .where("created_date", "<", dateBeforeApi);

    return res.send(dateBeforeMeals);
  }
  console.log(allMeals);
  const validSortKeys = [
    "title",
    "when",
    "max_reservations",
    "price",
    "created_date",
  ];
  if (sortKeyApi && validSortKeys.includes(sortKeyApi)) {
    if (sortDirApi) {
      const sortedMeals = await knex
        .select("*")
        .from("Meal")
        .orderBy(sortKeyApi, sortDirApi);

      return res.send(sortedMeals);
    } else {
      const sortedMeals = await knex
        .select("*")
        .from("Meal")
        .orderBy(sortKeyApi, "ASC");

      return res.send(sortedMeals);
    }
  }

  if (
    !availableReservationsApi ||
    !titleApi ||
    !dateAfterApi ||
    !dateBeforeApi ||
    !limitApi ||
    !sortKeyApi
  ) {
    if (limitApi) {
      const limitedMeals = await knex("Meal")
        .select("*")
        .orderBy("ID", "ASC")
        .limit(parseInt(limitApi));

      return res.send(limitedMeals);
    } else {
      return res.send(allMeals);
    }
  }
});

mealsRouter.post("/", async (req, res) => {
  const { title, description, location, max_reservations, price } = req.query;
  try {
    await knex("Meal").insert({
      title,
      description,
      location,
      max_reservations,
      price,
      created_date: new Date(),
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

mealsRouter.get("/:meal_id/reviews", async (req, res) => {
  const mealId = req.params.meal_id;

  const fetchedItem = await knex
    .select("*")
    .from("Review")
    .where("meal_id", mealId);

  if (fetchedItem.length > 0) {
    res.send(fetchedItem);
  } else {
    res.send("No data found in that meal ID");
  }
});

mealsRouter.put("/:meal_id/reviews", async (req, res) => {
  const mealId = req.params.meal_id;

  const fetchedItem = await knex
    .select("*")
    .from("Review")
    .where("meal_id", mealId);

  if (fetchedItem.length > 0) {
    res.send(fetchedItem);
  } else {
    res.send("No data found in that meal ID");
  }
});

mealsRouter.delete("/:meal_id/reviews", async (req, res) => {
  const mealId = req.params.meal_id;

  const fetchedItem = await knex
    .select("*")
    .from("Review")
    .where("meal_id", mealId);

  if (fetchedItem.length > 0) {
    res.send(fetchedItem);
  } else {
    res.send("No data found in that meal ID");
  }
});

export default mealsRouter;
