const locationModel = require("../model/LocationModel");

module.exports.home = (request, response) => {
  response.status(200).send({
    status: true, //react
    message: "Welcome",
  });
};

module.exports.getLocation = async (request, response) => {
  let result = await locationModel.find();
  response.status(200).send({
    status: true, //react
    result,
  });
};

module.exports.getLocationById = async (request, response) => {
  let { id } = request.params;

  let result = await locationModel.find({ location_id: id });
  if (result) {
    response.status(200).send({
      status: true, //react
      result,
    });
  } else {
    response.status(200).send({
      status: false, //react
      message: "location not found",
    });
  }
};

module.exports.getLocationByCity = async  (request, response) => {
  let { city } = request.query;
  try {
    let result = await LocationModel.find({
      city: { $regex: city + ".*", $options: "i" },
    });
    response.status(200).send({
      status: true,
      location: result,
    });
  } catch (error) {
    response.status(500).send({
      status: false,
      message: "server error",
      error,
    });
  }
};