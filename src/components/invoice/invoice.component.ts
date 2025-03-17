// invoice.component.ts
import { Component } from '@angular/core';
import jsPDF from 'jspdf';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';

interface Client {
  id: number;
  name: string;
  // add more client fields if needed
}

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css'],
})
export class InvoiceComponent {
  // Sample (dummy) list of clients
  clients: Client[] = [
    { id: 1, name: 'Client One' },
    { id: 2, name: 'Client Two' },
    { id: 3, name: 'Client Three' },
  ];
  invoiceData = {
    invoice_no: 'MAULI/2425/0347',
    date: new Date().toLocaleDateString(),
    client_name: 'Sentinel Manufacturing India Private Limited',
    qty: 52,
    rate: 185,
    amount: 9620.0,
    cgst: 577.2,
    sgst: 577.2,
    total: 10774.0,
  };

  // Default selections / input values
  selectedClient: Client = this.clients[0];
  quantity: number = 20;
  price: number = 0;

  constructor() {
    setInterval(() => {
      console.log(
        'Quantity:',
        this.quantity,
        'Price:',
        this.price,
        'Invoice Data:'
      );
    }, 2000);
  }

  // Option 1: Generate PDF using jsPDF's text API
  generateInvoice() {
    // Load the `.docx` template (Ensure you have the file in `assets/`)
    fetch('/assets/sentinel_format.docx')
      .then((response) => response.arrayBuffer())
      .then((content) => {
        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip);

        // Replace placeholders with actual data
        doc.setData(this.invoiceData);
        try {
          doc.render();
        } catch (error) {
          console.error('Error rendering docx:', error);
        }

        // Generate the modified .docx file
        const output = doc.getZip().generate({ type: 'blob' });
        saveAs(output, 'Invoice.docx');
      })
      .catch((error) => console.error('Error loading template:', error));

    // const doc = new jsPDF();

    // doc.setFontSize(16);
    // doc.text('Invoice', 10, 20);

    // doc.setFontSize(12);
    // doc.text(`Client: ${this.selectedClient.name}`, 10, 30);
    // doc.text(`Quantity: ${this.quantity}`, 10, 40);
    // doc.text(`Price: ${this.price}`, 10, 50);
    // doc.text(`Total: ${this.quantity * this.price}`, 10, 60);

    // // Add more content and formatting as needed
    // doc.save('invoice.pdf');
  }

  /* 
  // Option 2: Generate PDF from an HTML template using html2canvas
  // Uncomment the following method if you want to render an HTML invoice section.

  generateInvoiceFromHTML() {
    const invoiceElement = document.getElementById('invoice-content');
    if (invoiceElement) {
      html2canvas(invoiceElement).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        // Adjust positioning and sizing as necessary
        pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
        pdf.save('invoice.pdf');
      });
    }
  }
  */

  onClientChange(event: any) {
    debugger;
    this.quantity = 325;
  }
}
