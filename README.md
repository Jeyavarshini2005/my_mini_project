

# 🚀 Multi-Function React App

A simple React project that includes **Registration, Login, Calculator, To-Do List, Resume Builder, and Weather App** — all inside one application.

---

## 📌 Features

### 🔐 Authentication

* Register user
* Login user
* Uses **localStorage**

### 🏠 Dashboard

After login, the user sees 4 mini-apps:

* 🧮 **Calculator**
* 📝 **To-Do List**
* 📄 **Resume Builder**
* 🌤️ **Weather App**

### 🧮 Calculator

Performs +, −, ×, ÷

### 📝 To-Do App

Add, delete tasks

### 📄 Resume Builder

Fill details → generates preview

### 🌦️ Weather App

Fetches temperature using **OpenWeatherMap API**

---

## 📂 Project Structure

```
my-multi-app/
│
├── public/
├── src/
│   ├── pages/
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── Home.js
│   │   ├── Calculator.js
│   │   ├── Todo.js
│   │   ├── Resume.js
│   │   └── Weather.js
│   │
│   ├── App.js
│   ├── index.js
│   ├── style.css
│   └── logo.svg
│
├── package.json
└── README.md
```

---

## 🛠️ Tech Stack

* **React**
* **JavaScript**
* **HTML**
* **CSS**
* **React Router**
* **LocalStorage**
* **OpenWeatherMap API**

---

## ▶️ Running the Project

### 1️⃣ Install dependencies

```
npm install
```

### 2️⃣ Start the development server

```
npm start
```

### 3️⃣ Open in browser

```
http://localhost:3000
```

---

## 🌦️ Weather API Setup

Get an API key from:
[https://openweathermap.org/api](https://openweathermap.org/api)

Insert it in your Weather component:

```js
const API_KEY = "YOUR_API_KEY";
```

---



