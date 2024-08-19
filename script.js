// script.js

// Hachages des mots de passe au lieu des mots de passe en clair
const users = {
    benjamin: { password: '952e5cef06b51e5315dc5fa7fc00ab76a652f9762e830e6b3deaf7a71287332f', fullName: 'Benjamin Corbeau', code: 'IT00012' },
    bruno: { password: '3cc25ca2c747d34880dab449478a015c7a55a1efa0eff79c83ab05018632fc84', fullName: 'Bruno Minier', code: 'IT00009' },
    corentin: { password: '5a3b5e303d733ce7087d54d5b8c71261ef0d4037a3a18d4026e5c9cdb19fa6bc', fullName: 'Corentin Damange', code: 'IT00004' },
    damien: { password: 'e1a8a7b7b1ec7e75d6e1e028b5e40c0f462d84f35ad1ed0ae12dfc4c445a1b56', fullName: 'Damien Corbeau', code: 'IT00003' },
    quentin: { password: '9c21914e1e09d6e134243f8baf6f08a1df5ae06a913a91f3af76413ae65041d5', fullName: 'Quentin Boursaud', code: 'IT00007' },
    john: { password: '2abdd12ae86e945d7c495f3cdd2de7b3995f93fd67e1b9ab31c21c3ed92a405a', fullName: 'John Coutant', code: 'IT00028' },
    archimed: { password: '39f37e3bce1f5e76b9b519d4ab1637cc091acbc5862db9491af5bb71587b93db', fullName: 'Archimed Imane', code: 'IT00013' },
};

let currentUser = null;

document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value.toLowerCase();
    const password = document.getElementById('password').value;
    const hashedPassword = CryptoJS.SHA256(password).toString(); // Hachage du mot de passe entré

    if (users[username] && users[username].password === hashedPassword) {
        // Connexion réussie
        currentUser = users[username];
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('pointage-container').style.display = 'block';
        document.getElementById('worker-name').value = currentUser.fullName; // Remplir automatiquement le nom complet
        document.getElementById('worker-code').value = currentUser.code; // Remplir automatiquement le code intervenant
        document.getElementById('include').value = '1'; // Valeur par défaut
        document.getElementById('planned-duration').value = '3,5'; // Valeur par défaut
        populateTimeOptions(); // Générer les options de temps
        populateProjectCodeOptions(); // Générer les options de codes de chantier
    } else {
        // Erreur de connexion
        document.getElementById('error-message').innerText = 'ID ou mot de passe incorrect';
    }
});

function populateTimeOptions() {
    populateStartTimeOptions();
    populateEndTimeOptions();
}

function populateStartTimeOptions() {
    const startTimeSelect = document.getElementById('start-time');
    startTimeSelect.innerHTML = '';

    const startTimes = generateTimeOptions(5, 0, 14, 0, 15);
    startTimes.forEach(time => {
        const option = new Option(time, time);
        startTimeSelect.add(option);
    });

    startTimeSelect.addEventListener('change', calculateDuration);
}

function populateEndTimeOptions() {
    const endTimeSelect = document.getElementById('end-time');
    endTimeSelect.innerHTML = '';

    const endTimes = generateTimeOptions(11, 0, 23, 30, 15);
    endTimes.forEach(time => {
        const option = new Option(time, time);
        endTimeSelect.add(option);
    });

    endTimeSelect.addEventListener('change', calculateDuration);
}

function generateTimeOptions(startHour, startMinute, endHour, endMinute, intervalMinutes) {
    let times = [];
    let currentTime = new Date();
    currentTime.setHours(startHour, startMinute, 0, 0);

    const endTime = new Date();
    endTime.setHours(endHour, endMinute, 0, 0);

    while (currentTime <= endTime) {
        const hours = currentTime.getHours().toString().padStart(2, '0');
        const minutes = currentTime.getMinutes().toString().padStart(2, '0');
        times.push(`${hours}:${minutes}`);
        currentTime.setMinutes(currentTime.getMinutes() + intervalMinutes);
    }

    return times;
}

