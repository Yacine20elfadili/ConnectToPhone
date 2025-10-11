Project: ConnectToPhone - Phone File Browser via Wi-Fi Hotspot

What it is: ConnectToPhone is a system that lets you browse and manage files on your computer directly from your phone's web browser, using a temporary Wi-Fi hotspot created on your PC. It combines a Python script (RunConnect.py) for hotspot management, a Node.js/Express backend server, and a web-based frontend.

How it works:

Initialization: Run RunConnect.py (as administrator) on your PC. This creates a Wi-Fi hotspot named "TP-Link_3545" with the password "123pass123" and starts a Node.js server.
Connection: Connect your phone to the "TP-Link_3545" Wi-Fi network using the provided password.
Access: Open your phone's web browser and navigate to http://192.168.137.1:3001. This will load the web-based file browser.
File Management: Use the browser to navigate folders, view text files, images, and videos, download files, and preview supported media. Markdown files are rendered with formatting.
Termination: To stop the system, choose option 4 in RunConnect.py to shut down the Node.js server and the Wi-Fi hotspot.
Key Components:

RunConnect.py: Python script for managing the Wi-Fi hotspot and launching the server.
Node.js/Express Backend: Handles file serving and communication.
Web Frontend: Provides the user interface for browsing and managing files.
Prerequisites:

Node.js and npm installed on your PC.
Python 3.x installed on your PC.
Windows operating system (for Wi-Fi hotspot functionality).