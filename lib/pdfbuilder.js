const JSPDF = require('jsPDF')

function buildPDF () {
  let doc = new JSPDF()
  doc.text('Hello world!', 1, 1)
}

module.exports = { buildPDF }
