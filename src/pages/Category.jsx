import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

function Category() {
    const { categoryName } = useParams()
    const navigate = useNavigate()
    const [entries, setEntries] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchEntries()
    }, [categoryName])

    const fetchEntries = async () => {
        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            navigate('/login')
            return
        }

        const { data, error } = await supabase
            .from('entries')
            .select('*')
            .eq('owner_id', user.id)
            .eq('category', categoryName)
            .order('created_at', { ascending: false })

        if (error) {
            console.error(error)
        } else {
            setEntries(data)
        }
        setLoading(false)
    }

    const toStart = entries.filter((e) => e.status === 'to_start')
    const ongoing = entries.filter((e) => e.status === 'ongoing')
    const done = entries.filter((e) => e.status === 'done')

    const handleNewEntry = (status) => {
        navigate(`/category/${categoryName}/new?status=${status}`)
    }

    const handleOpenEntry = (id) => {
        navigate(`/entry/${id}`)
    }

    if (loading) return <p style={{ padding: '40px' }}>Loading...</p>

    return (
        <div style={{ padding: '40px' }}>
            <button onClick={() => navigate('/')} style={{ marginBottom: '20px' }}>
                ← Back to Home
            </button>

            <h1 style={{ textTransform: 'capitalize' }}>{categoryName}</h1>

            <div style={{ display: 'flex', gap: '30px', marginTop: '30px', flexWrap: 'wrap' }}>
                {/* TO START COLUMN */}
                <div style={{ flex: 1, minWidth: '250px' }}>
                    <h2>To Start</h2>
                    <button onClick={() => handleNewEntry('to_start')} style={{ marginBottom: '10px' }}>
                        + New
                    </button>
                    {toStart.length === 0 && <p>Nothing here yet.</p>}
                    {toStart.map((entry) => (
                        <div
                            key={entry.id}
                            onClick={() => handleOpenEntry(entry.id)}
                            style={cardStyle}
                        >
                            {entry.image_url && (
                                <img src={entry.image_url} alt={entry.name} style={imgStyle} />
                            )}
                            <p>{entry.name}</p>
                        </div>
                    ))}
                </div>

                {/* ONGOING COLUMN */}
                <div style={{ flex: 1, minWidth: '250px' }}>
                    <h2>Ongoing</h2>
                    <button onClick={() => handleNewEntry('ongoing')} style={{ marginBottom: '10px' }}>
                        + New
                    </button>
                    {ongoing.length === 0 && <p>Nothing here yet.</p>}
                    {ongoing.map((entry) => (
                        <div
                            key={entry.id}
                            onClick={() => handleOpenEntry(entry.id)}
                            style={cardStyle}
                        >
                            {entry.image_url && (
                                <img src={entry.image_url} alt={entry.name} style={imgStyle} />
                            )}
                            <p>{entry.name}</p>
                        </div>
                    ))}
                </div>

                {/* DONE COLUMN — view only, no click-through to edit */}
                <div style={{ flex: 1, minWidth: '250px' }}>
                    <h2>Done</h2>
                    {done.length === 0 && <p>Nothing here yet.</p>}
                    {done.map((entry) => (
                        <div key={entry.id} style={{ ...cardStyle, cursor: 'default' }}>
                            {entry.image_url && (
                                <img src={entry.image_url} alt={entry.name} style={imgStyle} />
                            )}
                            <p>{entry.name}</p>
                            <p>⭐ {entry.rating || '—'}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

const cardStyle = {
    border: '1px solid #444',
    borderRadius: '8px',
    padding: '10px',
    marginBottom: '10px',
    cursor: 'pointer',
    background: '#2a2a2a',
    color: 'white',
}

const imgStyle = {
    width: '100%',
    height: '120px',
    objectFit: 'cover',
    borderRadius: '4px',
    marginBottom: '8px',
}

export default Category