const printer = require('printer')
const path = require('path')

function getDefaultPrinter () {
  let list = printer.getPrinters()
  for (let p of list) {
    if (p.isDefault) return p
  }
}

function printFile (f) {
  // f = path.join(__dirname, f)
  printer.printFile({
    filename: f,
    printer: getDefaultPrinter().name, // printer name, if missing then will print to default printer
    success: function (jobID) {
      console.log(`sent to printer with ID: ${jobID}`)
    },
    error: function (err) {
      console.log(err)
    }
  })
}

module.exports = { printFile, getDefaultPrinter }
