import { BrowserWindow, ipcMain, systemPreferences } from "electron"
import * as path from "path"

export class Window {
    win: BrowserWindow;

    constructor(width: number, height: number, devTools: boolean) {
        this.win = new BrowserWindow({
            width: width,
            height: height,
            minWidth: 532,
            title: "Surfer",
            webPreferences: {
                preload: path.join(__dirname, "preload.js"),
            },
            titleBarStyle: "hiddenInset",
            backgroundColor: "#dadada",
        });
        
        this.win.loadFile(path.join(__dirname, "../pages/index.html"));
        
        if (devTools) {
            this.win.webContents.openDevTools({mode: 'undocked'});
        }

        ipcMain.on('titleBarDoubleClicked', () => {
            const doubleClickAction = systemPreferences.getUserDefault('AppleActionOnDoubleClick', 'string');
            if (doubleClickAction === 'Minimize') {
                this.win.minimize();
            } else if (doubleClickAction === 'Maximize') {
                if (!this.win.isMaximized()) {
                this.win.maximize();
                } else {
                    this.win.unmaximize();
                }
            }
        })

        if (process.platform === 'darwin') {
            this.win.on('enter-full-screen', () => {
                this.win.webContents.send('removeLeftMargin')
            })
            this.win.on('leave-full-screen', () => {
                this.win.webContents.send('restoreLeftMargin')
            })
        }

        this.win.webContents.send('setTheme', 'dark')
    }
}