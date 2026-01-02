const express = require("express");
const cors = require("cors");
const Controller = require("./controllers/controller");
const authentication = require("./middlewares/authentication.js");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/register", Controller.register);
app.post("/login", Controller.login);
app.post("/applications", authentication, Controller.addApplication);
app.get("/applications", authentication, Controller.viewApplications);
app.get("/applications/:id", authentication, Controller.getApplicationById);
app.put("/applications/:id", authentication, Controller.updateApplication);
app.delete("/applications/:id", authentication, Controller.deleteApplication);

app.get("/groups", authentication, Controller.getGroupsWithItems);
app.post("/scoring", authentication, Controller.submitScoring);
app.get("/scoring/:id", authentication, Controller.getApplicationScore);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
module.exports = app;
