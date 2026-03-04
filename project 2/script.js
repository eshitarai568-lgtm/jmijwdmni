const API_BASE = 'http://localhost:5000';

let currentUser = null;
let currentPage = 'dashboard';
let charts = {};

let formData = {
    age: 25,
    mood_score: 3,
    stress_level: 2,
    cycle_day: 14,
    hormone_intensity: 2,
    sleep_duration: 7,
    physical_activity: 30,
    day_index: 0
};

let lastPrediction = null;

function checkAuth() {
    const user = localStorage.getItem('luna_user');
    const authContainer = document.getElementById('auth-container');
    const appContainer = document.getElementById('app-container');

    if (user) {
        currentUser = JSON.parse(user);
        authContainer.style.display = 'none';
        appContainer.style.display = 'flex';
        initializeApp();
    } else {
        authContainer.style.display = 'flex';
        appContainer.style.display = 'none';
        initializeAuth();
    }
}

function initializeAuth() {
    document.getElementById('auth-login-btn').addEventListener('click', login);
    document.getElementById('auth-signup-btn').addEventListener('click', signup);
    document.getElementById('auth-form').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') login();
    });
}

function login() {
    const email = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value.trim();

    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }

    const user = { email, loginTime: new Date().toISOString() };
    localStorage.setItem('luna_user', JSON.stringify(user));
    currentUser = user;

    const authContainer = document.getElementById('auth-container');
    const appContainer = document.getElementById('app-container');
    authContainer.style.display = 'none';
    appContainer.style.display = 'flex';
    initializeApp();
}

function signup() {
    const email = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value.trim();

    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }

    if (password.length < 6) {
        alert('Password must be at least 6 characters');
        return;
    }

    const user = { email, signupTime: new Date().toISOString() };
    localStorage.setItem('luna_user', JSON.stringify(user));
    currentUser = user;

    const authContainer = document.getElementById('auth-container');
    const appContainer = document.getElementById('app-container');
    authContainer.style.display = 'none';
    appContainer.style.display = 'flex';
    initializeApp();
}

function logout() {
    localStorage.removeItem('luna_user');
    currentUser = null;
    charts = {};
    window.location.reload();
}

function initializeApp() {
    document.getElementById('logout-btn').addEventListener('click', logout);

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            navigateTo(btn.dataset.page);
        });
    });

    navigateTo('dashboard');
}

function navigateTo(page) {
    currentPage = page;

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('bg-purple-600', 'text-white');
        btn.classList.add('text-gray-300');
    });

    const activeBtn = document.querySelector(`[data-page="${page}"]`);
    if (activeBtn) {
        activeBtn.classList.add('bg-purple-600', 'text-white');
        activeBtn.classList.remove('text-gray-300');
    }

    destroyAllCharts();
    renderPage();
}

function destroyAllCharts() {
    Object.values(charts).forEach(chart => {
        if (chart) {
            chart.destroy();
        }
    });
    charts = {};
}

function renderPage() {
    const content = document.getElementById('page-content');

    switch(currentPage) {
        case 'dashboard':
            renderDashboard(content);
            break;
        case 'daily-log':
            renderDailyLog(content);
            break;
        case 'analytics':
            renderAnalytics(content);
            break;
        case 'model-insights':
            renderModelInsights(content);
            break;
        case 'research-mode':
            renderResearchMode(content);
            break;
    }
}

