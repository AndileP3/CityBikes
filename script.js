// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } 
    from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } 
    from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCNL43XZofpLfWlnWW-0suoLbYL4QzD0CA",
    authDomain: "bike-system-bb362.firebaseapp.com",
    projectId: "bike-system-bb362",
    storageBucket: "bike-system-bb362.appspot.com",
    messagingSenderId: "910355578427",
    appId: "1:910355578427:web:ca8a4931dc89b9664ce61e",
    measurementId: "G-XNRSFGYYGX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Switch between screens
window.switchScreen = function(screen) {
    document.getElementById('signin').classList.add('hidden');
    document.getElementById('signup').classList.add('hidden');
    document.getElementById('forgot-password').classList.add('hidden');
    document.getElementById('signout').classList.add('hidden');
    document.getElementById(screen).classList.remove('hidden');
}

// Sign Up Function (Stores User in Firestore)
window.signUp = async function () {
    const name = document.getElementById("new-username").value;
    const email = document.getElementById("new-email").value;
    const password = document.getElementById("new-password").value;

    if (!name || !email || !password) {
        alert("Please fill in all fields.");
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Store user in Firestore
        await setDoc(doc(db, "users", user.uid), {
            name: name,
            email: email
        });

        
        alert("Account created successfully! You can now log in.");
        switchScreen('signin');
    } catch (error) {
        alert(error.message);
    }
};

// Sign In Function (Fetches user data from Firestore)
window.signIn = async function () {
    const email = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));

        if (userDoc.exists()) {
            document.getElementById('user-name').innerText = userDoc.data().name;
        } else {
            document.getElementById('user-name').innerText = email; // Fallback
        }

        switchScreen('signout');
    } catch (error) {
        alert("Invalid credentials: " + error.message);
    }

    
};

// Sign Out Function
window.signOut = function () {
    signOut(auth)
        .then(() => {
            alert("Signed out successfully!");
            switchScreen('signin');
        })
        .catch((error) => {
           // alert(error.message);
        });
};

// Forgot Password Function
window.sendResetLink = function () {
    const email = document.getElementById("email").value;

    sendPasswordResetEmail(auth, email)
        .then(() => {
            alert("Password reset link sent to " + email);
            switchScreen('signin');
        })
        .catch((error) => {
            alert(error.message);
        });
};



/// Home Script code

 // Sample data for the application
 const currentUser = {
    id: 1,
    name: "Andile"
};

const hubs = [
    { id: 1, name: "Central Station", location: "Amsterdam Centraal", totalBikes: 20, availableBikes: 15 },
    { id: 2, name: "Museumplein", location: "Near Rijksmuseum", totalBikes: 15, availableBikes: 3 },
    { id: 3, name: "Leidseplein", location: "Leidse Square", totalBikes: 12, availableBikes: 8 },
    { id: 4, name: "Jordaan District", location: "Haarlemmerstraat", totalBikes: 10, availableBikes: 0 }
];

const bikes = [
   
    { id: 102, hubId: 1, lastInspection: "2023-06-20", nextInspection: "2023-12-20", status: "available" },
    { id: 103, hubId: 1, lastInspection: "2023-04-10", nextInspection: "2023-10-10", status: "available" },
    { id: 201, hubId: 2, lastInspection: "2023-03-01", nextInspection: "2023-09-01", status: "maintenance" },
    { id: 202, hubId: 2, lastInspection: "2023-05-30", nextInspection: "2023-11-30", status: "available" },
    { id: 203, hubId: 2, lastInspection: "2023-01-15", nextInspection: "2023-07-15", status: "available" },
    { id: 301, hubId: 3, lastInspection: "2023-02-28", nextInspection: "2023-08-28", status: "available" },
    { id: 302, hubId: 3, lastInspection: "2022-12-10", nextInspection: "2023-06-10", status: "maintenance" },
    { id: 401, hubId: 4, lastInspection: "2023-04-05", nextInspection: "2023-10-05", status: "reserved" },
    { id: 402, hubId: 4, lastInspection: "2023-03-20", nextInspection: "2023-09-20", status: "maintenance" }
];

