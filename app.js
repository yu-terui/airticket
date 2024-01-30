const path = require("path");
const express = require("express"); //expressモジュールをロード
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express(); //インスタンス化してappに代入

const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");//テンプレートエンジンをEJSに

const mysql = require("mysql2");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "rootroot",
  database: "products",
});
// cssファイルの取得
app.use(express.static("assets"));

// mysqlからデータを持ってくる
app.get("/", (req, res) => {
  const sql = "select * from personas";
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.render("index", {
      filteredPersonas: result,
      order: "",
      search: ""
    });
  });
});

//新規追加
//データベースを変更したいときはpost
app.post("/", (req, res) => {
  const sql = "INSERT INTO personas SET ?";
  con.query(sql, req.body, function (err, result, fields) {//query＝SQLの実行
    if (err) throw err;
    console.log(result);
    res.redirect("/");
  });
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

//ソート・絞り込み
app.get("/:filter", (req, res) => {
  let order = ""
  let search = ""
  let orderQuery = ""
  let searchQuery = ""
  let filteredPersonas = []
  const filter = req.params.filter.split("+")

  // ソート・絞り込みの選択肢が格納されている分だけ処理繰り返し
  filter.forEach((element) => {
    //ソート
    if (element.indexOf("order") > -1) {
      // order=rating:ascという形から=の後の記述のみ取得
      const selectOrder = element.slice(element.indexOf("=") + 1)
      if (element.indexOf("rating") > -1) {
        //ascという形のみ取得
        let order = selectOrder.slice(selectOrder.indexOf(":") + 1)
        if (order !== "base") orderQuery = `ORDER BY rating ${order}`
      }
      else if (selectOrder === "base") order = "base"
    }
    //絞り込み
    else if (element.indexOf("search") > -1) {
      // search=rating:1という形から=の後の記述のみ取得
      const selectSearch = element.slice(element.indexOf("=") + 1)
      if (element.indexOf("rating") > -1) {
        //1という形のみ取得
        search = selectSearch.slice(selectSearch.indexOf(":") + 1)
        if (search !== "base") searchQuery = `WHERE rating = ${search}`
      }
      else if (selectSearch === "base") search = "base"
    }
  });
  // 検索結果を反映した情報を取得
  sql = `SELECT * FROM personas ${searchQuery} ${orderQuery}`;
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    // ソートされたユーザー情報と順番の情報を返す
    res.render("index", {
      filteredPersonas: result,
      order: order,
      search: search
    });
  });
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
