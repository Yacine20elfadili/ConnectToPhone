import ctypes
import subprocess
import sys
import os
import psutil
import time


WiFiName = "TP-Link_3545"
Password = "123pass123"


def is_admin():
    """Check if the script is running with administrative privileges."""
    try:
        # The IsUserAnAdmin function returns a non-zero value if the user is an admin.
        return ctypes.windll.shell32.IsUserAnAdmin()
    except:
        return False

def run_command(command):
    """Executes a command and prints its output."""
    print(f"\n> Executing: {' '.join(command)}")
    try:
        # We use subprocess.run to execute the command.
        # capture_output=True saves stdout and stderr.
        # text=True decodes them as text.
        # check=True will raise an exception if the command returns a non-zero exit code (an error).
        result = subprocess.run(
            command,
            capture_output=True,
            text=True,
            check=True,
            shell=False  # Don't use shell=True for netsh commands
        )
        print("--- Success ---")
        if result.stdout:
            print("Output:")
            print(result.stdout)
        return True
    except FileNotFoundError:
        print(f"Error: Command not found. Is 'netsh' in your system's PATH?")
        return False
    except subprocess.CalledProcessError as e:
        # This block catches errors from the command itself
        print("--- Command Failed ---")
        print(f"Error Code: {e.returncode}")
        if e.stdout:
            print("Output:")
            print(e.stdout)
        if e.stderr:
            print("Error Output:")
            print(e.stderr)
        return False

def start_npm_server():
    """Start npm in the specified directory."""
    npm_dir = r"C:\ConnectToPhone\backend"
    
    if not os.path.exists(npm_dir):
        print(f"Error: Directory {npm_dir} does not exist!")
        return None
    
    print(f"\n> Starting npm in directory: {npm_dir}")
    
    # Try different ways to find and run npm
    npm_commands = [
        ["npm", "start"],
        ["npm.cmd", "start"],
        [r"C:\Program Files\nodejs\npm.cmd", "start"],
        [r"C:\Program Files (x86)\nodejs\npm.cmd", "start"]
    ]
    
    for cmd in npm_commands:
        try:
            print(f"Trying command: {' '.join(cmd)}")
            # Start npm in the background
            process = subprocess.Popen(
                cmd,
                cwd=npm_dir,
                creationflags=subprocess.CREATE_NEW_CONSOLE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                shell=True  # Use shell=True for Windows compatibility
            )
            print("--- NPM Server Started ---")
            print(f"Process ID: {process.pid}")
            
            # Wait a moment to see if the process starts successfully
            time.sleep(2)
            if process.poll() is None:  # Process is still running
                return process
            else:
                print(f"Process exited with code: {process.poll()}")
                continue
                
        except Exception as e:
            print(f"Failed with command {cmd[0]}: {e}")
            continue
    
    # If all npm commands failed, try using cmd directly
    try:
        print("Trying with cmd.exe...")
        process = subprocess.Popen(
            f'cmd /c "cd /d {npm_dir} && npm start"',
            creationflags=subprocess.CREATE_NEW_CONSOLE,
            shell=True
        )
        print("--- NPM Server Started via CMD ---")
        print(f"Process ID: {process.pid}")
        return process
    except Exception as e:
        print(f"Error starting npm via cmd: {e}")
        print("\nTroubleshooting tips:")
        print("1. Make sure Node.js is installed")
        print("2. Try running 'npm --version' in command prompt")
        print("3. Check if package.json exists in the backend directory")
        print("4. Try running 'npm install' first in the backend directory")
        return None

def stop_npm_processes():
    """Stop all npm processes."""
    print("\n> Stopping npm processes...")
    processes_killed = 0
    
    try:
        # Find and terminate npm processes
        for proc in psutil.process_iter(['pid', 'name', 'cmdline']):
            try:
                process_name = proc.info['name']
                cmdline = proc.info['cmdline']
                
                # Check for npm processes
                if process_name and 'npm' in process_name.lower():
                    proc.kill()  # Use kill() instead of terminate() for more force
                    print(f"Killed npm process: {proc.info['pid']}")
                    processes_killed += 1
                
                # Check for node processes (which npm spawns)
                elif process_name and 'node' in process_name.lower():
                    proc.kill()
                    print(f"Killed node process: {proc.info['pid']}")
                    processes_killed += 1
                
                # Check for cmd processes running npm
                elif cmdline and any('npm' in str(cmd).lower() for cmd in cmdline):
                    proc.kill()
                    print(f"Killed npm-related process: {proc.info['pid']}")
                    processes_killed += 1
                    
            except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
                pass
        
        # Also try to kill processes by port (if you know your server port)
        # This is useful if processes are using specific ports
        try:
            # Kill processes using common development ports
            common_ports = [3000, 3001, 5000, 8000, 8080]
            for port in common_ports:
                for proc in psutil.process_iter(['pid', 'name', 'connections']):
                    try:
                        if proc.info['connections']:
                            for conn in proc.info['connections']:
                                if conn.laddr.port == port:
                                    proc.kill()
                                    print(f"Killed process using port {port}: {proc.info['pid']}")
                                    processes_killed += 1
                    except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
                        pass
        except:
            pass
        
        if processes_killed > 0:
            print(f"--- {processes_killed} processes stopped ---")
            # Wait a moment for processes to fully terminate
            time.sleep(2)
        else:
            print("--- No npm/node processes found ---")
            
        return True
    except Exception as e:
        print(f"Error stopping npm processes: {e}")
        return False

