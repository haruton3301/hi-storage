import { describe, expect, it } from "vitest"
import { mockFiles } from "../mocks/data/files"
import { mockStorageBaseUrl } from "../mocks/data/storage"
import { downloadFile } from "../services/api"

describe("downloadFile", () => {
  it("returns the file URL when given a valid file ID and password", async () => {
    const file = mockFiles[0]
    const result = await downloadFile(file.fileId, file.password)
    expect(result).toEqual({ url: `${mockStorageBaseUrl}/${file.storagePath}` })
  })

  it("throws an error when given an incorrect password", async () => {
    const file = mockFiles[0]
    await expect(downloadFile(file.fileId, "wrong-password")).rejects.toThrow(
      "パスワードが違います",
    )
  })

  it("throws an error when the file does not exist", async () => {
    await expect(
      downloadFile("invalid-file", "correct-password"),
    ).rejects.toThrow("ファイルが見つかりません")
  })
})
