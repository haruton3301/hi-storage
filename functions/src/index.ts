import bcrypt from "bcryptjs"
import { initializeApp } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"
import { getStorage } from "firebase-admin/storage"
import * as functions from "firebase-functions"
import { GetDownloadurlParams } from "./types"

initializeApp()

export const getDownloadUrl = functions.https.onCall(async ({ data }) => {
  console.log(data)
  const { fileId, password } = data as functions.https.CallableRequest &
    GetDownloadurlParams

  const db = getFirestore()
  const fileRef = db.collection("files").doc(fileId)
  const fileData = await fileRef.get()

  if (!fileData.exists) {
    throw new functions.https.HttpsError("not-found", "File does not exist")
  }

  const storedPasswordHash = fileData.data()?.password

  const isPasswordCorrect = await bcrypt.compare(password, storedPasswordHash)

  if (!isPasswordCorrect) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Incorrect password",
    )
  }

  const bucket = getStorage().bucket()
  const file = bucket.file(fileData.data()?.storagePath)
  const [url] = await file.getSignedUrl({
    action: "read",
    expires: Date.now() + 15 * 60 * 1000,
  })

  return { url }
})
