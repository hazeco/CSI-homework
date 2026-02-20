import { useState } from 'react';
import { login, verify, register, getUsers } from './service/apiService.js';

function App() {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [roleId, setRoleId] = useState(2);
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [loggedInUsername, setLoggedInUsername] = useState('');
    const [role, setRole] = useState('');
    const [users, setUsers] = useState([]);
    const [activeView, setActiveView] = useState(''); // 'whoami' | 'list'
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
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
            // auto verify to get role
            const verifyResult = await verify(result.token);
            setRole(verifyResult.role);
        } catch (error) {
            setError('login fail');
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
            setShowPassword(false);
            setShowConfirmPassword(false);
            setError('✓ สมัครสมาชิกสำเร็จ! โปรดเข้าสู่ระบบ');
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
        setUsers([]);
        setActiveView('');
        setError('');
        localStorage.removeItem('token');
    }

    const verifyClick = async () => {
        try {
            const result = await verify(token);
            setRole(result.role);
            setActiveView('whoami');
        } catch (error) {
            setError('Token verification failed');
            logoutClick();
        }
    }

    const listUsersClick = async () => {
        try {
            const result = await getUsers(token);
            setUsers(result.users);
            setActiveView('list');
        } catch (error) {
            setError(error.message || 'Unauthorized: Worker cannot access user list');
        }
    }
    
    return (
        <>
            {token ? (
                <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full">
                        <div className="flex items-center justify-between mb-8">
                            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                            <button
                                onClick={logoutClick}
                                className="text-sm border border-black px-4 py-1.5 rounded hover:bg-black hover:text-white transition duration-150"
                            >
                                Logout
                            </button>
                        </div>

                        {error && (
                            <div className="text-sm border border-black/20 bg-black/5 text-black px-4 py-2 rounded mb-4">
                                {error}
                            </div>
                        )}

                        <div className="flex gap-2 mb-6">
                            <button
                                onClick={verifyClick}
                                className={`flex-1 py-2 px-4 text-sm font-medium rounded border transition duration-150 ${
                                    activeView === 'whoami'
                                        ? 'bg-black text-white border-black'
                                        : 'bg-white text-black border-black hover:bg-black hover:text-white'
                                }`}
                            >
                                Who am I
                            </button>
                            {role !== 'worker' && (
                                <button
                                    onClick={listUsersClick}
                                    className={`flex-1 py-2 px-4 text-sm font-medium rounded border transition duration-150 ${
                                        activeView === 'list'
                                            ? 'bg-black text-white border-black'
                                            : 'bg-white text-black border-black hover:bg-black hover:text-white'
                                    }`}
                                >
                                    List of Users
                                </button>
                            )}
                            {role === 'worker' && (
                                <button
                                    onClick={() => setError('Unauthorized: Worker cannot access user list')}
                                    className="flex-1 py-2 px-4 text-sm font-medium rounded border border-black bg-white text-black hover:bg-black hover:text-white transition duration-150"
                                >
                                    List of Users
                                </button>
                            )}
                        </div>

                        {activeView === 'whoami' && (
                            <div className="border border-black/10 rounded p-5 space-y-3">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs uppercase tracking-widest text-black/40 w-20">Username</span>
                                    <span className="font-medium">{loggedInUsername}</span>
                                </div>
                                <div className="border-t border-black/5"></div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs uppercase tracking-widest text-black/40 w-20">Role</span>
                                    <span className="text-xs font-bold uppercase tracking-wider border border-black px-2 py-0.5 rounded">{role}</span>
                                </div>
                            </div>
                        )}

                        {activeView === 'list' && (
                            <div className="border border-black/10 rounded overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-black/10">
                                            <th className="px-4 py-2.5 text-left text-xs uppercase tracking-widest text-black/40 font-medium">ID</th>
                                            <th className="px-4 py-2.5 text-left text-xs uppercase tracking-widest text-black/40 font-medium">Username</th>
                                            <th className="px-4 py-2.5 text-left text-xs uppercase tracking-widest text-black/40 font-medium">Role</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((u) => (
                                            <tr key={u.id} className="border-t border-black/5 hover:bg-black/2">
                                                <td className="px-4 py-2.5 text-black/50 text-xs">{u.id}</td>
                                                <td className="px-4 py-2.5 font-medium">{u.username}</td>
                                                <td className="px-4 py-2.5">
                                                    <span className="text-xs font-bold uppercase tracking-wider border border-black/30 px-2 py-0.5 rounded">{u.role}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
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
                                <div className={`p-3 rounded-lg mb-6 ${error.includes('✓') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
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
                                    <div className="relative">
                                        <input 
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && (isLogin ? loginClick() : registerClick())}
                                            placeholder="Enter your password"
                                            className="w-full px-4 py-3 pr-11 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
                                        />
                                        {password && (
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(v => !v)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition"
                                                tabIndex={-1}
                                            >
                                                {showPassword ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                                    </svg>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {!isLogin && (
                                    <>
                                        <div>
                                            <label className="block text-gray-700 font-semibold mb-2">
                                                Confirm Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && registerClick()}
                                                    placeholder="Confirm your password"
                                                    className="w-full px-4 py-3 pr-11 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
                                                />
                                                {confirmPassword && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowConfirmPassword(v => !v)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition"
                                                        tabIndex={-1}
                                                    >
                                                        {showConfirmPassword ? (
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                        ) : (
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                                            </svg>
                                                        )}
                                                    </button>
                                                )}
                                            </div>
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
                            backgroundImage: 'url(https://platform.vox.com/wp-content/uploads/sites/2/chorus/uploads/chorus_asset/file/23382090/Animation.gif?quality=90&strip=all&crop=7.8%2C0%2C84.4%2C100&w=1080)',
                            backgroundPosition: 'center'
                        }}
                    >
                        <div className="absolute inset-0 bg-black/30"></div>
                        <div className="relative z-10 flex items-center justify-center w-full h-full">
                            <div className="text-center text-white">
                                <h2 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                                    Welcome
                                </h2>
                                <h3 className="text-2xl md:text-3xl font-light drop-shadow-lg">
                                    to jwt authentication demo
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