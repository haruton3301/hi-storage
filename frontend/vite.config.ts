import react from "@vitejs/plugin-react"
import fs from "fs"
import path from "path"
import { OutputOptions } from "rollup"
import { defineConfig } from "vitest/config"

function excludeMsw() {
  return {
    name: "exclude-msw",
    resolveId(source: string) {
      return source === "virtual-module" ? source : null
    },
    async renderStart(outputOptions: OutputOptions) {
      const outDir = outputOptions.dir || "dist"
      const msWorkerPath = path.resolve(outDir, "mockServiceWorker.js")

      if (fs.existsSync(msWorkerPath)) {
        fs.rm(msWorkerPath, (err) => {
          if (err) {
            console.error(`Error while deleting ${msWorkerPath}:`, err)
          } else {
            console.log(`Deleted ${msWorkerPath}`)
          }
        })
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), excludeMsw()],
  server: {
    port: 8080,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/__tests__/setup.ts",
  },
})
