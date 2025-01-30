import bcrypt from "bcryptjs"
import { cert, initializeApp } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"
import { ServiceAccount } from "firebase-admin/lib/app/credential"
import { getStorage } from "firebase-admin/storage"
import * as functions from "firebase-functions"
import serviceAccount from "../keys/serviceAccountKey.json"
import { GetDownloadurlParams } from "./types"

initializeApp({
  credential: cert(serviceAccount as ServiceAccount),
})

functions.setGlobalOptions({
  region: "asia-northeast1",
  memory: "1GiB",
  timeoutSeconds: 60,
})

export const getDownloadUrl = functions.https.onRequest(async (req, res) => {
  try {
    const { fileId, password } = req.body as GetDownloadurlParams

    const db = getFirestore()
    const fileRef = db.collection("files").doc(fileId)
    const fileData = await fileRef.get()

    if (!fileData.exists) {
      res.status(404).json({ error: "File does not exist" })
      return
    }

    const storedPasswordHash = fileData.data()?.password

    const isPasswordCorrect = await bcrypt.compare(password, storedPasswordHash)

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
})

export const generateHashedPassword = functions.https.onRequest(
  async (req, res) => {
    const { password } = req.body

    if (!password) {
      res.status(400).json({ error: "Please provide a password" })
      return
    }

    const hashedPassword = bcrypt.hashSync(password, 10)

    res.status(200).json({ hashedPassword })
  },
)
