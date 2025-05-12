// Wait until the entire HTML document is fully loaded
document.addEventListener('DOMContentLoaded', () => {

    // Get all the HTML elements we need to interact with
    const form = document.getElementById('new-task-form'); // The form to add a new task
    const tasksUl = document.getElementById('tasks'); // The <ul> element where tasks will be listed
    const completedCount = document.getElementById('completed-count'); // To show number of completed tasks
    const totalCount = document.getElementById('total-count'); // To show total number of tasks
    const progressBar = document.getElementById('task-progress'); // Progress bar element
  
    // Load saved tasks from localStorage or start with an empty list
    let taskList = JSON.parse(localStorage.getItem('taskList')) || [];
  
    // Render all saved tasks when the page loads
    taskList.forEach(renderTask);
    updateStats(); // Update total/completed count and progress
  
    // When the form is submitted (user adds a task)
    form.addEventListener('submit', (e) => {
      e.preventDefault(); // Prevents page reload
  
      // Get the values from the form fields
      const title = document.getElementById('task-title').value.trim();
      const category = document.getElementById('task-category').value;
      const dueDate = document.getElementById('task-due-date').value;
      const priority = document.getElementById('task-priority').value;
  
      // If the title is empty, do nothing
      if (!title) return;
  
      // Create a new task object
      const task = {
        id: Date.now(), // Unique ID based on current time
        title,
        category,
        dueDate,
        priority,
        completed: false // Task starts as not completed
      };
  
      // Add the task to our list and save it
      taskList.push(task);
      saveTasks();
      renderTask(task); // Show the task on screen
      updateStats(); // Update progress
      form.reset(); // Clear the form fields
    });
  
    // Function to create and display a task in the list
    function renderTask(task) {
      const li = document.createElement('li'); // Create a list item for the task
      li.setAttribute('data-id', task.id); // Set task ID in the HTML
      li.classList.toggle('completed', task.completed); // Add "completed" class if the task is done
  
      // Set the inner HTML of the task item
      li.innerHTML = `
        <input type="checkbox" class="complete-checkbox" ${task.completed ? 'checked' : ''} />
        <strong>${task.title}</strong>
        <small>${getCategoryEmoji(task.category)}</small>
        <span>(${task.priority.toUpperCase()})</span>
        ${task.dueDate ? `<em>Due: ${task.dueDate}</em>` : ''}
        <button class="delete-btn">🗑️</button>
      `;
  
      // Add event listener to checkbox (mark task complete/incomplete)
      li.querySelector('.complete-checkbox').addEventListener('change', (e) => {
        task.completed = e.target.checked; // Update task status
        li.classList.toggle('completed', task.completed); // Add or remove completed class
        saveTasks(); // Save changes
        updateStats(); // Update count and progress bar
      });
  
      // Add event listener to delete button (remove task)
      li.querySelector('.delete-btn').addEventListener('click', () => {
        taskList = taskList.filter(t => t.id !== task.id); // Remove task from the array
        saveTasks(); // Save updated list
        li.remove(); // Remove from the screen
        updateStats(); // Update stats
      });
  
      // Add the task item to the <ul>
      tasksUl.appendChild(li);
    }
  
    // Function to update the progress and counts
    function updateStats() {
      const total = taskList.length; // Total number of tasks
      const completed = taskList.filter(t => t.completed).length; // Completed tasks count
  
      totalCount.textContent = total; // Update total count in UI
      completedCount.textContent = completed; // Update completed count
      progressBar.value = total ? (completed / total) * 100 : 0; // Set progress bar
    }
  
    // Function to save task list to localStorage
    function saveTasks() {
      localStorage.setItem('taskList', JSON.stringify(taskList)); // Convert to JSON and save
    }
  
    // Function to get an emoji and label based on task category
    function getCategoryEmoji(category) {
      switch (category) {
        case 'work': return '🧠 Work';
        case 'personal': return '🏡 Personal';
        case 'shopping': return '🛒 Shopping';
        default: return ''; // Default is empty string
      }
    }
  });
  