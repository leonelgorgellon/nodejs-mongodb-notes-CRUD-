const { Router } = require("express");
const router = Router();

const {
  renderNoteForm,
  createNewNote,
  renderNotes,
  renderEditForm,
  updateNote,
  deleteNote,
} = require("../controllers/notes.controllers");

const {isAuthenticated} = require('../helpers/auth')

//crear nota
router.get("/notes/add", isAuthenticated, renderNoteForm);
router.post("/notes/new-note", isAuthenticated, createNewNote);

//obtener todas las notas
router.get("/notes", isAuthenticated, renderNotes);

//editar notas
router.get("/notes/edit/:id", isAuthenticated, renderEditForm); //mostrar formulario
router.put("/notes/edit/:id", isAuthenticated, updateNote); //actualizar los datos

//eliminar
router.delete("/notes/delete/:id", isAuthenticated, deleteNote);

module.exports = router;
