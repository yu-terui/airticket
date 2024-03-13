// const router = require('express').Router();

// // mysql
// const con = require('./app.js')

// // loginを管理できるライブラリー
// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;

// passport.use("mylogin",
//   new LocalStrategy({
//     usernameField: 'id',
//     passwordField: 'password',
// }, function (input_id, input_password, done) {
//   const sql = `select * from accounts where id = '${input_id}'`
//   con.query(sql, function (err, result) {
//     // mysql から取り出したaccounts情報から１番目の情報と照合する
//       login_data = result[0]
//       if (err) return done(err)
//       if (!login_data) return done(null, false)
//       if (input_password == login_data.password) {
//           return done(null, login_data)
//       } else {
//           return done(null, false)
//       }
//   })
// }));
// // ログイン処理をミドルウェアとしてルーターが使う事を宣言
// router.use(passport.initialize());

// // loginページ
// router.get("/member_login", (req, res) => {
//   res.render("member_login");
// });

// router.post("/member_login", passport.authenticate(
//   "mylogin",
//   {
//     successRedirect: "/booking_check",
//     failureRedirect: "/member_login",
//     session: false // セッションにログイン情報を保存しない。trueとすると、passport.serializeUserやpassport.deserializeUserというメソッドを実装する事でセッションに保存したログイン情報が正しいか判別出来る。
//   }
// ));
// //   (req, res) => {
// //   const sql = "SELECT * FROM flights";
// //   let data = req.body;
// //   con.query(sql, req.body, function (err, result) {
// //     if (err) throw err;
// //     res.render("member_login", {
// //       date: data.date,
// //       flight_num: data.flight_num,
// //       departure: data.departure,
// //       departure_time: data.departure_time,
// //       arrival: data.arrival,
// //       arrival_time: data.arrival_time,
// //       people: data.people,
// //       total: data.total,
// //     });
// //   });
// // });

// module.exports = router;
