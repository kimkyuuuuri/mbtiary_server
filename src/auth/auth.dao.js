async function selectUser(connection, email) {
  const selectUserEmailQuery = `
    SELECT userIdx, email, nickname
    FROM User
    WHERE email = '${email}';
  `;
  const [userRow] = await connection.query(selectUserEmailQuery, email);
  return userRow;
}

module.exports = {
  selectUser,
};
