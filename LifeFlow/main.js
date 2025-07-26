// ---- TIME DISPLAY ----
function updateTime() {
    const now = new Date();
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('currentTime').textContent = now.toLocaleTimeString('en-US', timeOptions);
    document.getElementById('currentDate').textContent = now.toLocaleDateString('en-US', dateOptions);
}
setInterval(updateTime, 1000);
updateTime();

// ---- TASK MANAGEMENT ----
function toggleTask(checkbox) {
    checkbox.classList.toggle('checked');
    checkbox.nextElementSibling.classList.toggle('completed');
    saveTasks();
    updateTaskProgress();
}

function addTaskFromInput() {
    const input = document.getElementById('newTaskInput');
    const task = input.value.trim();
    if (task) {
        const todoList = document.getElementById('todoList');
        const taskElement = document.createElement('div');
        taskElement.className = 'todo-item';
        taskElement.innerHTML = `
            <div class="checkbox" onclick="toggleTask(this)"></div>
            <span class="task-text">${task}</span>
            <button class="delete-task" onclick="deleteTask(this)">✖</button>
        `;
        todoList.appendChild(taskElement);
        saveTasks();
        updateTaskProgress();
        input.value = ''; 
    }
}

function deleteTask(button) {
    button.parentElement.remove();
    saveTasks();
    updateTaskProgress();
}

function deleteHabit(button) {
    button.parentElement.remove();
    saveHabits();
    updateHabitProgress();
}