const reservations = [
    { id: 1, bikeId: 401, hubId: 4, userId: 1, date: "2023-06-15", time: "10:00", name: "John Doe", status: "active", notes: "" },
    { id: 2, bikeId: 102, hubId: 1, userId: 1, date: "2023-05-20", time: "14:30", name: "John Doe", status: "completed", notes: "" },
    { id: 3, bikeId: 203, hubId: 2, userId: 1, date: "2023-04-10", time: "09:15", name: "John Doe", status: "cancelled", notes: "Change of plans" }
];

const maintenanceLogs = [];

// DOM Elements
const userNameElement = document.getElementById('user-name');
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');
const hubsContainer = document.getElementById('hubs-container');
const reserveHubSelect = document.getElementById('reserve-hub');
const reserveBikeSelect = document.getElementById('reserve-bike');
const reserveDateInput = document.getElementById('reserve-date');
const reserveTimeInput = document.getElementById('reserve-time');
const reserveNameInput = document.getElementById('reserve-name');
const submitReservationBtn = document.getElementById('submit-reservation');
const reservationResult = document.getElementById('reservation-result');
const currentReservationContainer = document.getElementById('current-reservation-container');
const reservationHistory = document.getElementById('reservation-history');
const maintenanceList = document.getElementById('maintenance-list');
const maintenanceBikeSelect = document.getElementById('maintenance-bike');
const maintenanceNotesInput = document.getElementById('maintenance-notes');
const submitMaintenanceBtn = document.getElementById('submit-maintenance');
const newBikeHubSelect = document.getElementById('new-bike-hub');
const newBikeIdInput = document.getElementById('new-bike-id');
const addBikeBtn = document.getElementById('add-bike');
const removeBikeSelect = document.getElementById('remove-bike');
const removeBikeBtn = document.getElementById('remove-bike-btn');
const reservationModal = document.getElementById('reservation-modal');
const confirmModal = document.getElementById('confirm-modal');
const closeModalBtns = document.querySelectorAll('.close-modal');
const closeReservationModalBtn = document.getElementById('close-reservation-modal');
const reservationDetails = document.getElementById('reservation-details');
const confirmTitle = document.getElementById('confirm-title');
const confirmMessage = document.getElementById('confirm-message');
const confirmActionBtn = document.getElementById('confirm-action');
const cancelActionBtn = document.getElementById('cancel-action');
const confirmNotesContainer = document.getElementById('confirm-notes-container');
const cancelNotesInput = document.getElementById('cancel-notes');

// Set current user name
userNameElement.textContent = currentUser.name;
reserveNameInput.value = currentUser.name;

// Set minimum date for reservation (today)
const today = new Date().toISOString().split('T')[0];
reserveDateInput.min = today;

// Tab switching functionality
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs and contents
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding content
        tab.classList.add('active');
        const tabId = tab.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
        
        // Refresh relevant data when switching tabs
        if (tabId === 'reserve') {
            updateCurrentReservation();
        } else if (tabId === 'history') {
            updateReservationHistory();
        } else if (tabId === 'maintenance') {
            updateMaintenanceList();
            updateMaintenanceBikeSelect();
        } else if (tabId === 'manage') {
            updateRemoveBikeSelect();
            initializeHubSelect(newBikeHubSelect);
        }
    });
});

