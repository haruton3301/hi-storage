import React from "react"
import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import NotFoundPage from "./pages/404"
import DownloadPage from "./pages/Download"

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/:slug" element={<DownloadPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  )
}

export default App
