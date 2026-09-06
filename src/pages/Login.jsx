import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

function Login() {
    const [isSignup, setIsSignup] = useState(false)
    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        if (isSignup) {
            const { data, error: signupError } = await supabase.auth.signUp({
                email,
                password,
            })

            if (signupError) {
                setError(signupError.message)
                setLoading(false)
                return
            }

            if (data.user) {
                const { error: profileError } = await supabase.from('profiles').insert({
                    id: data.user.id,
                    name,
                    username,
                    phone,
                })

                if (profileError) {
                    setError(profileError.message)
                    setLoading(false)
                    return
                }
            }

            navigate('/')
        } else {
            const { error: loginError } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (loginError) {
                setError(loginError.message)
                setLoading(false)
                return
            }

            navigate('/')
        }

        setLoading(false)
    }

    return (
        <div style={{ maxWidth: '400px', margin: '80px auto', textAlign: 'center' }}>
            <h1>BingeLog</h1>
            <h2>{isSignup ? 'Sign Up' : 'Log In'}</h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {isSignup && (
                    <>
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <input
                            type="tel"
                            placeholder="Phone Number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </>
                )}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                {error && <p style={{ color: 'red' }}>{error}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? 'Please wait...' : isSignup ? 'Sign Up' : 'Log In'}
                </button>
            </form>

            <p style={{ marginTop: '15px' }}>
                {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                    onClick={() => setIsSignup(!isSignup)}
                    style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
                >
                    {isSignup ? 'Log In' : 'Sign Up'}
                </button>
            </p>
        </div>
    )
}

export default Login