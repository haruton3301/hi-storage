import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import { describe, expect, it, vi } from "vitest"
import DownloadForm from "../components/DownloadForm"
import { mockFiles } from "../mocks/data/files"
import { mockStorageBaseUrl } from "../mocks/data/storage"
import NotFoundPage from "../pages/404"

describe("DownloadForm", () => {
  it("should render the form and allow file download with correct password", async () => {
    const slug = mockFiles[0].fileId
    render(
      <MemoryRouter>
        <DownloadForm slug={slug} />
      </MemoryRouter>,
    )

    expect(document.getElementById("loader")).toBeInTheDocument()

    await waitFor(() => {
      expect(
        screen.getByLabelText(/パスワードを入力してください/i),
      ).toBeInTheDocument()
      expect(screen.getByText("ダウンロード")).toBeInTheDocument()
    })

    const passwordInput = screen.getByLabelText(/パスワードを入力してください/i)
    fireEvent.change(passwordInput, { target: { value: "correct-password" } })

    const downloadButton = screen.getByText("ダウンロード")
    fireEvent.click(downloadButton)

    // Mocks for download
    const link = Object.assign(document.createElement("a"), {
      click: vi.fn(),
    })
    vi.spyOn(document, "createElement").mockImplementation(() => link)
    vi.spyOn(document.body, "appendChild").mockImplementation(vi.fn())
    vi.spyOn(document.body, "removeChild").mockImplementation(vi.fn())

    await waitFor(() => {
      expect(screen.queryByText("ダウンロード中...")).not.toBeInTheDocument()
      expect(document.body.appendChild).toHaveBeenCalledWith(link)
      expect(link.href).toBe(
        `${mockStorageBaseUrl}/${mockFiles[0].storagePath}`,
      )
      expect(link.click).toHaveBeenCalledTimes(1)
      expect(document.body.removeChild).toHaveBeenCalledWith(link)
    })

    vi.restoreAllMocks()
  })

  it("should show an error if the password is incorrect", async () => {
    const slug = mockFiles[0].fileId
    render(
      <MemoryRouter>
        <DownloadForm slug={slug} />
      </MemoryRouter>,
    )

    await waitFor(() => {
      const passwordInput =
        screen.getByLabelText(/パスワードを入力してください/i)
      fireEvent.change(passwordInput, { target: { value: "wrong-password" } })
    })

    const downloadButton = screen.getByText("ダウンロード")
    fireEvent.click(downloadButton)

    await waitFor(() =>
      expect(screen.getByText("パスワードが違います")).toBeInTheDocument(),
    )
  })

  it("should navigate to 404 if the file does not exist", async () => {
    const slug = "non-existent-file"
    render(
      <MemoryRouter initialEntries={[`/${slug}`]}>
        <Routes>
          <Route path={`/${slug}`} element={<DownloadForm slug={slug} />} />
          <Route path="/404" element={<NotFoundPage />} />
        </Routes>
      </MemoryRouter>,
    )

    await waitFor(() =>
      expect(screen.getByText("404 - File Not Found")).toBeInTheDocument(),
    )
  })

  it("should show an error if the password is not provided", async () => {
    const slug = mockFiles[0].fileId
    render(
      <MemoryRouter>
        <DownloadForm slug={slug} />
      </MemoryRouter>,
    )

    await waitFor(() => {
      const downloadButton = screen.getByText("ダウンロード")
      fireEvent.click(downloadButton)
    })

    await waitFor(() =>
      expect(document.getElementById("error")).toHaveTextContent(
        "パスワードを入力してください",
      ),
    )
  })
})