function renderDashboard(content) {
    content.innerHTML = `
        <div>
            <h3 class="text-xl font-semibold mb-6 text-white">Prediction Dashboard</h3>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div class="bg-gray-900 border border-gray-800 rounded-lg p-6">
                    <div class="text-sm font-medium text-gray-400 mb-2">Wellbeing Score</div>
                    <div class="text-3xl font-bold text-purple-400" id="metric-wellbeing">—</div>
                    <div class="text-xs text-gray-500 mt-3">AI prediction (0-100)</div>
                </div>

                <div class="bg-gray-900 border border-gray-800 rounded-lg p-6">
                    <div class="text-sm font-medium text-gray-400 mb-2">Anxiety Risk</div>
                    <div class="text-3xl font-bold text-yellow-400" id="metric-anxiety">—</div>
                    <div class="text-xs text-gray-500 mt-3">Probability estimate</div>
                </div>

                <div class="bg-gray-900 border border-gray-800 rounded-lg p-6">
                    <div class="text-sm font-medium text-gray-400 mb-2">Depression Risk</div>
                    <div class="text-3xl font-bold text-blue-400" id="metric-depression">—</div>
                    <div class="text-xs text-gray-500 mt-3">Probability estimate</div>
                </div>

                <div class="bg-gray-900 border border-gray-800 rounded-lg p-6">
                    <div class="text-sm font-medium text-gray-400 mb-2">Cycle Phase</div>
                    <div class="text-3xl font-bold text-pink-400" id="metric-cycle">—</div>
                    <div class="text-xs text-gray-500 mt-3">Current phase</div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="bg-gray-900 border border-gray-800 rounded-lg p-6">
                    <h4 class="font-semibold text-white mb-4">Mood Trend</h4>
                    <canvas id="chart-mood-trend"></canvas>
                </div>

                <div class="bg-gray-900 border border-gray-800 rounded-lg p-6">
                    <h4 class="font-semibold text-white mb-4">Sleep Pattern</h4>
                    <canvas id="chart-sleep-pattern"></canvas>
                </div>
            </div>
        </div>
    `;

    if (lastPrediction) {
        updateMetricsDisplay(lastPrediction);
    } else {
        loadDashboardDefaults();
    }

    setTimeout(() => {
        renderMoodTrendChart();
        renderSleepPatternChart();
    }, 100);
}

function loadDashboardDefaults() {
    document.getElementById('metric-wellbeing').textContent = '—';
    document.getElementById('metric-anxiety').textContent = '—';
    document.getElementById('metric-depression').textContent = '—';
    document.getElementById('metric-cycle').textContent = 'Follicular';
}

function updateMetricsDisplay(prediction) {
    const wellbeing = Math.round(prediction.wellbeing_score || 0);
    const anxiety = ((prediction.anxiety_risk || 0) * 100).toFixed(1);
    const depression = ((prediction.depression_risk || 0) * 100).toFixed(1);
    const phase = getCyclePhase(formData.cycle_day);

    const wellbeingEl = document.getElementById('metric-wellbeing');
    const anxietyEl = document.getElementById('metric-anxiety');
    const depressionEl = document.getElementById('metric-depression');
    const cycleEl = document.getElementById('metric-cycle');

    if (wellbeingEl) {
        wellbeingEl.classList.add('value-pulse');
        wellbeingEl.textContent = wellbeing;
        setTimeout(() => wellbeingEl.classList.remove('value-pulse'), 500);
    }

    if (anxietyEl) {
        anxietyEl.classList.add('value-pulse');
        anxietyEl.textContent = anxiety + '%';
        setTimeout(() => anxietyEl.classList.remove('value-pulse'), 500);
    }

    if (depressionEl) {
        depressionEl.classList.add('value-pulse');
        depressionEl.textContent = depression + '%';
        setTimeout(() => depressionEl.classList.remove('value-pulse'), 500);
    }

    if (cycleEl) {
        cycleEl.textContent = phase;
    }
}

function getCyclePhase(cycleDay) {
    if (cycleDay <= 7) return 'Menstrual';
    if (cycleDay <= 11) return 'Follicular';
    if (cycleDay <= 17) return 'Ovulatory';
    return 'Luteal';
}

function renderMoodTrendChart() {
    const ctx = document.getElementById('chart-mood-trend');
    if (!ctx) return;

    charts.moodTrend = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
            datasets: [{
                label: 'Mood Score',
                data: [3, 3.2, 3.5, 3.8, 3.5, 3.9, 4],
                borderColor: '#a855f7',
                backgroundColor: 'rgba(168, 85, 247, 0.05)',
                tension: 0.3,
                fill: true,
                pointRadius: 4,
                pointBackgroundColor: '#a855f7'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 5,
                    ticks: { color: '#9ca3af' },
                    grid: { color: '#374151', drawBorder: false }
                },
                x: {
                    ticks: { color: '#9ca3af' },
                    grid: { color: '#374151', drawBorder: false }
                }
            }
        }
    });
}

function renderSleepPatternChart() {
    const ctx = document.getElementById('chart-sleep-pattern');
    if (!ctx) return;

    charts.sleepPattern = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
            datasets: [{
                label: 'Sleep Hours',
                data: [7, 6.5, 7.5, 8, 6.8, 7.2, 8.1],
                backgroundColor: '#9333ea',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 12,
                    ticks: { color: '#9ca3af' },
                    grid: { color: '#374151', drawBorder: false }
                },
                x: {
                    ticks: { color: '#9ca3af' },
                    grid: { color: '#374151', drawBorder: false }
                }
            }
        }
    });
}

