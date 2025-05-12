
    document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('new-task-form');
    const tasksUl = document.getElementById('tasks');
    const completedCount = document.getElementById('completed-count');
    const totalCount = document.getElementById('total-count');
    const progressBar = document.getElementById('task-progress');

    let taskList = JSON.parse(localStorage.getItem('taskList')) || [];

    // Initialize on load
    taskList.forEach(renderTask);
    updateStats();

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const title = document.getElementById('task-title').value.trim();
      const category = document.getElementById('task-category').value;
      const dueDate = document.getElementById('task-due-date').value;
      const priority = document.getElementById('task-priority').value;

      if (!title) return;

      const task = {
        id: Date.now(),
        title,
        category,
        dueDate,
        priority,
        completed: false
      };

      taskList.push(task);
      saveTasks();
      renderTask(task);
      updateStats();
      form.reset();
    });

    function renderTask(task) {
      const li = document.createElement('li');
      li.setAttribute('data-id', task.id);
      li.classList.toggle('completed', task.completed);

      li.innerHTML = `
        <input type="checkbox" class="complete-checkbox" ${task.completed ? 'checked' : ''} />
        <strong>${task.title}</strong>
        <small>${getCategoryEmoji(task.category)}</small>
        <span>(${task.priority.toUpperCase()})</span>
        ${task.dueDate ? `<em>Due: ${task.dueDate}</em>` : ''}
        <button class="delete-btn">🗑️</button>
      `;

      li.querySelector('.complete-checkbox').addEventListener('change', (e) => {
        task.completed = e.target.checked;
        li.classList.toggle('completed', task.completed);
        saveTasks();
        updateStats();
      });

      li.querySelector('.delete-btn').addEventListener('click', () => {
        taskList = taskList.filter(t => t.id !== task.id);
        saveTasks();
        li.remove();
        updateStats();
      });

      tasksUl.appendChild(li);
    }

    function updateStats() {
      const total = taskList.length;
      const completed = taskList.filter(t => t.completed).length;

      totalCount.textContent = total;
      completedCount.textContent = completed;
      progressBar.value = total ? (completed / total) * 100 : 0;
    }

    function saveTasks() {
      localStorage.setItem('taskList', JSON.stringify(taskList));
    }

    function getCategoryEmoji(category) {
      switch (category) {
        case 'work': return '🧠 Work';
        case 'personal': return '🏡 Personal';
        case 'shopping': return '🛒 Shopping';
        default: return '';
      }
    }
  });

