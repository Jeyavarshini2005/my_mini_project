import React, { useState, useEffect } from "react";

/*
 Very simple multi-app:
 - Register
 - Login
 - Dashboard with buttons (Calculator, ToDo, Resume, Weather)
 - Calculator works
 - ToDo simple
 - Resume shows a preview
 - Weather is a tiny demo (no API) but explained how to connect API
*/

function App(){
  const [page, setPage] = useState("register"); // register, login, dashboard, calc, todo, resume, weather
  const [registeredUser, setRegisteredUser] = useState(null);
  const [loggedUser, setLoggedUser] = useState(null);

  // load saved user from localStorage
  useEffect(()=>{
    const saved = localStorage.getItem("myapp_user");
    if(saved) setRegisteredUser(JSON.parse(saved));
    const logged = localStorage.getItem("myapp_logged");
    if(logged) {
      setLoggedUser(JSON.parse(logged));
      setPage("dashboard");
    }
  },[]);

  // save registered user
  const saveRegistered = (user) => {
    localStorage.setItem("myapp_user", JSON.stringify(user));
    setRegisteredUser(user);
  };

  // log user in
  const doLogin = (email) => {
    const user = registeredUser;
    if(user && user.email === email){
      localStorage.setItem("myapp_logged", JSON.stringify(user));
      setLoggedUser(user);
      setPage("dashboard");
    } else {
      alert("No user found or email wrong. Please register first.");
    }
  };

  // logout
  const doLogout = () => {
    localStorage.removeItem("myapp_logged");
    setLoggedUser(null);
    setPage("login");
  };

  // small header
  return (
    <div className="container">
      <h2>My Mini Project</h2>
      { loggedUser && <p style={{textAlign:"center"}}>Hello, <b>{loggedUser.name}</b></p> }

      {page === "register" && <Register onSave={saveRegistered} goLogin={()=>setPage("login")} />}
      {page === "login" && <Login onLogin={doLogin} goRegister={()=>setPage("register")} />}
      {page === "dashboard" && <Dashboard onOpen={(p)=>setPage(p)} onLogout={doLogout} />}
      {page === "calc" && <Calculator goBack={()=>setPage("dashboard")} />}
      {page === "todo" && <ToDo goBack={()=>setPage("dashboard")} />}
      {page === "resume" && <Resume goBack={()=>setPage("dashboard")} />}
      {page === "weather" && <Weather goBack={()=>setPage("dashboard")} />}
    </div>
  );
}

/* ---------- Register ---------- */
function Register({ onSave, goLogin }){
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if(!name || !email || !password){ alert("Please fill all"); return; }
    const user = { name, email, password };
    onSave(user);
    alert("Registered! Now go to Login.");
    goLogin();
  };

  return (
    <form onSubmit={submit}>
      <h3>Register</h3>
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" />
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
      <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" />
      <button type="submit">Register</button>
      <div style={{textAlign:"center", marginTop:10}}>
        <button type="button" className="small-btn" onClick={goLogin}>I already have account → Login</button>
      </div>
    </form>
  );
}

/* ---------- Login ---------- */
function Login({ onLogin, goRegister }){
  const [email, setEmail] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if(!email){ alert("Enter email"); return; }
    onLogin(email);
  };

  return (
    <form onSubmit={submit}>
      <h3>Login</h3>
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email used at register" />
      <button type="submit">Login</button>
      <div style={{textAlign:"center", marginTop:10}}>
        <button type="button" className="small-btn" onClick={goRegister}>Create new account</button>
      </div>
    </form>
  );
}

/* ---------- Dashboard ---------- */
function Dashboard({ onOpen, onLogout }){
  return (
    <div>
      <h3>Dashboard</h3>
      <div className="row">
        <button className="card-btn" onClick={()=>onOpen("calc")}>Calculator</button>
        <button className="card-btn" onClick={()=>onOpen("todo")}>To-Do List</button>
        <button className="card-btn" onClick={()=>onOpen("resume")}>Resume</button>
        <button className="card-btn" onClick={()=>onOpen("weather")}>Weather</button>
      </div>
      <div style={{textAlign:"center", marginTop:12}}>
        <button onClick={onLogout}>Logout</button>
      </div>
    </div>
  );
}

