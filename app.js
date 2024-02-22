const path = require("path");
const express = require("express"); //expressモジュールをロード
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express(); //インスタンス化してappに代入

const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs"); //テンプレートエンジンをEJSに

const mysql = require("mysql2");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "rootroot",
  database: "ecdb",
});

// cssファイルの取得
app.use("/assets", express.static("assets"));

// アップロードされた画像をローカルに保存
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "assets/img/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

//テーブル作成
con.connect(function (err) {
  if (err) throw err;
  console.log("Connected");
  let sql =
    "create table if not exists cart (name varchar(45), price INT, image varchar(45))";
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    console.log("table created");
  });
});
con.connect(function (err) {
  if (err) throw err;
  console.log("Connected");
  let sql =
    "create table if not exists newusers (id INT auto_increment not null,userName varchar(45),furigana varchar(45),address varchar(45),email varchar(45),password varchar(45),primary key(id));";
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    console.log("table created");
  });
});

// mysqlからデータを持ってくる
app.get("/", (req, res) => {
  const sql =
    "select * from products left join review on review.itemId = products.id";
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.render("index", {
      products: result,
      reviews: result
    });
  });
});
app.get("/booking_search", (req, res) => {
    res.render("booking_search");
});
app.get("/booking_check", (req, res) => {
    res.render("booking_check");
});
app.get("/booking_info", (req, res) => {
    res.render("booking_info");
});
app.post("/booking_confirm", (req, res) => {
    res.render("booking_confirm");
});
app.get("/ticket_select", (req, res) => {
    res.render("ticket_select");
});
app.get("/ticket_check", (req, res) => {
    res.render("ticket_check");
});
app.get("/member_login", (req, res) => {
    res.render("member_login");
});
app.get("/member_register", (req, res) => {
    res.render("member_register");
});
app.get("/member_register_complete", (req, res) => {
    res.render("member_register_complete");
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
