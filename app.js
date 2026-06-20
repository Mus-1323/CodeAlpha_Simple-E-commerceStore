const express=require("express");
const app=express();
const port=8080;
const path=require("path");
const mongoose = require('mongoose');
const Product=require("./models/product.js");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User=require("./models/user.js");
const Order = require("./models/orders.js");


//middle wares
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(path.join(__dirname , "public")));
app.engine("ejs", ejsMate);
app.use(session({
    secret: "mysupersecretkey",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});
const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }
  next();
};

mongoose.connect("mongodb://127.0.0.1:27017/E-commerce")
.then(() => {
    console.log("MongoDB Connected");
})
.catch((err) => {
    console.log(err);
});
//routes
app.get("/product", async (req,res)=>{
    let allList = await Product.find();
    res.render("home.ejs", { allList });
});

app.get("/product/:id", async (req,res)=>{
    let { id } = req.params;
    let product = await Product.findById(id);

    if (!product) {
        return res.status(404).send("Product not found");
    }

    res.render("show.ejs", { product });
});

app.get("/cart",isLoggedIn,(req,res)=>{
  res.render("cart.ejs");
});
//orders page 

app.get("/order",isLoggedIn, (req, res) => {
  res.render("order.ejs");
});

app.post("/order", async (req, res) => {
  const { items, totalAmount, customerName, address, phone } = req.body;

  const newOrder = new Order({
    items,
    totalAmount,
    customerName,
    address,
    phone,
    user: req.user._id,
  });

  await newOrder.save();

  res.json({
    success: true,
    message: "Order placed successfully",
  });
});
app.get("/my-order", isLoggedIn, async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.render("my-order.ejs", { orders });
});


//user login pages
app.get("/signup", (req, res) => {
  res.render("signup.ejs");
});

app.post("/signup", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const newUser = new User({
      username,
      email,
    });

    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }

      res.redirect("/product");
    });
  } catch (err) {
    res.send(err.message);
  }
});
app.get("/login", (req, res) => {
  res.render("login.ejs");
});
app.post("/login",passport.authenticate("local", { failureRedirect: "/login",}), (req, res) => {
    res.redirect("/product");
  }
);

app.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    res.redirect("/product");
  });
});

app.listen(port,()=>{
    console.log(`the port is on and it is activated port${port}`)
});
