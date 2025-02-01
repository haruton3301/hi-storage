import bcrypt from "bcryptjs"
import * as functions from "firebase-functions"
import { options } from "./options.js"

export const generateHashedPassword = functions.https.onRequest(
  options,
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
