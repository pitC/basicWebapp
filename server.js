var express = require("express"),
  path = require("path"),
  http = require("http"),
  objects = require("./routes/objects"),
  cfg = require("./config.json"),
  bodyParser = require("body-parser");

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.set("port", process.env.PORT || 3000);

app.get("/dummy", objects.getDummy);
app.get("/objects", objects.findAll);
app.get("/objects/:id", objects.findById);
app.post("/objects", objects.addObject);
app.put("/objects/:id", objects.updateObject);
app.delete("/objects/:id", objects.deleteObject);

server = http.createServer(app);

var io = require("socket.io").listen(server);

server.listen(app.get("port"), function() {
  console.log("Express server listening on port " + app.get("port"));
  console.log(cfg);
});

io.on("connection", function(socket) {
  console.log("a user connected");
  socket.on("disconnect", function() {
    console.log("user disconnected");
  });

  socket.on("item-removed", function(msg) {
    console.log("message!");
    console.log(msg);
    this.broadcast.emit("item-removed", msg);
  });

  socket.on("item-created", function(msg) {
    console.log("message!");
    console.log(msg);
    this.broadcast.emit("item-created", msg);
  });

  socket.on("item-updated", function(msg) {
    console.log("message!");
    console.log(msg);
    this.broadcast.emit("item-updated", msg);
  });
});
