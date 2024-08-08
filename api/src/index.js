import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import knex from "./database_client.js";
import nestedRouter from "./routers/nested.js";

const app = express();

app.use(cors());
app.use(bodyParser.json());

const apiRouter = express.Router();

// This nested router example can also be replaced with your own sub-router
apiRouter.use("/nested", nestedRouter);

app.use("/api", apiRouter);

app.get("/future-meals", async (req, res) => {
  //   const meals = await knex.raw("SELECT * FROM Meal");
  // console.log(meals);
  const futureMeals = await knex.raw(
    `SELECT * FROM Meal WHERE created_date >= NOW() ORDER BY created_date DESC`
  );
  if (futureMeals.length > 0) {
    res.send(futureMeals);
  } else {
    res.send([]);
  }
});
app.get("/past-meals", async (req, res) => {
  const pastMeals = await knex.raw(
    `SELECT * FROM Meal WHERE created_date <= NOW() ORDER BY created_date DESC`
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

// this comments are for myself

// You can delete this route once you add your own routes
// apiRouter.get("/", async (req, res) => {
//   const SHOW_TABLES_QUERY =
//     process.env.DB_CLIENT === "pg"
//       ? "SELECT * FROM pg_catalog.pg_tables;"
//       : "SHOW TABLES;";
//   const tables = await knex.raw(SHOW_TABLES_QUERY);
//   res.json({ tables });
// });

// console.log(Date(Date.now()));
