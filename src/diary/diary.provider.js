const { pool } = require("../../config/database");
const { logger } = require("../../config/winston");

const diaryDao = require("./diary.dao");
const userDao = require("../user/user.dao");
const axios = require("axios");
const { response } = require("../../config/response");
const baseResponseStatus = require("../../config/baseResponseStatus");
const aws4 = require("aws4");
const diaryService = require("./diary.service");


exports.retrieveDiary = async function (diaryIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    const diaryResult = await diaryDao.selectDiary(connection, diaryIdx);
    connection.release();
    return diaryResult;
  } catch (err) {
    return response(baseResponseStatus.DB_ERROR);
  } finally {
    connection.release();
  }
};

exports.retrieveCalendar = async function (userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    const selectCalendarParams = [userIdx];
    const diaryResult = await diaryDao.selectCalendar(
      connection,
      selectCalendarParams
    );
    return diaryResult;
  } catch (error) {
    return response(baseResponseStatus.DB_ERROR);
  } finally {
    connection.release();
  }
};

exports.retrieveDiaryList = async function (year, month, userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    const firstDate = year
      .concat("-")
      .concat(month)
      .concat("-")
      .concat("1")
      .concat(" 00:00:00");
    let endDate = "";
    if (
      month == 1 ||
      month == 3 ||
      month == 5 ||
      month == 7 ||
      month == 8 ||
      month == 10 ||
      month == 12
    ) {
      endDate = year
        .concat("-")
        .concat(month)
        .concat("-")
        .concat("31")
        .concat(" 23:59:59");
    } else {
      endDate = endDate = year
        .concat("-")
        .concat(month)
        .concat("-")
        .concat("30")
        .concat(" 23:59:59");
    }

    const selectDiaryListParams = [firstDate, endDate, userIdx];
    const diaryListResult = await diaryDao.selectDiaryList(
      connection,
      selectDiaryListParams
    );

    return diaryListResult;
  } catch (error) {
    return response(baseResponseStatus.DB_ERROR);
  } finally {
    connection.release();
}
};

exports.retrieveDiaryMbti = async function (diaryIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    const [diary] = await diaryDao.selectDiaryByIdx(connection, diaryIdx);
    connection.release();
    const contents = diary.contents;

    let request = {
      host: "https://2o3dvyned6.execute-api.ap-northeast-2.amazonaws.com",
      method: "POST",
      url: `https://2o3dvyned6.execute-api.ap-northeast-2.amazonaws.com/pred/emptyinteger-lambda-image/predict`,
      data: { text: contents },
      body: JSON.stringify({ text: contents }),
      headers: {
        "content-type": "application/json",
      },
      region: "ap-northeast-2",
      service: "lambda",
    };

    let signedRequest = aws4.sign(request, {
      secretAccessKey: "M96hLEdo+XRJN2rKi3MsG3/zDPure3jysnwMpfCy",
      accessKeyId: "AKIAVRPN5E6NCQLFI44E",
    });

    delete signedRequest.headers["Host"];
    delete signedRequest.headers["Content-Length"];

    // mbti 요청보내기
    const mbti = await axios(signedRequest)
      .then((response) => {
        return JSON.parse(response.data.body);
      })
      .catch((error) => {
        return response(baseResponseStatus.SERVER_ERROR);
      });

    const a = await diaryService.createDiaryMbti(diaryIdx, mbti);

    return response(baseResponseStatus.SUCCESS, mbti);
  } catch (error) {
    return response(baseResponseStatus.SERVER_ERROR);
  } finally {
    connection.release();
  }
};
