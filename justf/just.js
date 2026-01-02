// Prize data with specific icons
const prizes = [
    { name: "iPhone 14 Pro Max", icon: "fas fa-mobile-alt", color: "#007AFF", imgClass: "phone-img" },
    { name: "MacBook Pro", icon: "fas fa-laptop", color: "#555555", imgClass: "laptop-img" },
    { name: "$500 Gift Card", icon: "fas fa-credit-card", color: "#FF9500", imgClass: "card-img" },
    { name: "PlayStation 5", icon: "fas fa-gamepad", color: "#003087", imgClass: "gamepad-img" },
    { name: "AirPods Pro", icon: "fas fa-headphones", color: "#A2AAAD", imgClass: "headphone-img" },
    { name: "Nike Sneakers", icon: "fas fa-shoe-prints", color: "#DD052B", imgClass: "shoe-img" },
    { name: "DJI Drone", icon: "fas fa-drone", color: "#000000", imgClass: "drone-img" },
    { name: "Gucci Watch", icon: "fas fa-clock", color: "#0F0F0F", imgClass: "watch-img" },
    { name: "Netflix 1 Year", icon: "fas fa-film", color: "#E50914", imgClass: "netflix-img" },
    { name: "GoPro Hero", icon: "fas fa-camera", color: "#00B3FF", imgClass: "camera-img" },
    { name: "Amazon Echo", icon: "fas fa-microphone-alt", color: "#00BFFF", imgClass: "echo-img" },
    { name: "Better Luck", icon: "fas fa-sad-tear", color: "#888888", imgClass: "sad-img" }
];

// Game state
let spinsLeft = 3;
let isSpinning = false;
let currentPrizeIndex = -1;
let wheelRotation = 0;

