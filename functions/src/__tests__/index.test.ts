import express from "express"
import { Request } from "firebase-functions/https"
import supertest from "supertest"
import { beforeAll, describe, expect, it, vi } from "vitest"
import { getDownloadUrl } from "../"
import { mockFirestore, mockStorage } from "../mocks"

vi.mock("firebase-admin/app", () => ({
  initializeApp: vi.fn(),
  cert: vi.fn(),
}))

vi.mock("firebase-admin/firestore", () => ({
  getFirestore: vi.fn(() => mockFirestore),
}))

vi.mock("firebase-admin/storage", () => ({
  getStorage: vi.fn(() => mockStorage),
}))

describe("getDownloadUrl function", () => {
  const app = express()

  beforeAll(() => {
    app.use(express.json())
    app.use("/", (req, res) => getDownloadUrl(req as Request, res))
  })

  it("should return 200 and a signed URL when the file exists and password is correct", async () => {
    const response = await supertest(app)
      .post("/")
      .send({ fileId: "mockId", password: "password123" })

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ url: "signedUrl" })
  })

  it("should return 404 if the file does not exist", async () => {
    const response = await supertest(app)
      .post("/")
      .send({ fileId: "nonExistingFile", password: "password123" })

    expect(response.status).toBe(404)
    expect(response.body).toEqual({ error: "File does not exist" })
  })

  it("should return 401 if the password is incorrect", async () => {
    const response = await supertest(app)
      .post("/")
      .send({ fileId: "mockId", password: "wrongPassword" })

    expect(response.status).toBe(401)
    expect(response.body).toEqual({ error: "Incorrect password" })
  })
})
