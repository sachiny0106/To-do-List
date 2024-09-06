document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskButton = document.getElementById('addTaskButton');
    const taskList = document.getElementById('taskList');
    const completedTaskList = document.getElementById('completedTaskList');
    const clearCompletedButton = document.getElementById('clearCompletedButton');

    // Load tasks from local storage
    loadTasks();

    addTaskButton.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        if (taskText) {
            addTask(taskText);
            taskInput.value = '';
            saveTasks();
        }
    });

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTaskButton.click();
        }
    });

    clearCompletedButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all completed tasks?')) {
            completedTaskList.innerHTML = '';
            saveTasks();
        }
    });

    function addTask(text, completed = false) {
        const li = document.createElement('li');
        li.innerHTML = `
            <input type="checkbox" class="checkbox" ${completed ? 'checked' : ''}>
            ${text}
            <button class="edit">Edit</button>
            <button class="delete">Delete</button>
        `;
        if (completed) {
            completedTaskList.appendChild(li);
            li.classList.add('completed');
        } else {
            taskList.appendChild(li);
        }

        li.querySelector('.checkbox').addEventListener('change', () => {
            if (li.querySelector('.checkbox').checked) {
                completedTaskList.appendChild(li);
                li.classList.add('completed');
            } else {
                taskList.appendChild(li);
                li.classList.remove('completed');
            }
            saveTasks();
        });

        li.querySelector('.edit').addEventListener('click', () => {
            const newText = prompt('Edit your task:', text);
            if (newText !== null) {
                li.childNodes[1].textContent = newText;
                saveTasks();
            }
        });

        li.querySelector('.delete').addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this task?')) {
                li.remove();
                saveTasks();
            }
        });
    }

    function saveTasks() {
        const tasks = Array.from(taskList.children).map(li => ({
            text: li.childNodes[1].textContent,
            completed: li.querySelector('.checkbox').checked
        }));
        const completedTasks = Array.from(completedTaskList.children).map(li => ({
            text: li.childNodes[1].textContent
        }));
        localStorage.setItem('tasks', JSON.stringify(tasks));
        localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];

        tasks.forEach(task => addTask(task.text, task.completed));
        completedTasks.forEach(task => addTask(task.text, true));
    }
});
