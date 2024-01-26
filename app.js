const http = require("http");
const path = require("path");
const ejs = require("ejs");
const express = require("express"); //expressモジュールをロード
const app = express(); //インスタンス化してappに代入
const bodyParser = require("body-parser");
const port = 3000;

app.set("view engine", "ejs");//テンプレートエンジンをEJSに
app.use(bodyParser.urlencoded({ extended: true }));

const mysql = require("mysql2");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "rootroot",
  database: "products",
});

// mysqlからデータを持ってくる
app.get("/", (req, res) => {
  // cssファイルの取得
  app.use(express.static("assets"));
  const sql = "select * from personas";
  app.post("/", (req, res) => {
    //データベースを変更したいときはpost
    //新規追加
    const sql = "INSERT INTO personas SET ?";
    con.query(sql, req.body, function (err, result, fields) {//query＝SQLの実行
      if (err) throw err;
      console.log(result);
      res.redirect("/");
    });
  });
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.render("index", {
      personas: result,
    });
  });
});
//レンダリング
// app.get("/select/:rating", (req, res) => {
  // res.render('index.ejs');
// });
app.get("/select/:rating", (req, res) => {
  const sql = "SELECT * FROM personas ORDER BY rating DESC;";
  con.query(sql, req.body.desc, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    res.redirect("/");
    //フォーム送信後の遷移場所＝action="/select/"だが、redirect("/")なので、元のページに戻る仕組み
  });
  // con.query(sql, function (err, result, fields) {
  //   if (err) throw err;
  //   res.render("index", {
  //     personas: result,
  //   });
  // });
});


app.get("/edit/:id", (req, res) => {
  //getでデータ取得
  //編集画面へ遷移するために、id=？の行のデータを取得
  const sql = "SELECT * FROM personas WHERE id = ?";
  con.query(sql, [req.params.id], function (err, result, fields) {
    if (err) throw err;
    res.render("edit", {
      personas: result,
    });
  });
});
app.post("/update/:id", (req, res) => {
  //データベースを変更したいときはpost
  //編集画面にて、データの更新
  const sql = "UPDATE personas SET ? WHERE id = " + req.params.id;
  con.query(sql, req.body, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    res.redirect("/");
    //フォーム送信後の遷移場所＝action="/update/"だが、redirect("/")なので、元のページに戻る仕組み
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
