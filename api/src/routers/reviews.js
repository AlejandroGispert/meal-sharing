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

export default reviewsRouter;
