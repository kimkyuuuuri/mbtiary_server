const jwtMiddleware = require("../../config/jwtMiddleware");
const diaryProvider = require("./diary.provider");
const diaryService = require("./diary.service");
const baseResponse = require("../../config/baseResponseStatus");
const { response, errResponse } = require("../../config/response");

const regexEmail = require("regex-email");
const { emit } = require("nodemon");
const userService = require("../user/user.service");

/**
 다이어리 작성
 */
exports.postDiarys = async function (req, res) {
  const userIdxJwt = req.verifiedToken.userIdx;
  const imgUrl = req.file.location;

  const { contents, isSecret } = req.body;

  // 빈 값 체크
  if (!contents) return res.send(response(baseResponse.DIARY_CONTENTS_EMPTY));

  // 길이 체크
  if (contents > 2000)
    return res.send(response(baseResponse.DIARY_CONTENTS_LENGTH));

  // 형식 체크 (by 정규표현식)
  if (!imgUrl) return res.send(response(baseResponse.DIARY_IMGURL_EMPTY));

  // 기타 등등 - 추가하기

  const signUpResponse = await diaryService.createDiary(
    contents,
    imgUrl,
    userIdxJwt,
    isSecret
  );

  return res.send(signUpResponse);
};

/**
 다이어리 조회
 */
exports.getDiary = async function (req, res) {
  const userIdxJwt = req.verifiedToken.userIdx;
  const diaryIdx = req.params.diaryIdx;

  const diaryByIdx = await diaryProvider.retrieveDiary(diaryIdx);
  return res.send(response(baseResponse.SUCCESS, diaryByIdx));
};

/**
 달력 조회
 */
exports.getCalendar = async function (req, res) {
  const userIdxJwt = req.verifiedToken.userIdx;

  const calendar = await diaryProvider.retrieveCalendar(userIdxJwt);
  return res.send(response(baseResponse.SUCCESS, calendar));
};

/** 리스트로 일기 조회 */
exports.getDiaryList = async function (req, res) {
  const userIdxJwt = req.verifiedToken.userIdx;
  const year = req.query.year;
  const month = req.query.month;

  const diaryList = await diaryProvider.retrieveDiaryList(
    year,
    month,
    userIdxJwt
  );
  return res.send(response(baseResponse.SUCCESS, diaryList));
};

exports.getDiaryMbti = async function (req, res) {
  const diaryIdx = req.params.diaryIdx;
  const retrieveDiaryMbtiResponse = await diaryProvider.retrieveDiaryMbti(
    diaryIdx
  );

  return res.send(retrieveDiaryMbtiResponse);
};

exports.deleteDiary = async function (req, res) {
  const deleteIdx = req.params.diaryIdx;

  const deleteUserResponse = await diaryService.deleteDiary(deleteIdx);

  return res.send(deleteUserResponse);
};

exports.check = async function (req, res) {
  const userIdResult = req.verifiedToken.userId;
  return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};
