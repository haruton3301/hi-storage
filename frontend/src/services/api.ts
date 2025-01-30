import axios from "axios"

export const downloadFile = async (fileId: string, password: string) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}`,
      {
        fileId,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    )

    return response.data
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status
      if (status === 404) {
        throw new Error("ファイルが見つかりません")
      } else if (status === 401) {
        throw new Error("パスワードが違います")
      }
    }
    throw new Error("エラーが発生しました")
  }
}