function calculateDuration() {
    const startTime = document.getElementById('start-time').value;
    const endTime = document.getElementById('end-time').value;

    if (startTime && endTime) {
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);

        const start = new Date();
        start.setHours(startHour, startMinute, 0, 0);

        const end = new Date();
        end.setHours(endHour, endMinute, 0, 0);

        if (end > start) {
            const duration = (end - start) / (1000 * 60 * 60); // Convertir la durée en heures
            document.getElementById('duration-done').value = duration.toFixed(1).replace('.', ','); // Formater en heures
        }
    }
}

function formatDateAndTime(date, time) {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}  ${time}`;
}

function populateProjectCodeOptions() {
    const projectCodeSelect = document.getElementById('project-code');
    projectCodeSelect.innerHTML = '';

    // Liste des codes de chantier avec leurs noms
    const projectCodes = [
        { code: 'P-24-X-13', name: 'Selecom' },
        { code: 'P-24-X-12', name: 'Mouvaux' },
        { code: 'P-24-T-12', name: 'xSO - Montel Gelat' },
        { code: 'P-24-T-11', name: 'xSO Pontarion' },
        { code: 'P-24-T-10', name: 'xSO - Mimizan - RAL 7004' },
        { code: 'P-24-P-03', name: 'SNCF - Carignan' },
        { code: 'P-24-X-09', name: 'Cornille les Cave' },
        { code: 'P-24-R-02', name: 'SNCF - Anglefort' },
        { code: 'P-24-X-02', name: 'VDR - st blaise' },
        { code: 'P-24-X-01', name: 'UPS - Nantes' },
        { code: 'P-24-T-08', name: 'xSO - Tramain - Bardage bois' },
        { code: 'P-24-T-02B', name: 'xSO Bourg equipements' },
        { code: 'P-24-T-02', name: 'xSO - Bourg' },
        { code: 'P-24-T-01B', name: 'xSO - saverne Equipements' },
        { code: 'P-24-T-01', name: 'xSO Saverne - shelter' },
        { code: 'P-23-T-18', name: 'SOp - Métal Précommande 2' },
        { code: 'P-23-T-17', name: 'SOp - Metal - précommande 1' },
    ];

    projectCodes.forEach(({ code, name }) => {
        const option = new Option(`${code} : ${name}`, code);
        projectCodeSelect.add(option);
    });

    projectCodeSelect.addEventListener('change', function () {
        const selectedOption = projectCodeSelect.options[projectCodeSelect.selectedIndex];
        projectCodeSelect.value = selectedOption.value; // Garde seulement le code lors de la sélection
    });
}

const form = document.forms['submit-to-google-sheet'];
const messageStatus = document.getElementById("msg");

form.addEventListener('submit', e => {
    e.preventDefault();
    console.log("Form submitted");

    const date = document.getElementById('date').value;
    const startTime = document.getElementById('start-time').value;
    const endTime = document.getElementById('end-time').value;

    if (date && startTime && endTime) {
        const formattedStartTime = formatDateAndTime(date, startTime);
        const formattedEndTime = formatDateAndTime(date, endTime);

        const formData = new FormData(form);
        formData.set('Début', formattedStartTime);
        formData.set('Fin', formattedEndTime);

        fetch('https://script.google.com/macros/s/AKfycbxSJSF7Q2CjPSKnNI3LMny8Tc9fy28GzG04KHgAKwgAFbQ0TGm_JZ4NjQ4Xpw2Ajeji4g/exec', { method: 'POST', body: formData })
            .then(response => {
                console.log("Form sent successfully", response);
                messageStatus.innerHTML = "Message envoyé avec succès !"
                setTimeout(function () {
                    messageStatus.innerHTML = ""
                }, 1000)
                form.reset();
                // Réinitialiser les valeurs
                if (currentUser) {
                    document.getElementById('worker-name').value = currentUser.fullName;
                    document.getElementById('worker-code').value = currentUser.code;
                    document.getElementById('include').value = '1';
                    document.getElementById('planned-duration').value = '3,5';
                }
            })
            .catch(error => {
                console.error('Error!', error.message);
                messageStatus.innerHTML = "Erreur lors de l'envoi du message."
            });
    } else {
        messageStatus.innerHTML = "Veuillez remplir tous les champs requis.";
    }
});

function logout() {
    document.getElementById('login-container').style.display = 'block';
    document.getElementById('pointage-container').style.display = 'none';
    document.getElementById('login-form').reset();
    document.getElementById('error-message').innerText = '';
    currentUser = null;
}