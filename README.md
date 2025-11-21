# 📱 ConnectToPhone

> Browse and manage your PC files directly from your phone's web browser using a Wi-Fi hotspot.  
> No internet required — just connect and browse!

**NOTE:** This project was only built and tested on Windows.

![Status](https://img.shields.io/badge/Status-Active-brightgreen) ![Node.js](https://img.shields.io/badge/Node.js-18+-green) ![Python](https://img.shields.io/badge/Python-3.x+-blue) ![Express](https://img.shields.io/badge/Express-4.x-lightgrey) ![HTML](https://img.shields.io/badge/HTML-5-orange) ![CSS](https://img.shields.io/badge/CSS-3-blue) ![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)

## ✨ Features

- **📡 Wi-Fi Hotspot** — Creates a local hotspot on your PC for phone connection
- **📂 File Browser** — Navigate folders and files through a clean web interface
- **👁️ File Preview** — View text files, images, and videos directly in browser
- **📥 File Download** — Download any file to your phone with one tap
- **📝 Markdown Rendering** — Beautiful formatting for `.md` files
- **🎬 Video Streaming** — Stream videos with range request support
- **📱 Responsive Design** — Optimized for mobile screens
- **🔒 Secure Access** — Directory traversal protection built-in

## 🗃️ Project Structure

```
ConnectToPhone/
├── RunConnect.py          # Main Python script (hotspot + server management)
├── README.md              # This documentation file
├── linkwifilink.png       # QR code or connection info image
├── backend/
│   └── server.js          # Node.js/Express backend server
└── frontend/
    ├── index.html         # Web interface entry point
    ├── script.js          # Frontend JavaScript logic
    └── style.css          # Styling and responsive design
```

## 🚀 Complete Setup Guide

### Prerequisites Check (Windows Only)

Before starting, verify these are installed on your Windows PC:

#### Step 1: Check Python Installation

1. Press `Win + R`, type `cmd`, press Enter
2. Run:
    ```cmd
    python --version
    ```
    **Expected**: `Python 3.x.x`

If not installed:
- Download from [Python.org](https://www.python.org/downloads/)
- **Important**: Check "Add Python to PATH" during installation

#### Step 2: Check Node.js Installation

In command prompt, run:
```cmd
node --version
npm --version
```
**Expected**: `v18.x.x` or higher for Node.js

If not installed:
- Download from [nodejs.org](https://nodejs.org/)

#### Step 3: Verify Administrator Access

This application requires administrator privileges to create Wi-Fi hotspots. Make sure you can run programs as administrator on your PC.

### Project Installation

#### Step 1: Clone or Download the Repository

1. Open Command Prompt
2. Navigate to your desired location:
    ```cmd
    cd C:\
    ```
3. Clone the project:
    ```cmd
    git clone https://github.com/Yacine20elfadili/ConnectToPhone.git
    ```
    Or download and extract the ZIP file to `C:\ConnectToPhone`

#### Step 2: Install Node.js Dependencies

Navigate to the backend folder and install dependencies:
```cmd
cd C:\ConnectToPhone\backend
npm install
```

This will install:
- `express` — Web server framework
- `cors` — Cross-origin resource sharing
- `fs` and `path` — File system utilities (built-in)

### Default Configuration

The application comes pre-configured with these settings:

| Setting | Default Value |
|---------|---------------|
| Wi-Fi Name (SSID) | `TP-Link_3545` |
| Wi-Fi Password | `123pass123` |
| Server Port | `3001` |
| Server IP | `192.168.137.1` |
| Storage Root | Parent of backend folder |

You can change the Wi-Fi name and password when running the script.

## 🎯 Usage Guide

### Starting the System

1. **Run the Python script as Administrator:**
   - Right-click `RunConnect.py`
   - Select "Run as administrator"
   - Or run from elevated command prompt:
     ```cmd
     python C:\ConnectToPhone\RunConnect.py
     ```

2. **Configure Wi-Fi settings (optional):**
   - The script will ask if you want to change the default Wi-Fi name and password
   - Press `n` to keep defaults or `y` to customize

3. **Start the hotspot and server:**
   - Choose option `1` from the menu
   - This will:
     - Create the Wi-Fi hotspot
     - Start the Node.js server
     - Open the connection info image

4. **Connect your phone:**
   - Go to your phone's Wi-Fi settings
   - Connect to `TP-Link_3545` (or your custom name)
   - Enter password: `123pass123` (or your custom password)

5. **Browse files:**
   - Open your phone's web browser
   - Navigate to: `http://192.168.137.1:3001`
   - Start browsing your PC files!

### Menu Options

| Option | Action |
|--------|--------|
| `1` | Start Hotspot + NPM Server + Open Image |
| `2` | Stop Hotspot + Stop NPM Server |
| `3` | Force Stop All NPM/Node Processes |
| `4` | Quit (stops everything and exits) |

### Web Interface Features

- **📁 Navigate Folders** — Click folders to enter, use "⬆️ Up" to go back
- **📄 View Text Files** — Click to preview `.txt`, `.json`, `.js`, `.py`, etc.
- **📝 View Markdown** — `.md` files render with full formatting
- **🖼️ View Images** — Preview `.jpg`, `.png`, `.gif`, `.svg`, etc.
- **🎬 Play Videos** — Stream `.mp4`, `.webm`, `.mkv`, etc.
- **📥 Download Files** — Click the download button or tap unsupported files

### Supported File Types

**Text Files:**
`.txt`, `.md`, `.log`, `.json`, `.js`, `.html`, `.css`, `.py`, `.xml`, `.csv`, `.yml`, `.yaml`, `.sh`, `.bat`, `.conf`, `.ini`, `.env`, `.java`, `.c`, `.cpp`, `.go`, `.php`, `.rb`, `.ts`, `.tsx`, `.sql`, and more

**Image Files:**
`.jpg`, `.jpeg`, `.png`, `.gif`, `.bmp`, `.svg`, `.webp`, `.ico`, `.tiff`

**Video Files:**
`.mp4`, `.avi`, `.mov`, `.wmv`, `.flv`, `.webm`, `.mkv`, `.m4v`, `.3gp`, `.ogv`

## 🔄 How It Works

1. **Hotspot Creation** — Python script uses `netsh` commands to create a Windows hosted network
2. **Server Launch** — Node.js Express server starts on port 3001
3. **Phone Connection** — Phone connects to the hotspot, receives IP via DHCP
4. **File Serving** — Express serves the frontend and handles API requests
5. **File Browsing** — Frontend fetches directory listings via `/api/browse`
6. **File Access** — Files are downloaded/streamed via `/api/download` with range support
7. **Text Viewing** — Text content retrieved via `/api/view-text-file`

## 🛠️ API Reference

| Endpoint | Method | Parameters | Description |
|----------|--------|------------|-------------|
| `/api/browse` | GET | `path` (optional) | List files and folders |
| `/api/download` | GET | `path` (required) | Download or stream a file |
| `/api/view-text-file` | GET | `path` (required) | Get text file content |

## ⚠️ Troubleshooting

### Hotspot Won't Start
- Ensure you're running as administrator
- Check if your Wi-Fi adapter supports hosted networks:
  ```cmd
  netsh wlan show drivers
  ```
  Look for "Hosted network supported: Yes"

### Can't Connect from Phone
- Make sure the hotspot is running (check Wi-Fi networks on phone)
- Verify password is correct
- Try forgetting the network and reconnecting

### Server Won't Start
- Check if Node.js is installed: `node --version`
- Ensure dependencies are installed: `cd backend && npm install`
- Check if port 3001 is already in use

### Can't Access Web Interface
- Verify you're connected to the correct Wi-Fi network
- Use exactly: `http://192.168.137.1:3001`
- Don't use `https://`

### Files Not Loading
- Check that the storage root directory exists
- Verify file permissions
- Check server console for error messages

## 🔒 Security Notes

- **Local Network Only** — The hotspot creates an isolated local network
- **No Internet Sharing** — By default, internet isn't shared through the hotspot
- **Directory Protection** — Server prevents directory traversal attacks
- **Password Protected** — Wi-Fi requires password to connect
- **Change Default Password** — Consider changing the default password for better security

## 📊 Technical Details

### Server Configuration

The Express server (`backend/server.js`) handles:
- Static file serving for the frontend
- Directory browsing with security checks
- File streaming with HTTP range requests (for video seeking)
- MIME type detection for proper file handling

### Frontend Architecture

The web interface (`frontend/`) features:
- Vanilla JavaScript (no frameworks required)
- CSS with modern features (flexbox, gradients, animations)
- Modal-based file preview system
- Simple markdown parser for `.md` files
- Responsive design for all screen sizes

## 🤝 Sharing with Friends

### What to Share
1. **Repository Link**: `https://github.com/Yacine20elfadili/ConnectToPhone`
2. **This README**: Complete setup instructions included
3. **Quick Start**: Just run `RunConnect.py` as admin!

### Requirements for Friends
- Windows PC with Wi-Fi adapter
- Node.js and Python installed
- Administrator access

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Mohamed Yacine Elfadili**
- GitHub: [@Yacine20elfadili](https://github.com/Yacine20elfadili)

---

**Note**: This tool is designed for personal use on local networks. Use responsibly and respect privacy when sharing files.