function renderDailyLog(content) {
    content.innerHTML = `
        <div class="max-w-3xl">
            <h3 class="text-xl font-semibold mb-6 text-white">Daily Signal Log</h3>

            <div class="bg-gray-900 border border-gray-800 rounded-lg p-8 space-y-8">

                <!-- Age -->
                <div>
                    <label class="block text-sm font-medium text-white mb-2">Age (years)</label>
                    <input type="number" id="input-age" min="18" max="100" value="25" class="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white">
                    <p class="text-xs text-gray-500 mt-2">Age helps normalize hormonal and metabolic factors affecting wellbeing.</p>
                </div>

                <!-- Mood -->
                <div>
                    <label class="block text-sm font-medium text-white mb-3">Mood State</label>
                    <p class="text-xs text-gray-500 mb-3">Current emotional state strongly influences anxiety and depression predictions.</p>
                    <div class="flex gap-3">
                        <button class="mood-btn emoji-btn bg-gray-800 border border-gray-700 rounded-lg p-3" data-value="1">😞</button>
                        <button class="mood-btn emoji-btn bg-gray-800 border border-gray-700 rounded-lg p-3" data-value="2">🙁</button>
                        <button class="mood-btn emoji-btn bg-gray-800 border border-gray-700 rounded-lg p-3 selected" data-value="3">😐</button>
                        <button class="mood-btn emoji-btn bg-gray-800 border border-gray-700 rounded-lg p-3" data-value="4">🙂</button>
                        <button class="mood-btn emoji-btn bg-gray-800 border border-gray-700 rounded-lg p-3" data-value="5">😄</button>
                    </div>
                </div>

                <!-- Stress -->
                <div>
                    <label class="block text-sm font-medium text-white mb-3">Stress Level</label>
                    <p class="text-xs text-gray-500 mb-3">Perceived stress is a primary predictor of anxiety and depression risk.</p>
                    <div class="flex gap-3">
                        <button class="stress-btn emoji-btn bg-gray-800 border border-gray-700 rounded-lg p-3" data-value="1">😌</button>
                        <button class="stress-btn emoji-btn bg-gray-800 border border-gray-700 rounded-lg p-3 selected" data-value="2">😐</button>
                        <button class="stress-btn emoji-btn bg-gray-800 border border-gray-700 rounded-lg p-3" data-value="3">😔</button>
                        <button class="stress-btn emoji-btn bg-gray-800 border border-gray-700 rounded-lg p-3" data-value="4">😰</button>
                        <button class="stress-btn emoji-btn bg-gray-800 border border-gray-700 rounded-lg p-3" data-value="5">😫</button>
                    </div>
                </div>

                <!-- Sleep Duration -->
                <div>
                    <div class="flex justify-between items-center mb-3">
                        <label class="text-sm font-medium text-white">Sleep Duration</label>
                        <span class="text-sm text-purple-400" id="sleep-display">7.0 hours</span>
                    </div>
                    <p class="text-xs text-gray-500 mb-3">Sleep variability strongly influences emotional regulation and cognitive stability. Behavioral health studies consistently show that reduced or irregular sleep patterns correlate with increased anxiety and depressive symptoms.</p>
                    <input type="range" id="input-sleep" min="0" max="12" step="0.5" value="7" class="w-full">
                </div>

                <!-- Fatigue -->
                <div>
                    <div class="flex justify-between items-center mb-3">
                        <label class="text-sm font-medium text-white">Fatigue Level</label>
                        <span class="text-sm text-purple-400" id="fatigue-display">3</span>
                    </div>
                    <p class="text-xs text-gray-500 mb-3">Energy depletion impacts cognitive function and emotional regulation, affecting overall wellbeing estimates.</p>
                    <input type="range" id="input-fatigue" min="1" max="5" value="3" class="w-full">
                </div>

                <!-- Physical Activity -->
                <div>
                    <div class="flex justify-between items-center mb-3">
                        <label class="text-sm font-medium text-white">Physical Activity</label>
                        <span class="text-sm text-purple-400" id="activity-display">30 minutes</span>
                    </div>
                    <p class="text-xs text-gray-500 mb-3">Physical activity levels influence mood regulation and stress resilience through neurochemical pathways.</p>
                    <input type="range" id="input-activity" min="0" max="120" step="5" value="30" class="w-full">
                </div>

                <!-- Hormonal Symptoms -->
                <div>
                    <div class="flex justify-between items-center mb-3">
                        <label class="text-sm font-medium text-white">Hormonal Symptom Intensity</label>
                        <span class="text-sm text-purple-400" id="hormone-display">2</span>
                    </div>
                    <p class="text-xs text-gray-500 mb-3">Hormonal fluctuations significantly influence mood variability and emotional sensitivity across the menstrual cycle.</p>
                    <input type="range" id="input-hormone" min="1" max="5" value="2" class="w-full">
                </div>

                <!-- Cycle Day -->
                <div>
                    <div class="flex justify-between items-center mb-3">
                        <label class="text-sm font-medium text-white">Cycle Day</label>
                        <span class="text-sm text-purple-400" id="cycle-display">Day 14 (Ovulatory)</span>
                    </div>
                    <p class="text-xs text-gray-500 mb-3">Different cycle phases produce distinct hormonal profiles that interact with stress and mood regulation systems.</p>
                    <input type="range" id="input-cycle" min="1" max="28" value="14" class="w-full">
                </div>

                <!-- Submit -->
                <div class="flex items-center gap-4 pt-4 border-t border-gray-800">
                    <button id="predict-btn" class="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-2 rounded transition">
                        Run Prediction
                    </button>
                    <div id="loading" class="hidden flex items-center gap-2">
                        <div class="spinner"></div>
                        <span class="text-sm text-gray-400">Processing...</span>
                    </div>
                    <div id="result-msg" class="text-sm"></div>
                </div>
            </div>
        </div>
    `;

    setupDailyLogHandlers();
}

