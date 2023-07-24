const baseResponseStatus = require("../../config/baseResponseStatus");
const { pool } = require("../../config/database");
const { errResponse, response } = require("../../config/response");
const { logger } = require("../../config/winston");

const userDao = require("./user.dao");

// Provider: Read 비즈니스 로직 처리

exports.retrieveUserList = async function (email) {
  if (!email) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userListResult = await userDao.selectUser(connection);
    connection.release();

    return userListResult;
  } else {
    const connection = await pool.getConnection(async (conn) => conn);
    const userListResult = await userDao.selectUserEmail(connection, email);
    connection.release();

    return userListResult;
  }
};

exports.retrieveUser = async function (userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userResult = await userDao.selectUserId(connection, userIdx);

  connection.release();

  return userResult[0];
};

exports.nickNameCheck = async function (nickName) {
  const connection = await pool.getConnection(async (conn) => conn);
  const nickNameCheckResult = await userDao.selectUserNickName(
    connection,
    nickName
  );
  connection.release();

  return nickNameCheckResult;
};

exports.passwordCheck = async function (selectUserPasswordParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const passwordCheckResult = await userDao.selectUserPassword(
    connection,
    selectUserPasswordParams
  );
  connection.release();
  return passwordCheckResult[0];
};

exports.accountCheck = async function (email) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userAccountResult = await userDao.selectUserAccount(connection, email);
  connection.release();

  return userAccountResult;
};

exports.retrieveUserMbtiByDay = async function (userIdx, date) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    const [userMbtiByDay] = await userDao.retrieveUserMbtiByDay(
      connection,
      userIdx,
      date
    );

    return response(baseResponseStatus.SUCCESS, userMbtiByDay);
  } catch (error) {
    return errResponse(baseResponseStatus.DB_ERROR);
  } finally {
    connection.release();
  }
};

exports.retrieveUserMbtiByWeek = async function (userIdx, year, month) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    let day1 = 1;
    let day2 = 7;

    let resultArray = [];
    for (let i = 0; i < 4; i++) {
      let result = {};
      let week = i + 1;
      result.week = week;
      const [userMbtiByWeek] = await userDao.retrieveUserMbtiByWeek(
        connection,
        userIdx,
        year,
        month,
        day1,
        day2
      );
      result.userMbtiByWeek = userMbtiByWeek;
      day1 = day1 + 7;
      day2 = day2 + 7;
      resultArray.push(result);
    }

    return response(baseResponseStatus.SUCCESS, resultArray);
  } catch (error) {
    return errResponse(baseResponseStatus.DB_ERROR);
  } finally {
    connection.release();
  }
};

exports.getUserMbtiByMonth = async function (userIdx, year) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    let resultArray = [];
    for (let i = 0; i < 12; i++) {
      let result = {};
      let month = i + 1;
      result.month = month;
      const [userMbtiByMonth] = await userDao.retrieveUserMbtiByMonth(
        connection,
        userIdx,
        year,
        month
      );
      result.userMbtiByMonth = userMbtiByMonth;
      resultArray.push(result);
    }

    return response(baseResponseStatus.SUCCESS, resultArray);
  } catch (error) {
    return response(baseResponseStatus.DB_ERROR);
  } finally {
    connection.release();
  }
};
