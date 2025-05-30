document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const allTasksBtn = document.getElementById('allTasksBtn');
    const activeTasksBtn = document.getElementById('activeTasksBtn');
    const completedTasksBtn = document.getElementById('completedTasksBtn');
    const clearCompletedBtn = document.getElementById('clearCompletedBtn');
    const loadingMessage = document.getElementById('loadingMessage');
    const errorMessage = document.getElementById('errorMessage');
    const themeToggleBtn = document.getElementById('themeToggleBtn'); // Ambil tombol tema

    const API_URL = 'https://jsonplaceholder.typicode.com/todos';
    let tasks = [];
    let currentFilter = 'all'; // 'all', 'active', 'completed'

    // --- Fungsi Tema Gelap/Terang ---
    function setDarkMode(isDark) {
        if (isDark) {
            document.body.classList.add('dark-mode');
            themeToggleBtn.textContent = '🌙'; // Ubah ikon ke bulan
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            themeToggleBtn.textContent = '☀️'; // Ubah ikon ke matahari
            localStorage.setItem('theme', 'light');
        }
    }

    // Periksa preferensi tema yang tersimpan atau preferensi sistem
    function loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setDarkMode(savedTheme === 'dark');
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            // Jika tidak ada tema tersimpan, deteksi preferensi sistem
            setDarkMode(true);
        } else {
            setDarkMode(false); // Default ke mode terang
        }
    }

    // Event listener untuk tombol toggle tema
    themeToggleBtn.addEventListener('click', () => {
        setDarkMode(!document.body.classList.contains('dark-mode'));
    });

    // --- Helper Functions for UI State ---
    function showLoading() {
        loadingMessage.style.display = 'block';
        errorMessage.style.display = 'none';
        taskList.innerHTML = '';
    }

    function hideLoading() {
        loadingMessage.style.display = 'none';
    }

    function showErrorMessage(message = 'Failed to load tasks. Please try again.') {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        hideLoading();
    }

    function hideErrorMessage() {
        errorMessage.style.display = 'none';
    }

    // --- API Interactions (Sama seperti sebelumnya) ---

    async function fetchTasks() {
        showLoading();
        hideErrorMessage();
        try {
            const response = await fetch(API_URL + '?_limit=10');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            tasks = data.map(item => ({
                id: item.id.toString(),
                text: item.title,
                completed: item.completed
            }));
            renderTasks();
        } catch (error) {
            console.error('Error fetching tasks:', error);
            showErrorMessage();
        } finally {
            hideLoading();
        }
    }

    async function addTask(taskText) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: taskText,
                    completed: false,
                    userId: 1
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const newTaskData = await response.json();
            tasks.unshift({
                id: newTaskData.id.toString(),
                text: newTaskData.title,
                completed: newTaskData.completed
            });
            renderTasks();
            taskInput.value = '';
        } catch (error) {
            console.error('Error adding task:', error);
            alert('Failed to add task.');
        }
    }

    async function toggleTaskCompletion(id) {
        const taskToUpdate = tasks.find(task => task.id === id);
        if (!taskToUpdate) return;

        const newCompletedStatus = !taskToUpdate.completed;

        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    completed: newCompletedStatus,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            tasks = tasks.map(task =>
                task.id === id ? { ...task, completed: newCompletedStatus } : task
            );
            renderTasks();
        } catch (error) {
            console.error('Error toggling task completion:', error);
            alert('Failed to update task status.');
        }
    }

    async function editTask(id) {
        const taskToEdit = tasks.find(task => task.id === id);
        if (!taskToEdit) return;

        const newText = prompt('Edit your task:', taskToEdit.text);
        if (newText !== null && newText.trim() !== '') {
            try {
                const response = await fetch(`${API_URL}/${id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        title: newText.trim(),
                    }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                tasks = tasks.map(task =>
                    task.id === id ? { ...task, text: newText.trim() } : task
                );
                renderTasks();
            } catch (error) {
                console.error('Error editing task:', error);
                alert('Failed to edit task.');
            }
        } else if (newText !== null) {
            alert('Task text cannot be empty!');
        }
    }

    async function deleteTask(id) {
        if (!confirm('Are you sure you want to delete this task?')) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            tasks = tasks.filter(task => task.id !== id);
            renderTasks();
        } catch (error) {
            console.error('Error deleting task:', error);
            alert('Failed to delete task.');
        }
    }

    // --- UI Rendering & Event Handlers (Sama seperti sebelumnya, kecuali pemanggilan tema) ---

    function renderTasks() {
        taskList.innerHTML = '';
        const filteredTasks = tasks.filter(task => {
            if (currentFilter === 'active') return !task.completed;
            if (currentFilter === 'completed') return task.completed;
            return true;
        });

        if (filteredTasks.length === 0 && tasks.length > 0) {
            const noTasksMessage = document.createElement('li');
            noTasksMessage.textContent = `No ${currentFilter} tasks found.`;
            noTasksMessage.style.textAlign = 'center';
            noTasksMessage.style.fontStyle = 'italic';
            noTasksMessage.style.color = 'var(--message-color)'; // Gunakan variabel
            noTasksMessage.style.backgroundColor = 'transparent';
            noTasksMessage.style.boxShadow = 'none';
            taskList.appendChild(noTasksMessage);
            return;
        } else if (tasks.length === 0) {
             const noTasksMessage = document.createElement('li');
            noTasksMessage.textContent = "No tasks yet! Add one above or check your connection.";
            noTasksMessage.style.textAlign = 'center';
            noTasksMessage.style.fontStyle = 'italic';
            noTasksMessage.style.color = 'var(--message-color)'; // Gunakan variabel
            noTasksMessage.style.backgroundColor = 'transparent';
            noTasksMessage.style.boxShadow = 'none';
            taskList.appendChild(noTasksMessage);
            return;
        }

        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.setAttribute('data-id', task.id);
            if (task.completed) {
                li.classList.add('completed');
            }

            const taskTextSpan = document.createElement('span');
            taskTextSpan.textContent = task.text;
            taskTextSpan.addEventListener('click', () => toggleTaskCompletion(task.id));

            const actionsDiv = document.createElement('div');
            actionsDiv.classList.add('actions');

            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.classList.add('edit');
            editBtn.addEventListener('click', () => editTask(task.id));

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => deleteTask(task.id));

            actionsDiv.appendChild(editBtn);
            actionsDiv.appendChild(deleteBtn);

            li.appendChild(taskTextSpan);
            li.appendChild(actionsDiv);
            taskList.appendChild(li);
        });
    }

    addTaskBtn.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            addTask(taskText);
        } else {
            alert('Task cannot be empty!');
        }
    });

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTaskBtn.click();
        }
    });

    allTasksBtn.addEventListener('click', () => setFilter('all'));
    activeTasksBtn.addEventListener('click', () => setFilter('active'));
    completedTasksBtn.addEventListener('click', () => setFilter('completed'));

    function setFilter(filter) {
        currentFilter = filter;
        updateFilterButtons();
        renderTasks();
    }

    function updateFilterButtons() {
        allTasksBtn.classList.remove('active');
        activeTasksBtn.classList.remove('active');
        completedTasksBtn.classList.remove('active');

        if (currentFilter === 'all') allTasksBtn.classList.add('active');
        else if (currentFilter === 'active') activeTasksBtn.classList.add('active');
        else if (currentFilter === 'completed') completedTasksBtn.classList.add('active');
    }

    clearCompletedBtn.addEventListener('click', async () => {
        const completedTasks = tasks.filter(task => task.completed);
        if (completedTasks.length === 0) {
            alert('No completed tasks to clear.');
            return;
        }

        if (!confirm(`Are you sure you want to clear ${completedTasks.length} completed tasks?`)) {
            return;
        }

        try {
            tasks = tasks.filter(task => !task.completed);
            renderTasks();
            alert('Completed tasks cleared (locally).');
        } catch (error) {
            console.error('Error clearing completed tasks:', error);
            alert('Failed to clear completed tasks.');
        }
    });

    // --- Inisialisasi Aplikasi ---
    loadTheme(); // Muat tema saat halaman pertama kali dimuat
    fetchTasks();
    updateFilterButtons();
});