module.exports = function (app) {
  const authController = require("./auth.controller");

  // 1. 소셜 로그인 api
  app.post("/auth/login/kakao", authController.kakaoLogin);
};
