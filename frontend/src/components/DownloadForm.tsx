import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { downloadFile } from "../services/api"
import { ErrorMessage } from "./ErrorMessage"
import { Loader } from "./Loader"
import { SubmitButton } from "./SubmitButton"
import { TextInput } from "./TextInput"

interface DownloadFormProps {
  slug: string
}

const DownloadForm = ({ slug }: DownloadFormProps) => {
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const checkFileExists = async () => {
      if (!slug) return
      setIsChecking(true)
      try {
        await downloadFile(slug, "preflight")
      } catch (error: unknown) {
        if (
          error instanceof Error &&
          error.message.includes("ファイルが見つかりません")
        ) {
          navigate("/404")
        }
      } finally {
        setIsChecking(false)
      }
    }
    checkFileExists()
  }, [slug, navigate])

  const handleDownload = async () => {
    if (!password) {
      setErrorMessage("パスワードを入力してください")
      return
    }

    setLoading(true)
    setErrorMessage("")

    try {
      const response = await downloadFile(slug, password)
      const downloadUrl = response.url

      if (!downloadUrl) {
        throw new Error("ダウンロードURLが取得できませんでした")
      }

      const link = document.createElement("a")
      link.href = downloadUrl
      link.download = ""
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {isChecking ? (
        <Loader />
      ) : (
        <div className="w-full max-w-md p-6 rounded-lg bg-white shadow-md">
          {errorMessage && <ErrorMessage message={errorMessage} />}
          <TextInput
            id="password"
            label="パスワードを入力してください"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <SubmitButton onClick={handleDownload} disabled={loading}>
            {loading ? "ダウンロード中..." : "ダウンロード"}
          </SubmitButton>
        </div>
      )}
    </>
  )
}

export default DownloadForm
