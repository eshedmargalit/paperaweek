module.exports = app => {
  app.get("/api/auth", (req, res) => {
    console.log(req.headers);

    // token is header sent from the front-end
    let user = req.headers.user;
    if (!user) return res.status(401).send("User ID missing from header");
    console.log(user);
  });
};
