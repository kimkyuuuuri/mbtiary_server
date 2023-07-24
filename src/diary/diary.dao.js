// 다이어리 작성
async function insertDiary(connection, insertDiaryParams) {
  const insertDiaryQuery = `
        INSERT INTO Diary(contents,imgUrl,userIdx,isSecret)
        VALUES (?, ?,?,?);
    `;
  const insertDiaryRow = await connection.query(
    insertDiaryQuery,
    insertDiaryParams
  );

  return insertDiaryRow;
}

async function selectDiary(connection, diaryIdx) {
  const selectDiaryQuery = `
    SELECT  Diary.diaryIdx, Diary.contents, Diary.imgUrl, DATE_FORMAT(Diary.createdAt, '%Y-%m-%d') as createdAt, MS.mbti
    FROM Diary join MbtiStatistics MS on Diary.diaryIdx = MS.diaryIdx
    WHERE MS.diaryIdx = ? and Diary.status='T'`;
  const [diaryRows] = await connection.query(selectDiaryQuery, diaryIdx);
  return diaryRows;
}

async function selectDiaryByIdx(connection, diaryIdx) {
  const selectDiaryQuery = `
    SELECT diaryIdx, contents
    FROM Diary
    WHERE diaryIdx = ${diaryIdx} and Diary.status='T' `;
  const [diaryRows] = await connection.query(selectDiaryQuery, diaryIdx);
  return diaryRows;
}

async function selectDiaryList(connection, selectDiaryListParams) {
  const selectDiaryQuery = `
    SELECT contents, imgUrl, DATE_FORMAT(Diary.createdAt, '%Y-%m-%d') as createdAt ,Diary.diaryIdx, mbti
    FROM Diary left join MbtiStatistics MS on Diary.diaryIdx = MS.diaryIdx

    WHERE Diary.createdAt>=? and Diary.createdAt<=? and  Diary.userIdx=? and Diary.status='T'
    order by Diary.createdAt
                `;
  const [diaryRows] = await connection.query(
    selectDiaryQuery,
    selectDiaryListParams
  );
  return diaryRows;
}

async function deleteDiaryInfo(connection, diaryIdx) {
  const updateDiaryQuery = `
  UPDATE Diary 
  SET status = 'F'
  WHERE diaryIdx = ${diaryIdx};`;
  const deleteUserRow = await connection.query(updateDiaryQuery);
  return deleteUserRow[0];
}

async function selectCalendar(connection, selectCalendarParams) {
  const selectCalendarQuery = `
    SELECT Diary.diaryIdx, DATE_FORMAT(Diary.createdAt, '%Y-%m-%d') as createdAt,  mbti
    FROM Diary left join MbtiStatistics MS on Diary.diaryIdx = MS.diaryIdx
    WHERE Diary.userIdx= ? and Diary.status='T'
;
  `;
  const [diaryRows] = await connection.query(
    selectCalendarQuery,
    selectCalendarParams
  );
  return diaryRows;
}

async function insertDiaryMbti(connection, diaryIdx, mbti) {
  const insertDiaryMbtiQuery = `
    INSERT INTO MbtiStatistics(istjPercent, intjPercent, estjPercent, entjPercent, istpPercent, intpPercent, estpPercent, entpPercent, isfjPercent, infjPercent, enfjPercent, isfpPercent, infpPercent, esfpPercent, enfpPercent, esfjPercent, mbti, diaryIdx)
    VALUES (${mbti.istj}, ${mbti.intj}, ${mbti.estj}, ${mbti.entj}, ${mbti.istp}, ${mbti.intp}, ${mbti.estp}, ${mbti.entp}, ${mbti.isfj}, ${mbti.infj}, ${mbti.enfj}, ${mbti.isfp}, ${mbti.infp}, ${mbti.esfp}, ${mbti.enfp}, ${mbti.esfj}, '${mbti.mbti}', ${diaryIdx});
  `;

  const insertDiaryRow = await connection.query(
    insertDiaryMbtiQuery,
    diaryIdx,
    mbti
  );

  return insertDiaryRow;
}

module.exports = {
  insertDiary,
  selectDiary,
  selectDiaryByIdx,
  selectCalendar,
  insertDiaryMbti,
  selectDiaryList,
  deleteDiaryInfo,
};
