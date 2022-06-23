const backButton = <HTMLButtonElement>document.getElementById('backButton')
const forwardButton = <HTMLButtonElement>document.getElementById('forwardButton')
const refreshButton = document.getElementById('refreshButton')
const settingsButton = document.getElementById('settingsButton')
const searchBar = <HTMLInputElement>document.getElementById('searchBar')
const titleBar = document.getElementById('tabBar')
const nonDoubleClickableElements = document.querySelectorAll('.barButton, #searchBar');

document.documentElement.setAttribute('data-theme', 'light')

window.api.handleRemoveLeftMargin(() => {
    backButton.style.marginLeft = '10px'
})

window.api.handleRestoreLeftMargin(() => {
    backButton.style.marginLeft = '80px'
})

backButton.addEventListener('click', () => {
    window.api.backButtonPressed()
})

forwardButton.addEventListener('click', () => {
    window.api.forwardButtonPressed()
})

refreshButton.addEventListener('click', () => {
    window.api.refreshButtonPressed()
})

settingsButton.addEventListener('click', () => {
    window.api.settingsButtonPressed()
})

window.api.handleCanGoBack((_ev: any, canGoBack: boolean) => {
    backButton.disabled = !canGoBack
})

window.api.handleCanGoForward((_ev: any, canGoForward: boolean) => {
    forwardButton.disabled = !canGoForward
})

searchBar.addEventListener('keyup' , (event) => {
    //key code for enter
    if (event.key === 'Enter') {
        window.api.searchBarQueryEntered(searchBar.value)
        event.preventDefault();
        searchBar.blur()
    }
})

let searchBarFocused = searchBar === document.activeElement
searchBar.addEventListener('focus', () => {
    searchBarFocused = true
    searchBar.value = searchBarURL
    searchBar.select()
    // searchBar.setSelectionRange(0, searchBar.value.length)
})

searchBar.addEventListener('blur', () => {
    searchBarFocused = false
    searchBar.value = searchBarText
})

let searchBarText = ''
let searchBarURL = ''
window.api.handleSetSearchBar((_ev: any, text: string) => {
    searchBarText = text
    if (!searchBarFocused) {
        searchBar.value = text
    }
})

window.api.handleSetSearchBarURL((_ev: any, url: string) => {
    searchBarURL = url
    if (searchBarFocused) {
        searchBar.value = url
    }
})

let canDoubleClickTitleBar = true

nonDoubleClickableElements.forEach(elm => {
    elm.addEventListener('mouseenter', () => {
        canDoubleClickTitleBar = false
    })
    elm.addEventListener('mouseout', () => {
        canDoubleClickTitleBar = true
    })
})

titleBar.addEventListener('dblclick', () => {
    if (canDoubleClickTitleBar) window.api.titleBarDoubleClicked()
})
