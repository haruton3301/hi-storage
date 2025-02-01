import bcrypt from "bcryptjs"
import { getFirestore } from "firebase-admin/firestore"
import { getStorage } from "firebase-admin/storage"
import * as functions from "firebase-functions"
import { GetDownloadurlParams } from "../types"
import { options } from "./options.js"

export const getDownloadUrl = functions.https.onRequest(
  { cors: ["http://localhost:8080", "https://hi-storage.web.app"], ...options },
  async (req, res) => {
    try {
      const { fileId, password } = req.body as GetDownloadurlParams

      const db = getFirestore()
      const fileRef = db.collection("files").doc(fileId)
      const fileData = await fileRef.get()

      if (!fileData.exists) {
        res.status(404).json({ error: "File does not exist" })
        return
      }

      if (password === "preflight") {
        res.status(200).send()
      }

      const storedPasswordHash = fileData.data()?.password

      const isPasswordCorrect = await bcrypt.compare(
        password,
        storedPasswordHash,
      )

      if (!isPasswordCorrect) {
        res.status(401).json({ error: "Incorrect password" })
        return
      }

      const bucket = getStorage().bucket()
      const file = bucket.file(fileData.data()?.storagePath)
      const [url] = await file.getSignedUrl({
        action: "read",
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 1週間
      })

      res.status(200).json({ url })

      return
    } catch (error) {
      functions.logger.error("Error in getDownloadUrl function:", error)
      res.status(500).json({ error: "Internal server error" })
    }
  },
)
