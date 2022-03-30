import { useState, useEffect } from "react";
import LoginForm from "./components/LoginForm";
import Axios from 'axios';

function App() {
  const admin = {
    username: 'admin1',
    password: 'admin12345',
  };

  const [user, setUser] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [userList, setUserList] = useState([]);

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

  useEffect(() => {
    Axios.get('http://localhost:3001/api/get').then((res) => {
      console.log(res.data);
      setUserList(res.data);
    })
  }, [user]);

  const Logout = () => {
    console.log('Logout');
    setUser({ username: '', password: '' });
    setError('');
  }

  return (
    <div className="App">
      {(user.username !== '') ? (
        <div className="welcome">
          <h2>Welcome, <span>{user.username}</span></h2>
          <button onClick={Logout}>Logout</button>
          { userList.map((value) => {
            return <h1>username: {value.username} | password: {value.password}</h1> 
          }) }
        </div>
      ) : (
        <LoginForm login={Login} error={error} />
      )}
    </div>
  );
}

export default App;
