import express from "express";

const app = express();

app.get("/login");

app.get("/refresh");

app.get("/activate");

app.get("/register");

app.get("/validate");

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
