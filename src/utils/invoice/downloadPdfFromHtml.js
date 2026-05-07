// Generate and download a PDF from an HTML string using jsPDF
// Requires 'jspdf' to be installed in the project

import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

const writeToIframe = (html) => new Promise((resolve, reject) => {
  try {
    const iframe = document.createElement('iframe')
    iframe.style.position = 'fixed'
    iframe.style.left = '-10000px'
    iframe.style.top = '0'
    iframe.style.width = '900px' // match invoice sheet max-width for accurate layout
    iframe.style.height = '1400px'
    iframe.style.border = '0'
    document.body.appendChild(iframe)

    const doc = iframe.contentWindow?.document
    if (!doc) {
      document.body.removeChild(iframe)
      return reject(new Error('Unable to create print document'))
    }
    doc.open()
    doc.write(html)
    doc.close()

    const onReady = async () => {
      try {
        // Wait for fonts to be ready if supported
        if (doc.fonts && doc.fonts.ready) {
          await doc.fonts.ready
        }
        // Let layout settle
        await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))
      } catch {}
      resolve({ iframe, doc })
    }
    if (doc.readyState === 'complete') onReady()
    else iframe.onload = onReady
  } catch (e) {
    reject(e)
  }
})

// Render a specific page by mutating the document (e.g., keeping only a slice of rows)
const renderPageToCanvas = async (baseHtml, mutateDocFn) => {
  const { iframe, doc } = await writeToIframe(baseHtml)
  try {
    if (typeof mutateDocFn === 'function') {
      await mutateDocFn(doc)
      // allow reflow after mutations
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))
    }
    const target = doc.body
    const canvas = await html2canvas(target, {
      scale: 1.25, // reduce scale to lower image size while maintaining readability
      useCORS: true,
      backgroundColor: '#FFFFFF',
      windowWidth: Math.max(target.scrollWidth, 900),
      windowHeight: target.scrollHeight
    })
    return canvas
  } finally {
    if (iframe && iframe.parentNode) iframe.parentNode.removeChild(iframe)
  }
}

const downloadPdfFromHtml = async (htmlString, filename = 'invoice.pdf') => {
  // Parse the HTML once to compute pagination
  const { doc } = await writeToIframe(htmlString)
  try {
    const tbody = doc.getElementById('items') || doc.querySelector('#items')
    const rows = tbody ? Array.from(tbody.querySelectorAll('tr')) : []

    const firstCount = 15
    const nextCount = 20
    const totalRows = rows.length
    const pages = []

    if (totalRows === 0) {
      pages.push({ start: 0, end: -1 })
    } else {
      const firstEnd = Math.min(totalRows, firstCount) - 1
      pages.push({ start: 0, end: firstEnd })
      let start = firstEnd + 1
      while (start < totalRows) {
        const end = Math.min(totalRows - 1, start + nextCount - 1)
        pages.push({ start, end })
        start = end + 1
      }
    }

    // Create PDF
  const pdf = new jsPDF({ unit: 'pt', format: 'a4', orientation: 'p' })
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margins = { top: 36, right: 24, bottom: 42, left: 24 }
    const usableWidth = pageWidth - margins.left - margins.right
    const usableHeight = pageHeight - margins.top - margins.bottom
  // Keep consistent visual dimensions: enforce a target sheet height in px
  // For iframe width 900px, compute corresponding height so it maps to usableHeight in PDF
  const targetSheetHeightPx = Math.round(900 * (usableHeight / usableWidth))

    for (let i = 0; i < pages.length; i++) {
      if (i > 0) pdf.addPage()
      const isLast = i === pages.length - 1
      const { start, end } = pages[i]

      const canvas = await renderPageToCanvas(htmlString, (d) => {
        const tbd = d.getElementById('items') || d.querySelector('#items')
        if (tbd) {
          const rs = Array.from(tbd.querySelectorAll('tr'))
          rs.forEach((tr, idx) => {
            if (totalRows > 0) {
              if (idx < start || idx > end) tr.remove()
            } else {
              tr.remove() // no rows on any page when totalRows is 0
            }
          })
        }
        // Remove header on pages after the first
        if (i > 0) {
          const header = d.querySelector('header')
          if (header) header.remove()
          const addresses = d.querySelector('.addresses')
          if (addresses) addresses.remove()
        }
        // Keep design dimensions consistent by enforcing a target sheet height
        const sheet = d.querySelector('.sheet')
        if (sheet) {
          sheet.style.minHeight = `${targetSheetHeightPx}px`
          sheet.style.boxSizing = 'border-box'
        }
        // Remove totals and amount-in-words on non-last pages
        if (!isLast) {
          const totals = d.querySelector('.totals')
          if (totals) totals.remove()
          const ps = Array.from(d.querySelectorAll('p.muted'))
          const words = ps.find(p => /Total\s+Amount\s+in\s+Words/i.test(p.textContent || ''))
          if (words) words.remove()
        }
      })

      // Fit canvas image into PDF page within margins
      // Target 90% of usable width, centered; scale down if needed to fit height
      let targetWidth = usableWidth * 0.9
      let imgWidth = targetWidth
      let imgHeight = (canvas.height * imgWidth) / canvas.width
      if (imgHeight > usableHeight) {
        const scale = usableHeight / imgHeight
        imgWidth = imgWidth * scale
        imgHeight = usableHeight
      }

      // Downscale bitmap to reduce file size before embedding
      const maxExportWidth = 1200 // px
      let exportCanvas = canvas
      if (canvas.width > maxExportWidth) {
        const scale = maxExportWidth / canvas.width
        const exportHeight = Math.round(canvas.height * scale)
        const off = document.createElement('canvas')
        off.width = maxExportWidth
        off.height = exportHeight
        const ctx = off.getContext('2d')
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(canvas, 0, 0, off.width, off.height)
        exportCanvas = off
      }

      const x = margins.left + ((usableWidth - imgWidth) / 2)
      const y = margins.top
      const imgData = exportCanvas.toDataURL('image/jpeg', 0.72) // JPEG with quality to shrink size
      pdf.addImage(imgData, 'JPEG', x, y, imgWidth, imgHeight, undefined, 'FAST')
    }

    pdf.save(filename)
  } finally {
    // Cleanup parser iframe
    const iframe = doc.defaultView?.frameElement
    if (iframe && iframe.parentNode) iframe.parentNode.removeChild(iframe)
  }
}

export default downloadPdfFromHtml
