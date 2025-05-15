const options = document.querySelectorAll('.menu__option')

options.forEach((option) => {
    option.addEventListener('click', () => {
        document.querySelector('.menu__option--active').classList.remove('menu__option--active')
        option.classList.add('menu__option--active')
    })
})