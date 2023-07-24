const jwtMiddleware = require("../../config/jwtMiddleware");
const userProvider = require("./user.provider");
const userService = require("./user.service");
const baseResponse = require("../../config/baseResponseStatus");
const { response, errResponse } = require("../../config/response");

const regexEmail = require("regex-email");
const { emit } = require("nodemon");



exports.patchUserNickname = async function (req, res) {
  const userIdx = req.params.userIdx;
  const { nickName } = req.body;

  const editUserResponse = await userService.editUserNickname(
    userIdx,
    nickName
  );

  return res.send(editUserResponse);
};

exports.patchUserprofileImgUrl = async function (req, res) {
  const userIdx = req.params.userIdx;
  const imageUrl = req.file.location;

  const editUserResponse = await userService.editUserprofileImgUrl(
    userIdx,
    imageUrl
  );

  return res.send(editUserResponse);
};

exports.deleteUser = async function (req, res) {
  const userIdx = req.params.userIdx;

  const deleteUserResponse = await userService.deleteUser(userIdx);

  return res.send(deleteUserResponse);
};

exports.getUserMbtiByMonth = async function (req, res) {
  const userIdx = req.params.userIdx;
  const year = req.query.year;

  const result = await userProvider.getUserMbtiByMonth(userIdx, year);

  return res.send(result);
};

/**
 * API No. 1
 * API Name : 유저 생성 (회원가입) API
 * [POST] /app/users
 */
exports.postUsers = async function (req, res) {
  /**
   * Body: email, password, nickname
   */
  const { email } = req.body;

  const signUpResponse = await userService.createUser(email);

  return res.send(signUpResponse);
};

/**
 * API No. 2
 * API Name : 유저 조회 API (+ 이메일로 검색 조회)
 * [GET] /app/users
 */
exports.getUsers = async function (req, res) {
  /**
   * Query String: email
   */
  const email = req.query.email;

  if (!email) {
    // 유저 전체 조회
    const userListResult = await userProvider.retrieveUserList();
    return res.send(response(baseResponse.SUCCESS, userListResult));
  } else {
    // 유저 검색 조회
    const userListByEmail = await userProvider.retrieveUserList(email);
    return res.send(response(baseResponse.SUCCESS, userListByEmail));
  }
};

exports.getUser = async function (req, res) {
  /**
   * Path Variable: userId
   */
  const userIdx = req.params.userIdx;

  const user = await userProvider.retrieveUser(userIdx);
  return res.send(response(baseResponse.SUCCESS, user));
};

// TODO: After 로그인 인증 방법 (JWT)
/**
 * API No. 4
 * API Name : 로그인 API
 * [POST] /app/login
 * body : email, passsword
 */
exports.login = async function (req, res) {
  const { email, password } = req.body;

  // TODO: email, password 형식적 Validation

  const signInResponse = await userService.postSignIn(email, password);

  return res.send(signInResponse);
};

//자동로그인
exports.autoLogin = async function (req, res) {
  const userIdxJwt = req.verifiedToken.userIdx;

  return response(baseResponse.SUCCESS, {
    userIdxJwt,
  });
};

/** JWT 토큰 검증 API
 * [GET] /app/auto-login
 */
exports.check = async function (req, res) {
  const userIdResult = req.verifiedToken.userId;
  return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};

exports.getUserMbtiByDay = async function (req, res) {
  // const userIdxJwt = req.verifiedToken.userId;
  const userIdx = req.params.userIdx;
  const date = req.query.date;

  const userMbtiByDay = await userProvider.retrieveUserMbtiByDay(userIdx, date);

  return res.send(userMbtiByDay);
};

exports.getUserMbtiByWeek = async function (req, res) {
  const year = req.query.year;
  const month = req.query.month;
  const userIdx = req.params.userIdx;

  const userMbtiByWeek = await userProvider.retrieveUserMbtiByWeek(
    userIdx,
    year,
    month
  );

  return res.send(userMbtiByWeek);
};
