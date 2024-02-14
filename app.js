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
  database: "ECdb",
});
// cssファイルの取得
app.use("/assets", express.static("assets"));

// favicon.icoがリクエストされた場合、空のレスポンスを返す。
app.get("/favicon.ico", (req, res) => {
  res.status(204);
});

//テーブル作成
con.connect(function(err) {
  if (err) throw err;
	console.log('Connected');
  let sql = "create table if not exists cart (name varchar(45), price INT)";
  con.query(sql, function (err, result, fields) {
      if (err) throw err;
      console.log("table created")
  });
});
con.connect(function(err) {
  if (err) throw err;
	console.log('Connected');
  let sql = "create table if not exists newusers (id INT auto_increment not null,userName varchar(45),furigana varchar(45),address varchar(45),email varchar(45),password varchar(45),primary key(id));";
  con.query(sql, function (err, result, fields) {
      if (err) throw err;
      console.log("table created")
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
      reviews: result,
    });
  });
});
app.get("/products/:name", (req, res) => {
  const sql =
    "select * from products left join review on review.itemId = products.id where name = ?";
  con.query(sql, req.params.name, function (err, result, fields) {
    if (err) throw err;
    res.render("products", {
      products: result,
      reviews: result,
      data: result,
    });
  });
});
app.get("/cart", (req, res) => {
  let sql = "SELECT * FROM `cart` WHERE name = '' OR name IS NULL";
  con.query(sql, function (err, result, fields) {
    if (err) {
      return req.params;
    } else {
      const sql = "select * from cart";
      con.query(sql, function (err, result, fields) {
        if (err) throw err;
        res.render("cart", {
          cart: result,
          data: result,
        });
      });
    }
  });
});
app.post("/addCart/:name", (req, res) => {
  const sql = "insert into cart (name, price) values(?, ?)";
  con.query(sql, [req.body.name, req.body.price], function (err, result) {
    if (err) throw err;
    res.redirect("/");
  });
});
app.post("/deleteItem/:name", (req, res) => {
  const sql = "delete from cart where name = ?";
  con.query(sql, req.params.name, function (err, result) {
    if (err) throw err;
    res.redirect("/");
  });
});
app.get("/register", (req, res) => {
  // 'create table newusers (id INT auto_increment not null, userName varchar(45),furigana varchar(45),address varchar(45),email varchar(45),password varchar(45),primary key(id));'
  res.render("register");
});
app.post("/confirm", (req, res) => {
  let data = req.body;
  res.render("confirm", {
    userName: data.userName,
    furigana: data.furigana,
    address: data.address,
    email: data.email,
    password: data.password,
  });
});
app.post("/complete", (req, res) => {
  let data = req.body;
  const sql = "insert into newusers set ?";
  con.query(sql, req.body, function (err, result, fields) {
    if (err) throw err;
    res.render("complete", {
      userName: data.userName,
      furigana: data.furigana,
      address: data.address,
      email: data.email,
      password: data.password,
    });
  });
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
