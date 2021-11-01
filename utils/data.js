// this file is used to populate an initial database
class RequestableObject {
	getObject() {
		return { ...this };
	}
}

class Student extends RequestableObject {
	fullName; email; phone; password; department; CGPA;

	constructor(fullName, email, phone, password, department, CGPA) {
		super();
		this.fullName = fullName;
		this.email = email.toLowerCase();
		this.phone = phone;
		this.password = password;
		this.department = department;
		this.CGPA = CGPA;
	}
}

class Instructor extends RequestableObject {
	fullName; email; phone; password; department; title;

	constructor(fullName, email, phone, password, department, titles) {
		super();
		this.fullName = fullName;
		this.email = email.toLowerCase();
		this.phone = phone;
		this.password = password;
		this.department = department;
		this.title = titles;
	}
}

// at least 5 courses
class Course extends RequestableObject {
	name; code; description; department;

	constructor(name, code, department, description) {
		super();
		this.name = name;
		this.code = code;
		this.department = department;
		this.description = description;
	}
}

class Section extends RequestableObject {
	static _CRN = 1;
	course_id; CRN; semester; startDate; endDate; schedule;

	constructor(schedule) {
		super();
		this.CRN = Section._CRN++;
		this.schedule = schedule;

		this.semester = "Spring 2021";
		this.startDate = "January 30, 2021";
		this.endDate = "June 30, 2021";
	}
}

class Assignment extends RequestableObject {
	section; name; description; type;
	startDate; startTime; endDate; endTime;

	constructor(name, description, type, startDate, startTime, endDate, endTime) {
		super();
		this.name = name;
		this.description = description;
		this.type = type;
		this.startDate = startDate;
		this.startTime = startTime;
		this.endDate = endDate;
		this.endTime = endTime;
	}
}

const data = {
	students: [
		(new Student("Jeffrey Joumjian", "jeffrey.joumjian@student.com", "54894980", "student", "Computer Science and Mathematics", 3.0)),
		(new Student("Rabih Jabr", "rabih.jabr@student.com", "84558254", "student", "Computer Science and Mathematics", 2.0)),
		(new Student("Victoria Jensen", "Victoria.Jensen@student.com", "96856751", "student", "Computer Science and Mathematics", 2.1)),
		(new Student("Cody Ford", "Cody.Ford@student.com", "97855717", "student", "Computer Science and Mathematics", 3.0)),
		(new Student("Alberta Lynch", "Alberta.Lynch@student.com", "74364751", "student", "Computer Science and Mathematics", 3.5)),
		(new Student("Maude Baker", "Maude.Baker@student.com", "75511013", "student", "Computer Science and Mathematics", 3.3)),
		(new Student("Lou Vaughn", "Lou.Vaughn@student.com", "72690499", "student", "Computer Science and Mathematics", 3.3)),
		(new Student("Roxie Dean", "Roxie.Dean@student.com", "97298396", "student", "Computer Science and Mathematics", 2.1)),
		(new Student("Virginia Dennis", "Virginia.Dennis@student.com", "95043928", "student", "Computer Science and Mathematics", 3.6)),
		(new Student("Lula Rodgers", "Lula.Rodgers@student.com", "82908319", "student", "Computer Science and Mathematics", 2.2)),
	],
	instructors: [
		(new Instructor("Catherine Quinn", "Catherine.Quinn@instructor.edu", "54519793", "instructor", "Computer Science and Mathematics", ["Professor"])),
	],

	courses: [
		(new Course("Algorithms and Data Structures", "CSC-310", "Computer Science and Mathematics", "This course presents the fundamental computing algorithms and data structures, with emphasis on design and analysis. Topics include the asymptotic analysis of upper and average complexity bounds, the best, the average, and the worst, case behaviors. Recurrence relations, sets, hashing and hash tables, trees and binary trees (properties, tree traversal algorithms), heaps, priority queues, and graphs (representation, depth-and breadth-first traversals and applications, shortest-path algorithms, transitive closure, network flows, topological sort). The course also covers the sorting algorithms and performance analysis which include mergesort, quicksort and heapsort. As well, the course details the fundamental algorithmic strategies (divide­ and-conquer approach, greedy, dynamic programming, and backtracking) and provides an introduction to NP-completeness theory.")),
		(new Course("Calculus III", "MTH 201", "Computer Science and Mathematics", "This course covers hyperbolic functions, integration techniques and improper integrals. The course covers also infinite sequences and series: limits of sequences of numbers, bounded sequences, integral test for series, comparison tests, ratio and root tests, alternating series test, absolute and conditional convergence, power series, Taylor and MacLaurin series, and applications of power series. Polar functions, polar coordinates, and graphing of polar curves are also covered. In addition, topics from multivariable calculus are introduced: functions of several variables, partial derivatives, double integrals, applications to double integrals, and double integrals in polar form.")),
		(new Course("Discrete Structures II", "MTH 307", "Computer Science and Mathematics", "This course covers computational complexity and order analysis, recurrence relations and their solutions, graphs and trees, elementary computability, classes P and NP problems, NP-completeness (Cook’s theorem), NP-complete problems, reduction techniques, automata theory including deterministic and nondeterministic finite automata, equivalence of DFAs and NFAs, regular expressions, the pumping lemma for regular expressions, context-free grammars, Turing machines, nondeterministic Turing machines, sets and languages, uncomputable functions, the halting problem, implications of uncomputability, Chomsky hierarchy, and the Church-Turing thesis.")),
		(new Course("Web Development", "CSC 443", "Computer Science and Mathematics", "This course introduces advanced concepts in web programming, and focuses on the development of dynamic web pages that incorporate both client-side and server-side programming. Topics include web scripting using JavaScript, VBScript, and PHP, as well as Java Beans, and server side components such as CGI, ASP, and PHP, and the installation and configuration of web servers. The course also discusses accessing databases through web applications. Hands-on experience is part of the class. ")),
		(new Course("Advanced Academic English", "ENG 202", "English", "This course builds on the skills achieved in the previous courses. It focuses on synthesizing sources producing an empirical research paper, and defending it in front of an audience.")),
	],
	sections: [
		new Section("MWF 01:00 PM 01:50 PM"),
		new Section("MWF 08:00 AM 08:50 AM"),
		new Section("TTH 01:00 PM 02:15 PM"),
		new Section("TTH 02:30 PM 03:45 PM"),
		new Section("MWF 10:00 AM 10:50 AM"),
	],

	assignments: [
		(new Assignment("Assignment 2", "Implement a simple webpage with pictures about any topic that you find interesting.")),
		(new Assignment("Draft Thesis", "Submit a draft thesis statement taking into consideration the things discussed in class.")),
	],

}

