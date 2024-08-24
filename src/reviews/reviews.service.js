const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

const addCritic = mapProperties({
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
});

function read(review_id) {
  return knex("reviews").select("*").where({ review_id }).first();
}

function destroy(review_id) {
  return knex("reviews").where({ review_id }).del();
}

function update(updatedReview) {
  return knex("reviews")
    .select("*")
    .where({ review_id: updatedReview.review_id })
    .update(updatedReview, "*")
    .then(() => {
      return knex("reviews as r")
        .join("critics as c", "r.critic_id", "c.critic_id")
        .select(
          "r.*",
          "c.critic_id",
          "c.preferred_name",
          "c.surname",
          "c.organization_name",
          "c.created_at as critic_created_at",
          "c.updated_at as critic_updated_at"
        )
        .where({ "r.review_id": updatedReview.review_id })
        .first()
        .then(addCritic);
    });
}

module.exports = {
  read,
  update,
  delete: destroy,
};
