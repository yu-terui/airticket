const path = require("path");
const express = require("express"); //expressモジュールをロード
const session = require('express-session');
const bodyParser = require("body-parser");
const ejs = require("ejs");
const passport = require("passport");
const app = express(); //インスタンス化してappに代入

const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

//req.bodyの中に送信したデータが保存される
app.set("view engine", "ejs"); //テンプレートエンジンをEJSに

const mysql = require("mysql2");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "rootroot",
  database: "airline",
  multipleStatements: true,
});

// 他のファイルでmysqlを使えるようにexportします
module.exports = con;
// // ここでlogin関連のapiを管理
app.use('/', require('./login'));

// cssファイルの取得
app.use("/assets", express.static("assets"));

// favicon.icoがリクエストされた場合、空のレスポンスを返す。
app.get("/favicon.ico", (req, res) => {res.status(204);})

//テーブル作成
con.connect(function (err) {
  if (err) throw err;
  console.log("Connected");
  let sql =
    "create table if not exists members (id INT auto_increment not null,familyname varchar(45),firstname varchar(45),age INT,sex varchar(45),email varchar(45),password varchar(45),primary key(id));";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("table created");
  });
});
// mysqlからデータを持ってくる
app.get("/", (req, res) => {
  const sql = "select * from flights";
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.render("index");
  });
});
app.post("/ticket_select/:departure", (req, res) => {
  const sql = "SELECT * FROM flights where departure = ?";
  let data = req.body;
  con.query(sql, data.departure, function (err, result) {
    if (err) throw err;
    res.render("ticket_select", {
      flights: result,
      departure: data.departure,
      arrival: data.arrival,
      date: data.date,
      people: data.people,
    });
  });
});
app.post("/ticket_check", (req, res) => {
  const sql = "SELECT * FROM flights";
  let data = req.body;
  con.query(sql, req.body, function (err, result) {
    if (err) throw err;
    res.render("ticket_check", {
      date: data.date,
      flight_num: data.flight_num,
      departure: data.departure,
      departure_time: data.departure_time,
      arrival: data.arrival,
      arrival_time: data.arrival_time,
      type: data.type,
      people: data.people,
      total: data.total,
    });
  });
});
app.get("/booking_search", (req, res) => {
  res.render("booking_search");
});
app.get("/booking_check", (req, res) => {
  res.render("booking_check");
});
app.post("/booking_confirm", (req, res) => {
  const sql =
    "INSERT INTO passengers (flight_num, familyname, firstname, age, sex) values (?),(?),(?),(?),(?)";
  // const sql = "INSERT INTO passengers (flight_num, familyname, firstname, age, sex, phone_kind, phone_num, email) values (?),(?),(?),(?),(?),(?),(?),(?)";
  let data = req.body;
  let { familyname_1, firstname_1, age_1, sex_1 } = data;
  let { familyname_2, firstname_2, age_2, sex_2 } = data;
  let { familyname_3, firstname_3, age_3, sex_3 } = data;
  let { familyname_4, firstname_4, age_4, sex_4 } = data;
  let { familyname_5, firstname_5, age_5, sex_5 } = data;
  console.log(data.date);
  let data1 = {
    flight_num: data.flight_num,
    familyname: familyname_1,
    firstname: firstname_1,
    age: age_1,
    sex: sex_1,
  };
  let data2 = {
    flight_num: data.flight_num,
    familyname: familyname_2,
    firstname: firstname_2,
    age: age_2,
    sex: sex_2,
  };
  let data3 = {
    flight_num: data.flight_num,
    familyname: familyname_3,
    firstname: firstname_3,
    age: age_3,
    sex: sex_3,
  };
  let data4 = {
    flight_num: data.flight_num,
    familyname: familyname_4,
    firstname: firstname_4,
    age: age_4,
    sex: sex_4,
  };
  let data5 = {
    flight_num: data.flight_num,
    familyname: familyname_5,
    firstname: firstname_5,
    age: age_5,
    sex: sex_5,
  };
  let datas = [data1, data2, data3, data4, data5];
  function converter(obj) {
    let { flight_num, familyname, firstname, age, sex } = obj; //分割代入
    return [flight_num, familyname, firstname, age, sex];
  }
  let converted = datas.map(converter);
  con.query(sql, converted, function (err, result) {
    if (err) throw err;
    // res.render("booking_confirm", {
    //   date: data.date,
    //   flight_num: data.flight_num,
    //   departure: data.departure,
    //   departure_time: data.departure_time,
    //   arrival: data.arrival,
    //   arrival_time: data.arrival_time,
    //   people: data.people,
    //   total: data.total,
    // });
    res.send(converted);
  });
});
app.get("/member_register", (req, res) => {
  res.render("member_register");
});
app.post("/member_register", (req, res) => {
  res.render("member_register");
});
app.post("/member_register_complete", (req, res) => {
  con.query(
    "INSERT INTO members SET ?; select LAST_INSERT_ID()",
    req.body,
    function (err, result) {
      if (err) throw err;
      res.render("member_register_complete", {
        data1: result[0],
        data2: result[1],
      });
    }
  );
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