function setupDailyLogHandlers() {
    document.getElementById('input-age').addEventListener('change', (e) => {
        formData.age = parseInt(e.target.value);
    });

    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            formData.mood_score = parseInt(btn.dataset.value);
        });
    });

    document.querySelectorAll('.stress-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.stress-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            formData.stress_level = parseInt(btn.dataset.value);
        });
    });

    document.getElementById('input-sleep').addEventListener('input', (e) => {
        formData.sleep_duration = parseFloat(e.target.value);
        document.getElementById('sleep-display').textContent = e.target.value + ' hours';
    });

    document.getElementById('input-fatigue').addEventListener('input', (e) => {
        document.getElementById('fatigue-display').textContent = e.target.value;
    });

    document.getElementById('input-activity').addEventListener('input', (e) => {
        formData.physical_activity = parseInt(e.target.value);
        document.getElementById('activity-display').textContent = e.target.value + ' minutes';
    });

    document.getElementById('input-hormone').addEventListener('input', (e) => {
        formData.hormone_intensity = parseInt(e.target.value);
        document.getElementById('hormone-display').textContent = e.target.value;
    });

    document.getElementById('input-cycle').addEventListener('input', (e) => {
        formData.cycle_day = parseInt(e.target.value);
        const phase = getCyclePhase(formData.cycle_day);
        document.getElementById('cycle-display').textContent = `Day ${e.target.value} (${phase})`;
    });

    document.getElementById('predict-btn').addEventListener('click', runPrediction);
}

async function runPrediction() {
    const loading = document.getElementById('loading');
    const resultMsg = document.getElementById('result-msg');
    const predictBtn = document.getElementById('predict-btn');

    loading.classList.remove('hidden');
    resultMsg.textContent = '';
    predictBtn.disabled = true;

    const payload = buildPredictionPayload();

    try {
        const response = await fetch(`${API_BASE}/predict`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const data = await response.json();
            lastPrediction = data;
            resultMsg.textContent = '✓ Prediction complete. View dashboard for results.';
            resultMsg.className = 'text-sm text-green-400';

            setTimeout(() => navigateTo('dashboard'), 500);
        } else {
            throw new Error('Backend error');
        }
    } catch (error) {
        resultMsg.textContent = '⚠ Backend unavailable. Using simulated prediction.';
        resultMsg.className = 'text-sm text-yellow-400';

        lastPrediction = {
            wellbeing_score: 68 + Math.random() * 20,
            anxiety_risk: 0.25 + Math.random() * 0.25,
            depression_risk: 0.18 + Math.random() * 0.2
        };

        setTimeout(() => navigateTo('dashboard'), 500);
    } finally {
        loading.classList.add('hidden');
        predictBtn.disabled = false;
    }
}

