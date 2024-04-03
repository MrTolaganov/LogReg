const express = require("express");
const { config } = require("dotenv");
const { createConnection } = require("mysql");

const app = express();

config({ path: "" });

app.set("view engine", "hbs");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/", require("./routes/page"));
app.use("/auth", require("./routes/auth"));

const { DATABASE, DATABASE_HOST, DATABASE_USER, DATABASE_PASSWORD } =
  process.env;

const db = createConnection({
  host: DATABASE_HOST,
  user: DATABASE_USER,
  password: DATABASE_PASSWORD,
  database: DATABASE,
});

db.connect(err => {
  if (err) {
    console.log(err);
  } else {
    console.log("MySQL connected...");
  }
});

app.listen(3000, () => {
  console.log("Server is running on port: 3000...");
});
