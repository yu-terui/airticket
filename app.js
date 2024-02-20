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

//アップロードされた画像をローカルに保存
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
  let sql = "SELECT * FROM cart WHERE name = ''";
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
  const sql = "insert into cart (name, price, image) values(?, ?, ?)";
  con.query(
    sql,
    [req.body.name, req.body.price, req.body.image],
    function (err, result) {
      if (err) throw err;
      res.redirect("/");
    }
  );
});
app.post("/deleteItem/:name", (req, res) => {
  const sql = "delete from cart where name = ?";
  con.query(sql, req.params.name, function (err, result) {
    if (err) throw err;
    res.redirect("/");
  });
});
app.get("/register", (req, res) => {
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
app.get("/login", (req, res) => {
  const sql = "select * from login";
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.render("login", {
      login: result,
    });
  });
});
app.get("/control_register", (req, res) => {
  res.render("control_register");
});
//アップロードされたファイルの保存のため、input要素のname="imageFile"を指定
app.post("/control_register", upload.single("imageFile"), (req, res) => {
  const sql = "insert into products set ?";
  con.query(sql, req.body, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    res.redirect("control_register");
  });
});
app.get("/control_edit", (req, res) => {
  const sql = "select * from products";
  con.query(sql, req.params, function (err, result, fields) {
    if (err) throw err;
    res.render("control_edit", {
      products: result,
      data: result,
    });
  });
});
app.get("/control_edit_product/:name", (req, res) => {
  const sql = "select * from products where name = ?";
  con.query(sql, req.params.name, function (err, result, fields) {
    if (err) throw err;
    res.render("control_edit_product", {
      products: result,
      data: result,
    });
  });
});
//アップロードされたファイルの保存のため、input要素のname="imageFile"を指定
app.post("/update/:id", upload.single("imageFile"), (req, res) => {
  const sql = "update products set ? where id = " + req.params.id;
  con.query(sql, req.body, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    res.redirect("control_edit");
  });
});
app.get("/update/control_edit", (req, res) => {
  const sql = "select * from products";
  con.query(sql, req.params, function (err, result, fields) {
    if (err) throw err;
    res.render("control_edit", {
      products: result,
      data: result,
    });
  });
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
