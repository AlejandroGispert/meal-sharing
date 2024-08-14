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

reservationsRouter.post("/", async (req, res) => {
  const {
    contact_email,
    contact_name,
    contact_phonenumber,
    meal_id,
    number_of_guests,
  } = req.query;
  try {
    await knex.transaction(async (trx) => {
      await trx("Reservation").insert({
        contact_email,
        contact_name,
        contact_phonenumber,
        meal_id,
        number_of_guests,
      });
    });
    res.status(201).send("Reservation created successfully.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating reservation.");
  }
});
export default reservationsRouter;
