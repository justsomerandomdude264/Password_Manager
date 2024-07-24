# Password Manager

This project aims to create a simple but efficient password manager. It includes two versions:
1. **Desktop App**
2. **Web Deployable**

## Desktop App

### Installation

To install this program on your Windows device:

1. Download one of the installers from `Installers/Windows`.
2. Double-click the installer and follow the prompts to install the program (`.msi` is recommended).

### Source Code

To edit or review the source code:

1. Clone the repository:
    ```sh
    git clone https://github.com/KrishnaPaliwal264/Password_Manager.git
    ```
2. Navigate to the `desktop_app` folder:
    ```sh
    cd Password_Manager/desktop_app
    ```

## Web Deployable

### Usage 

To use the web version, follow these steps:

1. **Clone the repository**:
    ```sh
    git clone https://github.com/KrishnaPaliwal264/Password_Manager.git
    cd Password_Manager/web_deployable
    ```

2. **Make the Docker image and Run it**:
    ```sh
    docker-compose up --build
    ```

### Source Code

To edit or review the source code:

1. Clone the repository:
    ```sh
    git clone https://github.com/KrishnaPaliwal264/Password_Manager.git
    ```
2. Navigate to the `web_deployable` folder:
    ```sh
    cd Password_Manager/web_deployable
    ```

## Project Workflow

1. Desktop app
   - This is made using an electron app with react integrated in it.
   - The passwords and the data is tored in local storage and is unencrypted.
   - Credentials are used as an alternative for Multi-Factor Authentication.

2. Web Deployable
   - This uses react as its frontend and java's spring boot framework for backend.
   - MySQL8 is used for database management.
   - Two tables are made one with user data and the other has password data mapped with users.
   - All data managed using JPA in spring boot and multiple API endpoints are set up for multiple uses like register, login, saving passwords etc
   - The data stored is completely encrypted whether its user passwords or the passwords stored in the database.
   - The user account passswords include using sha256 hashing for encryption while for the saved passwords key based encryption is used.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.
Would like if someone built the Mac and Linux installers.
