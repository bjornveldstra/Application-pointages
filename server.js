const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000; // Port utilisé par Vercel ou 3000 par défaut

// Servir les fichiers statiques du dossier 'public'
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/submit', upload.none(), (req, res) => {
    const formData = req.body;
    console.log('Form data received:', formData);  // Log the received form data

    const filePath = path.join(__dirname, 'uploads', 'data.xlsx');
    let workbook;

    try {
        if (fs.existsSync(filePath)) {
            workbook = xlsx.readFile(filePath);
        } else {
            workbook = xlsx.utils.book_new();
            xlsx.utils.book_append_sheet(workbook, xlsx.utils.aoa_to_sheet([['Libellé', 'Début', 'Fin', 'Code intervenant', 'Code matériel', 'Durée réalisée - Durée en heures', 'Code du chantier', 'Inclure les coûts dans l\'analyse (Affaire)', 'Notes', 'Durée prévue - Durée en heures']]), 'Sheet1');
        }

        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        
        const startTime = `${formData.date}  ${formData.startTime}`;
        const endTime = `${formData.date}  ${formData.endTime}`;
        
        const newRow = [
            formData.workerName,
            startTime,
            endTime,
            formData.workerCode,
            formData.materialCode,
            formData.durationDone,
            formData.projectCode,
            formData.include,
            formData.notes,
            formData.plannedDuration
        ];

        console.log('New row to add:', newRow);  // Log the new row to be added

        // Trouver la première ligne vide après les en-têtes
        let rowIndex = 1;
        while (worksheet[`A${rowIndex + 1}`]) {
            rowIndex++;
        }

        // Ajouter la nouvelle ligne à la première ligne vide après les en-têtes
        xlsx.utils.sheet_add_aoa(worksheet, [newRow], { origin: `A${rowIndex + 1}` });
        workbook.Sheets[workbook.SheetNames[0]] = worksheet;

        xlsx.writeFile(workbook, filePath);

        res.json({ message: 'Données enregistrées avec succès !' });
    } catch (error) {
        console.error('Error writing to Excel:', error);
        res.status(500).json({ message: 'Erreur lors de l\'enregistrement des données.' });
    }
});

// Route pour la page d'accueil
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Démarrer le serveur sur le port fourni par Vercel ou 3000 par défaut
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