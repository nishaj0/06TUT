const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const corsOptions = require("./config/corsOption");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const PORT = process.env.PORT || 3001;

// custom middleware
app.use(logger);

// cross origin resource sharing
app.use(cors(corsOptions));

// built-in middleware to handler urlencoded for form
app.use(express.urlencoded({ extended: false }));

// build-in middleware for json
app.use(express.json());

// serve static files
app.use(express.static(path.join(__dirname, "/public")));

// routes
app.use("/", require("./router/root"));
app.use("/register", require("./router/register"));
app.use("/employees", require("./router/api/employees"));


app.all("*", (req, res) => {
   res.status(404);
   if (req.accepts("html")) {
      res.sendFile(path.join(__dirname, "views", "404.html"));
   } else if (req.accepts("json")) {
      res.json({ error: "404 not found" });
   } else {
      res.type("txt").send("404 not found");
   }
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`server running on port: ${PORT}`));