class Task {
    #title
    #description
    #date

    constructor(title, description = '', date = '') {
        this.#title = title
        this.#description = description
        this.#date = date
    }

    getTitle() {
        return this.#title
    }

    getDescription() {
        let description = this.#description

        if (description.length == 0) {
            description = "No se agregó ninguna descripición"
        }

        return description
    }

    getDate() {
        let date = this.#date

        if (date.length == 0) {
            date = "Sin fecha"
        }

        return date
    }
}

class Manager {
    // Private roperties
    #validSections = ['tasks-pending', 'tasks-performed', 'tasks-all']
    #currentSection
    #tasksPendingAmount
    #tasksPerformedAmount
    #tasksPending = []
    #tasksPerformed = []

    #reloadPrincipalSection(content) {
        const principalSection = document.getElementById('principal')
        
        // Delete the old html content
        principalSection.innerHTML = ''
        // Apend the content to the principal section
        principalSection.appendChild(content)
    }

    #showTasksSection(tasks) {
        const taskContainerTemplate = document.getElementById('template-task-container')
        const taskContainerCopy = taskContainerTemplate.content.cloneNode(true).querySelector('div')

        const taskTemplate = document.getElementById('template-task')

        tasks.forEach((task) => {
            const taskCopy = taskTemplate.content.cloneNode(true).querySelector('div')
            const taskTitle = taskCopy.querySelector('.task__title')
            const taskDescription = taskCopy.querySelector('.task__description')
            const taskDate = taskCopy.querySelector('.task__date')

            // Get the task data
            const title = task.getTitle()
            const description = task.getDescription()
            const date = task.getDate()

            // Associate data with its elements
            taskTitle.innerText = title
            taskDescription.innerText = description
            taskDate.innerText = date

            // Add the task to the container
            taskContainerCopy.prepend(taskCopy)
        })

        this.#reloadPrincipalSection(taskContainerCopy)
    }

    #showEmptySection(messages) {
        const emptyTemplate = document.getElementById('template-empty')
        const emptyCopy = emptyTemplate.content.cloneNode(true).querySelector('div')

        // Append the message to the beginning
        for (let i = messages.length - 1; i >= 0; i--) {
            const messageP = document.createElement('p')
            messageP.textContent = messages[i]

            emptyCopy.prepend(messageP)
        }

        this.#reloadPrincipalSection(emptyCopy)
    }

    #showPendingTasks() {
        if (this.#tasksPendingAmount == 0) {
            this.#showEmptySection([
                'No tienes tareas pendientes.',
                'Agrega una nueva tarea.'
            ])
        } else {
            this.#showTasksSection(this.#tasksPending)
        }
    }

    #showPerformedTasks() {
        if (this.#tasksPerformedAmount == 0) {
            this.#showEmptySection([
                'No tienes tareas realizadas.',
                '¿Quieres agregar una nueva tarea?'
            ])
        } else {
            this.#showTasksSection(this.#tasksPerformed)
        }
    }

    #showAllTasks() {
        if (this.#tasksPendingAmount + this.#tasksPerformedAmount == 0) {
            this.#showEmptySection([
                'No tienes ninguna tarea.',
                'Has click para agregar una nueva tarea.'
            ])
        } else {
            const tasksAll = this.#tasksPerformed.concat(this.#tasksPending)
            this.#showTasksSection(tasksAll)
        }
    }

    #showAndHideTaskForm(elements) {
        const taskForm = document.getElementById('section-task-form')
        const backdrop = document.getElementById('backdrop')

        elements.forEach((element) => {
            element.addEventListener('click', () => {
                taskForm.classList.toggle('generate--hidden')
                backdrop.classList.toggle('backdrop--hidden')
            })
        })
    }

    #changeCurrentSection() {
        const section = this.#currentSection

        if (!this.#validSections.includes(section)) {
            return
        }

        switch(section) {
            case 'tasks-pending':
                this.#showPendingTasks()
                break
            case 'tasks-performed':
                this.#showPerformedTasks()
                break
            case 'tasks-all':
                this.#showAllTasks()
                break
        }

        // Add a click event to the button that adds a task
        this.#showAndHideTaskForm([document.getElementById('button-add-task')])
    }

    #changeSectionEvent() {
        const options = document.querySelector('.menu__container')
        const optionClass = 'menu__option'
        const activeClass = 'menu__option--active'

        // Set the current active section
        let activeElement = document.querySelector(`.${activeClass}`)
        this.#currentSection = activeElement.id
        this.#changeCurrentSection()

        options.addEventListener('click', (event) => {
            const clicked = event.target

            if (clicked.classList.contains(optionClass) &&
                !clicked.classList.contains(activeClass)) {
                // Change the active element to the clicked element
                activeElement.classList.remove(activeClass)
                clicked.classList.add(activeClass)
                activeElement = clicked

                // Change the current section
                this.#currentSection = activeElement.id
                this.#changeCurrentSection()
            }
        })
    }

    #addSectionEvent() {
        const showHideElements = document.querySelectorAll('[data-action="show-hide-form"]')
        this.#showAndHideTaskForm(showHideElements)

        const formTask = document.getElementById('form-task')
        const taskInput = document.getElementById('task')
        const descriptionInput = document.getElementById('description')
        const dateInput = document.getElementById('date')

        formTask.addEventListener('submit', (event) => {
            event.preventDefault()

            // Create a new task
            const task = new Task(
                taskInput.value,
                descriptionInput.value,
                dateInput.value
            )

            // There was a change in the current section
            this.#tasksPendingAmount++
            this.#tasksPending.push(task)
            this.#changeCurrentSection()

            // Clean the input values
            taskInput.value = ""
            descriptionInput.value = ""
            dateInput.value = ""
        })
    }

    constructor() {
        // Get the saved tasks
        this.#tasksPendingAmount = 0
        this.#tasksPerformedAmount = 0

        // Initial events
        this.#changeSectionEvent()
        this.#addSectionEvent()
    }
}


document.addEventListener('DOMContentLoaded', function() {
    new Manager()
})