// Initialize the hub cards
function initializeHubCards() {
    hubsContainer.innerHTML = '';
    
    hubs.forEach(hub => {
        const hubBikes = bikes.filter(bike => bike.hubId === hub.id);
        const availableBikes = hubBikes.filter(bike => bike.status === 'available').length;
        
        const hubCard = document.createElement('div');
        hubCard.className = 'hub-card';
        
        let availabilityClass = 'available';
        if (availableBikes === 0) {
            availabilityClass = 'unavailable';
        } else if (availableBikes <= 3) {
            availabilityClass = 'low-availability';
        }
        
        hubCard.innerHTML = `
            <h3 class="hub-name">${hub.name}</h3>
            <p class="hub-location">${hub.location}</p>
            <p class="bike-count ${availabilityClass}">${availableBikes} of ${hubBikes.length} bicycles available</p>
            <button class="btn" data-hub-id="${hub.id}">View Bicycles</button>
        `;
        
        hubsContainer.appendChild(hubCard);
    });
    
    // Add event listeners to view bicycles buttons
    document.querySelectorAll('.hub-card button').forEach(button => {
        button.addEventListener('click', () => {
            const hubId = parseInt(button.getAttribute('data-hub-id'));
            viewBicyclesAtHub(hubId);
        });
    });
}

// View bicycles at a specific hub
// Modify the viewBicyclesAtHub function to include a report button
function viewBicyclesAtHub(hubId) {
    const hub = hubs.find(h => h.id === hubId);
    const hubBikes = bikes.filter(bike => bike.hubId === hubId);
    
    let bikesHtml = '<h3>Bicycles at ' + hub.name + '</h3><ul>';
    
    hubBikes.forEach(bike => {
        let statusBadge;
        if (bike.status === 'available') {
            statusBadge = '<span style="color:green">(Available)</span>';
        } else if (bike.status === 'reserved') {
            statusBadge = '<span style="color:orange">(Reserved)</span>';
        } else {
            statusBadge = '<span style="color:red">(Maintenance)</span>';
        }
        
        bikesHtml += `
            <li>
                Bicycle #${bike.id} ${statusBadge}
                ${bike.status === 'available' ? 
                    `<button class="btn btn-secondary btn-sm" data-bike-id="${bike.id}" style="margin-left:10px; padding:2px 5px;">Report Issue</button>` : 
                    ''}
            </li>`;
    });
    
    bikesHtml += '</ul>';
    
    reservationResult.innerHTML = bikesHtml;
    
    // Add event listeners to report buttons
    document.querySelectorAll('#reservation-result button').forEach(button => {
        button.addEventListener('click', (e) => {
            const bikeId = parseInt(e.target.getAttribute('data-bike-id'));
            showReportModal(bikeId);
        });
    });
    
    // Switch to reservation tab
    tabs.forEach(t => t.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));
    
    document.querySelector('.tab[data-tab="reserve"]').classList.add('active');
    document.getElementById('reserve').classList.add('active');
    
    // Set the hub in the reservation form
    reserveHubSelect.value = hubId;
    updateBikeSelect();
}

// Add a function to show the report modal
function showReportModal(bikeId) {
    confirmTitle.textContent = 'Report Maintenance Issue';
    confirmMessage.textContent = `Please describe the issue with bicycle #${bikeId}:`;
    confirmNotesContainer.style.display = 'block';
    cancelNotesInput.placeholder = 'Enter issue description';
    cancelNotesInput.value = '';
    
    showConfirmModal(() => {
        const description = cancelNotesInput.value.trim();
        if (!description) {
            alert('Please enter a description of the issue');
            return;
        }
        
        // Find the bike and mark it for maintenance
        const bikeIndex = bikes.findIndex(b => b.id === bikeId);
        if (bikeIndex !== -1) {
            bikes[bikeIndex].status = 'maintenance';
            
            // Update hub availability if needed
            const hub = hubs.find(h => h.id === bikes[bikeIndex].hubId);
            if (hub) {
                hub.availableBikes -= 1;
            }
            
            // Add to maintenance logs
            maintenanceLogs.push({
                bikeId,
                date: new Date().toISOString().split('T')[0],
                notes: `Reported issue: ${description}`
            });
            
            alert(`Bicycle #${bikeId} has been reported for maintenance`);
            
            // Update displays
            initializeHubCards();
            updateMaintenanceList();
            updateMaintenanceBikeSelect();
        }
    });
}
// Initialize hub select dropdown
function initializeHubSelect(selectElement) {
    selectElement.innerHTML = '<option value="">-- Select a hub --</option>';
    
    hubs.forEach(hub => {
        const option = document.createElement('option');
        option.value = hub.id;
        option.textContent = `${hub.name} (${hub.location})`;
        selectElement.appendChild(option);
    });
}

