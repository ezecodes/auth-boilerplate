const { AuthCodes } = require("../models");

const findAuthCode = async ({ query, attributes }) => {
  const data = await AuthCodes.findOne({
    where: { ...query },
    attributes: [...attributes],
  });
  return data;
};

const updateAuthCode = async ({ query, data }) => {
  await AuthCodes.update({ ...data }, { where: { ...query } });
};
const createAuthCode = async ({ data }) => {
  await AuthCodes.create({ ...data });
};
const destroyAuthCode = async ({ query }) => {
  await AuthCodes.destroy({ where: { ...query } });
};

module.exports = {
  findAuthCode,
  updateAuthCode,
  createAuthCode,
  destroyAuthCode,
};
