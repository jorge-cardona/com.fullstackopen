const Notification = ( {message} ) => {
  if (message?.text == null) {
    return null
  }

  const type = message.type === 'error'
                  ? 'error'
                  : 'success'

  return (
    <div className={`notification ${type}`}>
      {message.text}
    </div>
  )
}

export default Notification