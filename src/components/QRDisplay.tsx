import { useState, useEffect } from 'react'

interface QRData {
  url: string
  qrCode: string
  ip: string
  port: number
}

export const QRDisplay = () => {
  const [qrData, setQrData] = useState<QRData | null>(null)
  const [loading, setLoading] = useState(true)

  const loadQRCode = async () => {
    try {
      setLoading(true)
      console.log('QRコード取得開始...')
      // ローカル開発時は直接サーバーにアクセス、本番時はプロキシ経由
      const apiUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
        ? 'http://localhost:3001/api/qr' 
        : '/api/qr'
      console.log('QRコードAPI URL:', apiUrl)
      const response = await fetch(apiUrl)
      console.log('QRコードレスポンス:', response.status, response.statusText)
      
      if (response.ok) {
        const data = await response.json()
        console.log('QRコードデータ取得成功:', data)
        setQrData(data)
      } else {
        console.error('QRコード取得失敗:', response.status, response.statusText)
        const errorText = await response.text()
        console.error('エラー詳細:', errorText)
        setQrData(null)
      }
    } catch (error) {
      console.error('QRコード読み込みエラー:', error)
      setQrData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadQRCode()
  }, [])

  if (loading) {
    return (
      <div className="qr-display">
        <p>QRコード読み込み中...</p>
      </div>
    )
  }

  if (!qrData) {
    return (
      <div className="qr-display">
        <p>QRコード生成エラー</p>
        <button onClick={loadQRCode} className="retry-btn">
          再試行
        </button>
      </div>
    )
  }

  return (
    <div className="qr-display">
      <h3>📱 参加者用QRコード</h3>
      <div className="qr-code-container">
        <img src={qrData.qrCode} alt="QRコード" className="qr-code" />
      </div>
      <div className="qr-url">
        <p><strong>URL:</strong> {qrData.url}</p>
      </div>
    </div>
  )
}