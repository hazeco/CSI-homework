import { useState } from 'react';
import { login, verify, register } from './service/apiService.js';

function App() {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [roleId, setRoleId] = useState(2);
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [loggedInUsername, setLoggedInUsername] = useState('');
    const [role, setRole] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const loginClick = async () => {
        if (!username || !password) {
            setError('Please enter username and password');
            return;
        }
        
        setLoading(true);
        setError('');
        try {
            const result = await login(username, password);
            setToken(result.token);
            localStorage.setItem('token', result.token);
            setLoggedInUsername(username);
            setUsername('');
            setPassword('');
        } catch (error) {
            setError(error.message || 'Login failed');
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const registerClick = async () => {
        if (!username || !password || !confirmPassword) {
            setError('Please fill in all information');
            return;
        }
        
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        
        setLoading(true);
        setError('');
        try {
            await register(username, password, roleId);
            setError('');
            setUsername('');
            setPassword('');
            setConfirmPassword('');
            setIsLogin(true);
            setError('สมัครสมาชิกสำเร็จ! โปรดเข้าสู่ระบบ');
        } catch (error) {
            setError(error.message || 'Registration failed');
            console.log(error);
        } finally {
            setLoading(false);
        }
    }
    
    const logoutClick = () => {
        setToken('');
        setLoggedInUsername('');
        setRole('');
        localStorage.removeItem('token');
    }

    const verifyClick = async () => {
        try {
            const result = await verify(token);
            setRole(result.role);
        } catch (error) {
            setError('Token verification failed');
            logoutClick();
        }
    }
    
    return (
        <>
            {token ? (
                <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
                        <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome!</h1>
                        <div className="space-y-4">
                            <p className="text-gray-700">
                                <span className="font-semibold">Username:</span> {loggedInUsername}
                            </p>
                            <p className="text-gray-700">
                                <span className="font-semibold">Role:</span> {role || 'Loading...'}
                            </p>
                            <div className="flex gap-2 pt-4">
                                <button 
                                    onClick={verifyClick}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                                >
                                    Verify Token
                                </button>
                                <button 
                                    onClick={logoutClick}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="min-h-screen flex">
                    {/* Left side - Form */}
                    <div className="flex-1 flex items-center justify-center bg-white p-4 md:p-8">
                        <div className="w-full max-w-md">
                            {isLogin ? (
                                <>
                                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
                                        Welcome
                                    </h1>
                                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
                                        back!
                                    </h2>
                                </>
                            ) : (
                                <>
                                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8">
                                        Sign Up
                                    </h1>
                                </>
                            )}

                            {error && (
                                <div className={`p-3 rounded-lg mb-6 ${error.includes('successful') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {error}
                                </div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">
                                        Username
                                    </label>
                                    <input 
                                        type="text" 
                                        value={username} 
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="Enter your username" 
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">
                                        Password
                                    </label>
                                    <input 
                                        type="password" 
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password" 
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
                                    />
                                </div>

                                {!isLogin && (
                                    <>
                                        <div>
                                            <label className="block text-gray-700 font-semibold mb-2">
                                                Confirm Password
                                            </label>
                                            <input 
                                                type="password" 
                                                value={confirmPassword} 
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="Confirm your password" 
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-semibold mb-2">
                                                Role
                                            </label>
                                            <select 
                                                value={roleId} 
                                                onChange={(e) => setRoleId(Number(e.target.value))}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
                                            >
                                                <option value={1}>Admin</option>
                                                <option value={2}>Manager</option>
                                                <option value={3}>Worker</option>
                                            </select>
                                        </div>
                                    </>
                                )}
                            </div>

                            <button 
                                onClick={isLogin ? loginClick : registerClick}
                                disabled={loading}
                                className="w-full mt-6 bg-black hover:bg-gray-800 text-white font-bold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50"
                            >
                                {loading ? 'Loading...' : (isLogin ? 'Login' : 'Sign Up')}
                            </button>

                            <div className="mt-6 text-center">
                                {isLogin ? (
                                    <p className="text-gray-600">
                                        Don't have an account? 
                                        <button 
                                            onClick={() => {
                                                setIsLogin(false);
                                                setError('');
                                                setUsername('');
                                                setPassword('');
                                                setConfirmPassword('');
                                            }}
                                            className="text-black font-bold hover:underline ml-1"
                                        >
                                            Sign Up
                                        </button>
                                    </p>
                                ) : (
                                    <p className="text-gray-600">
                                        Already have an account? 
                                        <button 
                                            onClick={() => {
                                                setIsLogin(true);
                                                setError('');
                                                setUsername('');
                                                setPassword('');
                                                setConfirmPassword('');
                                            }}
                                            className="text-black font-bold hover:underline ml-1"
                                        >
                                            Login
                                        </button>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right side - Hero Image */}
                    <div className="hidden md:flex flex-1 bg-cover bg-center relative" 
                        style={{
                            backgroundImage: 'url(https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=2070)',
                            backgroundPosition: 'center'
                        }}
                    >
                        <div className="absolute inset-0 bg-black/30"></div>
                        <div className="relative z-10 flex items-center justify-center w-full h-full">
                            <div className="text-center text-white">
                                <h2 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                                    Fresh flowers
                                </h2>
                                <h3 className="text-2xl md:text-3xl font-light drop-shadow-lg">
                                    for any special occasion
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default App