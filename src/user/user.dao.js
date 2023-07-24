// 모든 유저 조회
async function selectUser(connection) {
  const selectUserListQuery = `
                SELECT email, nickname 
                FROM UserInfo;
                `;
  const [userRows] = await connection.query(selectUserListQuery);
  return userRows;
}

// 이메일로 회원 조회
async function selectUserNickName(connection, nickName) {
  const selectUserEmailQuery = `
                SELECT nickname 
                FROM User 
                WHERE nickname = ?;
                `;
  const [nickNameRows] = await connection.query(selectUserEmailQuery, nickName);
  return nickNameRows;
}

// userId 회원 조회
async function selectUserId(connection, userIdx) {
  const selectUserIdQuery = `
                 SELECT userIdx, email, nickname, profileImgUrl 
                 FROM User 
                 WHERE userIdx = ?;
                 `;
  const [userRow] = await connection.query(selectUserIdQuery, userIdx);
  return userRow;
}

// 유저 생성
async function insertUserInfo(connection, insertUserInfoParams) {
  const insertUserInfoQuery = `
        INSERT INTO User(email)
        VALUES (?);
    `;
  const insertUserInfoRow = await connection.query(
      insertUserInfoQuery,
      insertUserInfoParams
  );

  return insertUserInfoRow;
}

// 패스워드 체크
async function selectUserPassword(connection, selectUserPasswordParams) {
  const selectUserPasswordQuery = `
        SELECT email, nickname, password
        FROM UserInfo 
        WHERE email = ? AND password = ?;`;
  const selectUserPasswordRow = await connection.query(
      selectUserPasswordQuery,
      selectUserPasswordParams
  );

  return selectUserPasswordRow;
}

// 유저 계정 상태 체크 (jwt 생성 위해 id 값도 가져온다.)
async function selectUserAccount(connection, email) {
  const selectUserAccountQuery = `
        SELECT status, id
        FROM UserInfo 
        WHERE email = ?;`;
  const selectUserAccountRow = await connection.query(
      selectUserAccountQuery,
      email
  );
  return selectUserAccountRow[0];
}

async function updateUserNickname(connection, userIdx, nickName) {
  const updateUserQuery = `
  UPDATE User 
  SET nickname = '${nickName}'
  WHERE userIdx = ${userIdx};`;
  const updateUserRow = await connection.query(updateUserQuery);
  return updateUserRow[0];
}

async function deleteUserInfo(connection, userIdx) {
  const updateUserQuery = `
  UPDATE User 
  SET status = 'F'
  WHERE userIdx = ${userIdx};`;
  const deleteUserRow = await connection.query(updateUserQuery);
  return deleteUserRow[0];
}

async function updateUserprofileImgUrl(connection, userIdx, imageUrl) {
  const updateUserQuery = `
  UPDATE User 
  SET profileImgUrl = '${imageUrl}'
  WHERE userIdx = ${userIdx};`;
  const updateUserRow = await connection.query(updateUserQuery);
  return updateUserRow[0];
}

async function retrieveUserMbtiByDay(connection, userIdx, date) {
  const retrieveUserMbtiByDayQuery = `
    SELECT Diary.diaryIdx,
          Diary.contents,
          MbtiStatistics.enfjPercent,
          MbtiStatistics.enfpPercent,
          MbtiStatistics.entjPercent,
          MbtiStatistics.entpPercent,
          MbtiStatistics.esfpPercent,
          MbtiStatistics.esfjPercent,
          MbtiStatistics.estpPercent,
          MbtiStatistics.estjPercent,
          MbtiStatistics.infjPercent,
          MbtiStatistics.infpPercent,
          MbtiStatistics.intjPercent,
          MbtiStatistics.intpPercent,
          MbtiStatistics.isfjPercent,
          MbtiStatistics.isfpPercent,
          MbtiStatistics.istjPercent,
          MbtiStatistics.istpPercent,
          MbtiStatistics.mbti,

    (select D.diaryIdx  from Diary D join MbtiStatistics M on M.diaryIdx = D.diaryIdx
    where M.mbti= MbtiStatistics.mbti
      and D.isSecret='F'  and D.userIdx <> Diary.userIdx order by D.diaryIdx limit 1
    ) as recommendationDiaryIdx

    FROM Diary
    
    
            join MbtiStatistics on MbtiStatistics.diaryIdx = Diary.diaryIdx
    WHERE Diary.userIdx = ${userIdx} and DATE(Diary.createdAt) = '${date}' and Diary.status = 'T';
  `;
  const [mbtiByDayRow] = await connection.query(retrieveUserMbtiByDayQuery);

  return mbtiByDayRow;
}

