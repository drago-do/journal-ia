const express = require("express");
const app = express();
const morgan = require("morgan");
require("dotenv").config();

const port = process.env.PORT || 3001;

app.timeout = 5000; // Aumenta el tiempo de espera a 5 segundos (puedes ajustar este valor según tus necesidades)

//Configuraciones
app.set("port", port);
app.set("json spaces", 2);

//Middleware
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Configurar cabeceras y cors
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

//Conexión mongoDB
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const uri = process.env.MONGODB_URI;

mongoose
  .connect(uri, (data) => console.log("Conectado a base:" + data))
  .catch((e) => console.log(e));

//Routes
app.use(express.static("public"));

//Entrada General a la api
app.use(require("./routes/index"));

// //Para las rutas
app.use("/article", require("./routes/article"));
app.use("/user", require("./routes/user"));
app.use("/pdf", require("./routes/pdf"));
app.use("/assistant", require("./routes/assistant"));
app.use("/commentOfRevisor", require("./routes/commentOfRevisor"));

//Iniciando el servidor
app.listen(app.get("port"), () => {
  console.log(`Server listening on port ${app.get("port")}`);
});
