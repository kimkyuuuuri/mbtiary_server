const baseResponse = require("../../config/baseResponseStatus");
const { response } = require("../../config/response");
const { errResponse } = require("../../config/response");
const authDao = require("./auth.dao");
const { pool } = require("../../config/database");
const jwt = require("jsonwebtoken");
const secret_config = require("../../config/secret");
const userService = require("../user/user.service");

exports.kakaoLogin = async function (email) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    const [user] = await authDao.selectUser(connection, email);
    if (!user) {
      const createUserResponse = await userService.createUser(email);

      return createUserResponse;
    } else {
      const userIdx = user.userIdx;
      //토큰 생성 Service
      let token = jwt.sign(
        {
          userIdx: userIdx,
        }, // 토큰의 내용(payload)
        secret_config.jwtsecret, // 비밀키
        {
          expiresIn: "365d",
          subject: "userInfo",
        } // 유효 기간 365일
      );

      return response(baseResponse.SUCCESS, {
        userIdx: userIdx,
        jwt: token,
        nickname: user.nickname,
      });
    }
  } catch (error) {
    return errResponse(baseResponse.DB_ERROR);
  } finally {
    connection.release();
  }
};
