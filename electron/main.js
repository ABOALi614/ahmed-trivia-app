// =============================================================================
// ELECTRON MAIN PROCESS
// =============================================================================
// Creates the desktop window and loads index.html into it.
// Run with: npm start  (after `npm install`)
// =============================================================================

const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 480,
    height: 800,
    minWidth: 380,
    minHeight: 640,
    backgroundColor: "#0a0118", // matches --bg-deep, avoids a white flash on load
    title: "هل تعرف أحمد؟",
    autoHideMenuBar: true, // hides the default File/Edit/View menu bar
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadFile(path.join(__dirname, "..", "index.html"));

  // Uncomment while developing to open DevTools automatically:
  // win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

// macOS-style behavior: keep the app running until explicitly quit
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