// Update bike select based on selected hub
function updateBikeSelect() {
    const hubId = parseInt(reserveHubSelect.value);
    
    if (!hubId) {
        reserveBikeSelect.innerHTML = '<option value="">-- Select a hub first --</option>';
        reserveBikeSelect.disabled = true;
        return;
    }
    
    const hubBikes = bikes.filter(bike => 
        bike.hubId === hubId && bike.status === 'available'
    );
    
    if (hubBikes.length === 0) {
        reserveBikeSelect.innerHTML = '<option value="">No available bicycles at this hub</option>';
        reserveBikeSelect.disabled = true;
    } else {
        reserveBikeSelect.innerHTML = '<option value="">-- Select a bicycle --</option>';
        hubBikes.forEach(bike => {
            const option = document.createElement('option');
            option.value = bike.id;
            option.textContent = `Bicycle #${bike.id}`;
            reserveBikeSelect.appendChild(option);
        });
        reserveBikeSelect.disabled = false;
    }
}

// Update current reservation display
function updateCurrentReservation() {
    const activeReservation = reservations.find(r => 
        r.userId === currentUser.id && r.status === 'active'
    );
    
    currentReservationContainer.innerHTML = '';
    
    if (activeReservation) {
        const hub = hubs.find(h => h.id === activeReservation.hubId);
        const bike = bikes.find(b => b.id === activeReservation.bikeId);
        
        const reservationDiv = document.createElement('div');
        reservationDiv.className = 'current-reservation';
        reservationDiv.innerHTML = `
            <h3>Your Current Reservation</h3>
            <p><strong>Reservation ID:</strong> #${activeReservation.id}</p>
            <p><strong>Bicycle:</strong> #${bike.id}</p>
            <p><strong>Hub:</strong> ${hub.name}</p>
            <p><strong>Date:</strong> ${activeReservation.date} at ${activeReservation.time}</p>
            <button class="btn btn-danger" id="cancel-reservation" data-reservation-id="${activeReservation.id}">Cancel Reservation</button>
        `;
        
        currentReservationContainer.appendChild(reservationDiv);
        
        // Add event listener to cancel button
        document.getElementById('cancel-reservation').addEventListener('click', (e) => {
            const reservationId = parseInt(e.target.getAttribute('data-reservation-id'));
            showCancelConfirmation(reservationId);
        });
    } else {
        const noReservationDiv = document.createElement('div');
        noReservationDiv.className = 'no-reservation';
        noReservationDiv.textContent = 'You currently have no active reservations.';
        currentReservationContainer.appendChild(noReservationDiv);
    }
}

