const JSPDF = require('jsPDF')
const fs = require('fs')

function buildTicket (f) {
  let pdf = new JSPDF('p', 'pt', 'letter')
  pdf.html(document.getElementById('ticket'), {callback: function(pdf) {
    let content = pdf.output()
    fs.writeFile(f, content, function(err){
      if (err) throw err;
      console.log('The file has been saved!');
    });
  }});
}

module.exports = { buildTicket }
