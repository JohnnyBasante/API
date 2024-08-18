const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

const mongoUri = process.env.MONGODDB_URI;

try {
  mongoose.connect(mongoUri);
  console.log("Conectadoa a MongoDB");
} catch (error) {
  console.error("Error de conexion", error);
}

const libroSchema = new mongoose.Schema({
  titulo: String, 
  autor: String,
});

const Libro = new mongoose.model("Libro", libroSchema);

/*
app.use((req, res, next) => {
  const authToken = req.headers["authorization"];

  if(authToken === "miTokenSecreto123"){
    next();
  }
  else {
    res.status(401).send("Acceso no autorizado");
  }
})
*/

// RUTAS 

// Crear un nuevo libro
app.post("/libros", async (req, res) => {
  const libro = new Libro({
    titulo: req.body.titulo,
    autor: req.body.autor
  })

  try {
    await libro.save();
    res.json(libro);
  } catch (error) {
    res.status(500).send("Error al guardar libro", error);
  }
});

// Pedir un listado de libros

app.get("/libros",async (req, res) => {
  try {
    const libros = await Libro.find();
    res.json(libros);
  } catch (error) {
    res.status(500).send("Error al obtener libros", error);
  }
});

// Actualizar libro 

app.put("/libros/:id", async (req, res) =>{
  try {
    let id = req.params.id;
    const libro = await Libro.findByIdAndUpdate(id,{titulo: req.body.titulo, autor: req.body.autor}, {new:true});

    if(libro) {
      res.json(libro);
    } else{
      res.status(404).send("Libro no encontrado");
    }

  } catch (error) {
    res.status(500).send("Error al actualizar el libro", error);
  }
});

// Eliminar el libro

 app.delete("/libros/:id", async (req, res) =>{
  try {
    let id = req.params.id;
    const libro = await Libro.findByIdAndDelete(id);

    if(libro) {
      res.status(204).send("Libro encontrado");
    } else{
      res.status(404).send("Libro no encontrado");
    }

  } catch (error) {
    res.status(500).send("Error al actualizar el libro", error);
  }
 });

app.listen(3000, () => {
  console.log("Servidor ejecutandose en http://localhost:3000/libros");
});