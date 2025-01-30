import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App.tsx"
import { Header } from "./components/Header.tsx"
import "./index.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Header />
    <main className="bg-slate-100">
      <App />
    </main>
  </StrictMode>,
)
