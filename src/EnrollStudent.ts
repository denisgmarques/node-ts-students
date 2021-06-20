import Enrollment from './entities/Enrollment';
import Student from './entities/Student';
import ClassroomRepository from './repositories/ClassroomRepository';
import EnrollmentRepository from './repositories/EnrollmentRepository'
import LevelRepository from './repositories/LevelRepository';
import ModuleRepository from './repositories/ModuleRepository';
import RepositoryAbstractFactory from './repositories/RepositoryAbstractFactory';

export default class EnrollStudent {
  levelRepository: LevelRepository;
  moduleRepository: ModuleRepository;
  classroomRepository: ClassroomRepository;
  enrollmentRepository: EnrollmentRepository;

  constructor (repositoryFactory: RepositoryAbstractFactory) {
    this.levelRepository = repositoryFactory.createLevelRepository();
    this.moduleRepository = repositoryFactory.createModuleRepository();
    this.classroomRepository = repositoryFactory.createClassroomRepository();
    this.enrollmentRepository = repositoryFactory.createEnrollmentRepository();
  }

  execute(enrollmentRequest: any): any {
    let student = new Student(enrollmentRequest.student.name, enrollmentRequest.student.cpf, enrollmentRequest.student.birthDate);

    let level = this.levelRepository.findByCode(enrollmentRequest.level);
    let module = this.moduleRepository.findByLevelAndCode(enrollmentRequest.level, enrollmentRequest.module);
    let classroom = this.classroomRepository.findByLevelAndModuleAndCode(enrollmentRequest.level, enrollmentRequest.module, enrollmentRequest.classroom);

    // Check class capacity
    const classCount = this.countStudentInTheClass(enrollmentRequest);

    // Instantiate Enrollment entity
    const issueDate = new Date();
    let enrollment = new Enrollment(student, level, module, classroom, enrollmentRequest.installments, issueDate, classCount + 1);

    if (classCount >= classroom.capacity) {
      throw new Error("Should not enroll student over class capacity");
    }

    // Check existing enrollment (The same CPF)
    this.checkDuplicateKey(enrollment);
   
    this.enrollmentRepository.add(enrollment);

    return enrollment;
  }

  private checkDuplicateKey (enrollment: Enrollment) {
    if (this.enrollmentRepository.existByCpf(enrollment.student.cpf.value)) {
      throw new Error('Should not enroll duplicated student')
    }
  }

  countStudentInTheClass (enrollmentRequest: any): any {
    let filter = `${new Date().getFullYear()}${enrollmentRequest.level}${enrollmentRequest.module}${enrollmentRequest.classroom}`;
    return this.enrollmentRepository.findAll().reduce((counter = 0, it) => {
      if (it.code.value.startsWith(filter)) {
        return ++counter;
      }
    }, 0) || 0; // TODO - Não sei pq retorna undefined as vezes
  }

}