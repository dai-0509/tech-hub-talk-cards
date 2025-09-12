interface MessageProps {
  type: 'success' | 'warning' | 'error' | 'info'
  message: string
}

export const Message = ({ type, message }: MessageProps) => {
  return (
    <div className={`message ${type}`}>
      {message}
    </div>
  )
}