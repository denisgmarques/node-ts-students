import Student from '../entities/Student';
import ModuleRepository from './ModuleRepositoryMemory';
import ClassRepository from './ClassRepositoryMemory';
import EnrollmentRepository from './EnrollmentRepository'
import EnrollmentBO from '../businessrules/EnrollmentBO'

export default class EnrollmentRepositoryMemory implements EnrollmentRepository {
  moduleRepository: ModuleRepository;
  classRepository: ClassRepository;
  data: any[] = []

  constructor (moduleRepository: ModuleRepository, classRepository: ClassRepository) {
    this.moduleRepository = moduleRepository;
    this.classRepository = classRepository;
  }

  findAll (): any[] {
    return this.data;
  }

  findById (id: string): any {
    return this.data.find((enroll) => {
      return enroll.id === id
    })
  }

  findByStudentCpf (cpf: string): any {
    return this.data.find((enroll) => {
      return enroll.student && enroll.student.cpf === cpf
    })
  }

  existByCpf (cpf: string): boolean {
    return this.data.filter((enroll) => {
      return enroll.student.cpf === cpf
    }).length > 0
  }

  count (): number {
    return this.data.length;
  }

  add (enrollment: any): any {
    let student = new Student(enrollment.student.name, enrollment.student.cpf, enrollment.student.birthDate)

    // Instance of enrollment Business Object
    const enrollmentBO = new EnrollmentBO(this.classRepository, this.moduleRepository);
    
    // Check minimal age
    enrollmentBO.checkMinimalAge(enrollment, student);

    // Class Business Rules   
    enrollmentBO.checkFinishedClass(enrollment);

    // Should not enroll after 25% of the start of the class
    enrollmentBO.checkStartedClassCompletedPercentage(enrollment);

    // Check class capacity
    enrollmentBO.checkClassCapacity(enrollment, this.countStudentInTheClass(enrollment));

    // Generate Invoices
    enrollment.invoices = enrollmentBO.generateInvoices(enrollment);

    // extractOnlyDigits
    enrollment.student.cpf = student.cpf.value;

    // Check existing enrollment (The same CPF)
    this.checkDuplicateKey(enrollment);

    // Generate Enrollment ID
    enrollment.id = this.generateEnrollmentId(enrollment);
    
    this.data.push(enrollment);

    return enrollment;
  }

  private checkDuplicateKey (enrollment: any) {
    if (this.existByCpf(enrollment.student.cpf)) {
      throw new Error('Should not enroll duplicated student')
    }
  }

  countStudentInTheClass (enrollment: any): number {
    let filter = this.getEnrollmentPrefix(enrollment);
    return this.data.reduce((counter = 0, it) => {
      if (it.id.startsWith(filter)) {
        return ++counter;
      }
    }, 0)
  }

  private getNextSequenceFor (preffix: string) {
    let currentId = 0;
    
    // Get current sequence
    this.data.filter((it) => {
      if (it.id.startsWith(preffix)) {
        let lastPart = /[0-9]{4}$/.exec(it.id)
        if (lastPart) {
          let lastPartAsNumber = Number(lastPart)
          if (lastPartAsNumber > currentId) currentId = lastPartAsNumber;
        }
      }
    })

    currentId ++;
    return new String(currentId).padStart(4, "0");
  }

  private getEnrollmentPrefix (enrollment: any): string {
    return `${new Date().getFullYear()}${enrollment.level}${enrollment.module}${enrollment.class}`;
  }

  private generateEnrollmentId (enrollment: any): string {
    return `${this.getEnrollmentPrefix(enrollment)}${this.getNextSequenceFor(this.getEnrollmentPrefix(enrollment))}`;
  }

}
