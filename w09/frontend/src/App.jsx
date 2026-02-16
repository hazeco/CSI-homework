import { useState } from 'react';
import './App.css';

function App() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const loginClick = () => {
    setToken('x')
    // api call to backend
    }
    const logoutClick = () => {
    setToken('')
    // do something
    }
    return (
    <>
        {token ? (
            <div>
                <h1>LOGIN</h1>
                <p>
                    Username: {''}
                    <input 
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </p>
                <p>
                    Password: {''}
                    <input 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </p>
                <p>
                    <button 
                        style={{ backgroundColor: "red", color:"white"}}
                        onClick={logoutClick}>
                        Logout
                    </button>
                </p>
            </div>
            ) : (
                <div>
                    <h1>LOGOUT</h1>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                    <button onClick={loginClick}>Login</button>
                </div>
            )}
        </>
    )
}

export default App