// Update reservation history
function updateReservationHistory() {
    const userReservations = reservations.filter(r => r.userId === currentUser.id);
    
    if (userReservations.length === 0) {
        reservationHistory.innerHTML = `
            <tr>
                <td colspan="6">You have no reservation history</td>
            </tr>
        `;
        return;
    }
    
    reservationHistory.innerHTML = '';
    
    userReservations.forEach(reservation => {
        const hub = hubs.find(h => h.id === reservation.hubId);
        const bike = bikes.find(b => b.id === reservation.bikeId);
        
        let statusBadge;
        if (reservation.status === 'active') {
            statusBadge = '<span class="status-active">Active</span>';
        } else if (reservation.status === 'completed') {
            statusBadge = '<span class="status-completed">Completed</span>';
        } else {
            statusBadge = '<span class="status-cancelled">Cancelled</span>';
        }
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${reservation.id}</td>
            <td>#${bike.id}</td>
            <td>${hub.name}</td>
            <td>${reservation.date} ${reservation.time}</td>
            <td>${statusBadge}</td>
            <td>
                ${reservation.status === 'active' ? 
                    `<button class="btn btn-danger btn-sm" data-reservation-id="${reservation.id}">Cancel</button>` : 
                    ''}
            </td>
        `;
        
        reservationHistory.appendChild(row);
        
        // Add event listener to cancel button if present
        const cancelBtn = row.querySelector('button');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', (e) => {
                const reservationId = parseInt(e.target.getAttribute('data-reservation-id'));
                showCancelConfirmation(reservationId);
            });
        }
    });
}

// Show cancellation confirmation dialog
function showCancelConfirmation(reservationId) {
    confirmTitle.textContent = 'Cancel Reservation';
    confirmMessage.textContent = 'Are you sure you want to cancel this reservation?';
    confirmNotesContainer.style.display = 'block';
    cancelNotesInput.value = '';
    
    showConfirmModal(() => {
        cancelReservation(reservationId, cancelNotesInput.value.trim());
    });
}

// Cancel a reservation
function cancelReservation(reservationId, notes) {
    const reservationIndex = reservations.findIndex(r => r.id === reservationId);
    
    if (reservationIndex !== -1) {
        // Update reservation status
        reservations[reservationIndex].status = 'cancelled';
        reservations[reservationIndex].notes = notes;
        
        // Find the bike and make it available again
        const bikeId = reservations[reservationIndex].bikeId;
        const bikeIndex = bikes.findIndex(b => b.id === bikeId);
        
        if (bikeIndex !== -1) {
            bikes[bikeIndex].status = 'available';
        }
        
        // Update displays
        updateCurrentReservation();
        updateReservationHistory();
        initializeHubCards();
        
        alert('Reservation has been cancelled');
    }
}

// Handle reservation submission
function handleReservationSubmit() {
    // Check if user already has an active reservation
    const hasActiveReservation = reservations.some(r => 
        r.userId === currentUser.id && r.status === 'active'
    );
    
    if (hasActiveReservation) {
        alert('You already have an active reservation. Please cancel it before making a new one.');
        return;
    }
    
    const hubId = parseInt(reserveHubSelect.value);
    const bikeId = parseInt(reserveBikeSelect.value);
    const date = reserveDateInput.value;
    const time = reserveTimeInput.value;
    const name = reserveNameInput.value.trim();
    
    if (!hubId || !bikeId || !date || !time || !name) {
        alert('Please fill in all fields');
        return;
    }
    
    // Find the bike and update its status
    const bikeIndex = bikes.findIndex(b => b.id === bikeId);
    if (bikeIndex !== -1) {
        bikes[bikeIndex].status = 'reserved';
    }
    
    // Create reservation
    const reservation = {
        id: reservations.length + 1,
        bikeId,
        hubId,
        userId: currentUser.id,
        date,
        time,
        name,
        status: 'active',
        notes: ''
    };
    
    reservations.push(reservation);
    
    // Show confirmation
    showReservationConfirmation(reservation);
    
    // Reset form
    reserveHubSelect.value = '';
    reserveBikeSelect.innerHTML = '<option value="">-- Select a hub first --</option>';
    reserveBikeSelect.disabled = true;
    reserveDateInput.value = '';
    reserveTimeInput.value = '';
    
    // Update displays
    updateCurrentReservation();
    updateReservationHistory();
    initializeHubCards();
}

// Show reservation confirmation modal
function showReservationConfirmation(reservation) {
    const hub = hubs.find(h => h.id === reservation.hubId);
    const bike = bikes.find(b => b.id === reservation.bikeId);
    
    reservationDetails.innerHTML = `
        <p><strong>Reservation ID:</strong> #${reservation.id}</p>
        <p><strong>Bicycle:</strong> #${bike.id}</p>
        <p><strong>Hub:</strong> ${hub.name}</p>
        <p><strong>Date:</strong> ${reservation.date} at ${reservation.time}</p>
        <p><strong>Reserved by:</strong> ${reservation.name}</p>
    `;
    
    reservationModal.style.display = 'flex';
}

// Update maintenance list
function updateMaintenanceList() {
    maintenanceList.innerHTML = '';
    
    // Find bikes due for inspection (within next 7 days)
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    
    const bikesDueForInspection = bikes.filter(bike => {
        const nextInspectionDate = new Date(bike.nextInspection);
        return nextInspectionDate <= nextWeek;
    });
    
    if (bikesDueForInspection.length === 0) {
        maintenanceList.innerHTML = '<tr><td colspan="6">No bicycles currently due for inspection</td></tr>';
        return;
    }
    
    bikesDueForInspection.forEach(bike => {
        const hub = hubs.find(h => h.id === bike.hubId);
        const status = bike.status === 'maintenance' ? 
            '<span class="status-completed">In Maintenance</span>' : 
            '<span class="status-pending">Due for Inspection</span>';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${bike.id}</td>
            <td>${hub.name}</td>
            <td>${bike.lastInspection}</td>
            <td>${bike.nextInspection}</td>
            <td>${status}</td>
            <td><button class="btn btn-secondary" data-bike-id="${bike.id}">Mark Serviced</button></td>
        `;
        
        maintenanceList.appendChild(row);
    });
    
    // Add event listeners to mark serviced buttons
    document.querySelectorAll('#maintenance-list button').forEach(button => {
        button.addEventListener('click', () => {
            const bikeId = parseInt(button.getAttribute('data-bike-id'));
            maintenanceBikeSelect.value = bikeId;
        });
    });
}

