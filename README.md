# Blockchains Testers

## Ethereum - geth

### Requirements

#### Step 1: Install Geth

On Linux (Ubuntu/Debian)

Add the Ethereum repository:

    sudo add-apt-repository -y ppa:ethereum/ethereum
    sudo apt-get update

Install Geth:

    sudo apt-get install geth

On macOS

    Using Homebrew:

    brew tap ethereum/ethereum
    brew install geth

On Windows

    Download the installer from the official Geth GitHub repository.
    Run the installer and follow the instructions.

#### Step 2: Verify Installation

After installing Geth, verify that it is correctly installed by running:

    geth version

    # Here we are in
    Version: 1.16.0-stable

This should display the version of Geth installed on your system.

#### Step 3: Add Geth to PATH (if necessary)

If Geth is installed but still not found, it might not be in your system's PATH. You can add it manually.

On Linux/macOS

    Find the Geth executable:
    which geth

If it returns a path, ensure that path is in your PATH environment variable.

Add to PATH:

    export PATH=$PATH:/path/to/geth

    Replace /path/to/geth with the actual path to the Geth executable.

On Windows

    Find the Geth executable: It is usually installed in C:\Program Files\Geth.
    Add to PATH:
        Open the Start Search, type in "env", and select "Edit the system environment variables".
        In the System Properties window, click on the "Environment Variables" button.
        Under "System variables", find the "Path" variable, select it, and click "Edit".
        Add the path to the Geth executable (e.g., C:\Program Files\Geth).

#### Step 4: Restart Terminal

After adding Geth to your PATH, restart your terminal or command prompt and try running geth version again.

### Launch

```
cd ethereum
chmod +x launch.sh 
./launch.sh 
```