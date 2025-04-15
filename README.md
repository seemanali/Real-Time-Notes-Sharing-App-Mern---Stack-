# 📄 Real-Time Notes Sharing App

A collaborative real-time document sharing app built with the **MERN stack** (MongoDB, Express.js, React, Node.js) and **Socket.io**. This application allows users to create, edit, and share notes instantly with others — all updates are synced live across connected users.


## 🚀 Features

- 📝 Real-time collaborative note editing
- 👥 User authentication (login/register)
- 💬 Socket.io-based live communication
- 🗃️ Persistent note storage using MongoDB
- 📱 Responsive and clean UI
- 🕓 Automatically syncs updates across clients
- 🔐 Secure routes and form validations


## 🛠️ Tech Stack

- **Frontend:** React.js, CSS/Tailwind
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (with Mongoose)
- **Real-Time Engine:** Socket.io
- **Authentication:** JWT (JSON Web Tokens)


## 🧑‍💻 How to Download and Use This Code

### 🛠️ Prerequisites

- Node.js & npm installed
- MongoDB (local or Atlas URI)

### 📦 Installation Steps

1. **Clone the repository:**

```bash
git clone https://github.com/seemanali/Real-Time-Notes-Sharing-App-Mern---Stack-.git
cd Real-Time-Notes-Sharing-App-Mern---Stack-

```

2. **Install Dependecies**

```bash
cd backend
npm install
cd ../frontend
npm install
```
   
3. **Create environment variables in the backend folder:**

Inside backend/, create a .env file and add:

```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

**▶️ Running the App**

Start both backend and frontend using:

```bash
cd backend
npm test
```
Then in seprate terminal :

```bash
cd frontend
npm test
```


##🖥️ App Usage

Open the browser and navigate to:
```bash
http://localhost:5173
```

Register or login to start creating and sharing notes in real-time!


##👨‍💻 Author

-Seeman Ali
-GitHub

