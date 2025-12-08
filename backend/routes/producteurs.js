const express = require('express');
const router = express.Router();
const Producteur = require('../models/Producteur'); // Assure-toi que ce modèle existe

// GET : Tous les producteurs
router.get('/', async (req, res) => {
  try {
    const producteurs = await Producteur.find();
    res.json(producteurs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST : Ajouter un producteur
router.post('/', async (req, res) => {
  const nouveauProducteur = new Producteur({
    nom: req.body.nom,
    localisation: req.body.localisation,
    produits: req.body.produits
  });

  try {
    const savedProducteur = await nouveauProducteur.save();
    res.status(201).json(savedProducteur);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET : Un producteur par ID
router.get('/:id', async (req, res) => {
  try {
    const producteur = await Producteur.findById(req.params.id);
    if (!producteur) return res.status(404).json({ message: "Producteur non trouvé" });
    res.json(producteur);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT : Mettre à jour un producteur
router.put('/:id', async (req, res) => {
  try {
    const updatedProducteur = await Producteur.findByIdAndUpdate(
      req.params.id,
      {
        nom: req.body.nom,
        localisation: req.body.localisation,
        produits: req.body.produits
      },
      { new: true }
    );
    if (!updatedProducteur) return res.status(404).json({ message: "Producteur non trouvé" });
    res.json(updatedProducteur);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE : Supprimer un producteur
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Producteur.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Producteur non trouvé" });
    res.json({ message: "Producteur supprimé" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
