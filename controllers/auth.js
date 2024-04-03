const { createConnection } = require("mysql");
const { hash, compare } = require("bcryptjs");

const { DATABASE, DATABASE_HOST, DATABASE_USER, DATABASE_PASSWORD } =
  process.env;

const db = createConnection({
  host: DATABASE_HOST,
  user: DATABASE_USER,
  password: DATABASE_PASSWORD,
  database: DATABASE,
});

exports.register = async (req, res) => {
  const { username, email, password, passwordConfirm } = req.body;
  db.query(
    "SELECT email FROM users WHERE email = ?",
    [email],
    async (error, results) => {
      if (error) {
        console.log(error);
      }
      if (results.length > 0) {
        return res.render("register", {
          message: "Email has already been taken",
        });
      } else if (password !== passwordConfirm) {
        return res.render("register", {
          message: "Password is not verified",
        });
      }
      let hashedPassword = await hash(password, 8);
      console.log(hashedPassword);
      db.query(
        "INSERT INTO users SET ?",
        { username, email, password: hashedPassword },
        (error, results) => {
          if (error) {
            console.log(error);
          } else {
            console.log(results);
            return res.render("register", {
              message: "User registered",
            });
          }
        }
      );
    }
  );
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).render("login", {
        message: "Please provide email and password",
      });
    }
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (error, results) => {
        console.log(results);
        if (!results || !(await compare(password, results[0].password))) {
          res.status(401).render("login", {
            message: "Email or Password is incorrect",
          });
        } else {
          const id = results[0].id;
          res.status(200).redirect("/");
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};
