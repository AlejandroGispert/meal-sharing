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
  const numberOfGuests = req.params.number_of_guests;
  const mealId = req.params.meal_id;
  const contactPhonenumber = req.params.contact_phonenumber;
  const contactName = req.params.contact_name;
  const contactEmail = req.params.contact_email;

  await knex.transaction(async (trx) => {
    await trx("Reservation").insert({
      number_of_guests: numberOfGuests,
      meal_id: mealId,
      contact_phonenumber: contactPhonenumber,
      contact_name: contactName,
      contact_email: contactEmail,
    });
  });
  res.send("new meal added");
});
export default reservationsRouter;