// DOM elements
const wheel = document.getElementById('wheel');
const spinBtn = document.getElementById('spin-btn');
const spinsCount = document.getElementById('spins-count');
const prizeText = document.getElementById('prize-text');
const prizeIcon = document.getElementById('prize-icon');
const winModal = document.getElementById('win-modal');
const modalPrize = document.getElementById('modal-prize');
const claimNowBtn = document.getElementById('claim-now-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const timerElement = document.getElementById('timer');
const prizesGrid = document.querySelector('.prizes-grid');

// Initialize the game
function initGame() {
    createWheel();
    createPrizeList();
    updateSpins();
    startTimer(300); // 5 minute timer
    setupEventListeners();
}

// Create the wheel segments with prize images
function createWheel() {
    wheel.innerHTML = '';
    const segmentAngle = 360 / prizes.length;
    
    prizes.forEach((prize, index) => {
        const segment = document.createElement('div');
        segment.className = 'wheel-segment';
        segment.style.position = 'absolute';
        segment.style.width = '50%';
        segment.style.height = '50%';
        segment.style.transformOrigin = '100% 100%';
        segment.style.transform = `rotate(${index * segmentAngle}deg)`;
        segment.style.overflow = 'hidden';
        
        const segmentContent = document.createElement('div');
        segmentContent.style.position = 'absolute';
        segmentContent.style.left = '-100%';
        segmentContent.style.width = '200%';
        segmentContent.style.height = '200%';
        segmentContent.style.transformOrigin = '50% 50%';
        segmentContent.style.transform = `rotate(${segmentAngle / 2}deg)`;
        segmentContent.style.textAlign = 'center';
        segmentContent.style.paddingTop = '15px';
        segmentContent.style.color = 'white';
        segmentContent.style.fontWeight = '600';
        segmentContent.style.fontSize = '12px';
        
        // Alternate colors for visual appeal
        const colorIndex = index % 3;
        const colors = ['#FF0080', '#8000FF', '#0080FF'];
        segmentContent.style.backgroundColor = colors[colorIndex];
        
        // Add prize image/icon with special styling
        segmentContent.innerHTML = `
            <div class="wheel-prize-img ${prize.imgClass}">
                <i class="${prize.icon}"></i>
            </div>
            <div class="wheel-prize-name">${prize.name}</div>
        `;
        
        segment.appendChild(segmentContent);
        wheel.appendChild(segment);
    });
}

// Create the prize list display with images
function createPrizeList() {
    prizesGrid.innerHTML = '';
    
    prizes.forEach((prize, index) => {
        const prizeItem = document.createElement('div');
        prizeItem.className = 'prize-item';
        prizeItem.dataset.index = index;
        
        prizeItem.innerHTML = `
            <div class="prize-img-container ${prize.imgClass}">
                <i class="${prize.icon}"></i>
            </div>
            <div class="prize-name">${prize.name}</div>
        `;
        
        prizesGrid.appendChild(prizeItem);
    });
}

// Update spins display
function updateSpins() {
    spinsCount.textContent = spinsLeft;
    
    if (spinsLeft === 0) {
        spinBtn.disabled = true;
        spinBtn.style.opacity = '0.6';
        spinBtn.innerHTML = '<i class="fas fa-lock"></i> NO MORE SPINS';
    } else {
        spinBtn.disabled = false;
        spinBtn.style.opacity = '1';
    }
}

// Spin the wheel
function spinWheel() {
    if (isSpinning || spinsLeft <= 0) return;
    
    isSpinning = true;
    spinsLeft--;
    updateSpins();
    
    // Randomly select a prize (with a higher chance for less valuable prizes)
    let randomValue = Math.random();
    if (randomValue < 0.3) {
        currentPrizeIndex = 11; // Better Luck Next Time
    } else if (randomValue < 0.6) {
        // Middle tier prizes
        currentPrizeIndex = Math.floor(Math.random() * 6) + 5;
    } else {
        // Top tier prizes
        currentPrizeIndex = Math.floor(Math.random() * 5);
    }
    
    // Calculate the rotation for the selected prize
    const segmentAngle = 360 / prizes.length;
    // Position the selected prize at the top (pointer position)
    // Add multiple full rotations plus the specific segment
    const targetRotation = 360 * 5 + (360 - (currentPrizeIndex * segmentAngle)) - (segmentAngle / 2);
    
    // Apply rotation with easing
    wheelRotation += targetRotation;
    wheel.style.transform = `rotate(${wheelRotation}deg)`;
    
    // Reset and highlight the selected prize after spin
    setTimeout(() => {
        isSpinning = false;
        displayPrize(currentPrizeIndex);
        showWinModal();
        
        // Highlight the won prize in the list
        document.querySelectorAll('.prize-item').forEach(item => {
            item.classList.remove('selected');
        });
        document.querySelector(`.prize-item[data-index="${currentPrizeIndex}"]`).classList.add('selected');
    }, 5000);
}

// Display the won prize
function displayPrize(index) {
    const prize = prizes[index];
    prizeText.textContent = prize.name;
    prizeIcon.innerHTML = `<div class="won-prize-img ${prize.imgClass}"><i class="${prize.icon}"></i></div>`;
    prizeIcon.style.color = prize.color;
}

// Show winning modal
function showWinModal() {
    const prize = prizes[currentPrizeIndex];
    modalPrize.textContent = prize.name;
    winModal.style.display = 'flex';
    
    // Add prize image to modal
    const modalImg = document.createElement('div');
    modalImg.className = `modal-prize-img ${prize.imgClass}`;
    modalImg.innerHTML = `<i class="${prize.icon}"></i>`;
    modalPrize.parentNode.insertBefore(modalImg, modalPrize.nextSibling);
    
    document.body.style.overflow = 'hidden';
}

// Close the modal
function closeModal() {
    winModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Remove any modal images
    const modalImgs = document.querySelectorAll('.modal-prize-img');
    modalImgs.forEach(img => img.remove());
}

// Start countdown timer
function startTimer(seconds) {
    let timeLeft = seconds;
    
    const timer = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;
        
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            timerElement.textContent = "00:00";
            timerElement.style.color = "#FF0000";
            // Disable spin button when time runs out
            spinBtn.disabled = true;
            spinBtn.style.opacity = '0.6';
            spinBtn.innerHTML = '<i class="fas fa-clock"></i> TIME EXPIRED';
        } else if (timeLeft <= 60) {
            // Less than a minute left - pulse red
            timerElement.style.color = "#FF0000";
            timerElement.style.animation = "pulse 1s infinite";
        } else if (timeLeft <= 180) {
            // Less than 3 minutes left - turn yellow
            timerElement.style.color = "#FFEB3B";
        }
        
        timeLeft--;
    }, 1000);
}

// Setup event listeners
function setupEventListeners() {
    // Spin button
    spinBtn.addEventListener('click', spinWheel);
    
    // Modal buttons
    claimNowBtn.addEventListener('click', () => {
        alert("CONGRATULATIONS! To claim your prize, complete 3 simple offers!\n\n(.)");
        closeModal();
    });
    
    closeModalBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    winModal.addEventListener('click', (e) => {
        if (e.target === winModal) {
            closeModal();
        }
    });
    
    // Action buttons
    document.querySelector('.claim-btn').addEventListener('click', () => {
        alert("To claim your prize, you need to spin the wheel first!");
    });
    
    document.querySelector('.share-btn').addEventListener('click', () => {
        alert("Share with 5 friends to get an extra spin!");
    });
    
    document.querySelector('.bonus-btn').addEventListener('click', () => {
        if (spinsLeft === 0) {
            spinsLeft = 1;
            updateSpins();
            alert("BONUS SPIN ADDED! You now have 1 more spin!");
        } else {
            alert("You still have spins left! Use them first.");
        }
    });
    
    // Extra buttons
    document.querySelectorAll('.extra-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const btnText = this.textContent.trim();
            alert(`You clicked: ${btnText}\n\nThis feature would require additional steps in a real implementation.`);
        });
    });
    
    // Close modal with escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && winModal.style.display === 'flex') {
            closeModal();
        }
    });
}

// Initialize the game when page loads
window.addEventListener('DOMContentLoaded', initGame);