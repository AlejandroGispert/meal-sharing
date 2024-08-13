import express from "express";
import knex from "../database_client.js";
// This router can be deleted once you add your own router
const reservationsRouter = express.Router();

reservationsRouter.get("/", async (req, res) => {
  const allReservations = await knex
    .select("*")
    .from("Reservation")
    .orderBy("ID", "ASC");

  if (allReservations.length > 0) {
    res.send(allReservations);
  } else {
    res.send([]);
  }
});

export default reservationsRouter;