async function retrieveUserMbtiByWeek(
    connection,
    userIdx,
    year,
    month,
    day1,
    day2
) {
  const retrieveUserMbtiByWeekQuery = `
    SELECT IFNULL(round(avg(MbtiStatistics.enfjPercent), 0), 0) as enfjPercent,
          IFNULL(round(avg(MbtiStatistics.enfpPercent), 0), 0) as enfpPercent,
          IFNULL(round(avg(MbtiStatistics.entjPercent), 0), 0) as entjPercent,
          IFNULL(round(avg(MbtiStatistics.entpPercent), 0), 0) as entpPercent,
          IFNULL(round(avg(MbtiStatistics.esfpPercent), 0), 0) as esfpPercent,
          IFNULL(round(avg(MbtiStatistics.esfjPercent), 0), 0) as esfjPercent,
          IFNULL(round(avg(MbtiStatistics.estpPercent), 0), 0) as estpPercent,
          IFNULL(round(avg(MbtiStatistics.estjPercent), 0), 0) as estjPercent,
          IFNULL(round(avg(MbtiStatistics.infjPercent), 0), 0) as infjPercent,
          IFNULL(round(avg(MbtiStatistics.infpPercent), 0), 0) as infpPercent,
          IFNULL(round(avg(MbtiStatistics.intjPercent), 0), 0) as intjPercent,
          IFNULL(round(avg(MbtiStatistics.intpPercent), 0), 0) as intpPercent,
          IFNULL(round(avg(MbtiStatistics.isfjPercent), 0), 0) as isfjPercent,
          IFNULL(round(avg(MbtiStatistics.isfpPercent), 0), 0) as isfpPercent,
          IFNULL(round(avg(MbtiStatistics.istjPercent), 0), 0) as istjPercent,
          IFNULL(round(avg(MbtiStatistics.istpPercent), 0), 0) as istpPercent
    FROM Diary
        join MbtiStatistics on MbtiStatistics.diaryIdx = Diary.diaryIdx
    WHERE Diary.userIdx = ${userIdx} and Diary.status = 'T' and DATE(Diary.createdAt) between '${year}-${month}-${day1}' and '${year}-${month}-${day2}';
  `;

  const [mbtiByWeekRow] = await connection.query(retrieveUserMbtiByWeekQuery);

  return mbtiByWeekRow;
}

async function retrieveUserMbtiByMonth(connection, userIdx, year, month) {
  const retrieveUserMbtiByMonthQuery = `
    SELECT IFNULL(round(avg(MbtiStatistics.enfjPercent), 0), 0) as enfjPercent,
       IFNULL(round(avg(MbtiStatistics.enfpPercent), 0), 0) as enfpPercent,
       IFNULL(round(avg(MbtiStatistics.entjPercent), 0), 0) as entjPercent,
       IFNULL(round(avg(MbtiStatistics.entpPercent), 0), 0) as entpPercent,
       IFNULL(round(avg(MbtiStatistics.esfpPercent), 0), 0) as esfpPercent,
       IFNULL(round(avg(MbtiStatistics.esfjPercent), 0), 0) as esfjPercent,
       IFNULL(round(avg(MbtiStatistics.estpPercent), 0), 0) as estpPercent,
       IFNULL(round(avg(MbtiStatistics.estjPercent), 0), 0) as estjPercent,
       IFNULL(round(avg(MbtiStatistics.infjPercent), 0), 0) as infjPercent,
       IFNULL(round(avg(MbtiStatistics.infpPercent), 0), 0) as infpPercent,
       IFNULL(round(avg(MbtiStatistics.intjPercent), 0), 0) as intjPercent,
       IFNULL(round(avg(MbtiStatistics.intpPercent), 0), 0) as intpPercent,
       IFNULL(round(avg(MbtiStatistics.isfjPercent), 0), 0) as isfjPercent,
       IFNULL(round(avg(MbtiStatistics.isfpPercent), 0), 0) as isfpPercent,
       IFNULL(round(avg(MbtiStatistics.istjPercent), 0), 0) as istjPercent,
       IFNULL(round(avg(MbtiStatistics.istpPercent), 0), 0) as istpPercent
    FROM Diary
            left join MbtiStatistics on MbtiStatistics.diaryIdx = Diary.diaryIdx
    WHERE Diary.userIdx = ${userIdx}
      and Diary.status = 'T'
      and DATE_FORMAT(Diary.createdAt, '%Y-%c') = '${year}-${month}';
  `;

  const [mbtiByMonthRow] = await connection.query(retrieveUserMbtiByMonthQuery);

  return mbtiByMonthRow;
}

module.exports = {
  selectUser,
  selectUserNickName,
  selectUserId,
  insertUserInfo,
  selectUserPassword,
  selectUserAccount,
  updateUserNickname,
  deleteUserInfo,
  updateUserprofileImgUrl,
  retrieveUserMbtiByDay,
  retrieveUserMbtiByWeek,
  retrieveUserMbtiByMonth,
};