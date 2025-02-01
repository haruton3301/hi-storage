import { HttpsOptions } from "firebase-functions/https"

export const options = {
  region: "asia-northeast1",
  memory: "1GiB",
  timeoutSeconds: 60,
  maxInstances: 10,
} as Partial<HttpsOptions>
