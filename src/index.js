function Todo(name, $form, $list, $editForm, template) { // eslint-disable-line
    this.form = $form;
    this.list = $list;
    this.template = template;
    this.notes = [];
    this.name = name;
    this.editForm = $editForm;
}

Todo.prototype.save = function() {
    localStorage.setItem(this.name, JSON.stringify(this.notes));
};

Todo.prototype.render = function() {
    this.list.innerHTML = '';
    this.notes.forEach(note => {
        this.list.insertAdjacentHTML(
            'afterbegin',
            this.template(note)
        );
    });
};

Todo.prototype.init = function() {
    this.form.addEventListener('submit', e => {
        e.preventDefault();
        const dataRow = new FormData(e.target);
        const value = dataRow.get('value');
        this.append(value);
        this.render();
        this.save();
    });

    this.list.addEventListener('click', e => {
        const isCompleteBtn = e.target.tagName === 'BUTTON' && e.target.classList.contains('note__button--done');
        const isEditBtn = e.target.tagName === 'BUTTON' && e.target.classList.contains('note__button--edit');
        const currentNoteId = e.target.closest('.note__item').dataset.id;

        if(isCompleteBtn) {
            this.complete(currentNoteId);
        } else if(isEditBtn) {
            this.editForm.style.display = 'block';
            this.editForm.style.left = e.target.offsetLeft + 'px';
            this.editForm.style.top = e.target.offsetTop + 'px';
            this.editForm.setAttribute('data-id', currentNoteId);
        } else {
            this.remove(currentNoteId);
        }

        this.render();
        this.save();
    });

    this.editForm.addEventListener('submit', e => {
        e.preventDefault();

        const editDataRow = new FormData(e.target);
        const id = e.target.dataset.id; // eslint-disable-line
        const editData = editDataRow.get('edit-value');
        e.target.style.display = 'none';

        this.edit(id, editData);
        this.render();
        this.save();

    });

    const savedData = JSON.parse(localStorage.getItem(this.name));
    if(savedData) {
        this.notes = savedData;
        this.render();
    } else {
        this.notes = [];
    }
};

Todo.prototype.append = function(value) {
    const date = moment().format('x'); // eslint-disable-line
    const note = {
        value: value,
        createdAt: date,
        id: date,
        completed: false
    };
    this.notes.unshift(note);
    this.render();
    this.save();
};

Todo.prototype.edit = function(id, value) {
    this.notes.find(note => note.id === id).value = value;
};

Todo.prototype.complete = function(id) {
    this.notes.find(note => note.id === id).completed = true;
};

Todo.prototype.remove = function(id) {
    this.notes = this.notes.filter(note => note.id !== id);
};

const todo = new Todo(
    'todo',
    document.querySelector('.form'),
    document.querySelector('.note'),
    document.querySelector('.edit-form'),
    note => `<li data-id="${note.id}" class="note__item${note.completed ? ' note__item--completed' : ''}">
                <span class="note__text">${note.value}</span>
                <button class="note__button note__button--done" ${note.completed ? 'disabled' : ''}>Done</button>
                <button class="note__button note__button--edit">Edit</button>
                <button class="note__button note__button--remove">Remove</button>
            </li>`
);

todo.init();