// script.js

const users = {
    benjamin: { password: 'BenMSM12', fullName: 'Benjamin Corbeau', code: 'IT00012' },
    bruno: { password: 'BrunoMSM05', fullName: 'Bruno Minier', code: 'IT00005' },
    corentin: { password: 'CorentinMSM04', fullName: 'Corentin Damange', code: 'IT00004' },
    damien: { password: 'DamienMSM03', fullName: 'Damien Corbeau', code: 'IT00003' },
    quentin: { password: 'QuentinMSM07', fullName: 'Quentin Boursaud', code: 'IT00007' },
    john: { password: 'JohnMSM28', fullName: 'John Coutant', code: 'IT00028' },
    archimed: { password: 'ArchimedMSM13', fullName: 'Archimed Imane', code: 'IT00013' },
};

let currentUser = null;

document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value.toLowerCase();
    const password = document.getElementById('password').value;

    if (users[username] && users[username].password === password) {
        // Connexion réussie
        currentUser = users[username];
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('pointage-container').style.display = 'block';
        document.getElementById('worker-name').value = currentUser.fullName; // Remplir automatiquement le nom complet
        document.getElementById('worker-code').value = currentUser.code; // Remplir automatiquement le code intervenant
        document.getElementById('include').value = '1'; // Valeur par défaut
        document.getElementById('planned-duration').value = '3,5'; // Valeur par défaut
        populateTimeOptions(); // Générer les options de temps
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

    const startTimes = generateTimeOptions(5, 0, 15, 0, 15);
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

document.getElementById('pointage-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const workerName = document.getElementById('worker-name').value;
    const workDate = document.getElementById('date').value;
    const startTime = document.getElementById('start-time').value;
    const endTime = document.getElementById('end-time').value;
    const workerCode = document.getElementById('worker-code').value;
    const materialCode = document.getElementById('material-code').value;
    const durationDone = document.getElementById('duration-done').value;
    const projectCode = document.getElementById('project-code').value;
    const includeCost = document.getElementById('include').value;
    const notes = document.getElementById('notes').value;
    const plannedDuration = document.getElementById('planned-duration').value;

    const formData = new FormData();
    formData.append('workerName', workerName);
    formData.append('date', workDate);
    formData.append('startTime', startTime);
    formData.append('endTime', endTime);
    formData.append('workerCode', workerCode);
    formData.append('materialCode', materialCode);
    formData.append('durationDone', durationDone);
    formData.append('projectCode', projectCode);
    formData.append('include', includeCost);
    formData.append('notes', notes);
    formData.append('plannedDuration', plannedDuration);

    fetch('/submit', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('msg').innerText = data.message;
        setTimeout(() => document.getElementById('msg').innerText = '', 5000);
        this.reset();
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
        document.getElementById('msg').innerText = 'Erreur lors de l\'enregistrement des données.';
    });
});

function logout() {
    document.getElementById('login-container').style.display = 'block';
    document.getElementById('pointage-container').style.display = 'none';
    document.getElementById('login-form').reset();
    document.getElementById('error-message').innerText = '';
    currentUser = null;
}
