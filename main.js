const {app,BrowserWindow} = require('electron')
const path = require('path')
const {autoUpdater} = require('electron-updater')
const log = require('electron-log');

log.transports.file.resolvePath = () => path.join(__dirname, 'logs/main.log');
log.log("application version = " + app.getVersion())
log.info('Hello, log');

autoUpdater.setFeedURL({
        provider: 'github',
        owner: 'ibtissamOlearn',
        repo: 'https://github.com/ibtissamOlearn/auto-update-electron.git',
        token: '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'
    });

let win;
Object.defineProperty(app, 'isPackaged', {
    get() {
      return true;
    }
  });

autoUpdater.autoDownload = false ;
autoUpdater.autoInstallOnAppQuit = true;

function createWindow(){
win = new BrowserWindow({width:300,height:400})

win.loadFile(path.join(__dirname,'index.html'))
}


app.on('ready',()=>{
    createWindow()
    autoUpdater.checkForUpdates()
    win.webContents.send("updateMessage",`Checking for updates. Current version ${app.getVersion()}`)
})


autoUpdater.on('update-available',()=>{
   log.info('update-available')
   win.webContents.send("updateMessage",`Update available. Current version ${app.getVersion()}`);
})

autoUpdater.on('update-not-available',()=>{
    log.info('update-not-available')
    win.webContents.send("updateMessage",`No update available. Current version ${app.getVersion()}`);
 })

autoUpdater.on('checking-for-update',()=>{
    log.info('checking-for-update')
    win.webContents.send("updateMessage",`Checking for update. Current version ${app.getVersion()}`);
})

autoUpdater.on('error',(err)=>{
    log.info('error in auto updater ' + err)
    win.webContents.send("updateMessage",err);
 })

autoUpdater.on('download-progress',(progressTrack)=>{
    log.info('download-progress')
    log.info(progressTrack)
    win.webContents.send("updateMessage",`Downald in progress. Current version ${app.getVersion()}` + progressTrack.percent());
})
autoUpdater.on('update-downloaded',(info)=>{
    log.info('update-downloaded')
    win.webContents.send("updateMessage",`Update downloaded. Current version ${app.getVersion()}`);
})