/*
You can choose to define all your middleware functions here, 
export them and then import them into your app.js and attach them that that.
add.use(myMiddleWare()). you can also just define them in the app.js if you like as seen in lecture 10's lecture code example. If you choose to write them in the app.js, you do not have to use this file. 
*/

/**
 * Middleware that sets the Cache-Control header to no-store, no-cache, must-revalidate, private
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const noCache = (req, res, next) => {
  /**
   * Cache-Control
   * no-store means do not cache the responsne
   * no-cache means do not cache
   * must-revalidate means to revalidate the cache with the server
   * private means the response should not be stored in a shared cache
   */
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  next();
};

const root = async (req, res, next) => {
  // Check if user is logged in
  if (req.session?.user) {
    return res.redirect("/modules");
  }
  return res.redirect("/login");
};

const login = async (req, res, next) => {
  // Check if user is logged in
  if (req.session?.user) {
    return res.redirect("/dashboard");
  }
  return next();
};

const signup = async (req, res, next) => {
  // Check if user is logged in
  if (req.session?.user) {
    return res.redirect("/dashboard");
  }
  return next();
};

const home = async (req, res, next) => {
  if (!req.session?.user) {
    return res.redirect("/login");
  }
  return next();
};

const logout = async (req, res, next) => {
  if (!req.session?.user) {
    return res.redirect("/login");
  }
  return next();
};

const logging = async (req, res, next) => {
  let timestamp = new Date().toUTCString();
  let { method, path } = req;
  let authenticated = req.session?.user
    ? "Authenticated User"
    : "Non-Authenticated User";

  console.log(`[${timestamp}]: ${method} ${path} (${authenticated})`);

  next();
};

const authAPI = async (req, res, next) => {
  req.session.user = { username: "johndoe" };

  if (!req.session?.user) {
    return res.status(403).json({ error: req.session });
  }
  return next();
};

export { noCache, root, login, signup, home, logout, logging, authAPI };
