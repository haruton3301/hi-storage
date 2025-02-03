import { cert, initializeApp, ServiceAccount } from "firebase-admin/app"
import * as functions from "firebase-functions"
import serviceAccount from "../keys/serviceAccountKey.json" with { type: "json" }
import { generateHashedPassword } from "./funcs/generateHashedPassword.js"
import { getDownloadUrl } from "./funcs/getDownloadUrl.js"

initializeApp({
  credential: cert(serviceAccount as ServiceAccount),
  storageBucket: "hi-storage.firebasestorage.app",
})

functions.setGlobalOptions({
  region: "asia-northeast1",
  memory: "1GiB",
  timeoutSeconds: 60,
  maxInstances: 10,
})

export { generateHashedPassword, getDownloadUrl }
