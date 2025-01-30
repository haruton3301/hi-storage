import { useNavigate, useParams } from "react-router-dom"
import DownloadForm from "../components/DownloadForm"

const DownloadPage = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()

  if (!slug) {
    navigate("/404", { replace: true })
  }

  return (
    <div className="flex justify-center p-6">
      <DownloadForm slug={slug!} />
    </div>
  )
}

export default DownloadPage
