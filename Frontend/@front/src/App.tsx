import { Route, Routes } from 'react-router-dom'
import { Header } from './components/organisms/Header'
import { Footer } from './components/organisms/Footer'
import { Landing } from './pages/Landing'
import { Login } from './pages/Login'
import { Market } from './pages/Market'
import { Roadmaps } from './pages/Roadmaps'
import { KnowYourPath } from './pages/KnowYourPath'
import { AuthCallback } from './pages/AuthCallback'
import { NotFound } from './pages/NotFound'

export default function App() {
  return (
    <div className="min-h-full flex flex-col">
      <Header />
      <main id="main" className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/market" element={<Market />} />
          <Route path="/roadmaps" element={<Roadmaps />} />
          <Route path="/path" element={<KnowYourPath />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}