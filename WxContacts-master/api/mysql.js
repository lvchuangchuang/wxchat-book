const mysql = require('mysql');

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'lhxjsg438',
    database: 'wx_contacts',
    connectionLimit: 10
})

let query = function (sql, values) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) {
                return reject(err);
            } else {
                connection.query(sql, values, (err, rows) => {
                    connection.release();
                    if (err) {
                        return reject(err)
                    } else {
                        return resolve(rows);
                    }
                })
            }
        })
    })
}

module.exports = query;