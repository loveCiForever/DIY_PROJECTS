+---------------+
|  TodoItemFormatter  |
+---------------+
       |
       |
       v
+---------------+
|  TodoManager      |
|  - todos: []     |
|  - todoItemFormatter: TodoItemFormatter |
|  + addTodo(task, dueDate)  |
|  + editTodo(id, updatedTask) |
|  + deleteTodo(id)          |
|  + toggleTodoStatus(id)    |
|  + clearAllTodos()         |
|  + filterTodos(status)     |
+---------------+
       |
       |
       v
+---------------+
|  UIManager      |
|  - todoManager: TodoManager  |
|  - todoItemFormatter: TodoItemFormatter |
|  - taskInput: HTMLInputElement  |
|  - dateInput: HTMLInputElement  |
|  - addBtn: HTMLButtonElement  |
|  - todosListBody: HTMLTableElement |
|  - alertMessage: HTMLDivElement  |
|  + addEventListeners()        |
|  + handleAddTodo()           |
|  + handleClearAllTodos()     |
|  + showAllTodos()            |
|  + displayTodos(todos)       |
|  + handleEditTodo(id)        |
|  + handleToggleStatus(id)    |
|  + handleDeleteTodo(id)      |
|  + handleFilterTodos(status) |
+---------------+
       |
       |
       v
+---------------+
|  ThemeSwitcher  |
|  - themes: NodeList          |
|  - html: HTMLHtmlElement    |
|  + init()                  |
|  + addThemeEventListeners() |
|  + setTheme(themeName)      |
|  + saveThemeToLocalStorage(themeName) |
|  + getThemeFromLocalStorage() |
+---------------+