def open_images():
    """Open the specified image."""
    image_path = r"C:\ConnectToPhone\linkwifilink.png"
    
    print("\n> Opening image...")
    try:
        if os.path.exists(image_path):
            # Use the default system image viewer
            os.startfile(image_path)
            print(f"Opened: {image_path}")
        else:
            print(f"Warning: Image not found: {image_path}")
    except Exception as e:
        print(f"Error opening image {image_path}: {e}")

def main():
    """Main function to run the hotspot manager."""
    global WiFiName, Password  # Allow modification of global variables
    
    # Ask user if they want to change default settings
    print("\n--- WiFi Settings ---")
    print(f"Current WiFi Name: {WiFiName}")
    print(f"Current Password: {Password}")
    change = input("Do you want to change these settings? (y/n): ").lower()
    
    if change == 'y':
        WiFiName = input("Enter new WiFi name: ") or WiFiName
        Password = input("Enter new password (8-63 characters): ") or Password
        print("\nSettings updated!")
    
    while True:
        print("\n--- Windows Hotspot Manager ---")
        print("1. Start Hotspot (+ NPM Server + Open Image)")
        print("2. Stop Hotspot (+ Stop NPM Server)")
        print("3. Force Stop All NPM/Node Processes")
        print("4. Quit")
        choice = input("Enter your choice (1/2/3/4): ")
        
        # Define commands here to use updated WiFiName and Password
        setup_command = ["netsh", "wlan", "set", "hostednetwork", f"ssid={WiFiName}", f"key={Password}", "mode=allow"]
        start_command = ["netsh", "wlan", "start", "hostednetwork"]
        stop_command = ["netsh", "wlan", "stop", "hostednetwork"]
        
        if choice == '1':
            print("Setting up and starting the hotspot...")
            if run_command(setup_command) and run_command(start_command):
                print("\nStarting NPM server...")
                npm_process = start_npm_server()
                
                print("\nOpening image...")
                open_images()
                
                print("\n=== All services started successfully! ===")
            else:
                print("\nFailed to start hotspot. NPM server not started.")
                
        elif choice == '2':
            print("Stopping the hotspot...")
            run_command(stop_command)
            
            print("Stopping NPM server...")
            stop_npm_processes()
            
            print("\n=== All services stopped successfully! ===")
            
        elif choice == '3':
            print("Force stopping all NPM/Node processes...")
            stop_npm_processes()
            
        elif choice == '4':
            print("Stopping hotspot before quitting (if it's running)...")
            run_command(stop_command)
            
            print("Stopping NPM server before quitting...")
            stop_npm_processes()
            
            print("\nExiting program.")
            break
        else:
            print("\nInvalid choice. Please try again.")
            
    input("\nPress Enter to close the window.")

if __name__ == "__main__":
    if is_admin():
        # If we are admin, run the main program logic
        main()
    else:
        # If we are not admin, re-run the script with elevation
        print("Requesting administrator privileges...")
        try:
            # This uses the 'runas' verb to trigger the UAC prompt
            ctypes.windll.shell32.ShellExecuteW(
                None,           # Hwnd
                "runas",        # Verb: asks for elevation
                sys.executable, # File: the python interpreter
                f'"{__file__}"', # Parameters: the script file itself (quoted to handle spaces)
                None,           # Directory
                1               # Show command (SW_SHOWNORMAL)
            )
        except Exception as e:
            print(f"Failed to elevate privileges: {e}")
            input("Press Enter to exit...")
        
        # Exit the current process since we're launching a new elevated one
        sys.exit(0)