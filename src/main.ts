import { app, BrowserView, ipcMain, nativeTheme } from "electron"

import { Window } from "./Window"
import { View } from "./View"
import { OverlayView } from "./OverlayView"

declare global {
    interface Window {
        api?: any;
    }
}

app.on("ready", () => {

    app.setName('Surfer')

    const userAgent = new BrowserView().webContents.getUserAgent()

    let agentVersion = userAgent.substring(userAgent.indexOf('Surfer/'))
    agentVersion = agentVersion.substring(0, agentVersion.indexOf(' '))
    const newUserAgent = userAgent.replace(agentVersion, 'Surfer/0.1.0')

    app.userAgentFallback = newUserAgent

    const win = new Window(800, 600, true)
    const view = new View(800, 600, 38, win.win)
    
    // const settingsDropdown = new OverlayView(600, 35, 190, 350, '../pages/settings.html', 'toggleSettings', win.win, view.view)

    nativeTheme.themeSource = 'dark'

    // UNCOMMENT IN PRODUCTION! This is a useful feature for users in production,
    // but an annoying thing for me in development

    // app.on("activate", function () {
    //     // On macOS it's common to re-create a window in the app when the
    //     // dock icon is clicked and there are no other windows open.
    //     if (BrowserWindow.getAllWindows().length === 0) win = new Window(800, 600, false);
    // });
});

// Uncomment on production.

// app.on("window-all-closed", () => {
//     if (process.platform !== "darwin") {
//         app.quit();
//     }
// });

