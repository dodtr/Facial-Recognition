import { useState } from "react";
import LoginForm from "./components/LoginForm";

function App() {
  const admin = {
    username: 'admin1',
    password: 'admin12345',
  };

  const [user, setUser] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const Login = (details) => {
    console.log(details);
    if (details.username === admin.username && details.password === admin.password) {
      console.log('Login');
      setUser({username: details.username, password: details.password});
    } else {
      console.log('Not match');
      setError("Details do not match");
    }
  }

  const Logout = () => {
    console.log('Logout');
    setUser({ username: '', password: '' });
  }

  return (
    <div className="App">
      {(user.username !== '') ? (
        <div className="welcome">
          <h2>Welcome, <span>{user.username}</span></h2>
          <button onClick={Logout}>Logout</button>
        </div>
      ) : (
        <LoginForm login={Login} error={error} />
      )}
    </div>
  );
}

export default App;
