const app = require("./app");
const db = require("./db/conn");

const PORT = process.env.PORT || 8080;

db.connectToServer(function (err) {
  if (err) {
    console.log(err);
    process.exit(1);
  } });

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});