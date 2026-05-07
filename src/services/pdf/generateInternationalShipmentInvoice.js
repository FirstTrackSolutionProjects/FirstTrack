// Generates multi-page invoice PDF (one page per box) based on provided template
// invoiceData shape documented in getInternationalShipmentInvoiceService

const loadLibs = async () => {
  const [{ default: jsPDF }, html2canvas] = await Promise.all([
    import('jspdf'),
    import('html2canvas').then(m => m.default || m)
  ]);
  return { jsPDF, html2canvas };
};

function escapeHtml(str){
  return String(str ?? '')
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#39;');
}

// Basic Indian numbering system converter (crore, lakh, thousand, hundred)
function numberToIndianWords(n){
  n = Math.round(Number(n));
  if (!isFinite(n)) return '';
  if (n === 0) return 'Zero';
  const a=['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
  const b=['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
  const words=(num)=> num<20?a[num]:b[Math.floor(num/10)]+(num%10? ' '+a[num%10]:'');
  let out='';
  const crore=Math.floor(n/1e7); n%=1e7;
  const lakh=Math.floor(n/1e5); n%=1e5;
  const thousand=Math.floor(n/1e3); n%=1e3;
  const hundred=Math.floor(n/100); n%=100;
  if(crore) out+=words(crore)+' Crore ';
  if(lakh) out+=words(lakh)+' Lakh ';
  if(thousand) out+=words(thousand)+' Thousand ';
  if(hundred) out+=a[hundred]+' Hundred ';
  if(n) out+=(out?'and ':'')+words(n)+' ';
  return out.trim();
}

function amountInWordsINR(amount){
  const integer = Math.floor(amount);
  const paise = Math.round((amount - integer) * 100);
  let words = numberToIndianWords(integer) + ' Rupees';
  if (paise) words += ' and ' + numberToIndianWords(paise) + ' Paise';
  return words + ' Only';
}

function buildPageHTML({invoiceData, box, boxIndex, total, amountWords}){
  const items = Array.isArray(box.ITEMS) ? box.ITEMS : [];
  const rows = items.map((it,i)=>{
    const qty = Number(it.QUANTITY||0);
    const rate = Number(it.RATE||0);
    const amt = (qty*rate).toFixed(2);
    const manufacturerName = it.MANUFACTURER_NAME || '';
    const manufacturerAddress = it.MANUFACTURER_ADDRESS || '';
    return `<tr>\n<td class="center">${i+1}</td>\n<td class="description">${escapeHtml(it.DESCRIPTION)}</td>\n<td class="center">${escapeHtml(manufacturerName)}</td>\n<td class="center">${escapeHtml(manufacturerAddress)}</td>\n<td class="center">${escapeHtml(it.HSCODE)}</td>\n<td class="center">${escapeHtml((it.UNIT||'').toUpperCase())}</td>\n<td class="center">${qty}</td>\n<td class="center">${rate.toFixed(2)}</td>\n<td class="center">${amt}</td>\n</tr>`;
  }).join('\n');
  // Pad to at least 10 rows for layout consistency (now 9 columns)
  let empty='';
  for(let i=items.length;i<10;i++) empty+='<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>';
  return `<!doctype html><html><head><meta charset='utf-8'/><style>
    :root{--border:#000;--text:#000;--page-width:900px;--font-family:"Segoe UI",Arial,Helvetica,sans-serif;}
    body{margin:0;background:#fff;font-family:var(--font-family);color:var(--text);} .invoice-wrap{width:var(--page-width);background:#fff;border:2px solid var(--border);box-sizing:border-box;padding:0;}
    .row{display:flex;flex-wrap:nowrap;} .col{box-sizing:border-box;padding:12px;} .col-1-2{width:50%;} .col-1-3{width:33.3333%;}
    .invoice-title{text-align:center;font-weight:700;font-size:20px;padding:10px 0;border-bottom:1px solid var(--border);} .top-right{border-left:2px solid var(--border);} .shipper-consignee .left{border-right:2px solid var(--border);} .country-row .col{border-right:2px solid var(--border);padding:8px;text-align:center;font-weight:700;} .country-row .col:last-child{border-right:none;}
    table{width:100%;border-collapse:collapse;font-size:13px;} th,td{border:1px solid var(--border);padding:6px;vertical-align:top;} th{text-align:center;font-weight:700;} .center{text-align:center;} .description{text-align:left;} .box-number{text-align:center;font-weight:700;padding:8px 0;border-top:2px solid var(--border);border-bottom:2px solid var(--border);} .amount-row{display:flex;border-top:2px solid var(--border);} .amount-left{width:66.6666%;padding:10px;box-sizing:border-box;} .amount-right{width:33.3333%;padding:10px;box-sizing:border-box;border-left:2px solid var(--border);text-align:right;} .small{font-size:12px;} .footer-note{font-size:12px;padding:8px;border-top:1px solid var(--border);text-align:center;} .muted{color:#333;font-weight:400;}
  </style></head><body><div class='invoice-wrap' role='document' aria-label='Invoice'>
    <div class='invoice-title'>INVOICE</div>
    <div class='row header-top' style='border-bottom:2px solid var(--border);'>
      <div class='col col-1-2'>
        <div style='font-weight:600;font-size:13px;margin-bottom:6px;'>INVOICE NO. : <span class='muted'>${escapeHtml(invoiceData.INVOICE_NO)}</span></div>
        <div style='font-weight:600;font-size:13px;'>INVOICE DATE. : <span class='muted'>${escapeHtml(invoiceData.INVOICE_DATE)}</span></div>
      </div>
      <div class='col col-1-2 top-right'>
        <div style='font-weight:600;font-size:13px;'>SHIPPER</div>
        <div style='font-weight:700;font-size:16px;margin-top:6px;'>${escapeHtml(invoiceData.SHIPPER_NAME)}</div>
        <div style='font-weight:600;margin-top:6px;'>AADHAAR NUMBER : <span class='muted'>${escapeHtml(invoiceData.SHIPPER_AADHAAR)}</span></div>
      </div>
    </div>
    <div class='row shipper-consignee' style='border-bottom:2px solid var(--border);'>
      <div class='col col-1-2 left' style='padding:14px;'>
        <div class='bold' style='font-size:16px;'>${escapeHtml(invoiceData.SHIPPER_NAME)}</div>
        <div class='semi small'>COMPANY NAME : <span class='muted'>${escapeHtml(invoiceData.SHIPPER_COMPANY||invoiceData.SHIPPER_NAME)}</span></div>
        <div class='semi small'>ADDRESS : <span class='muted'>${escapeHtml(invoiceData.SHIPPER_ADDRESS)}</span></div>
        <div class='small' style='margin-top:6px;'><span class='bold'>${escapeHtml(invoiceData.SHIPPER_CITY)}, ${escapeHtml(invoiceData.SHIPPER_STATE)}</span></div>
        <div class='small' style='margin-top:6px;'><span class='bold'>${escapeHtml(invoiceData.SHIPPER_COUNTRY)}, ${escapeHtml(invoiceData.SHIPPER_PIN)}</span></div>
        <div class='small'>PHONE NUMBER : <span class='muted'>${escapeHtml(invoiceData.SHIPPER_PHONE||'')}</span></div>
        <div class='small'>AADHAAR NUMBER : <span class='muted'>${escapeHtml(invoiceData.SHIPPER_AADHAAR||'')}</span></div>
      </div>
      <div class='col col-1-2' style='padding:14px;'>
        <div class='bold' style='font-size:16px;'>${escapeHtml(invoiceData.CONSIGNEE_NAME)}</div>
        <div class='semi small'>COMPANY NAME : <span class='muted'>${escapeHtml(invoiceData.CONSIGNEE_COMPANY||invoiceData.CONSIGNEE_NAME)}</span></div>
        <div class='semi small'>ADDRESS : <span class='muted'>${escapeHtml(invoiceData.CONSIGNEE_ADDRESS)}</span></div>
        <div class='small' style='margin-top:6px;'><span class='muted'>${escapeHtml(invoiceData.CONSIGNEE_CITY)}</span></div>
        <div class='small' style='margin-top:6px;'><span class='bold'>${escapeHtml(invoiceData.CONSIGNEE_COUNTRY)}, ${escapeHtml(invoiceData.CONSIGNEE_PIN)}</span></div>
        <div class='small'>EMAIL PHONE NUMBER : <span class='muted'>${escapeHtml(invoiceData.CONSIGNEE_PHONE||'')}</span></div>
      </div>
    </div>
    <div class='row country-row' style='border-bottom:1px solid var(--border);'>
      <div class='col col-1-3'>COUNTRY OF ORIGIN<br/><span class='muted'>${escapeHtml(invoiceData.ORIGIN_COUNTRY||'India')}</span></div>
      <div class='col col-1-3'><br/><span class='muted'>&nbsp;</span></div>
      <div class='col col-1-3'>DESTINATION<br/><span class='muted'>${escapeHtml(invoiceData.DESTINATION_COUNTRY||'')}</span></div>
    </div>
    <div style='text-align:center;padding:8px;border-bottom:2px solid var(--border);font-weight:600;'>FREE TRADE SAMPLES OF NO COMMERCIAL VALUE</div>
    <div class='box-number'>BOX NO: ${boxIndex+1}</div>
    <div style='padding:6px 8px 0 8px;'>
      <table class='table items' aria-label='Invoice items'>
        <thead><tr>
          <th style='width:5%;'>SR.<br/>NO.</th>
          <th style='width:30%;text-align:left;'>DESCRIPTION</th>
          <th style='width:11%;'>MANUF.<br/>NAME</th>
          <th style='width:14%;'>MANUF.<br/>ADDRESS</th>
          <th style='width:10%;'>HS<br/>CODE</th>
          <th style='width:6%;'>UNIT</th>
          <th style='width:6%;'>QTY</th>
          <th style='width:8%;'>UNIT<br/>RATE</th>
          <th style='width:10%;'>AMOUNT</th>
        </tr></thead>
        <tbody>${rows}${empty}</tbody>
      </table>
    </div>
    <div class='amount-row'>
      <div class='amount-left'>
        <div style='font-weight:700;display:inline-block;margin-bottom:6px;'>AMOUNT In words:</div>
        <div style='border:1px solid transparent;padding:6px;margin-top:6px;font-weight:600;'>${escapeHtml(amountWords)}</div>
        <div class='notes small'>NOTES: ${escapeHtml(invoiceData.CONTENTS||'FREE TRADE SAMPLES OF NO COMMERCIAL VALUE')}</div>
      </div>
      <div class='amount-right'>
        <div style='font-size:14px;font-weight:700;'>TOTAL: <span style='font-weight:900;'>${total.toFixed(2)} INR</span></div>
      </div>
    </div>
    <div class='footer-note'>(It's a system generated Invoice Bill no need the seal and signature)</div>
  </div></body></html>`;
}

/**
 * Generate international shipment invoice PDF.
 * @param {object} invoiceData - Data returned from invoice service.
 * @param {object} [options] - Tuning options for quality vs size.
 * @param {number} [options.renderScale=1.25] - html2canvas scale (1 = base, >1 sharper, larger file).
 * @param {number} [options.maxRenderWidth=1800] - Max pixel width to downscale canvas to.
 * @param {number} [options.jpegQuality=0.82] - JPEG quality (0-1).
 */
export async function generateInternationalShipmentInvoicePDF(invoiceData, options = {}){
  if(!invoiceData || !Array.isArray(invoiceData.BOXES) || !invoiceData.BOXES.length){
    throw new Error('No boxes found in invoice data');
  }
  const { jsPDF, html2canvas } = await loadLibs();
  const {
    renderScale = 1.25,
    maxRenderWidth = 1800,
    jpegQuality = 0.82,
  } = options;
  // compress: true uses internal compression for streams
  const pdf = new jsPDF({ orientation:'portrait', unit:'mm', format:'a4', compress: true });
  const A4_WIDTH_MM = 210; const A4_HEIGHT_MM = 297; const MARGIN = 5;

  for(let i=0;i<invoiceData.BOXES.length;i++){
    const box = invoiceData.BOXES[i];
    const total = (box.ITEMS||[]).reduce((s,it)=> s + (Number(it.RATE||0)*Number(it.QUANTITY||0)), 0);
    const amountWords = amountInWordsINR(total);
    const html = buildPageHTML({ invoiceData, box, boxIndex:i, total, amountWords });
    const iframe = document.createElement('iframe');
    iframe.style.position='absolute'; iframe.style.left='-9999px'; iframe.style.top='0';
    document.body.appendChild(iframe);
    const idoc = iframe.contentDocument;
    idoc.open(); idoc.write(html); idoc.close();
    await new Promise(r=>setTimeout(r,40));
    const wrap = idoc.querySelector('.invoice-wrap');
    // Lower scale to 1 to reduce pixel dimensions; 2x created very large PNGs.
    let canvas = await html2canvas(wrap, { scale: renderScale, backgroundColor:'#ffffff' });
    // Downscale if exceeding maxRenderWidth
    if (canvas.width > maxRenderWidth) {
      const scaleFactor = maxRenderWidth / canvas.width;
      const tmp = document.createElement('canvas');
      tmp.width = maxRenderWidth;
      tmp.height = Math.round(canvas.height * scaleFactor);
      const ctx = tmp.getContext('2d');
      ctx.drawImage(canvas, 0, 0, tmp.width, tmp.height);
      canvas = tmp;
    }
    // Use JPEG; adjustable quality to balance clarity & size
    const imgData = canvas.toDataURL('image/jpeg', jpegQuality);
    if(i>0) pdf.addPage();
    const usableWidth = A4_WIDTH_MM - 2*MARGIN;
    const imgHeight = (canvas.height / canvas.width) * usableWidth;
  pdf.addImage(imgData,'JPEG', MARGIN, MARGIN, usableWidth, Math.min(imgHeight, A4_HEIGHT_MM - 2*MARGIN));
    document.body.removeChild(iframe);
  }
  pdf.save(`invoice_${invoiceData.INVOICE_NO || 'shipment'}.pdf`);
}

export default generateInternationalShipmentInvoicePDF;
