import React, { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import Executors from './pages/Executors.jsx'
import Externals from './pages/Externals.jsx'
import Tools from './pages/Tools.jsx'
import RDD from './pages/RDD.jsx'

function PageWrapper({ children }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    setVisible(false)
    const t = setTimeout(() => setVisible(true), 20)
    return () => clearTimeout(t)
  }, [children])

  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(12px)',
      transition: 'opacity 0.4s ease, transform 0.4s ease',
      minHeight: '100vh',
    }}>
      {children}
    </div>
  )
}

export default function App() {
  const location = useLocation()
  return (
    <>
      <Navbar />
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/executors" element={<PageWrapper><Executors /></PageWrapper>} />
        <Route path="/externals" element={<PageWrapper><Externals /></PageWrapper>} />
        <Route path="/tools" element={<PageWrapper><Tools /></PageWrapper>} />
        <Route path="/rdd" element={<PageWrapper><RDD /></PageWrapper>} />
      </Routes>
    </>
  )
}
