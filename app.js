const path = require('path');
const express = require('express');
const ejs = require('ejs');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

const mysql = require('mysql2');

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rootroot',
  database: 'products'
});

// mysqlからデータを持ってくる
app.get('/', (req, res) => {
// cssファイルの取得
app.use(express.static('assets'));
  const sql = "select * from personas";
app.post('/', (req, res) => { //データベースを変更したいときはpost
  const sql = "INSERT INTO personas SET ?"
  con.query(sql, req.body, function(err, result, fields) {
    if (err) throw err;
    console.log(result);
    res.redirect('/');
  });
});
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.render('index', {
      personas: result,
    });
  });
});
app.get('/edit/:id', (req, res) => {//getでデータ取得
  const sql = "SELECT * FROM personas WHERE id = ?";
  con.query(sql, [req.params.id], function (err, result, fields) {
    if (err) throw err;
    res.render('edit', {
      personas: result
    });
  });
});
app.post('/update/:id', (req, res) => {//postでデータ更新
  const sql = "UPDATE personas SET ? WHERE id = " + req.params.id;
  con.query(sql, req.body, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    res.redirect('/');
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
