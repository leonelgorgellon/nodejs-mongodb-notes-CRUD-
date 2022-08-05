const notesCtrl = {};

const Note = require('../models/Note')

notesCtrl.renderNoteForm = (req, res) => {
  res.render('notes/new-note');
};

notesCtrl.createNewNote = async (req, res) => {
  const {title,description} = req.body;
  const newNote = new Note({title, description});
  //mostramos el id del usuario que creo la nota.
  newNote.user = req.user.id;
  await newNote.save();
  req.flash('success_msg', 'Nota agregada con éxito');
  res.redirect('/notes');
};

notesCtrl.renderNotes = async (req, res) => {
  //mostramos solo las notas que pertenecen a cada usuario
  const notes= await Note.find({user: req.user.id}).sort({createdAt: 'desc'}).lean();
  res.render('notes/all-notes', {notes});
};

notesCtrl.renderEditForm = async (req, res) => {
  const note = await Note.findById(req.params.id).lean();
  //validamos para que un usuario no pueda editar la nota de otro. 
  if(note.user != req.user.id){
    req.flash('error_msg', 'No autorizado');
    return res.redirect('/notes');
  }
  res.render('notes/edit-note', {note});
};

notesCtrl.updateNote = async (req, res) => {
  const {title, description} = req.body;
  await Note.findByIdAndUpdate(req.params.id, {title, description})
  req.flash('success_msg', 'Nota actualizada con éxito');
  res.redirect('/notes')
};

notesCtrl.deleteNote = async (req, res) => {
  await Note.findByIdAndDelete(req.params.id)
  req.flash('success_msg', 'Nota eliminada con éxito');
  res.redirect('/notes');
};

module.exports = notesCtrl;
