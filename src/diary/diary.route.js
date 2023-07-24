const diary = require("./diary.controller");
const jwtMiddleware = require("../../config/jwtMiddleware");
const profileImageUploader = require("../../config/imageS3");
const user = require("../user/user.controller");
module.exports = function (app) {
  const diary = require("./diary.controller");
  const jwtMiddleware = require("../../config/jwtMiddleware");
  const diaryImageUploader = require("../../config/imageS3");


  app.post(
    "/diarys",
    jwtMiddleware,
    diaryImageUploader.single("diaryImg"),
    diary.postDiarys
  );
  app.get("/diarys/:diaryIdx", jwtMiddleware, diary.getDiary);
  app.get("/home/calendar", jwtMiddleware, diary.getCalendar);
  app.get("/home/list", jwtMiddleware, diary.getDiaryList);
  app.get("/diarys/:diaryIdx/mbti", jwtMiddleware, diary.getDiaryMbti);
  app.patch("/diarys/:diaryIdx/status", jwtMiddleware, diary.deleteDiary);

};

