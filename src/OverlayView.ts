import { BrowserView, BrowserWindow, ipcMain } from "electron"
import * as path from "path"

export class OverlayView {
    view: BrowserView
    open = false
    constructor(x: number, y: number, width: number, height: number, fileName: string, toggleSignal: string, win: BrowserWindow, view: BrowserView) {
        this.view = new BrowserView()
        win.addBrowserView(this.view)
        this.view.setBounds({ x: x, y: y, width: width, height: height })
        win.setTopBrowserView(view)
        
        this.view.webContents.loadFile(path.join(__dirname, fileName))
        ipcMain.on(toggleSignal, () => {
            if (this.open) {
                win.setTopBrowserView(view)
                this.open = false
            } else {
                win.setTopBrowserView(this.view)
                this.open = true
            }
        })
    }
}