import { useState } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../supabaseClient'

function NewEntry() {
    const { categoryName } = useParams()
    const [searchParams] = useSearchParams()
    const initialStatus = searchParams.get('status') || 'to_start'
    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [imageFile, setImageFile] = useState(null)
    const [rating, setRating] = useState('')
    const [review, setReview] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [currentSeason, setCurrentSeason] = useState('')
    const [currentEpisode, setCurrentEpisode] = useState('')
    const [totalEpisodes, setTotalEpisodes] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const isToStart = initialStatus === 'to_start'
    const isEpisodic = categoryName === 'series' || categoryName === 'anime'

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            navigate('/login')
            return
        }

        let imageUrl = null

        if (imageFile) {
            const filePath = `${user.id}/${Date.now()}_${imageFile.name}`
            const { error: uploadError } = await supabase.storage
                .from('entry-images')
                .upload(filePath, imageFile)

            if (uploadError) {
                setError(uploadError.message)
                setLoading(false)
                return
            }

            const { data: urlData } = supabase.storage
                .from('entry-images')
                .getPublicUrl(filePath)
            imageUrl = urlData.publicUrl
        }

        // Determine final status based on dates
        let status = 'to_start'
        if (endDate) status = 'done'
        else if (startDate) status = 'ongoing'

        const { error: insertError } = await supabase.from('entries').insert({
            owner_id: user.id,
            category: categoryName,
            status,
            name,
            image_url: imageUrl,
            rating: rating ? parseInt(rating) : null,
            review: isToStart ? null : review,
            start_date: startDate || null,
            end_date: endDate || null,
            current_season: currentSeason ? parseInt(currentSeason) : null,
            current_episode: currentEpisode ? parseInt(currentEpisode) : null,
            total_episodes: totalEpisodes ? parseInt(totalEpisodes) : null,
        })

        if (insertError) {
            setError(insertError.message)
            setLoading(false)
            return
        }

        navigate(`/category/${categoryName}`)
    }

    return (
        <div style={{ maxWidth: '500px', margin: '40px auto', padding: '20px' }}>
            <button onClick={() => navigate(`/category/${categoryName}`)} style={{ marginBottom: '20px' }}>
                ← Back
            </button>

            <h1 style={{ textTransform: 'capitalize' }}>New {categoryName} Entry</h1>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label>
                    Name
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={{ display: 'block', width: '100%' }}
                    />
                </label>

                <label>
                    Image
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files[0])}
                        style={{ display: 'block', width: '100%' }}
                    />
                </label>

                {/* Everything below is hidden for "To Start" entries per spec */}
                {!isToStart && (
                    <>
                        <label>
                            Rating (1-5)
                            <input
                                type="number"
                                min="1"
                                max="5"
                                value={rating}
                                onChange={(e) => setRating(e.target.value)}
                                style={{ display: 'block', width: '100%' }}
                            />
                        </label>

                        <label>
                            Short Review
                            <textarea
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                                style={{ display: 'block', width: '100%' }}
                            />
                        </label>

                        <label>
                            Start Date
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                style={{ display: 'block', width: '100%' }}
                            />
                        </label>

                        <label>
                            End Date
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                style={{ display: 'block', width: '100%' }}
                            />
                        </label>

                        {isEpisodic && (
                            <>
                                <label>
                                    Current Season
                                    <input
                                        type="number"
                                        value={currentSeason}
                                        onChange={(e) => setCurrentSeason(e.target.value)}
                                        style={{ display: 'block', width: '100%' }}
                                    />
                                </label>
                                <label>
                                    Current Episode
                                    <input
                                        type="number"
                                        value={currentEpisode}
                                        onChange={(e) => setCurrentEpisode(e.target.value)}
                                        style={{ display: 'block', width: '100%' }}
                                    />
                                </label>
                                <label>
                                    Total Episodes
                                    <input
                                        type="number"
                                        value={totalEpisodes}
                                        onChange={(e) => setTotalEpisodes(e.target.value)}
                                        style={{ display: 'block', width: '100%' }}
                                    />
                                </label>
                            </>
                        )}
                    </>
                )}

                {error && <p style={{ color: 'red' }}>{error}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Entry'}
                </button>
            </form>
        </div>
    )
}

export default NewEntry