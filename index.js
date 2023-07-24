const express = require("./config/express");
const { logger } = require("./config/winston");

const port = 8080;
express().listen(port);
logger.info(`${process.env.PORT} - API Server Start At Port ${port}`);
