import EnrollStudent from "./EnrollStudent";

let enrollStudent = new EnrollStudent();

test("Student Ok", function () {
  let request = { 
    student: {
      name: "Mary Lee", 
      cpf: "358.356.800-15",
      birthDate: "1975-06-11"
    },
    level: "EM",
    module: "1",
    class: "A"
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
    module: "1",
    class: "A"
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
    module: "1",
    class: "A"
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
    module: "1",
    class: "A"
  }
  expect(() => enrollStudent.execute(request)).toThrow(new Error("Should not enroll duplicated student"))
});

test("Student Ok", function () {
  let request = { 
    student: {
      name: "Mia Tommy", 
      cpf: "108.008.610-27",
      birthDate: "2002-03-12"
    },
    level: "EM",
    module: "1",
    class: "A"
  }
  expect(enrollStudent.execute(request));
});

test("Number of students OK", function () {
  expect(enrollStudent.enrollmentRepository.count()).toBe(2);
});