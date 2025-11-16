// Route configurations
const routeConfigs = {
    route12: {
        name: 'Route 12',
        city: 'Nashik',
        busNumber: 'MH-15-AB-1234',
        stops: ['CBS', 'Dwarka Circle', 'College Road', 'Railway Station'],
        totalTime: 25
    },
    route15: {
        name: 'Route 15',
        city: 'Nashik',
        busNumber: 'MH-15-AB-5678',
        stops: ['Gangapur Road', 'Panchavati', 'College Road', 'Railway Station'],
        totalTime: 30
    },
    route18: {
        name: 'Route 18',
        city: 'Nashik',
        busNumber: 'MH-15-AB-9012',
        stops: ['Nashik Road', 'Trimbakeshwar Temple', 'Gangapur', 'CBS'],
        totalTime: 45
    },
    route7: {
        name: 'Route 7',
        city: 'Raipur',
        busNumber: 'CG-04-AB-3456',
        stops: ['Telibandha', 'Civil Lines', 'Pandri', 'Railway Station'],
        totalTime: 28
    },
    route9: {
        name: 'Route 9',
        city: 'Raipur',
        busNumber: 'CG-04-AB-7890',
        stops: ['Railway Station', 'Civil Lines', 'Shankar Nagar', 'Telibandha'],
        totalTime: 32
    },
    brts1: {
        name: 'BRTS-1',
        city: 'Vadodara',
        busNumber: 'GJ-06-AB-1122',
        stops: ['Railway Station', 'Tower', 'Mandvi', 'Alkapuri'],
        totalTime: 20
    },
    brts4: {
        name: 'BRTS-4',
        city: 'Vadodara',
        busNumber: 'GJ-06-AB-3344',
        stops: ['Station', 'Fatehgunj', 'Waghodia', 'GIDC'],
        totalTime: 35
    },
    route21: {
        name: 'Route 21',
        city: 'Nashik',
        busNumber: 'MH-15-CD-4567',
        stops: ['Nashik Road', 'Bytco Point', 'Deolali Camp', 'Artillery Centre'],
        totalTime: 22
    },
    route10: {
        name: 'Route 10',
        city: 'Nashik',
        busNumber: 'MH-15-EF-8901',
        stops: ['Nimani', 'Panchavati', 'RTO Corner', 'Satpur MIDC'],
        totalTime: 40
    },
    route5: {
        name: 'Route 5',
        city: 'Raipur',
        busNumber: 'CG-04-CD-5678',
        stops: ['AIIMS', 'Tatibandh', 'DDU Nagar', 'Jaistambh Chowk'],
        totalTime: 38
    },
    brts2: {
        name: 'BRTS-2',
        city: 'Vadodara',
        busNumber: 'GJ-06-CD-5566',
        stops: ['Sama', 'Karelibaug', 'Akota', 'Manjalpur'],
        totalTime: 30
    }
};

let currentRouteId = 'route12';

function loadRoute(routeId) {
    const route = routeConfigs[routeId];
    if (!route) return;
    
    currentRouteId = routeId;
    
    // Update simulator UI
    document.getElementById('simulator-title').textContent = `🚌 Live ${route.name} Simulator`;
    document.getElementById('bus-number').textContent = `Bus: ${route.busNumber}`;
    document.getElementById('stop-start').textContent = route.stops[0];
    document.getElementById('stop-end').textContent = route.stops[route.stops.length - 1];
    document.getElementById('current-stop').textContent = route.stops[1] || route.stops[0];

    // Show pink bus indicator if applicable
    const pinkIndicator = document.getElementById('pink-bus-indicator');
    pinkIndicator.style.display = route.type === 'pink' ? 'block' : 'none';
    
    // Open simulator
    if (!simulatorOpen) {
        toggleSimulator();
    }
    
    // Restart simulation with new route
    if (simulatorInterval) {
        clearInterval(simulatorInterval);
    }
    busProgress = 0;
    startSimulator();
    
    showSimulatorMessage(`🎯 Switched to ${route.name} (${route.city})`, 'var(--color-primary)');
}

