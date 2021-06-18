import Level from './Level';
import Module from './Module';
import Classroom from './Classroom';
import Student from './Student';
import Invoice from './Invoice';
import EnrollmentCode from './EnrollmentCode';
import InvoiceEvent from './InvoiceEvent';

export default class Enrollment {
  student: Student;
  level: Level;
  module: Module;
  classroom: Classroom;
  installments: number;
  invoices: Invoice[] = [];
  code: EnrollmentCode;
  sequence: number;
  issueDate: Date;

  constructor (student: Student, level: Level, module: Module, classroom: Classroom, installments: number, issueDate: Date, sequence: number) {
    if (student.age < module.minimumAge) throw new Error("Student below minimum age");
    if (classroom.isFinished(issueDate)) throw new Error("Class is already finished");
    if (classroom.getProgress(issueDate) > 25) throw new Error("Class is already started");
    this.student = student;
    this.level = level;
    this.module = module;
    this.classroom = classroom;
    this.sequence = sequence;
    this.issueDate = issueDate;
    this.code = new EnrollmentCode(level.code, module.code, classroom.code, issueDate, sequence);
    this.invoices = [];
    this.installments = installments;
    this.invoices = this.generateInvoices();
  }

  generateInvoices (): Invoice[] {
    let invoices = [];
    let installmentDate:Date = new Date();
    const installmentBaseValue:number = Math.round((this.module.price / this.installments) * 100) / 100;
    let total:number = 0;

    for (let i=1; i <= this.installments; i++) {
      installmentDate = this.calculateInvoiceDate(installmentDate);

      let installmentValue = installmentBaseValue;
      total += installmentValue;

      // Calculate the rounded diference on the last installment
      if (i === this.installments) {
        const difference = Math.round((this.module.price - total) * 100) / 100;
        installmentValue += difference;
      }

      invoices.push(new Invoice(i, installmentDate, installmentValue));
    }

    return invoices;
  }

  private calculateInvoiceDate (date: Date): Date {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = 5; // date.getDate();
    return new Date(year, month, day);
  }

  getInvoiceBalance () {
      return this.invoices.reduce((total, invoice) => {
          total += invoice.getBalance();
          return total;
      }, 0);
  }

  getInvoice (month: number, year: number): Invoice | undefined {
      const invoice = this.invoices.find(invoice => invoice.month === month && invoice.year === year);
      return invoice;
  }

  payInvoice (month: number, year: number, amount: number) {
      const invoice = this.getInvoice(month, year);
      if (!invoice) throw new Error("Invalid invoice");
      invoice.addEvent(new InvoiceEvent("payment", amount));
  }
}
