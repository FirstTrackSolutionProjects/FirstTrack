// Opens a new window, writes the HTML, waits for load, and triggers the print dialog.
// Users can select "Save as PDF" to download.

const printHtml = (htmlString, { title = 'Invoice' } = {}) => {
  const printWindow = window.open('', '_blank', 'noopener,noreferrer')
  if (!printWindow) {
    alert('Popup blocked. Please allow popups to download the invoice.')
    return
  }
  // Write and close to ensure rendering
  printWindow.document.open()
  printWindow.document.write(htmlString)
  printWindow.document.title = title
  printWindow.document.close()

  const onLoad = () => {
    // Give a small delay to ensure styles/layout are applied
    setTimeout(() => {
      printWindow.focus()
      printWindow.print()
    }, 250)
  }

  // If the document is already complete, print; otherwise wait for load
  if (printWindow.document.readyState === 'complete') {
    onLoad()
  } else {
    printWindow.onload = onLoad
  }
}

export default printHtml
