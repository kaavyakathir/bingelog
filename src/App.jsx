import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import Category from './pages/Category'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/category/:categoryName" element={<Category />} />
        <Route path="/profile" element={<h1>Profile page (coming soon)</h1>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App