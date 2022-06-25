import { app, BrowserView, ipcMain, nativeTheme, systemPreferences } from "electron"

import { Window } from "./Window"
import { View } from "./View"

declare global {
    interface Window {
        api?: any
    }
}

app.on("ready", () => {

    app.setName('Surfer')

    const userAgent = new BrowserView().webContents.getUserAgent()

    let surferVersion = userAgent.substring(userAgent.indexOf('Surfer/'))
    surferVersion = surferVersion.substring(0, surferVersion.indexOf(' '))
    let newUserAgent = userAgent.replace(surferVersion, 'Surfer/0.1.0')
    let electronAgent = newUserAgent.substring(newUserAgent.indexOf('Electron/'))
    electronAgent = electronAgent.substring(0, electronAgent.indexOf(' '))
    newUserAgent = newUserAgent.replace(' ' + electronAgent, '')

    app.userAgentFallback = newUserAgent

    const win = new Window(800, 600, false)
    const view = new View(800, 600, 38, win.win)
    
    // const settingsDropdown = new OverlayView(600, 35, 190, 350, '../pages/settings.html', 'toggleSettings', win.win, view.view)

    nativeTheme.themeSource = 'light'

    // UNCOMMENT IN PRODUCTION! This is a useful feature for users in production,
    // but an annoying thing for me in development

    // app.on("activate", function () {
    //     // On macOS it's common to re-create a window in the app when the
    //     // dock icon is clicked and there are no other windows open.
    //     if (BrowserWindow.getAllWindows().length === 0) win = new Window(800, 600, false)
    // })
})

// Uncomment on production.

// app.on("window-all-closed", () => {
//     if (process.platform !== "darwin") {
//         app.quit()
//     }
// })

