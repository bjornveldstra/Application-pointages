const express = require('express');
const path = require('path');
const app = express();

// Servir les fichiers statiques du dossier 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Route pour la page d'accueil
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Démarrer le serveur sur le port fourni par Vercel ou 3000 par défaut
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});



// Pour enregistrer les modificiations du serveur : 

// 1) Ouvrir Node.js command prompt
// 2) copier et coller dans le prompt : cd /d "O:\13- Informatique\GESTION DES HEURES\Application pointages"
// 3) à la ligne, copier et coller dans le prompt : dir 
// 4) à la ligne, copier et coller dans le prompt : npm install 
// 5) à la ligne, copier et coller dans le prompt : npm start
// 6) à la fin, vous devrirez obtenir : Server running at http://localhost:(numéro_du_serveur)
// 7) ouvrir le serveur

// Pour pousser les modificiations du serveur sur vercel : 

// 1) Ouvrir Node.js command prompt
// 2) copier et coller dans le prompt : cd /d "O:\13- Informatique\GESTION DES HEURES\Application pointages"
// 3) copier et coller dans le prompt : git add .
// 4) copier et coller dans le prompt : git commit -m
// 5) copier et coller dans le prompt : git push