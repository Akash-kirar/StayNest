if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const UserRouter = require("./routes/user.js");

const port = process.env.PORT || 8080;
const defaultLocalDbUrl = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl =
  process.env.DB_URL ||
  (process.env.NODE_ENV === "production"
    ? process.env.ATLASDB_URL
    : process.env.LOCAL_DB_URL || defaultLocalDbUrl);

main()
  .then(() => {
    console.log("connected to DB");
    app.listen(port, () => {
      console.log(`server is listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use((req, res, next) => {
  res.locals.success = [];
  res.locals.error = [];
  res.locals.currUser = null;
  next();
});

const store = MongoStore.MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 60 * 60,
});

store.on("error", (err) => {
  console.log("ERROR in Mongo session store", err);
});

const sessionOptions = {
  store,

  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,

  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

// app.get("/", (req, res) => {
//     res.send("Hi , i am root");
// });
app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.use(session(sessionOptions));
app.use(flash());

//user

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

//user

// app.get("/demouser", async (req,res)=>{
//   let fakeUser = new User({
//     email:"student@gmail.com",
//     username: "akash"
//   });
//   let registeredUser =  await User.register(fakeUser, "hellowwarld");
//   res.send(registeredUser);
// });

app.use("/listings", listingRouter);

app.use("/listings/:id/reviews", reviewRouter);

app.use("/", UserRouter);

app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
  // res.status(statusCode).send(message);
});
