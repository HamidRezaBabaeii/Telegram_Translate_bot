const mysql = require('mysql2');
require('dotenv').config()

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
});

connection.connect((err) => {
  if (err) {
    console.error('خطا در اتصال به MySQL:', err);
    return;
  }
  console.log('اتصال به سرور MySQL برقرار شد.');

  const databaseName = process.env.DATABASE;

  
  const checkDatabaseQuery = `
    SELECT SCHEMA_NAME 
    FROM INFORMATION_SCHEMA.SCHEMATA 
    WHERE SCHEMA_NAME = '${databaseName}';
  `;

  connection.query(checkDatabaseQuery, (err, results) => {
    if (err) {
      console.error('خطا در بررسی وجود دیتابیس:', err);
      connection.end();
      return;
    }

    if (results.length > 0) {
      console.log(`دیتابیس '${databaseName}' قبلاً وجود دارد.`);
      connection.end(); 
    } else {
      console.log(`دیتابیس '${databaseName}' وجود ندارد. در حال ایجاد...`);


      const createDatabaseQuery = `CREATE DATABASE ${databaseName};`;
      connection.query(createDatabaseQuery, (err) => {
        if (err) {
          console.error('خطا در ایجاد دیتابیس:', err);
          connection.end();
          return;
        }
        console.log(`دیتابیس '${databaseName}' با موفقیت ایجاد شد.`);

      
        connection.changeUser({ database: databaseName }, (err) => {
          if (err) {
            console.error('خطا در انتخاب دیتابیس:', err);
            connection.end();
            return;
          }

          console.log(`دیتابیس '${databaseName}' انتخاب شد.`);

       
            const createUsersTableQuery = `
              CREATE TABLE users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                chatId BIGINT NOT NULL,
                date DATE NOT NULL,
              );
            `;

            connection.query(createUsersTableQuery, (err) => {
              if (err) {
                console.error('خطا در ایجاد جدول users:', err);
              } else {
                console.log('جدول users با موفقیت ایجاد شد.');
              }

           
              connection.end((err) => {
                if (err) {
                  console.error('خطا در بستن اتصال:', err);
                 
                } else {
                  console.log('اتصال به MySQL بسته شد.');
               
                }
              });
            });
        });
      });
    }
  });
});

