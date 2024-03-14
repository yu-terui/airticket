// ログインを管理できるライブラリー
let router = require('express').Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// mysql
const con = require('./app')

// ログイン処理
passport.use("mylogin",
  new LocalStrategy({
  // inputのnameと合わせる
  usernameField: "id",
  passwordField: "password"
}, function (id, password, done) {
  // const sql = `select * from members where id = '${id}'`
  // con.query(sql, function (err, result) {
      // login_data = result[0]
      // if (err) return done(err)
      // if (!login_data) return done(null, false, { message: 'account does not exist' })
      if (password == 'password') { // login_data.password
          return done(null, id) // ログイン成功
      } else {
          return done(null, false, { message: 'wrong password' })
      }
  // })
}));

router.use(passport.initialize());

// ログイン後ページ
router.post("/booking_info", (req, res) => {
  const sql = "SELECT * FROM flights";
  let data = req.body;
  con.query(sql, req.body, function (err, result) {
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

router.post("/member_login", (req, res) => {
  const sql = "SELECT * FROM flights";
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


// ログイン分岐
router.post('/booking_info', passport.authenticate(
  "mylogin", {
  successRedirect: '/booking_info',
  failureRedirect: '/member_login',
  session: false
}));


module.exports = router;
