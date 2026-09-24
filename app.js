const STORAGE_KEY = 'focusflow.tasks.v1';

const state = {
  tasks: loadTasks(),
  filter: 'all',
  query: '',
};

const els = {
  form: document.querySelector('#taskForm'),
  input: document.querySelector('#taskInput'),
  search: document.querySelector('#searchInput'),
  list: document.querySelector('#taskList'),
  empty: document.querySelector('#emptyState'),
  emptyTitle: document.querySelector('#emptyTitle'),
  emptyCopy: document.querySelector('#emptyCopy'),
  allCount: document.querySelector('#allCount'),
  activeCount: document.querySelector('#activeCount'),
  completedCount: document.querySelector('#completedCount'),
  progress: document.querySelector('#progressRing'),
  progressValue: document.querySelector('#progressValue'),
  today: document.querySelector('#today'),
};

function loadTasks() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks));
}

function addTask(title) {
  const cleanTitle = title.trim();
  if (!cleanTitle) return;
  state.tasks.unshift({ id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), title: cleanTitle, completed: false, createdAt: Date.now() });
  saveTasks();
  els.input.value = '';
  render();
}

function visibleTasks() {
  const query = state.query.toLowerCase();
  return state.tasks.filter((task) => {
    const matchesFilter = state.filter === 'all' || (state.filter === 'active' && !task.completed) || (state.filter === 'completed' && task.completed);
    return matchesFilter && task.title.toLowerCase().includes(query);
  });
}

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[char]));
}

function render() {
  const completed = state.tasks.filter((task) => task.completed).length;
  const active = state.tasks.length - completed;
  const percent = state.tasks.length ? Math.round((completed / state.tasks.length) * 100) : 0;
  els.allCount.textContent = state.tasks.length;
  els.activeCount.textContent = active;
  els.completedCount.textContent = completed;
  els.progressValue.textContent = `${percent}%`;
  els.progress.style.setProperty('--progress', `${percent}%`);

  document.querySelectorAll('.filter').forEach((button) => {
    const activeFilter = button.dataset.filter === state.filter;
    button.classList.toggle('active', activeFilter);
    button.setAttribute('aria-selected', String(activeFilter));
  });

  const tasks = visibleTasks();
  els.list.innerHTML = tasks.map((task) => `
    <article class="task-item ${task.completed ? 'done' : ''}" data-id="${task.id}">
      <button class="check" data-action="toggle" aria-label="${task.completed ? 'Mark task active' : 'Complete task'}">✓</button>
      <div class="task-title">${escapeHtml(task.title)}</div>
      <div class="task-actions">
        <button class="icon-button" data-action="edit" aria-label="Edit task">✎</button>
        <button class="icon-button delete" data-action="delete" aria-label="Delete task">×</button>
      </div>
    </article>
  `).join('');

  const hasTasks = tasks.length > 0;
  els.empty.hidden = hasTasks;
  if (!hasTasks) {
    const hasFilters = state.tasks.length > 0;
    els.emptyTitle.textContent = hasFilters ? 'No matching tasks' : 'Nothing here yet';
    els.emptyCopy.textContent = hasFilters ? 'Try another search or filter.' : 'Add your first task above and make it happen.';
  }
}

function findTask(id) { return state.tasks.find((task) => task.id === id); }

els.form.addEventListener('submit', (event) => {
  event.preventDefault();
  addTask(els.input.value);
  els.input.focus();
});

els.search.addEventListener('input', (event) => {
  state.query = event.target.value;
  render();
});

document.querySelectorAll('.filter').forEach((button) => {
  button.addEventListener('click', () => {
    state.filter = button.dataset.filter;
    render();
  });
});

document.querySelector('#clearCompleted').addEventListener('click', () => {
  state.tasks = state.tasks.filter((task) => !task.completed);
  saveTasks();
  render();
});

els.list.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const item = button.closest('[data-id]');
  const task = findTask(item.dataset.id);
  if (!task) return;

  if (button.dataset.action === 'toggle') task.completed = !task.completed;
  if (button.dataset.action === 'delete') state.tasks = state.tasks.filter((candidate) => candidate.id !== task.id);
  if (button.dataset.action === 'edit') {
    const title = item.querySelector('.task-title');
    const input = document.createElement('input');
    input.className = 'edit-input';
    input.value = task.title;
    title.replaceWith(input);
    input.focus();
    input.select();
    const finish = () => {
      const value = input.value.trim();
      if (value) task.title = value;
      saveTasks();
      render();
    };
    input.addEventListener('blur', finish, { once: true });
    input.addEventListener('keydown', (keyEvent) => {
      if (keyEvent.key === 'Enter') input.blur();
      if (keyEvent.key === 'Escape') { input.value = task.title; input.blur(); }
    });
    return;
  }
  saveTasks();
  render();
});

els.today.textContent = new Intl.DateTimeFormat(undefined, { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date());
render();