/* ---------- Calculator ---------- */
function Calculator({ goBack }){
  const [expr, setExpr] = useState("");
  const [result, setResult] = useState("");

  const press = (v) => setExpr(prev => prev + v);
  const clearAll = () => { setExpr(""); setResult(""); };
  const del = () => setExpr(prev => prev.slice(0,-1));
  const calculate = () => {
    try {
      // safe eval: allow digits and + - * / . ( ) only
      if(!/^[0-9+\-*/().\s]+$/.test(expr)) { setResult("Invalid chars"); return; }
      // eslint-disable-next-line no-eval
      const res = eval(expr);
      setResult(String(res));
    } catch (e){
      setResult("Error");
    }
  };

  return (
    <div>
      <h3>Calculator</h3>
      <input value={expr} onChange={e=>setExpr(e.target.value)} placeholder="type or press buttons" />
      <div className="row" style={{marginTop:8}}>
        {["7","8","9","/","4","5","6","*","1","2","3","-","0",".","(",")","+"].map((k)=>(
          <button key={k} onClick={()=>press(k)} style={{minWidth:50}}>{k}</button>
        ))}
      </div>
      <div className="row" style={{marginTop:8}}>
        <button onClick={calculate}>=</button>
        <button onClick={del}>DEL</button>
        <button onClick={clearAll}>C</button>
        <button onClick={goBack}>Back</button>
      </div>

      <div className="result">
        <div><b>Expression:</b> {expr || "-"}</div>
        <div><b>Result:</b> {result || "-"}</div>
      </div>
    </div>
  );
}

/* ---------- ToDo ---------- */
function ToDo({ goBack }){
  const [items, setItems] = useState(()=>{
    const s = localStorage.getItem("myapp_todos");
    return s ? JSON.parse(s) : [];
  });
  const [text, setText] = useState("");

  useEffect(()=> {
    localStorage.setItem("myapp_todos", JSON.stringify(items));
  },[items]);

  const add = () => {
    if(!text) return;
    setItems(prev => [...prev, {id:Date.now(), text}]);
    setText("");
  };
  const remove = (id) => setItems(prev => prev.filter(i=>i.id !== id));

  return (
    <div>
      <h3>To-Do List</h3>
      <input value={text} onChange={e=>setText(e.target.value)} placeholder="Add new task" />
      <div className="row">
        <button onClick={add}>Add</button>
        <button onClick={goBack}>Back</button>
      </div>
      <div style={{marginTop:10}}>
        {items.length === 0 && <div>No tasks yet</div>}
        {items.map(it => (
          <div key={it.id} className="todo-item">
            <div>{it.text}</div>
            <div>
              <button onClick={()=>remove(it.id)}>Done</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Resume (simple preview) ---------- */
function Resume({ goBack }){
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");

  return (
    <div>
      <h3>Resume</h3>
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" />
      <textarea value={about} onChange={e=>setAbout(e.target.value)} placeholder="Write a short about you"></textarea>
      <div className="row">
        <button onClick={goBack}>Back</button>
      </div>

      <div style={{marginTop:12}}>
        <h4>Preview:</h4>
        <div style={{padding:10, borderRadius:6, background:"#fafafa"}}>
          <b>{name || "Your Name"}</b>
          <p>{about || "A short description about you will appear here."}</p>
        </div>
      </div>
    </div>
  );
}

/* ---------- Weather (tiny demo) ---------- */
/* ---------- Weather (Real API) ---------- */
function Weather({ goBack }){
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);

  const getWeather = async () => {
    if(!city){ 
      alert("Please type a city"); 
      return; 
    }

    const API_KEY = "ff8d2b5abe264095974b9de4975ae4cb";

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      if(data.cod === "404"){
        alert("City not found");
        return;
      }

      setWeather({
        name: data.name,
        temp: data.main.temp,
        cond: data.weather[0].description
      });

    } catch (error){
      alert("Something went wrong");
    }
  };

  return (
    <div>
      <h3>Weather App (Real)</h3>

      <input 
        value={city}
        onChange={e=>setCity(e.target.value)}
        placeholder="Enter city name"
      />

      <div className="row">
        <button onClick={getWeather}>Get Weather</button>
        <button onClick={goBack}>Back</button>
      </div>

      {weather && (
        <div className="result">
          <div><b>{weather.name}</b></div>
          <div>Temperature: {weather.temp} °C</div>
          <div>Condition: {weather.cond}</div>
        </div>
      )}
    </div>
  );
}

export default App;