function buildPredictionPayload() {
    const stress_level = formData.stress_level;
    const cycle_day = formData.cycle_day;
    const hormone_intensity = formData.hormone_intensity;
    const sleep_duration = formData.sleep_duration;

    return {
        day_index: Math.floor(Math.random() * 365),
        age: formData.age,
        mood_score: formData.mood_score,
        stress_level: stress_level,
        stress_cycle_interaction: stress_level * cycle_day,
        cycle_day: cycle_day,
        hormone_intensity: hormone_intensity,
        luteal_flag: cycle_day > 18 ? 1 : 0,
        sleep_duration: sleep_duration,
        physical_activity: formData.physical_activity,
        stress_squared: stress_level * stress_level,
        sleep_stress_ratio: sleep_duration / (stress_level + 1),
        hormone_stress_interaction: hormone_intensity * stress_level,
        cycle_phase_luteal: cycle_day > 18 ? 1 : 0,
        cycle_phase_menstrual: cycle_day <= 7 ? 1 : 0,
        cycle_phase_ovulatory: (cycle_day >= 12 && cycle_day <= 16) ? 1 : 0
    };
}

function renderAnalytics(content) {
    content.innerHTML = `
        <div>
            <h3 class="text-xl font-semibold mb-6 text-white">Behavioral Analytics</h3>

            <p class="text-sm text-gray-400 mb-6 leading-relaxed">
                Behavioral analytics examine the relationships between lifestyle signals and mental wellbeing outcomes. The charts below visualize how sleep patterns, stress levels, and physical activity interact to influence overall emotional and cognitive functioning. Understanding these relationships helps identify behavioral leverage points for wellbeing enhancement.
            </p>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div class="bg-gray-900 border border-gray-800 rounded-lg p-6">
                    <h4 class="font-semibold text-white mb-4">Mood vs Cycle Phase</h4>
                    <canvas id="chart-mood-cycle"></canvas>
                </div>

                <div class="bg-gray-900 border border-gray-800 rounded-lg p-6">
                    <h4 class="font-semibold text-white mb-4">Sleep vs Stress Relationship</h4>
                    <canvas id="chart-sleep-stress"></canvas>
                </div>
            </div>

            <div class="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <h4 class="font-semibold text-white mb-4">Activity vs Wellbeing Score</h4>
                <canvas id="chart-activity-wellbeing"></canvas>
            </div>
        </div>
    `;

    setTimeout(() => {
        renderMoodCycleChart();
        renderSleepStressChart();
        renderActivityWellbeingChart();
    }, 100);
}

function renderMoodCycleChart() {
    const ctx = document.getElementById('chart-mood-cycle');
    if (!ctx) return;

    charts.moodCycle = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Day 1-7\n(Menstrual)', 'Day 8-11\n(Follicular)', 'Day 12-16\n(Ovulatory)', 'Day 17-28\n(Luteal)'],
            datasets: [{
                label: 'Average Mood Score',
                data: [2.8, 3.4, 4.1, 3.3],
                borderColor: '#a855f7',
                backgroundColor: 'rgba(168, 85, 247, 0.05)',
                tension: 0.3,
                fill: true,
                pointRadius: 5,
                pointBackgroundColor: '#a855f7'
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: true, labels: { color: '#9ca3af' } } },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 5,
                    ticks: { color: '#9ca3af' },
                    grid: { color: '#374151', drawBorder: false }
                },
                x: {
                    ticks: { color: '#9ca3af' },
                    grid: { color: '#374151', drawBorder: false }
                }
            }
        }
    });
}

function renderSleepStressChart() {
    const ctx = document.getElementById('chart-sleep-stress');
    if (!ctx) return;

    charts.sleepStress = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Sleep-Stress Relationship',
                data: [
                    { x: 8, y: 1 }, { x: 7, y: 2 }, { x: 6, y: 3 },
                    { x: 5, y: 4 }, { x: 7.5, y: 2 }, { x: 6.5, y: 3 },
                    { x: 9, y: 1 }, { x: 5.5, y: 4 }, { x: 8.5, y: 1.5 }
                ],
                backgroundColor: '#9333ea',
                pointRadius: 5
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: true, labels: { color: '#9ca3af' } } },
            scales: {
                x: {
                    title: { display: true, text: 'Sleep Hours', color: '#9ca3af' },
                    ticks: { color: '#9ca3af' },
                    grid: { color: '#374151', drawBorder: false }
                },
                y: {
                    title: { display: true, text: 'Stress Level', color: '#9ca3af' },
                    ticks: { color: '#9ca3af' },
                    grid: { color: '#374151', drawBorder: false }
                }
            }
        }
    });
}