function saveTasks() {
    const tasks = [];
    document.querySelectorAll('#todoList .todo-item').forEach(item => {
        tasks.push({
            text: item.querySelector('.task-text').textContent,
            completed: item.querySelector('.checkbox').classList.contains('checked')
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const saved = localStorage.getItem('tasks');
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = ''; 
    if (!saved) return;

    JSON.parse(saved).forEach(t => {
        const taskElement = document.createElement('div');
        taskElement.className = 'todo-item';
        taskElement.innerHTML = `
            <div class="checkbox ${t.completed ? 'checked' : ''}" onclick="toggleTask(this)"></div>
            <span class="task-text ${t.completed ? 'completed' : ''}">${t.text}</span>
            <button class="delete-task" onclick="deleteTask(this)">✖</button>
        `;
        todoList.appendChild(taskElement);
    });

    updateTaskProgress();
}

function updateTaskProgress() {
    const totalTasks = document.querySelectorAll('#todoList .todo-item').length;
    const completedTasks = document.querySelectorAll('#todoList .checkbox.checked').length;
    const progress = totalTasks ? (completedTasks / totalTasks) * 100 : 0;
    document.getElementById('taskStats').textContent = `${completedTasks}/${totalTasks}`;
    document.getElementById('taskProgressFill').style.width = `${progress}%`;
}


function toggleHabit(checkbox) {
    checkbox.classList.toggle('checked');
    updateHabitProgress();
    saveHabits();
}

function addHabitFromInput() {
    const input = document.getElementById('newHabitInput');
    const habit = input.value.trim();
    if (habit) {
        const habitList = document.getElementById('habitList');
        const habitElement = document.createElement('div');
        habitElement.className = 'habit-item';
        habitElement.innerHTML = `
            <div class="checkbox" onclick="toggleHabit(this)"></div>
            <span class="task-text">${habit}</span>
            <button class="delete-habit" onclick="deleteHabit(this)">✖</button>
        `;
        habitList.appendChild(habitElement);
        saveHabits();
        updateHabitProgress();
        input.value = '';
    }
}

function saveHabits() {
    const habits = [];
    document.querySelectorAll('#habitList .habit-item').forEach(item => {
        habits.push({
            text: item.querySelector('.task-text').textContent,
            completed: item.querySelector('.checkbox').classList.contains('checked')
        });
    });
    localStorage.setItem('habits', JSON.stringify(habits));
}

function loadHabits() {
    const saved = localStorage.getItem('habits');
    const habitList = document.getElementById('habitList');
    if (!saved) return;
    habitList.innerHTML = '';
    JSON.parse(saved).forEach(h => {
        const habitElement = document.createElement('div');
        habitElement.className = 'habit-item';
        habitElement.innerHTML = `
            <div class="checkbox ${h.completed ? 'checked' : ''}" onclick="toggleHabit(this)"></div>
            <span class="task-text ${h.completed ? 'completed' : ''}">${h.text}</span>
            <button class="delete-habit" onclick="deleteHabit(this)">✖</button>
        `;
        habitList.appendChild(habitElement);
    });
    updateHabitProgress();
}

function updateHabitProgress() {
    const habits = document.querySelectorAll('#habitList .checkbox');
    const completed = document.querySelectorAll('#habitList .checkbox.checked').length;
    const progress = habits.length ? Math.round((completed / habits.length) * 100) : 0;
    document.getElementById('habitProgress').textContent = `${progress}%`;
    document.getElementById('habitProgressBar').style.width = `${progress}%`;
}

function saveNotes() {
    localStorage.setItem('notes', document.getElementById('quickNotes').value);
}
function loadNotes() {
    const notes = localStorage.getItem('notes');
    if (notes) document.getElementById('quickNotes').value = notes;
}

let focusTimer = null;
let focusMinutes = 25, focusSeconds = 0, isRunning = false, isBreakMode = false;
let totalFocusSeconds = 0;

function toggleTimer(event) {
    const button = event.target;
    if (isRunning) {
        clearInterval(focusTimer);
        button.textContent = isBreakMode ? 'Start Break' : 'Start Focus';
        isRunning = false;
    } else {
        focusTimer = setInterval(updateTimer, 1000);
        button.textContent = 'Pause';
        isRunning = true;
    }
}

function updateTimer() {
    if (!isBreakMode) totalFocusSeconds++; 
    if (focusSeconds === 0) {
        if (focusMinutes === 0) {
            clearInterval(focusTimer);
            isRunning = false;
            if (isBreakMode) {
                alert('Break complete! Ready to focus again.');
                resetTimer();
            } else {
                alert('Focus session complete! Time for a break.');
                setBreakTimer();
            }
            return;
        }
        focusMinutes--; focusSeconds = 59;
    } else {
        focusSeconds--;
    }
    document.getElementById('focusTimer').textContent = `${String(focusMinutes).padStart(2, '0')}:${String(focusSeconds).padStart(2, '0')}`;
    updateFocusTimeDisplay();
}

function updateFocusTimeDisplay() {
    const hours = (totalFocusSeconds / 3600).toFixed(1);
    document.getElementById('focusTimeDisplay').textContent = `${hours}h`;
}

function resetTimer() {
    clearInterval(focusTimer);
    focusMinutes = 25; focusSeconds = 0;
    isRunning = false; isBreakMode = false;
    document.getElementById('focusTimer').textContent = '25:00';
    document.querySelector('.card button[onclick="toggleTimer(event)"]').textContent = 'Start Focus';
}

function setBreakTimer() {
    clearInterval(focusTimer);
    focusMinutes = 5; focusSeconds = 0;
    isRunning = false; isBreakMode = true;
    document.getElementById('focusTimer').textContent = '05:00';
    document.querySelector('.card button[onclick="toggleTimer(event)"]').textContent = 'Start Break';
}


let currentAudio = null;
function playAmbient() {
    const sounds = {
        'Rain': 'sounds/rain.mp3',
        'Forest': 'sounds/forest.mp3',
        'Ocean': 'sounds/ocean.mp3',
        'Cafe': 'sounds/cafe.mp3',
        'Fireplace': 'sounds/fireplace.mp3'
    };
    const keys = Object.keys(sounds);
    const sound = keys[Math.floor(Math.random() * keys.length)];
    if (currentAudio) { currentAudio.pause(); currentAudio = null; }
    currentAudio = new Audio(sounds[sound]);
    currentAudio.loop = true;
    currentAudio.play();
    alert(`Playing ${sound} sounds...`);
}
function stopAmbient() {
    if (currentAudio) { currentAudio.pause(); currentAudio = null; alert('Ambient sounds stopped.'); }
}


function focusMode() {
    document.body.style.filter = 'grayscale(30%)';
    alert('Focus mode on! Distractions minimized.');
    setTimeout(() => document.body.style.filter = 'none', 30000);
}

function breathingExercise() {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.8); display: flex; align-items: center;
        justify-content: center; z-index: 1000; color: white; font-size: 2rem;
        text-align: center; backdrop-filter: blur(10px);
    `;
    modal.innerHTML = '<div>Breathe in...<br><small style="font-size: 1rem;">Click to close</small></div>';
    document.body.appendChild(modal);
    let phase = 'in';
    const breatheInterval = setInterval(() => {
        modal.innerHTML = phase === 'in'
            ? '<div>Hold...<br><small>Click to close</small></div>'
            : phase === 'hold'
                ? '<div>Breathe out...<br><small>Click to close</small></div>'
                : '<div>Breathe in...<br><small>Click to close</small></div>';
        phase = phase === 'in' ? 'hold' : phase === 'hold' ? 'out' : 'in';
    }, 4000);
    modal.onclick = () => { clearInterval(breatheInterval); modal.remove(); };
}

function generateQuote() {
    const quotes = [
        "The only way to do great work is to love what you do. - Steve Jobs",
        "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
        "Your limitation—it's only your imagination.",
        "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt"
    ];
    alert(quotes[Math.floor(Math.random() * quotes.length)]);
}

window.onload = function() {
    loadTasks();
    loadHabits();
    loadNotes();
    updateHabitProgress();
    updateTaskProgress();
    updateFocusTimeDisplay();
};
