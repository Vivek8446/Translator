import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Home from './Componets/Home'
import About from './Componets/About'

function App() {

  return (
   <Router>
           <Routes >
      
          {/* Public Routes */}
          <Route index element={<Home />} />
          <Route path="/about" element={<About />} />
          
        
      </Routes>
    </Router>
  )
}

export default App