// Live updating statistics
function updateStats() {
    const busesElement = document.getElementById('buses-tracked');
    const usersElement = document.getElementById('active-users');
    const tickerBusesElements = [document.getElementById('ticker-buses'), document.getElementById('ticker-buses-2')];
    
    // Simulate live bus count changes (456 ± 10)
    const currentBuses = parseInt(busesElement.textContent);
    const newBuses = currentBuses + Math.floor(Math.random() * 5) - 2;
    const finalBuses = Math.max(450, Math.min(465, newBuses));
    busesElement.textContent = finalBuses;
    tickerBusesElements.forEach(el => el.textContent = finalBuses);
    
    // Simulate user count changes (47,238 ± 50)
    const currentUsers = parseInt(usersElement.textContent.replace(',', ''));
    const newUsers = currentUsers + Math.floor(Math.random() * 100) - 50;
    const finalUsers = Math.max(47000, Math.min(48000, newUsers));
    usersElement.textContent = finalUsers.toLocaleString();
    document.getElementById('total-users').textContent = finalUsers.toLocaleString();
}

// Update ETA in ticker
function updateTicker() {
    const etaElements = [document.getElementById('eta-mins'), document.getElementById('eta-mins-2')];
    const randomNameElements = [document.getElementById('random-name'), document.getElementById('random-name-2')];
    const names = ['Priya', 'Rajesh', 'Amit', 'Manpreet', 'Sanjay', 'Neha', 'Vikram'];
    
    etaElements.forEach(el => {
        const currentETA = parseInt(el.textContent);
        el.textContent = currentETA > 1 ? currentETA - 1 : Math.floor(Math.random() * 8) + 3;
    });
    
    if (Math.random() > 0.7) {
        const randomName = names[Math.floor(Math.random() * names.length)];
        randomNameElements.forEach(el => el.textContent = randomName);
    }
}

// Route Simulator Functions
let simulatorOpen = false;
let busProgress = 0;
let simulatorInterval = null;

// Global state for persistent simulator data
if (!window.simulatorState) {
    window.simulatorState = {
        isCheckedIn: false,
        notificationsEnabled: false,
        hasNotified: false
    };
}

function toggleSimulator() {
    simulatorOpen = !simulatorOpen;
    const simulator = document.getElementById('route-simulator');
    simulator.style.display = simulatorOpen ? 'block' : 'none';
    
    if (simulatorOpen && !simulatorInterval) {
        showSimulatorMessage('🚌 Live tracking started for Route 12', 'var(--color-primary)');
        startSimulator();
    } else if (!simulatorOpen && simulatorInterval) {
        clearInterval(simulatorInterval);
        simulatorInterval = null;
    }
}

function closeSimulator() {
    simulatorOpen = false;
    document.getElementById('route-simulator').style.display = 'none';
    if (simulatorInterval) {
        clearInterval(simulatorInterval);
        simulatorInterval = null;
    }
}

