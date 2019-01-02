const path = require('path')
const { products } = require(path.join(__dirname, '..', 'lib', 'products'))
const printer = require('printer')
const JSPDF = require('jsPDF')
const fs = require('fs')

class Controller {
  constructor() {
    this.pdfPath = "/Users/brunoalassia/Desktop/ticket.pdf"
    this.products = products.products   
    this.ticket = [] 
  }

  getDefaultPrinter () {
    let list = printer.getPrinters()
    for (let p of list) {
      if (p.isDefault) return p
    }
  }

  printFile (f) {
    printer.printFile({
      filename: f,
      printer: this.getDefaultPrinter().name, 
      success: function (jobID) {
        console.log(`sent to printer with ID: ${jobID}`)
      },
      error: function (err) {
        console.log(err)
      }
    })
  }

  generateTicket(f, callback) {
    let pdf = new JSPDF('p', 'pt', 'a4')
    pdf.html(document.getElementById('ticket'), {callback: function(pdf) {
      let content = pdf.output()
      fs.writeFile(f, content, function(err){
        if (err) throw err;
        console.log('The file has been saved!')
        callback()
      });
    }});
  }

  newTicket() {
    document.getElementById("comandaBtt").style.display = "none"
    document.getElementById("ticket_form").style.display = "block"
  }

  cancelTicket() {
    document.getElementById("comandaBtt").style.display = "block"
    document.getElementById("ticket_form").style.display = "none"
    this.cleanupTicket()
  }

  prepareTicket() {
    let cantSelect = document.getElementById("cant")
    for (let i=1; i<=10; i++) {
      let el = this.createOptionElement(i)
      cantSelect.appendChild(el)
    }
    let productsSelect = document.getElementById("products")
    for (let po of this.products) {
      let el = this.createOptgroupElement(po.category)
      for (let item of po.items) {
        let el1 = this.createOptionElement(item)
        el.appendChild(el1)
      }
      productsSelect.appendChild(el)
    }
  }

  createOptionElement(value) {
    let option = document.createElement("option")
    option.value = value
    option.label = value
    option.text = value
    return option
  }

  createOptgroupElement(value){
    let optgroup = document.createElement("optgroup")
    optgroup.label = value
    return optgroup;
  }

  createTicketItemElement(id, text) {
    let div = document.createElement('div')
    div.className = "ticket_item"
    div.id = id
    let p = document.createElement('p')
    p.innerText = text
    div.appendChild(p)
    let button = document.createElement("button")
    button.className = "button"
    button.innerText = "Eliminar"
    let obj = this
    button.onclick = function(){
      obj.removeProduct(div.id)
    }
    div.appendChild(button)
    return div
  }

  removeProduct(id) {
    let div = document.getElementById('ticket_content')
    let el = document.getElementById(id)
    div.removeChild(el)
    for (let i in this.ticket) {
      if (this.ticket[i].id == id) {
        this.ticket.splice(i, 1)
        return
      }
    }
  }

  cleanupForm() {
    let el = document.getElementById('products')
    el.value = "-1"
    el = document.getElementById('cant')
    el.value = "1"
  }

  cleanupTicket() {
    let el = document.getElementById('ticket_content')
    el.innerText = ""
    this.ticket = []
    this.cleanupForm()
  }

  addProduct() {
    let p = document.getElementById('products').value
    if (p == "-1") {
      alert("Por favor seleccione un producto antes de continuar!")
      return;
    }
    let c = document.getElementById('cant').value
    let div = document.getElementById("ticket_content")
    let id = `ticket_item_${Math.random()}`
    let text = `${c} ${p}`
    let el = this.createTicketItemElement(id, text)
    div.appendChild(el)
    this.cleanupForm()
    this.ticket.push({"id": id, "content": text})
  }

  saveAndPrintTicket() {
    if (this.ticket.length == 0) {
      alert("No ha agregado ningun producto!")
      return
    }
    let body = document.getElementsByTagName("body")[0]
    let ticket = document.getElementById("ticket")
    if (ticket) {
      body.removeChild(ticket)
    }
    ticket = document.createElement('div')
    ticket.id = "ticket"

    for (let item of this.ticket) {
      let p = document.createElement('p')
      p.innerText = item.content
      ticket.appendChild(p)
    }

    let watermark = document.createElement('p')
    watermark.innerText = "Growler Garage vol.2"
    watermark.className = "watermark"
    ticket.appendChild(watermark)
    body.appendChild(ticket)
    let obj = this
    this.generateTicket(this.pdfPath, function(){
      body.removeChild(ticket)
      obj.printFile(obj.pdfPath)
      obj.cancelTicket()
    })
  }
}

const controller = new Controller()