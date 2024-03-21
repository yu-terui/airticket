const path = require("path");
const express = require("express"); //expressモジュールをロード
const session = require("express-session");
const bodyParser = require("body-parser");
const ejs = require("ejs");
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

// cssファイルの取得
app.use("/assets", express.static("assets"));

// favicon.icoがリクエストされた場合、空のレスポンスを返す。
app.get("/favicon.ico", (req, res) => {
  res.status(204);
});

// mysqlからデータを持ってくる
app.get("/", (req, res) => {
  const sql = "select * from flights";
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.render("index");
  });
});
app.post("/booking_info_login/:id", (req, res) => {
  const sql = "SELECT * FROM members where id = ?";
  let data = req.body;
  con.query(sql, data.id, function (err, result) {
    if (data.password == result[0].password) {
      //pass認証
      res.render("booking_info_login", {
        members: result,
        date: data.date,
        flight_num: data.flight_num,
        departure: data.departure,
        departure_time: data.departure_time,
        arrival: data.arrival,
        arrival_time: data.arrival_time,
        people: data.people,
        total: data.total,
      });
    } else {
      //認証失敗の場合
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
    }
  });
});
// チケット選択画面
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
// チケット確認画面
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
// 予約検索画面
app.get("/booking_search", (req, res) => {
  res.render("booking_search");
});
app.post("/booking_search", (req, res) => {
  res.render("booking_search");
});
// 予約確認画面（会員）
app.get("/booking_check_login/:id", (req, res) => {
  res.render("booking_check_login");
});
app.post("/booking_check_login/:id", (req, res) => {
  let data = req.body;
  let sql =
    "select * from members left join passengers on members.id = passengers.member_id left join flights on passengers.flight_num =flights.flight_num where members.id = ?";
  con.query(sql, data.id, function (err, result) {
    if (data.password == result[0].password) {
      //password認証
      res.render("booking_check_login", {
        data: result,
      });
    } else {
      //認証失敗の場合
      res.redirect("booking_search");
    }
  });
});
// 予約確認画面（一般）
app.get("/booking_check_nologin", (req, res) => {
  res.render("booking_check_nologin");
});
app.post("/booking_check_nologin", (req, res) => {
  const sql =
    "select * from passengers left join flights on flights.flight_num = passengers.flight_num where passengers.flight_num = ? and passengers.familyname = ? and passengers.firstname = ?";
  let data = req.body;
  con.query(
    sql,
    [data.flight_num, data.familyname, data.firstname],
    function (err, result) {
      if (!result.length) {
        return res.render("booking_search");
      }
      if (
        data.flight_num == result[0].flight_num &&
        data.familyname == result[0].familyname &&
        data.firstname == result[0].firstname
      ) {
        //password認証
        res.render("booking_check_nologin", {
          data: result,
        });
      }
    }
  );
});
// 予約確定画面
app.post("/booking_confirm", (req, res) => {
  let data = req.body;
  //ナンバリングしたnameの値を元に戻す
  // ------------------
  let { familyname_1, firstname_1, age_1, sex_1 } = data;
  let { familyname_2, firstname_2, age_2, sex_2 } = data;
  let { familyname_3, firstname_3, age_3, sex_3 } = data;
  let { familyname_4, firstname_4, age_4, sex_4 } = data;
  let { familyname_5, firstname_5, age_5, sex_5 } = data;
  let data1 = {
    member_id: data.member_id,
    flight_num: data.flight_num,
    familyname: familyname_1,
    firstname: firstname_1,
    age: age_1,
    sex: sex_1,
    phone_kind: data.phone_kind,
    phone_num: data.phone_num,
    email: data.email,
    people: data.people,
    total: data.total,
  };
  let data2 = {
    member_id: data.member_id,
    flight_num: data.flight_num,
    familyname: familyname_2,
    firstname: firstname_2,
    age: age_2,
    sex: sex_2,
    phone_kind: data.phone_kind,
    phone_num: data.phone_num,
    email: data.email,
    people: data.people,
    total: data.total,
  };
  let data3 = {
    member_id: data.member_id,
    flight_num: data.flight_num,
    familyname: familyname_3,
    firstname: firstname_3,
    age: age_3,
    sex: sex_3,
    phone_kind: data.phone_kind,
    phone_num: data.phone_num,
    email: data.email,
    people: data.people,
    total: data.total,
  };
  let data4 = {
    member_id: data.member_id,
    flight_num: data.flight_num,
    familyname: familyname_4,
    firstname: firstname_4,
    age: age_4,
    sex: sex_4,
    phone_kind: data.phone_kind,
    phone_num: data.phone_num,
    email: data.email,
    people: data.people,
    total: data.total,
  };
  let data5 = {
    member_id: data.member_id,
    flight_num: data.flight_num,
    familyname: familyname_5,
    firstname: firstname_5,
    age: age_5,
    sex: sex_5,
    phone_kind: data.phone_kind,
    phone_num: data.phone_num,
    email: data.email,
    people: data.people,
    total: data.total,
  };
  let datas = [data1, data2, data3, data4, data5];
  function converter(obj) {
    let {
      member_id,
      flight_num,
      familyname,
      firstname,
      age,
      sex,
      phone_kind,
      phone_num,
      email,
      people,
      total,
    } = obj; //分割代入
    return [
      member_id,
      flight_num,
      familyname,
      firstname,
      age,
      sex,
      phone_kind,
      phone_num,
      email,
      people,
      total,
    ];
  }
  let sql =
    "INSERT INTO passengers (member_id, flight_num, familyname, firstname, age, sex, phone_kind, phone_num, email, people, total) values (?),(?),(?),(?),(?)";
  let converted = datas.map(converter);
  con.query(sql, converted, function (err, result) {
    res.render("booking_confirm", {
      familyname: data.familyname_1,
      firstname: data.firstname_1,
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
// 予約者情報入力画面（一般）
app.post("/booking_info_nologin", (req, res) => {
  const sql = "SELECT * FROM flights";
  let data = req.body;
  con.query(sql, data, function (err, result) {
    if (err) throw err;
    res.render("booking_info_nologin", {
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
// 予約者情報入力画面（会員）
app.post("/booking_info_login/:id", (req, res) => {
  const sql = "SELECT * FROM members where id = ?";
  let data = req.body;
  con.query(sql, data.id, function (err, result) {
    if (data.password == result[0].password) {
      //pass認証
      res.render("booking_info_login", {
        members: result,
        date: data.date,
        flight_num: data.flight_num,
        departure: data.departure,
        departure_time: data.departure_time,
        arrival: data.arrival,
        arrival_time: data.arrival_time,
        people: data.people,
        total: data.total,
      });
    } else {
      //認証失敗の場合
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
    }
  });
});
// 会員ログイン画面
app.post("/member_login", (req, res) => {
  const sql = "SELECT * FROM members";
  let data = req.body;
  con.query(sql, req.body, function (err, result) {
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
// 会員登録画面
app.get("/member_register", (req, res) => {
  res.render("member_register");
});
app.post("/member_register", (req, res) => {
  res.render("member_register");
});
// 会員登録完了画面
// multipleStatements
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