function startSimulator() {
    busProgress = 0;
    const route = routeConfigs[currentRouteId];
    const stops = route.stops;
    const stopDistances = stops.map((_, idx) => (idx * 100) / (stops.length - 1));
    let currentStopIndex = 0;
    let eta = Math.ceil(route.totalTime / 2);
    let confidence = 91;
    let passengers = 12;
    let isCheckedIn = false;
    let notificationsEnabled = false;
    let hasNotified = false;

    simulatorInterval = setInterval(() => {
        busProgress += 0.8; // Slower, more realistic movement
        if (busProgress > 100) {
            busProgress = 0;
            currentStopIndex = 0;
            isCheckedIn = false;
            hasNotified = false;
            showSimulatorMessage('🔄 Route completed! Bus starting new journey...', 'var(--color-primary)');
        }
        
        document.getElementById('bus-progress').style.width = busProgress + '%';
        
        // Update current stop with smooth transitions
        const newStopIndex = stopDistances.findIndex((dist, idx) => {
            const nextDist = stopDistances[idx + 1] || 101;
            return busProgress >= dist && busProgress < nextDist;
        });
        
        if (newStopIndex !== -1 && newStopIndex !== currentStopIndex) {
            currentStopIndex = newStopIndex;
            document.getElementById('current-stop').textContent = stops[currentStopIndex];
            
            // Announce stop arrival
            if (currentStopIndex > 0) {
                showSimulatorMessage(`📍 Approaching ${stops[currentStopIndex]}`, 'var(--color-primary)');
            }
        }
        
        // Dynamic ETA calculation based on distance remaining
        const remainingProgress = 100 - busProgress;
        const route = routeConfigs[currentRouteId];
        eta = Math.ceil((remainingProgress / 100) * route.totalTime / 2);
        const etaText = eta === 0 ? 'Arriving...' : eta + ' min' + (eta > 1 ? 's' : '');
        document.getElementById('sim-eta').textContent = etaText;
        
        // Dynamic confidence score with realistic fluctuations
        let baseConfidence = 70 + (busProgress / 4); // Increases as bus progresses
        
        // Bonus confidence from check-ins
        if (isCheckedIn) {
            baseConfidence += 8;
        }
        
        // Random minor fluctuations (±2%)
        baseConfidence += (Math.random() * 4) - 2;
        
        // Traffic/weather simulation (random dips)
        if (Math.random() > 0.95) {
            baseConfidence -= 5;
            showSimulatorMessage('⚠️ Heavy traffic detected - ETA may vary', 'var(--color-warning)');
        }
        
        confidence = Math.min(98, Math.max(68, Math.round(baseConfidence)));
        document.getElementById('sim-confidence').textContent = confidence + '%';
        
        // Color coding for confidence
        let confColor = 'var(--color-error)';
        if (confidence >= 85) confColor = 'var(--color-success)';
        else if (confidence >= 70) confColor = 'var(--color-warning)';
        document.getElementById('sim-confidence').style.color = confColor;
        
        // Realistic crowd level simulation
        // More passengers at peak times, fewer late at night
        const hour = new Date().getHours();
        const isPeakTime = (hour >= 7 && hour <= 10) || (hour >= 17 && hour <= 20);
        
        // Gradual passenger changes
        if (Math.random() > 0.7) {
            if (busProgress % 33 < 3) { // Near stops - people board
                passengers += Math.floor(Math.random() * 4) + (isPeakTime ? 2 : 0);
            } else {
                passengers += Math.floor(Math.random() * 3) - 1;
            }
        }
        
        passengers = Math.max(5, Math.min(45, passengers));
        
        let crowdText = 'Low 🟢';
        let crowdColor = 'var(--color-success)';
        if (passengers > 30) {
            crowdText = 'High 🔴';
            crowdColor = 'var(--color-error)';
        } else if (passengers > 18) {
            crowdText = 'Moderate 🟡';
            crowdColor = 'var(--color-warning)';
        }
        document.getElementById('sim-crowd').textContent = crowdText + ' (' + passengers + '/45)';
        document.getElementById('sim-crowd').style.color = crowdColor;
        
        // Notification system - alert when 5 mins away
        if (notificationsEnabled && !hasNotified && eta <= 5 && eta > 0) {
            hasNotified = true;
            showSimulatorMessage('🔔 Your bus is 5 minutes away! Get ready.', 'var(--color-success)');
            
            // Browser notification if supported
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('YatraTrack Alert', {
                    body: `Bus MH-15-AB-1234 arriving in ${eta} mins at ${stops[currentStopIndex]}`,
                    icon: '🚌'
                });
            }
        }
        
        // Arrival announcement
        if (busProgress >= 99 && busProgress < 100) {
            showSimulatorMessage('🎯 Bus arriving at Railway Station now!', 'var(--color-success)');
        }
        
    }, 1000);
}

function showSimulatorMessage(message, color) {
    const notification = document.getElementById('notification-alert');
    notification.style.display = 'block';
    notification.style.background = 'rgba(var(--color-success-rgb), 0.1)';
    notification.style.borderColor = color;
    notification.style.color = color;
    notification.innerHTML = message;
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.style.display = 'none';
            notification.style.opacity = '1';
        }, 300);
    }, 3500);
}

function checkInPassenger() {
    if (window.simulatorState && window.simulatorState.isCheckedIn) {
        showSimulatorMessage('✓ Already checked in on this route!', 'var(--color-warning)');
        return;
    }
    
    // Update global state
    if (!window.simulatorState) window.simulatorState = {};
    window.simulatorState.isCheckedIn = true;
    
    // Visual feedback
    const btn = event.target;
    btn.style.background = 'var(--color-success)';
    btn.innerHTML = '✓ Checked In';
    btn.disabled = true;
    
    showSimulatorMessage('✓ Checked in successfully! Confidence score +8%. Other passengers will see updated crowd level.', 'var(--color-success)');
    
    // Simulate other passengers seeing the update
    setTimeout(() => {
        showSimulatorMessage('👥 3 other passengers just checked in', 'var(--color-primary)');
    }, 2000);
    
    // Re-enable after route completes
    setTimeout(() => {
        btn.style.background = '';
        btn.innerHTML = 'Check In';
        btn.disabled = false;
        if (window.simulatorState) window.simulatorState.isCheckedIn = false;
    }, 120000); // 2 minutes
}

function toggleNotifications() {
    if (!window.simulatorState) window.simulatorState = {};
    
    const btn = document.getElementById('notif-btn');
    const currentState = window.simulatorState.notificationsEnabled || false;
    
    if (!currentState) {
        // Request browser notification permission
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    activateNotifications();
                } else {
                    showSimulatorMessage('⚠️ Please enable browser notifications for arrival alerts', 'var(--color-warning)');
                }
            });
        } else {
            activateNotifications();
        }
    } else {
        // Disable notifications
        window.simulatorState.notificationsEnabled = false;
        window.simulatorState.hasNotified = false;
        btn.innerHTML = '🔔 Alerts';
        btn.style.background = '';
        showSimulatorMessage('🔕 Arrival alerts disabled', 'var(--color-text-secondary)');
    }
}

