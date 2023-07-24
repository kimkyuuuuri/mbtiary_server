const mysql = require('mysql2/promise');
const {logger} = require('./winston');

// TODO: 본인의 DB 계정 입력
const pool = mysql.createPool( {
    host: 'mbtiary.c9xij6jfu9gi.ap-northeast-2.rds.amazonaws.com',
    user: 'admin',
    port: '3306',
    password: 'mbtiary1234',
    database: 'mbtiary'
});

module.exports = {
    pool: pool
};