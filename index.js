const connectToDatabase = require("./db");
const app = require("./app");
const Port = process.env.PORT || 4080;
const dotenv = require("dotenv");
dotenv.config();

console.log(process.env.PORT);

connectToDatabase();

app.listen(Port, () => {
  console.log(`listening on port ${Port}`);
});
