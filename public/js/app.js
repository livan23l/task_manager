class Task {
    
}


class Manager {
    // Private roperties
    #validSections = ['tasks-pending', 'tasks-performed', 'tasks-all']
    #tasksPendingAmount
    #tasksPerformedAmount
    #tasks

    #showEmptySection(messages) {
        const emptyTemplate = document.getElementById('template-empty')
        const emptyCopy = emptyTemplate.content.cloneNode(true).querySelector('div')

        // Append the message to the beginning
        for (let i = messages.length - 1; i >= 0; i--) {
            const messageP = document.createElement('p')
            messageP.textContent = messages[i]

            emptyCopy.prepend(messageP)
        }

        // Apend the empty copy to the principal section
        const principalSection = document.getElementById('principal')

        // Delete the old html content
        principalSection.innerHTML = ''
        principalSection.appendChild(emptyCopy)
    }

    #showPendingTasks() {
        if (this.#tasksPendingAmount == 0) {
            this.#showEmptySection([
                'No tienes tareas pendientes.',
                'Agrega una nueva tarea.'
            ])
        }
    }

    #showPerformedTasks() {
        if (this.#tasksPerformedAmount == 0) {
            this.#showEmptySection([
                'No tienes tareas realiadas.',
                '¿Quieres agregar una nueva tarea?'
            ])
        }
    }

    #showAllTasks() {
        if (this.#tasksPendingAmount + this.#tasksPerformedAmount == 0) {
            this.#showEmptySection([
                'No tienes ninguna tarea.',
                'Has click para agregar una nueva tarea.'
            ])
        }
    }

    #changeCurrentSection(section) {
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
    }

    #changeSectionEvent() {
        const options = document.querySelector('.menu__container')
        const optionClass = 'menu__option'
        const activeClass = 'menu__option--active'

        // Set the current active section
        let activeElement = document.querySelector(`.${activeClass}`)
        this.#changeCurrentSection(activeElement.id)

        options.addEventListener('click', (event) => {
            const clicked = event.target

            if (clicked.classList.contains(optionClass) &&
                !clicked.classList.contains(activeClass)) {
                // Change the active element to the clicked element
                activeElement.classList.remove(activeClass)
                clicked.classList.add(activeClass)
                activeElement = clicked

                // Change the current section
                this.#changeCurrentSection(activeElement.id)
            }
        })
    }

    constructor() {
        // Get the saved tasks
        this.#tasksPendingAmount = 0
        this.#tasksPerformedAmount = 0

        // Initial events
        this.#changeSectionEvent()
    }
}


document.addEventListener('DOMContentLoaded', function() {
    new Manager()
})