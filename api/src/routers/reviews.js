import express from "express";
import knex from "../database_client.js";

const reviewsRouter = express.Router();

reviewsRouter.get("/", async (req, res) => {
  const allReviews = await knex.select("*").from("Review").orderBy("ID", "ASC");

  if (allReviews.length > 0) {
    res.send(allReviews);
  } else {
    res.sendStatus("401");
  }
});

reviewsRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  const fetchedReview = await knex.select("*").from("Review").where("id", id);

  if (fetchedReview) {
    res.send(fetchedReview);
  } else {
    res.sendStatus("401");
  }
});

reviewsRouter.post("/", async (req, res) => {
  // ('Buenisimo', 'Italiano perfecctisima la mama del la comida', 1,5),('thunder', 'the food was stormy', 2,3)
  const { description, meal_id, stars, title } = req.query;
  try {
    await knex("Review").insert({
      description,
      meal_id,
      stars,
      title,
    });

    res.status(201).send("Review created successfully.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating review.");
  }
});

reviewsRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  const fetchedReview = await knex.select("*").from("Review").where("id", id);

  if (fetchedReview) {
    res.send(fetchedReview);
  } else {
    res.sendStatus("401");
  }
});

export default reviewsRouter;
