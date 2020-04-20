const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');

// index, show, store, update, destroy

async function findOneByUserName(username) {
  const dev = await Dev.findOne({ username });
  return dev;
}

module.exports = {
  async index(req, res) {
    const devs = await Dev.find();

    return res.json(devs);
  },

  async store(req, res) {
    const { github_username, techs, longitude, latitude } = req.body;
    let dev = await Dev.findOne({ github_username });

    if (!dev) {
      const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);

      const { name = login, avatar_url, bio } = apiResponse.data;
      const techsArray = parseStringAsArray(techs);
      const location = {
        type: 'Point',
        coordinates: [longitude, latitude]
      };

      dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techsArray,
        location
      });
    }

    return res.json(dev);
  },

  async update(req, res) {
    const { github_username, bio, techs, location } = req;
    const dev = findOneByUserName(github_username);
    if (dev) {
      console.log(dev);
      await Dev.updateOne({ github_username }, { bio, techs, location });
      return res.json(updatedDev);
    } else {
      console.log('Dev não encontrado');
    }
  },

  async destroy(req, res) {}
};
