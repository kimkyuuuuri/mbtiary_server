const { logger } = require("../../config/winston");
const { pool } = require("../../config/database");
const secret_config = require("../../config/secret");
const diaryProvider = require("./diary.provider");
const diaryDao = require("./diary.dao");
const baseResponse = require("../../config/baseResponseStatus");
const { response } = require("../../config/response");
const { errResponse } = require("../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { connect } = require("http2");
const userDao = require("../user/user.dao");

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.createDiary = async function (contents, imgUrl, userIdx, isSecret) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    const insertDairyParams = [contents, imgUrl, userIdx, isSecret];

    const diaryIdResult = await diaryDao.insertDiary(
      connection,
      insertDairyParams,
      userIdx,
      isSecret
    );
    return response(baseResponse.SUCCESS, {
      diaryIdx: diaryIdResult[0].insertId,
    });
  } catch (err) {
    return errResponse(baseResponse.DB_ERROR);
  } finally {
    connection.release();
  }
};

exports.deleteDiary = async function (diaryIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    await diaryDao.deleteDiaryInfo(connection, diaryIdx);
    connection.release();

    return response(baseResponse.SUCCESS);
  } catch (err) {
    return errResponse(baseResponse.DB_ERROR);
  } finally {
    connection.release();
  }
};

exports.createDiaryMbti = async function (diaryIdx, mbti) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    const createddiaryMbti = await diaryDao.insertDiaryMbti(
      connection,
      diaryIdx,
      mbti
    );

    return response(baseResponse.SUCCESS);
  } catch (error) {
    return response(baseResponse.DB_ERROR);
  } finally {
    connection.release();
  }
};
