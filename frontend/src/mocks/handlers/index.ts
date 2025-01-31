import { http, HttpResponse } from "msw"
import { mockFiles } from "../data/files"
import { mockStorageBaseUrl } from "../data/storage"

const API_URL = import.meta.env.VITE_API_URL

export const handlers = [
  http.post(`${API_URL}/`, async ({ request }) => {
    try {
      const { fileId, password } = (await request.json()) as {
        fileId: string
        password: string
      }

      if (!fileId || !password) {
        return HttpResponse.json(
          { error: "Missing parameters" },
          { status: 400 },
        )
      }

      const file = mockFiles.find((f) => f.fileId === fileId)
      if (!file) {
        return HttpResponse.json(
          { error: "File does not exist" },
          { status: 404 },
        )
      }

      if (password === "preflight") {
        return HttpResponse.json({}, { status: 200 })
      }

      if (file.password !== password) {
        return HttpResponse.json(
          { error: "Incorrect password" },
          { status: 401 },
        )
      }

      const signedUrl = `${mockStorageBaseUrl}/${file.storagePath}`
      return HttpResponse.json({ url: signedUrl }, { status: 200 })
    } catch (error) {
      console.error("Mock API Error:", error)
      return HttpResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      )
    }
  }),
]