// Update maintenance bike select
function updateMaintenanceBikeSelect() {
    maintenanceBikeSelect.innerHTML = '<option value="">-- Select a bicycle --</option>';
    
    bikes.forEach(bike => {
        if (bike.status === 'maintenance') {
            const option = document.createElement('option');
            option.value = bike.id;
            option.textContent = `Bicycle #${bike.id}`;
            maintenanceBikeSelect.appendChild(option);
        }
    });
}

// Update remove bike select
function updateRemoveBikeSelect() {
    removeBikeSelect.innerHTML = '<option value="">-- Select a bicycle --</option>';
    
    bikes.forEach(bike => {
        const option = document.createElement('option');
        option.value = bike.id;
        option.textContent = `Bicycle #${bike.id} (Hub: ${hubs.find(h => h.id === bike.hubId).name})`;
        removeBikeSelect.appendChild(option);
    });
}

// Handle maintenance submission
function handleMaintenanceSubmit() {
    const bikeId = parseInt(maintenanceBikeSelect.value);
    const notes = maintenanceNotesInput.value.trim();
    
    if (!bikeId) {
        alert('Please select a bicycle');
        return;
    }
    
    // Find the bike and update its status and inspection dates
    const bikeIndex = bikes.findIndex(b => b.id === bikeId);
    if (bikeIndex !== -1) {
        const bike = bikes[bikeIndex];
        
        // Update last inspection date to today
        const today = new Date().toISOString().split('T')[0];
        bike.lastInspection = today;
        
        // Set next inspection to 6 months from now
        const nextInspection = new Date();
        nextInspection.setMonth(nextInspection.getMonth() + 6);
        bike.nextInspection = nextInspection.toISOString().split('T')[0];
        
        // Set status to available
        bike.status = 'available';
        
        // Add to maintenance logs
        maintenanceLogs.push({
            bikeId,
            date: today,
            notes
        });
        
        alert(`Bicycle #${bikeId} has been marked as serviced and is now available`);
        
        // Reset form
        maintenanceBikeSelect.value = '';
        maintenanceNotesInput.value = '';
        
        // Update lists
        updateMaintenanceList();
        updateMaintenanceBikeSelect();
        initializeHubCards();
    }
}

