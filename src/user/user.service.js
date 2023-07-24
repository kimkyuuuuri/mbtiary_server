const { logger } = require("../../config/winston");
const { pool } = require("../../config/database");
const userProvider = require("./user.provider");
const userDao = require("./user.dao");
const baseResponse = require("../../config/baseResponseStatus");
const { response } = require("../../config/response");
const { errResponse } = require("../../config/response");
const jwt = require("jsonwebtoken");
const secret_config = require("../../config/secret");
const crypto = require("crypto");
const { connect } = require("http2");


exports.deleteUser = async function (userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    await userDao.deleteUserInfo(connection, userIdx);
    connection.release();

    return response(baseResponse.SUCCESS);
  } catch (err) {
    return errResponse(baseResponse.DB_ERROR);
  } finally {
    connection.release();
  }
};

exports.createUser = async function (email) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    const insertUserInfoParams = [email];

    const userIdResult = await userDao.insertUserInfo(
      connection,
      insertUserInfoParams
    );
    //토큰 생성 Service
    let token = jwt.sign(
      {
        userIdx: userIdResult[0].insertId,
      }, // 토큰의 내용(payload)
      secret_config.jwtsecret, // 비밀키
      {
        expiresIn: "365d",
        subject: "userInfo",
      } // 유효 기간 365일
    );
    return response(baseResponse.SUCCESS, {
      userIdx: userIdResult[0].insertId,
      jwt: token,
      nickname: null,
    });
  } catch (err) {
    return errResponse(baseResponse.DB_ERROR);
  } finally {
    connection.release();
  }
};

// TODO: After 로그인 인증 방법 (JWT)
exports.postSignIn = async function (email, password) {
  try {
    // 이메일 여부 확인
    const emailRows = await userProvider.emailCheck(email);
    if (emailRows.length < 1)
      return errResponse(baseResponse.SIGNIN_EMAIL_WRONG);

    const selectEmail = emailRows[0].email;

    // 비밀번호 확인
    const hashedPassword = await crypto
      .createHash("sha512")
      .update(password)
      .digest("hex");

    const selectUserPasswordParams = [selectEmail, hashedPassword];
    const passwordRows = await userProvider.passwordCheck(
      selectUserPasswordParams
    );

    if (passwordRows[0].password !== hashedPassword) {
      return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
    }

    // 계정 상태 확인
    const userInfoRows = await userProvider.accountCheck(email);

    if (userInfoRows[0].status === "INACTIVE") {
      return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
    } else if (userInfoRows[0].status === "DELETED") {
      return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);
    }

    //토큰 생성 Service
    let token = await jwt.sign(
      {
        userId: userInfoRows[0].id,
      }, // 토큰의 내용(payload)
      secret_config.jwtsecret, // 비밀키
      {
        expiresIn: "365d",
        subject: "userInfo",
      } // 유효 기간 365일
    );

    return response(baseResponse.SUCCESS, {
      userId: userInfoRows[0].id,
      jwt: token,
    });
  } catch (err) {
    return errResponse(baseResponse.DB_ERROR);
  }
};

exports.editUserNickname = async function (userIdx, nickName) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    const [nickNameCheck] = await userProvider.nickNameCheck(nickName);
    if (nickNameCheck) {
      return errResponse(baseResponse.DUPLICATED_NICK_NAME);
    }
    await userDao.updateUserNickname(connection, userIdx, nickName);

    return response(baseResponse.SUCCESS);
  } catch (err) {
    return errResponse(baseResponse.DB_ERROR);
  } finally {
    connection.release();
  }
};

exports.editUserprofileImgUrl = async function (userIdx, imageUrl) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    await userDao.updateUserprofileImgUrl(connection, userIdx, imageUrl);
    connection.release();

    return response(baseResponse.SUCCESS);
  } catch (err) {
    return errResponse(baseResponse.DB_ERROR);
  } finally {
    connection.release();
  }
};
