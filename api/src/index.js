import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import knex from "./database_client.js";
import nestedRouter from "./routers/nested.js";
import mealsRouter from "./routers/meals.js";
import reservationsRouter from "./routers/reservations.js";
import reviewsRouter from "./routers/reviews.js";
const app = express();

app.use(cors());
app.use(bodyParser.json());

const apiRouter = express.Router();

// This nested router example can also be replaced with your own sub-router
apiRouter.use("/nested", nestedRouter);
apiRouter.use("/meals", mealsRouter);
apiRouter.use("/reservations", reservationsRouter);
apiRouter.use("/reviews", reviewsRouter);

app.use("/", apiRouter);

app.get("/future-meals", async (req, res) => {
  //   const meals = await knex.raw("SELECT * FROM Meal");
  // console.log(meals);
  const futureMeals = await knex.raw(
    "SELECT * FROM Meal WHERE created_date >= NOW() ORDER BY created_date DESC"
  );
  if (futureMeals.length > 0) {
    res.send(futureMeals);
  } else {
    res.send([]);
  }
});

app.get("/past-meals", async (req, res) => {
  const pastMeals = await knex.raw(
    "SELECT * FROM Meal WHERE created_date <= NOW() ORDER BY created_date DESC"
  );
  if (pastMeals.length > 0) {
    res.send(pastMeals);
  } else {
    res.send([]);
  }
});
app.get("/all-meals", async (req, res) => {
  const allMeals = await knex.raw("SELECT * FROM Meal ORDER BY ID ASC");

  if (allMeals.length > 0) {
    res.send(allMeals);
  } else {
    res.send([]);
  }
});

app.get("/first-meal", async (req, res) => {
  const firstMeal = await knex.raw(
    "SELECT * FROM Meal ORDER BY ID ASC LIMIT 1"
  );
  if (firstMeal) {
    res.send(firstMeal);
  } else {
    res.status(404).send("No meals found");
  }
});

app.get("/last-meal", async (req, res) => {
  const lastMeal = await knex.raw(
    "SELECT * FROM Meal ORDER BY ID DESC LIMIT 1"
  );
  if (lastMeal) {
    res.send(lastMeal);
  } else {
    res.status(404).send("No meals found");
  }
});

app.listen(process.env.PORT, () => {
  console.log(`API listening on port ${process.env.PORT}`);
});