function activateNotifications() {
    if (!window.simulatorState) window.simulatorState = {};
    window.simulatorState.notificationsEnabled = true;
    window.simulatorState.hasNotified = false;
    
    const btn = document.getElementById('notif-btn');
    btn.innerHTML = '🔔 Active';
    btn.style.background = 'var(--color-success)';
    showSimulatorMessage('🔔 Arrival alerts enabled! You\'ll be notified when bus is 5 mins away.', 'var(--color-success)');
}

// Dark Mode Toggle
function toggleDarkMode() {
    const html = document.documentElement;
    const currentScheme = html.getAttribute('data-color-scheme');
    
    if (currentScheme === 'dark') {
        html.removeAttribute('data-color-scheme');
        localStorage.setItem('color-scheme', 'light');
    } else {
        html.setAttribute('data-color-scheme', 'dark');
        localStorage.setItem('color-scheme', 'dark');
    }
}

// Load saved theme preference
window.addEventListener('DOMContentLoaded', () => {
    const savedScheme = localStorage.getItem('color-scheme');
    if (savedScheme === 'dark') {
        document.documentElement.setAttribute('data-color-scheme', 'dark');
    }
});

// Scroll to Top Function
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Show/Hide Scroll to Top Button
window.addEventListener('scroll', () => {
    const scrollBtn = document.getElementById('scroll-top-btn');
    if (window.pageYOffset > 300) {
        scrollBtn.style.display = 'block';
    } else {
        scrollBtn.style.display = 'none';
    }
});

// SOS Modal Functions
function triggerSOS() {
    document.getElementById('sos-modal').style.display = 'flex';
}

function closeSOS() {
    const modal = document.getElementById('sos-modal');
    modal.style.display = 'none';
    // Reset to initial state
    document.getElementById('sos-initial').style.display = 'block';
    document.getElementById('sos-confirmed').style.display = 'none';
}

function confirmSOS() {
    document.getElementById('sos-initial').style.display = 'none';
    document.getElementById('sos-confirmed').style.display = 'block';
}
// Update network stats
function updateNetworkStats() {
    const buses = document.getElementById('network-buses');
    const users = document.getElementById('network-users');
    const checkins = document.getElementById('network-checkins');
    const accuracy = document.getElementById('network-accuracy');
    const routes = document.getElementById('network-routes');
    const pings = document.getElementById('network-pings');
    const response = document.getElementById('network-response');
    const uptime = document.getElementById('network-uptime');
    
    // Simulate realistic fluctuations
    buses.textContent = Math.floor(450 + Math.random() * 20);
    users.textContent = (2800 + Math.floor(Math.random() * 100)).toLocaleString();
    checkins.textContent = (1200 + Math.floor(Math.random() * 80)).toLocaleString();
    routes.textContent = Math.floor(40 + Math.random() * 4);
    
    const acc = 91 + Math.random() * 2;
    accuracy.textContent = acc.toFixed(1) + '%';
    accuracy.style.color = acc >= 92 ? 'var(--color-success)' : 'var(--color-warning)';
    
    // GPS pings per minute
    pings.textContent = (1800 + Math.floor(Math.random() * 50)).toLocaleString();
    
    // API response time
    const responseTime = 100 + Math.floor(Math.random() * 40);
    response.textContent = responseTime + 'ms';
    response.style.color = responseTime < 120 ? 'var(--color-success)' : 'var(--color-warning)';
    
    // System uptime
    const uptimePct = 99.1 + Math.random() * 0.2;
    uptime.textContent = uptimePct.toFixed(1) + '%';
    uptime.style.color = uptimePct >= 99.0 ? 'var(--color-success)' : 'var(--color-warning)';
}

// Update stats every 8 seconds
setInterval(updateStats, 8000);

// Update ticker every 3 seconds
setInterval(updateTicker, 3000);

// Update network stats every 5 seconds
setInterval(updateNetworkStats, 5000);
updateNetworkStats(); // Initial call

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Add animation to stats when they come into view
const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '0';
            entry.target.style.transform = 'translateY(20px)';
            setTimeout(() => {
                entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, 100);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card, .city-card, .testimonial-card, .team-card').forEach(card => {
    observer.observe(card);
});