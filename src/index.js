import "../src/config/db_connection.js";
import app from "./app.js";
import { PORT } from "./config.js";

app.listen(PORT, () => {
  console.log("server listen on port", app.get("port"));
});
