import { contextBridge, ipcRenderer } from "electron"

contextBridge.exposeInMainWorld('api', {

    handleRemoveLeftMargin: (callback: any) => ipcRenderer.on('removeLeftMargin', callback),
    handleRestoreLeftMargin: (callback: any) => ipcRenderer.on('restoreLeftMargin', callback),

    handleTest: (callback: any) => ipcRenderer.on('test', callback),

    handleSetSearchBar: (callback: any) => ipcRenderer.on('setSearchBar', callback),
    handleSetSearchBarURL: (callback: any) => ipcRenderer.on('setSearchBarURL', callback),

    backButtonPressed: () => ipcRenderer.send('goBack'),
    forwardButtonPressed: () => ipcRenderer.send('goForward'),
    refreshButtonPressed: () => ipcRenderer.send('refreshPage'),
    lockButtonPressed: () => ipcRenderer.send('lockButtonPressed'),

    handleCanGoBack: (callback: any) => ipcRenderer.on('canGoBack', callback),
    handleCanGoForward: (callback: any) => ipcRenderer.on('canGoForward', callback),

    searchBarQueryEntered: (query: string) => ipcRenderer.send('searchBarQueryEntered', query),

    titleBarDoubleClicked: () => ipcRenderer.send('titleBarDoubleClicked'),
})