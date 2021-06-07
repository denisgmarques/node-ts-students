export default class Invoice {
  id: number;
  dueDate: Date;
  value: number;

  constructor (id: number, dueDate: Date, value: number) {
    this.id = id;
    this.dueDate = dueDate;
    this.value = value;
  }
}