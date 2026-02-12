const mongoose = require("mongoose");
const app = require("./app");
require("dotenv").config();

async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (err) {
    console.error(`Error connecting to DB: ${err}`);
    process.exit(1);
  }
}

connectToDB();

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server listening on: ${PORT}`));
