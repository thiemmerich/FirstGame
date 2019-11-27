const { app, BrowserWindow } = require('electron')
// Mantém a referência global do objeto da janela.
// se você não fizer isso,
// a janela será fechada automaticamente
// quando o objeto JavaScript for coletado como lixo.
let win

function createWindow () {
  // Criar uma janela de navegação.
  win = new BrowserWindow({
    width: 590,
    height: 700,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  win.loadFile('index.html')

  // Hidding menubar, it's will show the menu when user press 'alt' key
  win.autoHideMenuBar = true;

  win.setBackgroundColor('#000')

  // Open the DevTools.
  win.webContents.openDevTools()

  // Disable resizeable
  win.resizable = false;

  // Emitido quando a janela é fechada.
  win.on('closed', () => {
    // Elimina a referência do objeto da janela, geralmente você iria armazenar as janelas
    // em um array, se seu app suporta várias janelas, este é o momento
    // quando você deve excluir o elemento correspondente.
    win = null
  })
}

// Este método será chamado quando o Electron tiver finalizado
// a inicialização e está pronto para criar a janela browser.
// Algumas APIs podem ser usadas somente depois que este evento ocorre.
app.on('ready', createWindow)