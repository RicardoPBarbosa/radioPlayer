const {app, BrowserWindow, globalShortcut, Menu, Tray} = require('electron');
const join = require('path').join;

const openAboutWindow = require('electron-about-window').default;

let mainWindow = null;
let tray = null;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 318,
    height: 500,
    resizable: false,
    titleBarStyle: 'hidden',
    maximizable: false,
    hasShadow: true
  });

  setMenuItems();

  // listen for a pause or play action
  globalShortcut.register('MediaPlayPause', () => {
    let code = `control.click();`;
    mainWindow.webContents.executeJavaScript(code);
  });

  // mainWindow.webContents.openDevTools();

  // mainWindow.loadURL('https://www.youtube.com/feed/subscriptions');
  mainWindow.loadURL(`file://${__dirname}/app/index.html`);

  /* set tray */
  setTray();
});

setMenuItems = () => {
  let template = [];
  
  if (process.platform === 'darwin') {
    template = [
      {
        label: 'Radio Nova Era',
        // label: app.getName(),
        submenu: [
          {
            label: 'About This App',
            click() {
              openAboutWindow({
                icon_path: join(__dirname, 'app/assets/img/about.png'),
                copyright: '(2018) Ricardo Barbosa',
                package_json_dir: __dirname,
                homepage: 'https://github.com/RicardoPBarbosa',
                // open_devtools: process.env.NODE_ENV !== 'production',
                css_path: join(__dirname, 'about-window.css'),
              });
            }
          },
          {type: 'separator'},
          {role: 'hide', label: 'Hide'},
          {type: 'separator'},
          {role: 'quit', label: 'Quit'}
        ]
      }
    ]
  }
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

const setTray = () => {
  tray = new Tray(join(__dirname, 'app/assets/img/tray.png'));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Play / Pause',
      type: 'normal',
      click() {
        const code = `control.click();`;
        mainWindow.webContents.executeJavaScript(code);
      }
    },
    // TODO: Add song name & artist to the tray list to be seen anytime with a click without maximizing the app; The request to get the current song must be asked at the click on the tray icon
    // {
    //   label: 'Song Name / Artist',
    //   type: 'normal',
    //   enabled: false,
    // },
    // {
    //   label: 'Artist',
    //   type: 'normal',
    //   enabled: false,
    // },
    {
      label: 'Copy To Clipboard',
      type: 'normal',
      click() {
        const code = `copy();`;
        mainWindow.webContents.executeJavaScript(code);
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Quit',
      role: 'quit',
      accelerator: 'Command+Q'
    },
  ]);
  tray.setContextMenu(contextMenu);
}

app.on('will-quit', () => {
  // Unregister all shortcuts.
  globalShortcut.unregisterAll();
});