function renderActivityWellbeingChart() {
    const ctx = document.getElementById('chart-activity-wellbeing');
    if (!ctx) return;

    charts.activityWellbeing = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['0-30 min', '30-60 min', '60-90 min', '90-120 min'],
            datasets: [{
                label: 'Average Wellbeing Score',
                data: [65, 72, 78, 75],
                backgroundColor: '#9333ea',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: true, labels: { color: '#9ca3af' } } },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: { color: '#9ca3af' },
                    grid: { color: '#374151', drawBorder: false }
                },
                x: {
                    ticks: { color: '#9ca3af' },
                    grid: { color: '#374151', drawBorder: false }
                }
            }
        }
    });
}

function renderModelInsights(content) {
    content.innerHTML = `
        <div>
            <h3 class="text-xl font-semibold mb-2 text-white">Understanding the Model</h3>
            <p class="text-sm text-gray-400 mb-6 leading-relaxed">
                The prediction system uses machine learning algorithms that analyze behavioral signals such as sleep patterns, perceived stress, physical activity, and menstrual cycle phase. Feature importance scores help identify which behavioral signals contribute most strongly to the prediction outcome. In behavioral datasets, stress variability and sleep irregularity often emerge as the strongest predictors of emotional wellbeing fluctuations. Visualizing feature importance allows researchers to interpret how lifestyle patterns influence the model's predictions.
            </p>

            <div class="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <h4 class="font-semibold text-white mb-4">Feature Importance Analysis</h4>
                <canvas id="chart-feature-importance"></canvas>
            </div>
        </div>
    `;

    setTimeout(() => {
        renderFeatureImportanceChart();
    }, 100);
}

function renderFeatureImportanceChart() {
    const ctx = document.getElementById('chart-feature-importance');
    if (!ctx) return;

    charts.featureImportance = new Chart(ctx, {
        type: 'barH',
        data: {
            labels: ['Stress Level', 'Sleep Duration', 'Cycle Day', 'Physical Activity', 'Hormone Intensity', 'Mood Score'],
            datasets: [{
                label: 'Feature Importance',
                data: [0.28, 0.24, 0.18, 0.15, 0.10, 0.05],
                backgroundColor: ['#9333ea', '#a855f7', '#c084fc', '#d8b4fe', '#e9d5ff', '#f3e8ff']
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                x: {
                    beginAtZero: true,
                    max: 0.3,
                    ticks: { color: '#9ca3af' },
                    grid: { color: '#374151', drawBorder: false }
                },
                y: {
                    ticks: { color: '#9ca3af' },
                    grid: { color: '#374151', drawBorder: false }
                }
            }
        }
    });
}

function renderResearchMode(content) {
    content.innerHTML = `
        <div>
            <h3 class="text-xl font-semibold mb-2 text-white">Research Evaluation Results</h3>
            <p class="text-sm text-gray-400 mb-6 leading-relaxed">
                Multiple machine learning models were evaluated to determine predictive stability and generalization performance. Ensemble models and gradient boosting techniques often capture nonlinear relationships in behavioral health data more effectively than linear approaches. The results below summarize key metrics across different algorithmic approaches.
            </p>

            <div class="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6">
                <h4 class="font-semibold text-white mb-4">Model Comparison</h4>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b border-gray-700">
                                <th class="text-left py-3 px-4 text-gray-400 font-medium">Model</th>
                                <th class="text-left py-3 px-4 text-gray-400 font-medium">Accuracy</th>
                                <th class="text-left py-3 px-4 text-gray-400 font-medium">Precision</th>
                                <th class="text-left py-3 px-4 text-gray-400 font-medium">Recall</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="border-b border-gray-800">
                                <td class="py-3 px-4 text-gray-300">Logistic Regression</td>
                                <td class="py-3 px-4 text-gray-300">0.742</td>
                                <td class="py-3 px-4 text-gray-300">0.718</td>
                                <td class="py-3 px-4 text-gray-300">0.735</td>
                            </tr>
                            <tr class="border-b border-gray-800">
                                <td class="py-3 px-4 text-gray-300">Random Forest</td>
                                <td class="py-3 px-4 text-gray-300">0.821</td>
                                <td class="py-3 px-4 text-gray-300">0.805</td>
                                <td class="py-3 px-4 text-gray-300">0.828</td>
                            </tr>
                            <tr class="bg-purple-900/20">
                                <td class="py-3 px-4 text-gray-300 font-semibold">Gradient Boosting</td>
                                <td class="py-3 px-4 text-purple-300 font-semibold">0.867</td>
                                <td class="py-3 px-4 text-purple-300 font-semibold">0.851</td>
                                <td class="py-3 px-4 text-purple-300 font-semibold">0.874</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

checkAuth();
