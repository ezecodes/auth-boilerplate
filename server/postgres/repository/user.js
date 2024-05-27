const { Users } = require("../models");
async function findUser({ query, attributes }) {
  return await Users.findOne({ where: query, attributes });
}
async function createUser({ data }) {
  return await Users.create(data, { returning: true });
}

async function destroyUser({ query }) {
  await Users.destroy({ where: query });
}

async function updateUser({ data, query }) {
  return await Users.update({ ...data }, { where: query });
}

async function findAllUsers({ page = 1, pageSize = 10, attributes }) {
  const offset = (page - 1) * pageSize;
  const data = await Users.findAndCountAll({
    attributes,
    limit: pageSize,
    offset: offset,
  });
  return {
    rows: data.rows,
    page,
    pageSize,
  };
}
module.exports = {
  findUser,
  createUser,
  updateUser,
  findAllUsers,
  destroyUser,
};
