import EnrollStudent from "./EnrollStudent";
import RepositoryMemoryFactory from "./repositories/RepositoryMemoryFactory";

let enrollStudent: EnrollStudent;

beforeEach(function () {
    enrollStudent = new EnrollStudent(new RepositoryMemoryFactory()); 
});

test("Student Ok 1", function () {
  let request = { 
    student: {
      name: "Mary Lee", 
      cpf: "358.356.800-15",
      birthDate: "1975-06-11"
    },
    level: "EM",
    module: "3",
    classroom: "A",
    installments: 12
  }
  expect(enrollStudent.execute(request));
});

test("Bad CPF", function () {
  let request = { 
    student: {
      name: "John Way", 
      cpf: "123.456.789-99",
      birthDate: "2002-03-12"
    },
    level: "EM",
    module: "3",
    classroom: "A",
    installments: 12
  }
  expect(() => enrollStudent.execute(request)).toThrow(new Error("Should not enroll without valid student cpf"))
});

test("Bad Name", function () {
  let request = { 
    student: {
      name: "G", 
      cpf: "777.740.360-59",
      birthDate: "2002-03-12"
    },
    level: "EM",
    module: "3",
    classroom: "A",
    installments: 12
  }
  expect(() => enrollStudent.execute(request)).toThrow(new Error("Should not enroll without valid student name"))
});

test("Duplicated CPF", function () {
  let request = { 
    student: {
      name: "John Way Jr", 
      cpf: "358.356.800-15",
      birthDate: "2002-03-12"
    },
    level: "EM",
    module: "3",
    classroom: "A",
    installments: 12
  }

  // Add first
  enrollStudent.execute(request);
  
  // Add duplicated
  expect(() => enrollStudent.execute(request)).toThrow(new Error("Should not enroll duplicated student"))
});

test("Student Ok 2", function () {
  let request = { 
    student: {
      name: "Mia Tommy", 
      cpf: "108.008.610-27",
      birthDate: "2002-03-12"
    },
    level: "EF2",
    module: "6",
    classroom: "A",
    installments: 10
  }
  expect(enrollStudent.execute(request));
});

test("Student Ok 3", function () {
  let request = { 
    student: {
      name: "John Mc Donald", 
      cpf: "845.644.890-70",
      birthDate: "2001-03-12"
    },
    level: "EF2",
    module: "6",
    classroom: "A",
    installments: 12
  }
  expect(enrollStudent.execute(request));
});

test("Student Ok 4 with 12 installments invoices", function () {
  let request = { 
    student: {
      name: "Jessica Turner", 
      cpf: "837.112.030-35",
      birthDate: "2003-10-11"
    },
    level: "EF2",
    module: "6",
    classroom: "A",
    installments: 12
  }

  let result = enrollStudent.execute(request);
  expect(result.invoices).toHaveLength(12);
});

// Should generate enrollment code
test("Get first enrollment by id", function () {
  let request = { 
    student: {
      name: "John Way Jr", 
      cpf: "358.356.800-15",
      birthDate: "2002-03-12"
    },
    level: "EM",
    module: "3",
    classroom: "A",
    installments: 12
  }

  // Add student
  enrollStudent.execute(request);

  expect(enrollStudent.enrollmentRepository.findByCode('2021EM3A0001')).not.toBeUndefined();
});

// Should not enroll student below minimum age
test("Very young student", function () {
  let request = { 
    student: {
      name: "Chiquitita Fia", 
      cpf: "976.012.680-04",
      birthDate: "2021-03-12"
    },
    level: "EF2",
    module: "6",
    classroom: "A",
    installments: 12
  }
  expect(() => enrollStudent.execute(request)).toThrow(new Error("Student below minimum age"))
});

// Should not enroll student over class capacity
test("Class overload", function () {
  let request1 = { 
    student: {
      name: "Jessica Turner", 
      cpf: "837.112.030-35",
      birthDate: "2003-10-11"
    },
    level: "EF2",
    module: "6",
    classroom: "A",
    installments: 12
  }

  enrollStudent.execute(request1);

  let request2 = { 
    student: {
      name: "Jika Lyra", 
      cpf: "039.137.020-08",
      birthDate: "2003-02-28"
    },
    level: "EF2",
    module: "6",
    classroom: "A",
    installments: 10
  }
  expect(() => enrollStudent.execute(request2)).toThrow(new Error("Should not enroll student over class capacity"))
});


// Should not enroll after que end of the class
test("Ended Class", function () {
  let request = { 
    student: {
      name: "Lumpa Kurki", 
      cpf: "808.381.200-59",
      birthDate: "1989-01-12"
    },
    level: "EF1",
    module: "1",
    classroom: "A",
    installments: 12
  }
  expect(() => enrollStudent.execute(request)).toThrow(new Error("Class is already finished"))
});


// Should not enroll after 25% of the start of the class
test("Class completed over 25%", function () {
  let request = { 
    student: {
      name: "Giulliam Mey", 
      cpf: "730.142.880-47",
      birthDate: "1977-11-09"
    },
    level: "EF1",
    module: "2",
    classroom: "A",
    installments: 6
  }
  expect(() => enrollStudent.execute(request)).toThrow(new Error("Class is already started"))
});
