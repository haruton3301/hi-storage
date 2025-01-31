import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App.tsx"
import { Header } from "./components/Header.tsx"
import "./index.css"

if (import.meta.env.DEV && import.meta.env.VITE_MOCK_MODE === "true") {
  const { worker } = await import("./mocks/setup/browser")
  await worker.start({ onUnhandledRequest: "bypass" })
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Header />
    <main className="bg-slate-100">
      <App />
    </main>
  </StrictMode>,
)
