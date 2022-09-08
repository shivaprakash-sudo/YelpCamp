import catchAsync from "../utils/catchAsync.js";
import User from "../models/user.js";

const signupForm = (req, res) => {
  res.render("users/signup");
};

const createUser = catchAsync(async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", `Welcome to Yelp Camp, ${username}!`);
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("signup");
  }
});

const loginForm = (req, res) => {
  res.render("users/login");
};

const login = (req, res) => {
  req.flash("success", `Welcome back ${req.user.username} !`);

  const redirectUrl = req.session.returnTo || "/campgrounds";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "Goodbye! Visit us again.");
    res.redirect("/campgrounds");
  });
};

const profile = (req, res) => {
  //   console.log(req.user);
  res.render("users/profile", { user: req.user });
};

export { signupForm, createUser, loginForm, login, logout, profile };
