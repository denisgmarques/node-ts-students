import InvoiceEvent from "./InvoiceEvent";

export default class Invoice {
  id: number;
  dueDate: Date;
  amount: number;
  month: number;
  year: number;
  events: InvoiceEvent[];

  constructor (id: number, dueDate: Date, amount: number) {
    this.id = id;
    this.dueDate = dueDate;
    this.amount = amount;
    this.events = [];
    this.month = dueDate.getMonth() + 1;
    this.year = dueDate.getFullYear();
  }

  addEvent (invoiceEvent: InvoiceEvent) {
      this.events.push(invoiceEvent);
  }

  getBalance () {
      return this.events.reduce((total, event) => {
          total -= event.amount;
          return total;
      }, this.amount);
  }
}