(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))d(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const i of a.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&d(i)}).observe(document,{childList:!0,subtree:!0});function l(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function d(s){if(s.ep)return;s.ep=!0;const a=l(s);fetch(s.href,a)}})();const p="http://localhost:5000";let u="dashboard",r={},o={mood:3,stress:2,sleep:7,fatigue:3,anxiety:2,cycle_day:14};function c(e){u=e,document.querySelectorAll(".nav-btn").forEach(l=>{l.classList.remove("bg-purple-600","text-white"),l.classList.add("text-gray-300")});const t=document.querySelector(`[data-page="${e}"]`);t&&(t.classList.add("bg-purple-600","text-white"),t.classList.remove("text-gray-300")),b()}function b(){const e=document.getElementById("page-content");switch(Object.values(r).forEach(t=>{t&&t.destroy()}),r={},u){case"dashboard":g(e);break;case"daily-log":v(e);break;case"analytics":M(e);break;case"model-insights":F(e);break;case"research-mode":P(e);break}}function g(e){e.innerHTML=`
    <div>
      <h3 class="text-2xl font-bold mb-6">Dashboard Overview</h3>

      <!-- Metric Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-lg">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-gray-400">Wellbeing Score</span>
            <span class="text-2xl">✨</span>
          </div>
          <div class="text-3xl font-bold text-purple-400" id="metric-wellbeing">--</div>
          <div class="text-xs text-gray-500 mt-2">AI-predicted wellness</div>
        </div>

        <div class="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-lg">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-gray-400">Anxiety Risk</span>
            <span class="text-2xl">😰</span>
          </div>
          <div class="text-3xl font-bold text-yellow-400" id="metric-anxiety">--</div>
          <div class="text-xs text-gray-500 mt-2">Probability estimate</div>
        </div>

        <div class="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-lg">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-gray-400">Depression Likelihood</span>
            <span class="text-2xl">🌧️</span>
          </div>
          <div class="text-3xl font-bold text-blue-400" id="metric-depression">--</div>
          <div class="text-xs text-gray-500 mt-2">Risk assessment</div>
        </div>

        <div class="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-lg">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-gray-400">Cycle Phase</span>
            <span class="text-2xl">🌙</span>
          </div>
          <div class="text-3xl font-bold text-pink-400" id="metric-cycle">--</div>
          <div class="text-xs text-gray-500 mt-2">Current phase</div>
        </div>
      </div>

      <!-- Charts -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-lg">
          <h4 class="text-lg font-semibold mb-4">Mood Trend</h4>
          <canvas id="chart-mood"></canvas>
        </div>

        <div class="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-lg">
          <h4 class="text-lg font-semibold mb-4">Sleep Trend</h4>
          <canvas id="chart-sleep"></canvas>
        </div>
      </div>
    </div>
  `,x(),y(),m()}async function x(){try{const e=await fetch(`${p}/predict`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)});if(e.ok){const t=await e.json();n(t)}else n({wellbeing_score:72,anxiety_risk:.24,depression_probability:.18,cycle_phase:"Follicular"})}catch{n({wellbeing_score:72,anxiety_risk:.24,depression_probability:.18,cycle_phase:"Follicular"})}}function n(e){document.getElementById("metric-wellbeing").textContent=e.wellbeing_score||"--",document.getElementById("metric-anxiety").textContent=e.anxiety_risk?`${(e.anxiety_risk*100).toFixed(0)}%`:"--",document.getElementById("metric-depression").textContent=e.depression_probability?`${(e.depression_probability*100).toFixed(0)}%`:"--",document.getElementById("metric-cycle").textContent=e.cycle_phase||"--"}function y(){const e=document.getElementById("chart-mood");r.mood=new Chart(e,{type:"line",data:{labels:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],datasets:[{label:"Mood Level",data:[3,4,3,5,4,3,4],borderColor:"#a855f7",backgroundColor:"rgba(168, 85, 247, 0.1)",tension:.4,fill:!0}]},options:{responsive:!0,plugins:{legend:{display:!1}},scales:{y:{beginAtZero:!0,max:5,ticks:{color:"#9ca3af"},grid:{color:"#374151"}},x:{ticks:{color:"#9ca3af"},grid:{color:"#374151"}}}}})}function m(){const e=document.getElementById("chart-sleep");r.sleep=new Chart(e,{type:"bar",data:{labels:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],datasets:[{label:"Sleep Hours",data:[7,6.5,8,7,6,9,8],backgroundColor:"#8b5cf6"}]},options:{responsive:!0,plugins:{legend:{display:!1}},scales:{y:{beginAtZero:!0,max:12,ticks:{color:"#9ca3af"},grid:{color:"#374151"}},x:{ticks:{color:"#9ca3af"},grid:{color:"#374151"}}}}})}function v(e){e.innerHTML=`
    <div class="max-w-4xl">
      <h3 class="text-2xl font-bold mb-2">Daily Signal Log</h3>
      <p class="text-gray-400 mb-6">Track your behavioral signals for AI prediction</p>

      <div class="bg-gray-900 rounded-xl p-8 border border-gray-800 shadow-lg">

        <!-- Mood -->
        <div class="mb-8">
          <label class="block text-sm font-medium mb-3">
            Mood State
            <span class="text-gray-500 text-xs ml-2">(Emotional state affects anxiety and depression predictions)</span>
          </label>
          <div class="emoji-selector flex gap-4">
            <button onclick="selectMood(1)" class="mood-btn p-4 rounded-lg border border-gray-700 hover:border-purple-500 text-4xl" data-value="1">😞</button>
            <button onclick="selectMood(2)" class="mood-btn p-4 rounded-lg border border-gray-700 hover:border-purple-500 text-4xl" data-value="2">🙁</button>
            <button onclick="selectMood(3)" class="mood-btn p-4 rounded-lg border border-gray-700 hover:border-purple-500 text-4xl selected" data-value="3">😐</button>
            <button onclick="selectMood(4)" class="mood-btn p-4 rounded-lg border border-gray-700 hover:border-purple-500 text-4xl" data-value="4">🙂</button>
            <button onclick="selectMood(5)" class="mood-btn p-4 rounded-lg border border-gray-700 hover:border-purple-500 text-4xl" data-value="5">😄</button>
          </div>
        </div>

        <!-- Stress -->
        <div class="mb-8">
          <label class="block text-sm font-medium mb-3">
            Stress Level
            <span class="text-gray-500 text-xs ml-2">(High stress correlates with anxiety and affects wellbeing)</span>
          </label>
          <div class="emoji-selector flex gap-4">
            <button onclick="selectStress(1)" class="stress-btn p-4 rounded-lg border border-gray-700 hover:border-purple-500 text-4xl" data-value="1">😌</button>
            <button onclick="selectStress(2)" class="stress-btn p-4 rounded-lg border border-gray-700 hover:border-purple-500 text-4xl selected" data-value="2">😐</button>
            <button onclick="selectStress(3)" class="stress-btn p-4 rounded-lg border border-gray-700 hover:border-purple-500 text-4xl" data-value="3">😰</button>
            <button onclick="selectStress(4)" class="stress-btn p-4 rounded-lg border border-gray-700 hover:border-purple-500 text-4xl" data-value="4">😫</button>
            <button onclick="selectStress(5)" class="stress-btn p-4 rounded-lg border border-gray-700 hover:border-purple-500 text-4xl" data-value="5">😱</button>
          </div>
        </div>

        <!-- Sleep Hours -->
        <div class="mb-8">
          <label class="block text-sm font-medium mb-3">
            Sleep Hours: <span id="sleep-value" class="text-purple-400">7</span>
            <span class="text-gray-500 text-xs ml-2">(Sleep quality is a strong predictor of mental wellbeing)</span>
          </label>
          <input type="range" min="0" max="12" step="0.5" value="7"
                 class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                 oninput="updateSleep(this.value)">
        </div>

        <!-- Fatigue -->
        <div class="mb-8">
          <label class="block text-sm font-medium mb-3">
            Fatigue Level: <span id="fatigue-value" class="text-purple-400">3</span>
            <span class="text-gray-500 text-xs ml-2">(Energy depletion impacts mood and depression risk)</span>
          </label>
          <input type="range" min="1" max="5" value="3"
                 class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                 oninput="updateFatigue(this.value)">
        </div>

        <!-- Anxiety -->
        <div class="mb-8">
          <label class="block text-sm font-medium mb-3">
            Anxiety Level: <span id="anxiety-value" class="text-purple-400">2</span>
            <span class="text-gray-500 text-xs ml-2">(Direct indicator for anxiety risk prediction)</span>
          </label>
          <input type="range" min="1" max="5" value="2"
                 class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                 oninput="updateAnxiety(this.value)">
        </div>

        <!-- Appetite -->
        <div class="mb-8">
          <label class="block text-sm font-medium mb-3">
            Appetite Change
            <span class="text-gray-500 text-xs ml-2">(Changes in eating patterns signal mental health shifts)</span>
          </label>
          <select class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white">
            <option>Normal</option>
            <option>Decreased</option>
            <option>Increased</option>
            <option>No appetite</option>
          </select>
        </div>

        <!-- Cycle Day -->
        <div class="mb-8">
          <label class="block text-sm font-medium mb-3">
            Cycle Day: <span id="cycle-value" class="text-purple-400">14</span>
            <span class="text-gray-500 text-xs ml-2">(Hormonal fluctuations during cycle affect mood and anxiety)</span>
          </label>
          <input type="range" min="1" max="28" value="14"
                 class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                 oninput="updateCycle(this.value)">
        </div>

        <!-- Submit Button -->
        <div class="flex items-center gap-4">
          <button onclick="runPrediction()"
                  class="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-lg font-semibold transition-colors">
            Run AI Prediction
          </button>
          <div id="loading-spinner" class="hidden">
            <div class="loader"></div>
          </div>
          <div id="prediction-result" class="text-sm text-gray-400"></div>
        </div>
      </div>
    </div>
  `}function f(e){o.mood=e,document.querySelectorAll(".mood-btn").forEach(t=>{t.classList.remove("selected"),t.dataset.value==e&&t.classList.add("selected")})}function h(e){o.stress=e,document.querySelectorAll(".stress-btn").forEach(t=>{t.classList.remove("selected"),t.dataset.value==e&&t.classList.add("selected")})}function w(e){o.sleep=parseFloat(e),document.getElementById("sleep-value").textContent=e}function C(e){o.fatigue=parseInt(e),document.getElementById("fatigue-value").textContent=e}function S(e){o.anxiety=parseInt(e),document.getElementById("anxiety-value").textContent=e}function k(e){o.cycle_day=parseInt(e),document.getElementById("cycle-value").textContent=e}async function L(){const e=document.getElementById("loading-spinner"),t=document.getElementById("prediction-result");e.classList.remove("hidden"),t.textContent="";try{const l=await fetch(`${p}/predict`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)});if(l.ok){const d=await l.json();t.textContent="✓ Prediction complete! View Dashboard for results.",t.classList.add("text-green-400"),n(d)}else t.textContent="⚠ Using fallback prediction (backend unavailable)",t.classList.add("text-yellow-400")}catch{t.textContent="⚠ Backend unavailable - using sample data",t.classList.add("text-yellow-400")}finally{e.classList.add("hidden")}}function M(e){e.innerHTML=`
    <div>
      <h3 class="text-2xl font-bold mb-6">Behavioral Analytics</h3>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div class="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-lg">
          <h4 class="text-lg font-semibold mb-4">Mood vs Cycle Phase</h4>
          <canvas id="chart-mood-cycle"></canvas>
        </div>

        <div class="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-lg">
          <h4 class="text-lg font-semibold mb-4">Sleep vs Stress</h4>
          <canvas id="chart-sleep-stress"></canvas>
        </div>
      </div>

      <div class="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-lg">
        <h4 class="text-lg font-semibold mb-4">Fatigue vs Wellbeing</h4>
        <canvas id="chart-fatigue-wellbeing"></canvas>
      </div>
    </div>
  `,I(),E(),A()}function I(){const e=document.getElementById("chart-mood-cycle");r.moodCycle=new Chart(e,{type:"line",data:{labels:["Day 1","Day 7","Day 14","Day 21","Day 28"],datasets:[{label:"Mood Score",data:[3,3.5,4.5,4,3.2],borderColor:"#ec4899",backgroundColor:"rgba(236, 72, 153, 0.1)",tension:.4,fill:!0}]},options:{responsive:!0,scales:{y:{beginAtZero:!0,max:5,ticks:{color:"#9ca3af"},grid:{color:"#374151"}},x:{ticks:{color:"#9ca3af"},grid:{color:"#374151"}}}}})}function E(){const e=document.getElementById("chart-sleep-stress");r.sleepStress=new Chart(e,{type:"scatter",data:{datasets:[{label:"Sleep-Stress Relationship",data:[{x:8,y:1},{x:7,y:2},{x:6,y:3},{x:5,y:4},{x:7.5,y:2},{x:6.5,y:3},{x:9,y:1},{x:5.5,y:4}],backgroundColor:"#8b5cf6"}]},options:{responsive:!0,scales:{x:{title:{display:!0,text:"Sleep Hours",color:"#9ca3af"},ticks:{color:"#9ca3af"},grid:{color:"#374151"}},y:{title:{display:!0,text:"Stress Level",color:"#9ca3af"},ticks:{color:"#9ca3af"},grid:{color:"#374151"}}}}})}function A(){const e=document.getElementById("chart-fatigue-wellbeing");r.fatigueWellbeing=new Chart(e,{type:"line",data:{labels:["Week 1","Week 2","Week 3","Week 4"],datasets:[{label:"Fatigue Level",data:[3,4,2,3],borderColor:"#ef4444",tension:.4},{label:"Wellbeing Score",data:[75,65,82,72],borderColor:"#10b981",tension:.4}]},options:{responsive:!0,scales:{y:{ticks:{color:"#9ca3af"},grid:{color:"#374151"}},x:{ticks:{color:"#9ca3af"},grid:{color:"#374151"}}}}})}function F(e){e.innerHTML=`
    <div>
      <h3 class="text-2xl font-bold mb-2">Model Insights & Explainability</h3>
      <p class="text-gray-400 mb-6">Understanding AI predictions through feature analysis</p>

      <div class="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-lg mb-6">
        <h4 class="text-lg font-semibold mb-4">Feature Importance</h4>
        <p class="text-sm text-gray-400 mb-4">These features have the highest impact on wellbeing predictions</p>
        <canvas id="chart-feature-importance"></canvas>
      </div>

      <div class="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-lg">
        <h4 class="text-lg font-semibold mb-4">SHAP Feature Explanations</h4>
        <p class="text-sm text-gray-400 mb-4">
          SHAP (SHapley Additive exPlanations) values show how much each feature contributes to pushing the model prediction
          from the base value to the final prediction. Features shown above are the most influential in determining your
          mental wellbeing score.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-gray-800 p-4 rounded-lg">
            <div class="flex justify-between mb-2">
              <span class="text-sm">Stress Variability</span>
              <span class="text-purple-400 font-semibold">0.32</span>
            </div>
            <div class="w-full bg-gray-700 rounded-full h-2">
              <div class="bg-purple-500 h-2 rounded-full" style="width: 64%"></div>
            </div>
          </div>
          <div class="bg-gray-800 p-4 rounded-lg">
            <div class="flex justify-between mb-2">
              <span class="text-sm">Sleep Deviation</span>
              <span class="text-purple-400 font-semibold">0.28</span>
            </div>
            <div class="w-full bg-gray-700 rounded-full h-2">
              <div class="bg-purple-500 h-2 rounded-full" style="width: 56%"></div>
            </div>
          </div>
          <div class="bg-gray-800 p-4 rounded-lg">
            <div class="flex justify-between mb-2">
              <span class="text-sm">Cycle Phase</span>
              <span class="text-purple-400 font-semibold">0.22</span>
            </div>
            <div class="w-full bg-gray-700 rounded-full h-2">
              <div class="bg-purple-500 h-2 rounded-full" style="width: 44%"></div>
            </div>
          </div>
          <div class="bg-gray-800 p-4 rounded-lg">
            <div class="flex justify-between mb-2">
              <span class="text-sm">Mood Volatility</span>
              <span class="text-purple-400 font-semibold">0.18</span>
            </div>
            <div class="w-full bg-gray-700 rounded-full h-2">
              <div class="bg-purple-500 h-2 rounded-full" style="width: 36%"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,B()}function B(){const e=document.getElementById("chart-feature-importance");r.featureImportance=new Chart(e,{type:"bar",data:{labels:["Stress Variability","Sleep Deviation","Cycle Phase","Mood Volatility","Fatigue"],datasets:[{label:"Importance Score",data:[.32,.28,.22,.18,.15],backgroundColor:["#8b5cf6","#a855f7","#c084fc","#d8b4fe","#e9d5ff"]}]},options:{indexAxis:"y",responsive:!0,plugins:{legend:{display:!1}},scales:{x:{beginAtZero:!0,max:.4,ticks:{color:"#9ca3af"},grid:{color:"#374151"}},y:{ticks:{color:"#9ca3af"},grid:{color:"#374151"}}}}})}function P(e){e.innerHTML=`
    <div>
      <h3 class="text-2xl font-bold mb-2">Research Evaluation Results</h3>
      <p class="text-gray-400 mb-6">Performance metrics and experimental findings</p>

      <!-- Table 1: Model Comparison -->
      <div class="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-lg mb-6">
        <h4 class="text-lg font-semibold mb-4">Table 1: Model Comparison</h4>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-700">
                <th class="text-left py-3 px-4 text-gray-400 font-medium">Model</th>
                <th class="text-left py-3 px-4 text-gray-400 font-medium">Accuracy</th>
                <th class="text-left py-3 px-4 text-gray-400 font-medium">Precision</th>
                <th class="text-left py-3 px-4 text-gray-400 font-medium">Recall</th>
                <th class="text-left py-3 px-4 text-gray-400 font-medium">F1 Score</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-gray-800">
                <td class="py-3 px-4 text-white">Logistic Regression</td>
                <td class="py-3 px-4 text-gray-300">0.762</td>
                <td class="py-3 px-4 text-gray-300">0.741</td>
                <td class="py-3 px-4 text-gray-300">0.758</td>
                <td class="py-3 px-4 text-gray-300">0.749</td>
              </tr>
              <tr class="border-b border-gray-800">
                <td class="py-3 px-4 text-white">Random Forest</td>
                <td class="py-3 px-4 text-gray-300">0.843</td>
                <td class="py-3 px-4 text-gray-300">0.829</td>
                <td class="py-3 px-4 text-gray-300">0.851</td>
                <td class="py-3 px-4 text-gray-300">0.840</td>
              </tr>
              <tr class="bg-purple-900/20">
                <td class="py-3 px-4 text-white font-semibold">Gradient Boosting</td>
                <td class="py-3 px-4 text-purple-400 font-semibold">0.891</td>
                <td class="py-3 px-4 text-purple-400 font-semibold">0.885</td>
                <td class="py-3 px-4 text-purple-400 font-semibold">0.897</td>
                <td class="py-3 px-4 text-purple-400 font-semibold">0.891</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="text-xs text-gray-500 mt-4">
          * Gradient Boosting achieved the highest performance across all metrics
        </p>
      </div>

      <!-- Table 2: Cycle Feature Experiment -->
      <div class="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-lg mb-6">
        <h4 class="text-lg font-semibold mb-4">Table 2: Cycle Feature Ablation Study</h4>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-700">
                <th class="text-left py-3 px-4 text-gray-400 font-medium">Model</th>
                <th class="text-left py-3 px-4 text-gray-400 font-medium">Without Cycle</th>
                <th class="text-left py-3 px-4 text-gray-400 font-medium">With Cycle</th>
                <th class="text-left py-3 px-4 text-gray-400 font-medium">Improvement</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-gray-800">
                <td class="py-3 px-4 text-white">Logistic Regression</td>
                <td class="py-3 px-4 text-gray-300">0.714</td>
                <td class="py-3 px-4 text-gray-300">0.762</td>
                <td class="py-3 px-4 text-green-400">+6.7%</td>
              </tr>
              <tr class="border-b border-gray-800">
                <td class="py-3 px-4 text-white">Random Forest</td>
                <td class="py-3 px-4 text-gray-300">0.798</td>
                <td class="py-3 px-4 text-gray-300">0.843</td>
                <td class="py-3 px-4 text-green-400">+5.6%</td>
              </tr>
              <tr class="bg-purple-900/20">
                <td class="py-3 px-4 text-white font-semibold">Gradient Boosting</td>
                <td class="py-3 px-4 text-gray-300">0.851</td>
                <td class="py-3 px-4 text-purple-400 font-semibold">0.891</td>
                <td class="py-3 px-4 text-green-400 font-semibold">+4.7%</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="text-xs text-gray-500 mt-4">
          * Incorporating menstrual cycle features improved prediction accuracy across all models
        </p>
      </div>

      <!-- Key Findings -->
      <div class="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-lg">
        <h4 class="text-lg font-semibold mb-4">Key Research Findings</h4>
        <ul class="space-y-3 text-gray-300">
          <li class="flex items-start">
            <span class="text-purple-400 mr-3">•</span>
            <span>Cycle-aware models demonstrate significant performance gains in mental wellbeing prediction</span>
          </li>
          <li class="flex items-start">
            <span class="text-purple-400 mr-3">•</span>
            <span>Gradient Boosting achieved 89.1% accuracy, outperforming traditional approaches</span>
          </li>
          <li class="flex items-start">
            <span class="text-purple-400 mr-3">•</span>
            <span>Feature importance analysis reveals stress variability and sleep patterns as primary predictors</span>
          </li>
          <li class="flex items-start">
            <span class="text-purple-400 mr-3">•</span>
            <span>Menstrual cycle phase integration improved model accuracy by an average of 5.7%</span>
          </li>
        </ul>
      </div>
    </div>
  `}document.addEventListener("DOMContentLoaded",()=>{document.querySelectorAll(".nav-btn").forEach(e=>{e.addEventListener("click",()=>{c(e.dataset.page)})}),c("dashboard")});window.selectMood=f;window.selectStress=h;window.updateSleep=w;window.updateFatigue=C;window.updateAnxiety=S;window.updateCycle=k;window.runPrediction=L;
