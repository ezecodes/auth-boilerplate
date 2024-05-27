const { ResetLinks } = require("../models");

async function createResetLink({ data }) {
  await ResetLinks.create({ ...data });
}

async function findLink({ query, attributes }) {
  return await ResetLinks.findOne({ where: query, attributes });
}

async function deleteResetLink({ query }) {
  await ResetLinks.destroy({ where: query });
}

async function updateResetLink({ query, data }) {
  await ResetLinks.update({ ...data }, { where: query });
}

module.exports = {
  createResetLink,
  updateResetLink,
  findLink,
  deleteResetLink,
};