// Handle adding a new bike
function handleAddBike() {
    const hubId = parseInt(newBikeHubSelect.value);
    const bikeId = parseInt(newBikeIdInput.value);
    
    if (!hubId || !bikeId) {
        alert('Please fill in all fields');
        return;
    }
    
    // Check if bike ID already exists
    if (bikes.some(b => b.id === bikeId)) {
        alert('A bicycle with this ID already exists');
        return;
    }
    
    // Get current date for inspection dates
    const today = new Date().toISOString().split('T')[0];
    const nextInspection = new Date();
    nextInspection.setMonth(nextInspection.getMonth() + 6);
    const nextInspectionDate = nextInspection.toISOString().split('T')[0];
    
    // Add new bike
    const newBike = {
        id: bikeId,
        hubId,
        lastInspection: today,
        nextInspection: nextInspectionDate,
        status: 'available'
    };
    
    bikes.push(newBike);
    
    // Update hub bike count
    const hub = hubs.find(h => h.id === hubId);
    if (hub) {
        hub.totalBikes += 1;
        hub.availableBikes += 1;
    }
    
    alert(`Bicycle #${bikeId} has been added to the system`);
    
    // Reset form
    newBikeHubSelect.value = '';
    newBikeIdInput.value = '';
    
    // Update displays
    initializeHubCards();
    updateRemoveBikeSelect();
    updateMaintenanceList();
}

// Handle removing a bike
function handleRemoveBike() {
    const bikeId = parseInt(removeBikeSelect.value);
    
    if (!bikeId) {
        alert('Please select a bicycle to remove');
        return;
    }
    
    // Check if bike is currently reserved
    const isReserved = reservations.some(r => 
        r.bikeId === bikeId && r.status === 'active'
    );
    
    if (isReserved) {
        alert('This bicycle is currently reserved and cannot be removed');
        return;
    }
    
    confirmTitle.textContent = 'Remove Bicycle';
    confirmMessage.textContent = `Are you sure you want to permanently remove bicycle #${bikeId}?`;
    confirmNotesContainer.style.display = 'none';
    
    showConfirmModal(() => {
        // Find bike index
        const bikeIndex = bikes.findIndex(b => b.id === bikeId);
        
        if (bikeIndex !== -1) {
            const bike = bikes[bikeIndex];
            
            // Update hub bike count
            const hub = hubs.find(h => h.id === bike.hubId);
            if (hub) {
                hub.totalBikes -= 1;
                if (bike.status === 'available') {
                    hub.availableBikes -= 1;
                }
            }
            
            // Remove bike
            bikes.splice(bikeIndex, 1);
            
            alert(`Bicycle #${bikeId} has been removed from the system`);
            
            // Update displays
            initializeHubCards();
            updateRemoveBikeSelect();
            updateMaintenanceList();
        }
    });
}

// Show confirmation modal
function showConfirmModal(confirmCallback) {
    confirmActionBtn.onclick = () => {
        confirmCallback();
        confirmModal.style.display = 'none';
    };
    
    cancelActionBtn.onclick = () => {
        confirmModal.style.display = 'none';
    };
    
    confirmModal.style.display = 'flex';
}

// Modal close functionality
function closeModal() {
    reservationModal.style.display = 'none';
    confirmModal.style.display = 'none';
}

// Event listeners
submitReservationBtn.addEventListener('click', handleReservationSubmit);
submitMaintenanceBtn.addEventListener('click', handleMaintenanceSubmit);
addBikeBtn.addEventListener('click', handleAddBike);
removeBikeBtn.addEventListener('click', handleRemoveBike);
closeModalBtns.forEach(btn => btn.addEventListener('click', closeModal));
closeReservationModalBtn.addEventListener('click', closeModal);
window.addEventListener('click', (e) => {
    if (e.target === reservationModal || e.target === confirmModal) {
        closeModal();
    }
});

// Initialize the application
initializeHubCards();
initializeHubSelect(reserveHubSelect);
reserveHubSelect.addEventListener('change', updateBikeSelect);
updateCurrentReservation();
updateReservationHistory();
updateMaintenanceList();
updateMaintenanceBikeSelect();
initializeHubSelect(newBikeHubSelect);
updateRemoveBikeSelect();
