# Phone File Browser with Wi-Fi Hotspot

A comprehensive file browser application that allows you to access your PC's files from your phone through a Wi-Fi hotspot connection. The system consists of a Node.js/Express backend server, a web-based frontend, and a Python script to manage the Wi-Fi hotspot.

## Features

- **File Browser Interface:**
  - Browse files and folders on your PC
  - View text files, images, and videos directly in the browser
  - Download any file type
  - Markdown file support with preview
  - Responsive design for mobile devices

- **Wi-Fi Hotspot Management:**
  - Create a Wi-Fi hotspot from your PC
  - Automatic server startup
  - Easy connection management
  - Administrative privilege handling

## Prerequisites

- Node.js and npm installed on your PC
- Python 3.x installed on your PC
- Windows operating system (for Wi-Fi hotspot functionality)
- Administrative privileges (required for Wi-Fi hotspot creation)

## Installation

1. **Clone or download the repository**

2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

## Configuration

### Wi-Fi Settings (RunConnect.py)
The default Wi-Fi hotspot settings are:
- SSID: "TP-Link_3545"
- Password: "123pass123"

You can modify these in `RunConnect.py` if desired.

### Frontend Configuration (script.js)
The frontend is pre-configured to connect to `http://192.168.137.1:3001`. This IP address is typically assigned to your PC when creating a Wi-Fi hotspot.

## Usage

1. **Start the Application:**
   - Run `RunConnect.py` with administrator privileges
   - Choose option 1 from the menu to:
     - Start the Wi-Fi hotspot
     - Launch the Node.js server
     - Open connection instructions

2. **Connect Your Phone:**
   - Find and connect to the Wi-Fi network "TP-Link_3545"
   - Use password: "123pass123"
   - Open your phone's web browser
   - Navigate to: `http://192.168.137.1:3001`

3. **Using the File Browser:**
   - Click folders to navigate
   - Click files to:
     - View text files directly
     - Preview images and videos
     - Download any file type
   - Use the "Up" button to navigate to parent folders

4. **Stopping the Service:**
   - Choose option 2 in `RunConnect.py` to:
     - Stop the Wi-Fi hotspot
     - Stop the Node.js server
   - Or choose option 4 to quit completely

## Supported File Types

### Viewable in Browser:
- **Text Files:** .txt, .md, .log, .json, .js, .html, .css, .py, and many more
- **Images:** .jpg, .jpeg, .png, .gif, .bmp, .svg, .webp
- **Videos:** .mp4, .avi, .mov, .wmv, .flv, .webm, .mkv

### Special Features:
- **Markdown Files (.md):** Rendered with formatting
- **Images:** Displayed with responsive sizing
- **Videos:** Playable in browser with controls

## Troubleshooting

1. **Wi-Fi Hotspot Issues:**
   - Ensure you're running as administrator
   - Check if your Wi-Fi adapter supports hosted networks
   - Try restarting the computer if hotspot creation fails

2. **Server Connection Issues:**
   - Verify the Node.js server is running (check terminal)
   - Confirm you're connected to the correct Wi-Fi network
   - Try accessing the server from your PC first using `localhost:3001`

3. **File Access Issues:**
   - Ensure files have appropriate read permissions
   - Check if the path contains special characters
   - Verify the file isn't locked by another process

## Security Notes

- The Wi-Fi hotspot is secured with WPA2 encryption
- The application implements basic path traversal protection
- Administrative privileges are required for hotspot creation only

## License

This project is open source and available under the MIT License.
