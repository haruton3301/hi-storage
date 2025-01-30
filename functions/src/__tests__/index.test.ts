import { describe, expect, it, jest } from "@jest/globals"
import firebaseFunctionsTest from "firebase-functions-test"
import { getDownloadUrl } from "../"
import { createMockRequest, mockFirestore, mockStorage } from "../mocks"
const { wrap } = firebaseFunctionsTest()

jest.mock("firebase-admin/app", () => ({
  initializeApp: jest.fn(),
}))

jest.mock("firebase-admin/firestore", () => ({
  getFirestore: jest.fn(() => mockFirestore),
}))

jest.mock("firebase-admin/storage", () => ({
  getStorage: jest.fn(() => mockStorage),
}))

describe("getDownloadUrl function", () => {
  it("should return a signed URL when the file exists and password is correct", async () => {
    const mockRequest = createMockRequest("mockId", "password123")
    const result = await wrap(getDownloadUrl)(mockRequest)

    expect(result).toEqual({ url: "signedUrl" })
  })

  it("should throw an error if the file does not exist", async () => {
    const mockRequest = createMockRequest("nonExistingFile", "password123")

    await expect(wrap(getDownloadUrl)(mockRequest)).rejects.toThrowError(
      "File does not exist",
    )
  })

  it("should throw an error if the password is incorrect", async () => {
    const mockRequest = createMockRequest("mockId", "wrongPassword")

    await expect(wrap(getDownloadUrl)(mockRequest)).rejects.toThrowError(
      "Incorrect password",
    )
  })
})
