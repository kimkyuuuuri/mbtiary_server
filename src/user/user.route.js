const user = require("./user.controller");
const jwtMiddleware = require("../../config/jwtMiddleware");
module.exports = function (app) {
  const user = require("./user.controller");
  const jwtMiddleware = require("../../config/jwtMiddleware");
  const profileImageUploader = require("../../config/imageS3");

  // 1. 유저 생성 (회원가입) API
  app.post("/users", user.postUsers);

  // 유저 삭제 api
  app.patch("/users/:userIdx/status", jwtMiddleware, user.deleteUser);
  // 유저 닉네임 변경 api
  app.patch("/users/:userIdx/nickname", jwtMiddleware, user.patchUserNickname);

  app.get("/auth/auto-login", jwtMiddleware, user.check);
  // 유저 프로필 사진 변경 api
  app.patch(
    "/users/:userIdx/profile-img-url",
    profileImageUploader.single("profileImg"),
    user.patchUserprofileImgUrl
  );

  // 일별 mbti
  app.get("/users/:userIdx/mbti/day", jwtMiddleware, user.getUserMbtiByDay);

  // 주별 mbti
  app.get("/users/:userIdx/mbti/week", jwtMiddleware, user.getUserMbtiByWeek);

  // 월별 mbti
  app.get("/users/:userIdx/mbti/month", user.getUserMbtiByMonth);

  // 마이페이지 조회 api
  app.get("/users/:userIdx", jwtMiddleware, user.getUser);
};
