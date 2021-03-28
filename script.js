// Селекторы
const mainInput    = document.querySelector('.main__input');
const mainButton   = document.querySelector('.main__button');
const mainList     = document.querySelector('.list__items');
const mainSelect   = document.querySelector('.main__select');
const filterOption = document.querySelector('.main__filter');

// Обработка событий
document.addEventListener('DOMContentLoaded', getTodos);
document.addEventListener('DOMContentLoaded', focusNewTodo);
mainButton.addEventListener('click', addTask);
mainList.addEventListener('click', deleteCheck);
filterOption.addEventListener('click', filterTodo);
filterOption.addEventListener('click', selectArrowToggle);
filterOption.addEventListener('blur', selectArrowAway);

// Функции
function addTask(event) {

   // Отключаем обновление страницы при нажатии
   event.preventDefault();

   // Проверяем заполнено ли поле ввода
   if (mainInput.value) {

      // Создаем шаблон для задачи
      // 1. li
      const listItem = document.createElement('li');
      listItem.classList.add('list__item');  

      // 2. div
      const newTask = document.createElement('div');
      newTask.innerText = mainInput.value;
      newTask.classList.add('list__item-text');
      listItem.append(newTask);

      // Добавляем значение поле ввода в локальное хранилище
      saveLocalTodos(mainInput.value);

      // 3. Кнопка checked
      const completedButton = document.createElement('button');
      completedButton.insertAdjacentHTML('afterbegin', '<svg class="list__icon-completed"><use href="images/checked.svg#checked"></use></svg>');
      completedButton.classList.add('list__button-completed');
      listItem.append(completedButton);

      // 4. Кнопка delete
      const deleteButton = document.createElement('button');
      deleteButton.insertAdjacentHTML('afterbegin', '<svg class="list__icon-delete"><use href="images/bin.svg#bin"></use></svg>');
      deleteButton.classList.add('list__button-delete');
      listItem.append(deleteButton);

      // Добавляем в общий список
      // mainList.append(listItem);

      // Добавляем в общий список первым элементом      
      mainList.prepend(listItem);


      // Очищаем поле ввода
      mainInput.value = '';

      // Возвращаем фокус на поле ввода
      focusNewTodo();
   } else {
      // Если поле ввода пустое, возвращаем фокус на него же
      focusNewTodo();
   };
};

function deleteCheck(event) {
   const item = event.target;

   // Удалить задачу
   if (item.classList[0] === 'list__button-delete') {
      const task = item.parentElement;
      task.classList.add('fall');

      // Удаляем задачу из локального хранилища
      // removeLocalTodos('list__item');
      removeLocalTodos(task);

      task.addEventListener('transitionend', function() {
         task.remove();
      });
   };   

   // Отметить выполнение задачи
   if (item.classList[0] === 'list__button-completed') {
      const task = item.parentElement;
      task.classList.toggle('list__item--completed');
   };
};

// Поиск псевдоэлемента
const styleSheet = document.styleSheets[0];
let selectRule;

for (let index = 0; index < styleSheet.cssRules.length; index++) {
   if (styleSheet.cssRules[index].selectorText === '.main__select::after') {
      selectRule = styleSheet.cssRules[index];
   };   
};

// Изменение стилей псевдоэлемента
function selectArrowToggle() {
   if (selectRule.style.transform === 'rotateX(0deg)') {
      selectRule.style.transform = 'rotateX(180deg)';
   } else {
      selectRule.style.transform = 'rotateX(0deg)';
   }
};

function selectArrowAway() {
   selectRule.style.transform = 'rotateX(0deg)';
};

// Сортировка задач по тегам
function filterTodo(e) {
   const todos = mainList.childNodes;
   todos.forEach(function (listItem) {
      switch(e.target.value) {
         case "all": 
            listItem.style.display = 'flex';
            break;
         case "completed":
            if (listItem.classList.contains('list__item--completed')) {
               listItem.style.display = 'flex';
            } else {
               listItem.style.display ='none';
            };
            break;
         case "uncompleted":
            if (!listItem.classList.contains('list__item--completed')) {
               listItem.style.display = 'flex';
            } else {
               listItem.style.display ='none';
            };
            break;
      };
   });   
};

// Проверка локального хранилища
function checkLocalStorage() {  
   
   if (localStorage.getItem('list__item') === null) {
      todos = [];      
   } else {
      todos = JSON.parse(localStorage.getItem('list__item'));     
   };
   
   return todos;
};

// Сохранение задач в локальное хранилище
function saveLocalTodos(todo) {

   // Проверка локального хранилища на наличие задач
   // let todos;
   // if (localStorage.getItem('list__item') === null) {
   //    todos = [];
   // } else {
   //    todos = JSON.parse(localStorage.getItem('list__item'));     
   // };

   checkLocalStorage();
   
   // Запись в массив задач в локальном хранилище
   todos.push(todo);
   localStorage.setItem('list__item', JSON.stringify(todos));   
}

// Вывод задач, сохранённых в локальном хранилище, при загрузке страницы
function getTodos() {

   // let todos;
   // if (localStorage.getItem('list__item') === null) {
   //    todos = [];
   // } else {
   //    todos = JSON.parse(localStorage.getItem('list__item'));      
   // };

   checkLocalStorage();

   todos.forEach(function (todo) {
      // Создаем шаблон для задачи
      // 1. li
      const listItem = document.createElement('li');
      listItem.classList.add('list__item');  

      // 2. div
      const newTask = document.createElement('div');
      newTask.innerText = todo;
      newTask.classList.add('list__item-text');
      listItem.append(newTask);   

      // 3. Кнопка checked
      const completedButton = document.createElement('button');
      completedButton.insertAdjacentHTML('afterbegin', '<svg class="list__icon-completed"><use href="images/checked.svg#checked"></use></svg>');
      completedButton.classList.add('list__button-completed');
      listItem.append(completedButton);

      // 4. Кнопка delete
      const deleteButton = document.createElement('button');
      deleteButton.insertAdjacentHTML('afterbegin', '<svg class="list__icon-delete"><use href="images/bin.svg#bin"></use></svg>');
      deleteButton.classList.add('list__button-delete');
      listItem.append(deleteButton);

      // Добавляем в общий список
      // mainList.append(listItem);

      // Добавляем в общий список первым элементом
      mainList.prepend(listItem);
   });
}

// Удаление задач из локального хранилища, при нажатии "удалить задачу"
function removeLocalTodos(newTask) {

   // let todos;
   // if (localStorage.getItem('list__item') === null) {
   //    todos = [];
   // } else {
   //    todos = JSON.parse(localStorage.getItem('list__item'));      
   // };

   checkLocalStorage();

   const todoIndex = newTask.children[0].innerText;  
   todos.splice(todos.indexOf(todoIndex), 1);    
   localStorage.setItem('list__item', JSON.stringify(todos));
   focusNewTodo();
}

// Фокус на окно ввода при загрузке страницы
function focusNewTodo() {
   mainInput.focus();
}