const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const corsOptions = require("./config/corsOption");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 3001;

// custom middleware
app.use(logger);

// cross origin resource sharing
app.use(cors(corsOptions));

// built-in middleware to handler urlencoded for form
app.use(express.urlencoded({ extended: false }));

// build-in middleware for json
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

// serve static files
app.use(express.static(path.join(__dirname, "/public")));

// routes
app.use("/", require("./router/root"));
app.use("/register", require("./router/register"));
app.use("/auth", require("./router/auth"));
app.use("/refresh", require("./router/refresh"));

app.use(verifyJWT)
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