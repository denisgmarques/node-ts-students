import EnrollmentRepository from './repositories/EnrollmentRepositoryMemory'

export default class EnrollStudent {
  enrollmentRepository: EnrollmentRepository;

  constructor (enrollmentRepository: EnrollmentRepository) {
    this.enrollmentRepository = enrollmentRepository;
  }

  execute(enrollmentRequest: any) {
    this.enrollmentRepository.add(enrollmentRequest);
  }
}