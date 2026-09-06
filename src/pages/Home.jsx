import { useNavigate } from 'react-router-dom'

const categories = ['Books', 'Series', 'Anime', 'Movies', 'Other']

function Home() {
    const navigate = useNavigate()

    return (
        <div style={{ padding: '40px', position: 'relative', minHeight: '100vh' }}>
            <button
                onClick={() => navigate('/profile')}
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    padding: '10px 20px',
                    cursor: 'pointer',
                }}
            >
                👤 User Profile
            </button>

            <h1 style={{ textAlign: 'center', marginBottom: '60px' }}>BingeLog</h1>

            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '30px',
                }}
            >
                {categories.map((cat) => (
                    <div
                        key={cat}
                        onClick={() => navigate(`/category/${cat.toLowerCase()}`)}
                        style={{
                            width: '200px',
                            height: '150px',
                            border: '2px solid #ccc',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            fontSize: '20px',
                            fontWeight: 'bold',
                            background: '#2a2a2a',
                            color: 'white',
                            transition: 'transform 0.2s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                        {cat}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Home