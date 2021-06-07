import ModuleRepository from '../repositories/ModuleRepositoryMemory';
import ClassRepository from '../repositories/ClassRepositoryMemory';
import Student from '../entities/Student';
import Invoice from '../entities/Invoice';

export default class ClassBO {
  classRepository: ClassRepository;
  moduleRepository: ModuleRepository;

  constructor (classRepository: ClassRepository, moduleRepository: ModuleRepository) {
    this.classRepository = classRepository;
    this.moduleRepository = moduleRepository;
  }

  checkMinimalAge (enrollment: any, student: Student): void {
    let module = this.moduleRepository.findByLevelAndCode(enrollment.level, enrollment.module);

    if (module) {
      if (module.minimumAge > student.age) {
        throw new Error("Should not enroll student below minimum age");
      }
    } else {
      throw new Error("Invalid module");
    }
  }

  checkFinishedClass (enrollment: any): void {
    let clas = this.classRepository.findByLevelAndModuleAndCode(enrollment.level, enrollment.module, enrollment.class);

    if (clas) {
      let today = new Date();
      let endClassDate = new Date(clas.end_date);

      if (today > endClassDate) {
        throw new Error("Should not enroll after que end of the class");
      }
    } else {
      throw new Error("Invalid class");
    }
  }

  checkStartedClassCompletedPercentage (enrollment: any): void {
    let clas = this.classRepository.findByLevelAndModuleAndCode(enrollment.level, enrollment.module, enrollment.class);

    let today = new Date();
    let startClassDate = new Date(clas.start_date);
    let endClassDate = new Date(clas.end_date);
  
    if (startClassDate < today) {
      let totalDays = this.getDaysFromPeriod(startClassDate, endClassDate);
      let passedDays = this.getDaysFromPeriod(startClassDate, today);

      if (passedDays / totalDays > 0.25) {
        throw new Error("Should not enroll after 25% of the start of the class");
      }
    }
  }

  checkClassCapacity (enrollment: any, numberOfStudent: number): void {
    let clas = this.classRepository.findByLevelAndModuleAndCode(enrollment.level, enrollment.module, enrollment.class);

    if (numberOfStudent >= clas.capacity) {
      throw new Error("Should not enroll student over class capacity");
    }
  }

  generateInvoices (enrollment: any): Invoice[] {
    let module = this.moduleRepository.findByLevelAndCode(enrollment.level, enrollment.module);
    let invoices = [];
    let installmentDate:Date = new Date();
    const installmentBaseValue:number = Math.round((module.price / enrollment.installments) * 100) / 100;
    let total:number = 0;

    for (let i=1; i <= enrollment.installments; i++) {
      installmentDate = this.addMonthToDate(installmentDate);

      let installmentValue = installmentBaseValue;
      total += installmentValue;

      // Calculate the round diference on the last one installment
      if (i === enrollment.installments) {
        const difference = Math.round((module.price - total) * 100) / 100;
        installmentValue += difference;
      }

      invoices.push(new Invoice(i, installmentDate, installmentValue));
    }

    return invoices;
  }

  private getDaysFromPeriod (start: Date, end: Date) {
    return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  }

  private addMonthToDate (date: Date): Date {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return new Date(year, month, day);
  }
  
}