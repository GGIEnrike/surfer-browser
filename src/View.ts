import { BrowserView, BrowserWindow, ipcMain } from "electron"
import * as path from "path"

export class View {
    view: BrowserView;
    constructor(width: number, height: number, tabHeight: number, win: BrowserWindow ) {
        this.view = new BrowserView({
            webPreferences: {
                nodeIntegration: false,
                sandbox: true,
                partition: 'persist:user',
                javascript: true,
                webSecurity: true,
                allowRunningInsecureContent: false,
                contextIsolation: true,
                webviewTag: false,
                zoomFactor: 1.0,
                navigateOnDragDrop: true
            }
        });
        win.addBrowserView(this.view)
        this.view.setBounds({ x: 0, y: tabHeight, width: width, height: height - tabHeight })
        this.view.setAutoResize({width: true, height: true})
        this.view.webContents.setVisualZoomLevelLimits(1, 3)
        this.view.webContents.loadURL('https://google.com')
        // this.view.webContents.openDevTools()

        this.view.webContents.setWindowOpenHandler((details: any) => {
            // Do stuff: open a new tab, navigate current tab, etc.
            this.view.webContents.loadURL(details.url)
            return {action: 'deny'}
        })

        this.view.webContents.on('did-fail-load', () => {
            console.log('failed loading the page!')
        })

        this.view.webContents.on('enter-html-full-screen', () => {
            const { width: w, height: h } = win.getBounds()
            this.view.setBounds({ x: 0, y: 0, width: w, height: h })
        })

        this.view.webContents.on('leave-html-full-screen', () => {
            const { width: w, height: h } = win.getBounds()
            this.view.setBounds({ x: 0, y: tabHeight, width: w, height: h - tabHeight })
        })

        const updateSearchBar = (_ev: any, url: string) => {
            let text: string
            if (typeof url === undefined) {
                return
            }
            if (url.indexOf('https://www.google.com/search?q=') === 0) {
                // text = new URL(url).toString()
                if (url.indexOf('&') === -1) {
                    text = url.substring(32)
                } else {
                    text = url.substring(32, url.indexOf('&'))
                }
                text = decodeURIComponent(text)
                text = text.replaceAll('+', ' ')
            } else if (url.indexOf('https://') === 0 || url.indexOf('http://') === 0) {
                text = url.replaceAll('https://', '').replaceAll('http://', '').replaceAll('www.', '')
                text = text.substring(0, text.indexOf('/'))
            } else {
                text = url
            }
            win.webContents.send('setSearchBar', text)
            win.webContents.send('setSearchBarURL', url)
        }
        this.view.webContents.on('will-navigate', updateSearchBar)
        this.view.webContents.on('did-navigate', (_ev: any, url: string) => {
            updateSearchBar(_ev, url)
            win.webContents.send('canGoBack', this.view.webContents.canGoBack())
            win.webContents.send('canGoForward', this.view.webContents.canGoForward())
        })
        // this.view.webContents.on('did-finish-load', updateSearchBar)

        this.view.webContents.on('did-finish-load', () => {
            this.view.webContents.setVisualZoomLevelLimits(1, 3)
        })

        ipcMain.on('goBack', () => {
            this.view.webContents.goBack()
        })

        ipcMain.on('goForward', () => {
            this.view.webContents.goForward()
        })

        ipcMain.on('refreshPage', () => {
            this.view.webContents.reload()
        })

        ipcMain.on('searchBarQueryEntered', (_event, query) => {
            if (query.indexOf('https://') === 0 || query.indexOf('http://') === 0) {
                this.view.webContents.loadURL(query)
            } else if (query.includes('.') || query.includes('/')) {
                this.view.webContents.loadURL('http://' + query)
            } else {
                this.view.webContents.loadURL(`https://google.com/search?q=${query}`)
            }
        })
    }
}