async function setUpCourses() {
	try {

		for (let i = 0; i < data.courses.length; i++) {


			let formData = new FormData();

			let currentData = data.courses[i].getObject();
			for (let prop in currentData)
				formData.append(prop, currentData[prop]);

			let res = await fetch('http://localhost:3000/api/courses/', {
				method: 'POST',
				body: formData
			});

			if (res.status === 201) {
				let course = await res.json();
				console.log(course);

				data.sections[i].course_id = course._id;
				let sectionRes = await fetch('http://localhost:3000/api/sections/', {
					method: 'POST',
					mode: 'cors',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(data.sections[i].getObject())
				});

				if (sectionRes.status === 201) {
					console.log((await sectionRes.json()).section._id);
				}
				else {
					console.log(await sectionRes.text());
				}
			}
			else {
				console.log(await res.text());
			}
		}
	}
	catch (e) {
		console.log(e.message);
	}
}


async function setUpStudents() {
	try {
		for (let i = 0; i < data.students.length; i++) {
			let res = await fetch('http://localhost:3000/api/students/', {
				method: 'POST',
				mode: 'cors',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data.students[i].getObject())
			});

			if (res.status === 201)
				console.log((await res.json())._id);
			else {
				console.log(await res.text());
			}
		}
	}
	catch (e) {
		console.log(e.message);
	}
}

async function addStudentsToSections() {
	let student_ids = ["60b234e653dbf04ceb5b3605", "60b234e553dbf04ceb5b3604", "60b234e553dbf04ceb5b3603", "60b234e553dbf04ceb5b3602", "60b234e553dbf04ceb5b3601", "60b234e553dbf04ceb5b3600", "60b234e453dbf04ceb5b35ff", "60b234e453dbf04ceb5b35fe", "60b234e453dbf04ceb5b35fd", "60b234e353dbf04ceb5b35fc"];
	const sections = ["60b2369c99ce664d41bf080b", "60b236038253894d220cd0dc", "60b236028253894d220cd0d6", "60b236028253894d220cd0d8", "60b236038253894d220cd0da"];
	try {
		for (let j = 0; j < sections.length; j++) {
			for (let i = 0; i < student_ids.length; i++) {
				let res = await fetch(`http://localhost:3000/api/students/${student_ids[i]}/courses/add/${sections[j]}`, {
					method: 'PUT',
					mode: 'cors',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					}
				});

				if (res.status === 201)
					console.log(await res.json());
				else {
					console.log(await res.text());
				}
			}
		}
	}
	catch (e) {
		console.log(e.message);
	}
}

async function setUpInstructors() {
	try {
		for (let i = 0; i < data.instructors.length; i++) {
			let res = await fetch('http://localhost:3000/api/instructors/', {
				method: 'POST',
				mode: 'cors',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data.instructors[i].getObject())
			});

			if (res.status === 201)
				console.log((await res.json())._id);
			else {
				console.log(await res.text());
			}
		}
	}
	catch (e) {
		console.log(e.message);
	}
}

async function addInstructorsToSections() {
	const instructor_ids = ["60b23956187b704dd8c36210"];
	const sections = ["60b2369c99ce664d41bf080b", "60b236038253894d220cd0dc", "60b236028253894d220cd0d6", "60b236028253894d220cd0d8", "60b236038253894d220cd0da"];
	try {
		for (let j = 0; j < sections.length; j++) {
			for (let i = 0; i < instructor_ids.length; i++) {
				let res = await fetch(`http://localhost:3000/api/instructors/${instructor_ids[i]}/courses/add/${sections[j]}`, {
					method: 'PUT',
					mode: 'cors',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					}
				});

				if (res.status === 201)
					console.log(await res.json());
				else {
					console.log(await res.text());
				}
			}
		}
	}
	catch (e) {
		console.log(e.message);
	}
}

// setUpCourses();
// setUpStudents();
// addStudentsToSections();
// setUpInstructors();
// addInstructorsToSections();
