const appController = require("./app.controller");
module.exports = function (app) {
  const appController = require("./app.controller");

  app.get("/", appController.getHello);

};
