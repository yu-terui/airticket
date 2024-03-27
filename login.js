// let router = require("express").Router();

// // mysql
// const con = require("./app.js");

// // ログインを管理できるライブラリー
// const passport = require("passport");
// const LocalStrategy = require("passport-local").Strategy;
// const session = require("express-session");

// router.use(session({ secret: "1234", resave: true, saveUninitialized: false }));
// router.use(passport.initialize());
// router.use(passport.session());

// // ログイン画面
// router.get("/member_login", (req, res) => {
//   const sql = "SELECT * FROM flights";
//   let data = req.body;
//   con.query(sql, req.body, function (err, result) {
//     if (err) throw err;
//     res.render("member_login", {
//       date: data.date,
//       flight_num: data.flight_num,
//       departure: data.departure,
//       departure_time: data.departure_time,
//       arrival: data.arrival,
//       arrival_time: data.arrival_time,
//       people: data.people,
//       total: data.total,
//     });
//   });
// });
// router.post("/member_login", (req, res) => {
//   const sql = "SELECT * FROM flights";
//   let data = req.body;
//   con.query(sql, req.body, function (err, result) {
//     if (err) throw err;
//     res.render("member_login", {
//       date: data.date,
//       flight_num: data.flight_num,
//       departure: data.departure,
//       departure_time: data.departure_time,
//       arrival: data.arrival,
//       arrival_time: data.arrival_time,
//       people: data.people,
//       total: data.total,
//     });
//   });
// });

// // ログイン後の遷移画面
// router.get("/booking_info/:date/:flight_num/:people/:total", (req, res) => {
//   const sql = "SELECT * FROM flights where date = ?";
//   let data = req.params;
//   con.query(sql, data, function (err, result) {
//     res.send(data)
//     // if (err) throw err;
//     // res.render("booking_info", {
//     //   date: data.date,
//     //   flight_num: data.flight_num,
//     //   people: data.people,
//     //   total: data.total,
//     // });
//   });
// });
// router.post("/booking_info/:date/:flight_num/:people/:total", (req, res) => {
//   const sql = "SELECT * FROM flights where date = ? ";
//   let data = req.params;
//   con.query(sql, data, function (err, result) {
//     // res.send(data)
//     // if (err) throw err;
//     res.render("booking_info", {
//       date: data.date,
//       flight_num: data.flight_num,
//       people: data.people,
//       total: data.total,
//     });
//   });
// });

// // ログイン分岐
// router.post("/booking_info/:date/:flight_num/:people/:total",
//   passport.authenticate("local", {
//     successRedirect: "/booking_info/:date/:flight_num/:people/:total",
//     failureRedirect: "/member_login",
//   })
// );

// // ログイン処理
// passport.use(
//   new LocalStrategy(
//     {
//       // inputのnameと合わせる
//       usernameField: "id",
//       passwordField: "password",
//       session: true,
//       passReqToCallback: false,
//     },
//     function (input_id, input_password, done) {
//       const sql = `select * from members where id = '${input_id}'`;
//       con.query(sql, function (err, result) {
//         login_data = result[0];
//         if (err) return done(err);
//         if (!login_data)
//           return done(null, false, { message: "account does not exist" });
//         if (input_password == login_data.password) {
//           return done(null, login_data); // ログイン成功
//         } else {
//           return done(null, false, { message: "wrong password" });
//         }
//       });
//     }
//   )
// );

// // ログインに成功したらuser.idのセッションを生成し、Cookieを作る
// passport.serializeUser(function (user, done) {
//   done(null, user.id);
// });

// passport.deserializeUser(function (user_id_saved, done) {
//   // ユーザーの情報をDBから探す
//   const sql = `select * from members where id = '${user_id_saved}'`;
//   con.query(sql, function (err, result) {
//     done(null, result[0]);
//   });
// });

// // ミドルウェアでログイン有無によるページ接近の管理
// function is_login(req, res, next) {
//   if (req.user) {
//     // loginした状態なら、通す
//     next();
//   } else {
//     // loginしてないならこのページに飛ばす
//     res.render("member_login.ejs");
//   }
// }

// // ミドルウェアでログインしているかチェックし、ログインしているならreq.userのDBを見せる
// // router.get("/booking_info", is_login, function (req, res) {
// //   // console.log(req.user)
// //   // res.send(req.user)
// // });

// module.exports = router;
