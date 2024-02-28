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
  database: "airline",
});

// cssファイルの取得
app.use("/assets", express.static("assets"));

//テーブル作成
con.connect(function (err) {
  if (err) throw err;
  console.log("Connected");
  let sql =
    "create table if not exists members (id INT auto_increment not null,userName varchar(45),furigana varchar(45),address varchar(45),email varchar(45),password varchar(45),primary key(id));";
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    console.log("table created");
  });
});
// mysqlからデータを持ってくる
app.get("/", (req, res) => {
  const sql =
    "select * from flights";
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.render("index", {
      flights: result
    });
  });
});
app.get("/booking_search", (req, res) => {
    res.render("booking_search");
});
app.get("/booking_check", (req, res) => {
    res.render("booking_check");
});
app.post("/booking_info", (req, res) => {
  const sql = "SELECT * FROM flights";
  let data = req.body;
  con.query(sql, req.body, function (err, result, fields) {
    if (err) throw err;
  res.render("booking_info", {
    date: data.date,
    flight_num: data.flight_num,
    departure: data.departure,
    departure_time: data.departure_time,
    arrival: data.arrival,
    arrival_time: data.arrival_time,
    people: data.people,
    total: data.total,
});
});
});
app.post("/booking_confirm", (req, res) => {
    res.render("booking_confirm");
});
app.post("/ticket_select/:departure", (req, res) => {
  const sql = "SELECT * FROM airline.flights left join tickets on tickets.flight_num = flights.flight_num where departure = ?";
  let data = req.body;
  con.query(sql, req.body.departure, function (err, result, fields) {
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
  con.query(sql, req.body, function (err, result, fields) {
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
app.post("/member_login", (req, res) => {
  const sql = "SELECT * FROM flights";
  let data = req.body;
  con.query(sql, req.body, function (err, result, fields) {
    if (err) throw err;
  res.render("member_login", {
    date: data.date,
    flight_num: data.flight_num,
    departure: data.departure,
    departure_time: data.departure_time,
    arrival: data.arrival,
    arrival_time: data.arrival_time,
    people: data.people,
    total: data.total,
});
});
});
app.get("/member_register", (req, res) => {
    res.render("member_register");
});
app.post("/member_register", (req, res) => {
    res.render("member_register");
});
app.get("/member_register_complete", (req, res) => {
    res.render("member_register_complete");
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
