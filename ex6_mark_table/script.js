document.addEventListener("DOMContentLoaded", function() {
    const students = [
        { name: "Mark", gender: "M", grades: [90, 85, 78, 92, 88] },
        { name: "Leo", gender: "M", grades: [78, 92, 84, 90, 76] },
        { name: "Eva", gender: "F", grades: [88, 79, 92, 85, 90] },
        { name: "Anne", gender: "F", grades: [92, 88, 75, 80, 86] },
        { name: "Nick", gender: "M", grades: [85, 90, 88, 92, 78] },
        { name: "Bob", gender: "M", grades: [76, 85, 90, 88, 92] },
        { name: "Alice", gender: "F", grades: [95, 89, 92, 84, 91] }
    ];

    const subjects = ["Maths", "Geography", "Biology", "English", "Chemistry"];

    const tableHeader = document.querySelector("#marks-table thead tr");

    let currentSortOrder = "high-to-low";

    tableHeader.innerHTML = "<th>Sex</th><th>Name/Subject</th>";
    for (let i = 0; i < subjects.length; i++) {
        tableHeader.innerHTML += `<th>${subjects[i]}</th>`;
    }
    
    tableHeader.innerHTML += "<th>GPA</th>";
    tableHeader.innerHTML += "<th>High Marks</th>";
    tableHeader.innerHTML += "<th>Low Marks</th>";

    const tableBody = document.querySelector("#marks-table tbody");

    function addStudentRows() {
        for (let i = 0; i < students.length; i++) {
            const student = students[i];
            const row = createStudentRow(student);
            tableBody.appendChild(row);
        }
    }

    function createStudentRow(student) {
        const row = document.createElement("tr");
        let rowHtml = `<td>${student.gender}</td><td>${student.name}</td>`;
        const studentGrades = student.grades;
        const maxIndexes = [];
        const minIndexes = [];

        const maxMark = Math.max(...studentGrades);
        const minMark = Math.min(...studentGrades);

        for (let j = 0; j < studentGrades.length; j++) {
            rowHtml += `<td>${studentGrades[j]}</td>`;

            if (studentGrades[j] === maxMark) {
                maxIndexes.push(j);
            }

            if (studentGrades[j] === minMark) {
                minIndexes.push(j);
            }
        }

        const maxSubjects = maxIndexes.map(index => subjects[index]);
        const minSubjects = minIndexes.map(index => subjects[index]);

        const gpa = calculateGPA(studentGrades);

        row.innerHTML = rowHtml;
        row.innerHTML += `<td>${gpa.toFixed(2)}</td>`;
        row.innerHTML += `<td>${maxSubjects.join(", ")}: ${maxMark}</td><td>${minSubjects.join(", ")}: ${minMark}</td>`;
        return row;
    }

    function calculateGPA(grades) {
        const totalMarks = grades.reduce((sum, grade) => sum + grade, 0);
        return (totalMarks / grades.length);
    }

    function sortStudents() {
        if (currentSortOrder === "high-to-low") {
            students.sort((a, b) => calculateGPA(b.grades) - calculateGPA(a.grades));
            currentSortOrder = "low-to-high";
        } else {
            students.sort((a, b) => calculateGPA(a.grades) - calculateGPA(b.grades));
            currentSortOrder = "high-to-low";
        }

        while (tableBody.firstChild) {
            tableBody.removeChild(tableBody.firstChild);
        }

        addStudentRows();
        displayAverageRow();
        displaySubjectHighLowMarksLastRow();
    }

    const sortHighToLowButton = document.querySelector("#sort-high-to-low");
    const sortLowToHighButton = document.querySelector("#sort-low-to-high");

    sortHighToLowButton.addEventListener("click", function() {
        sortStudents();
    });

    sortLowToHighButton.addEventListener("click", function() {
        sortStudents();
    });

    /* const sortAverageHighToLowButton = document.querySelector("#sort-average-high-to-low");
    const sortAverageLowToHighButton = document.querySelector("#sort-average-low-to-high");

    sortAverageHighToLowButton.addEventListener("click", function() {
        sortStudentsByAverage("high-to-low");
    });

    sortAverageLowToHighButton.addEventListener("click", function() {
        sortStudentsByAverage("low-to-high");
    });
 */
    function sortStudentsByAverage(order) {
        if (order === "high-to-low") {
            students.sort((a, b) => calculateGPA(b.grades) - calculateGPA(a.grades));
        } else {
            students.sort((a, b) => calculateGPA(a.grades) - calculateGPA(b.grades));
        }

        while (tableBody.firstChild) {
            tableBody.removeChild(tableBody.firstChild);
        }

        addStudentRows();
        displayAverageRow();
        displaySubjectHighLowMarksLastRow();
    }


    function calculateSubjectAverages(subjects, marks) {
        const averageRow = document.createElement("tr");
        averageRow.innerHTML = "<td></td><td>Average</td>";

        for (let i = 0; i < subjects.length; i++) {
            let sum = 0;
            for (let j = 0; j < marks.length; j++) {
                sum += marks[j][i];
            }
            const average = sum / marks.length;
            averageRow.innerHTML += `<td>${average.toFixed(2)}</td>`;
        }

        return averageRow;
    }

    function displaySubjectHighLowMarksLastRow() {
        const lastRow = document.createElement("tr");
        lastRow.innerHTML = "<td></td><td>High/Low</td>";

        for (let i = 0; i < subjects.length; i++) {
            const subjectMarks = students.map(student => student.grades[i]);
            const maxMark = Math.max(...subjectMarks);
            const minMark = Math.min(...subjectMarks);
            const maxStudents = students.filter((student, index) => student.grades[i] === maxMark).map(student => student.name);
            const minStudents = students.filter((student, index) => student.grades[i] === minMark).map(student => student.name);

            lastRow.innerHTML += `<td>High: ${maxMark} (${maxStudents.join(", ")}) / Low: ${minMark} (${minStudents.join(", ")})</td>`;
        }

        tableBody.appendChild(lastRow);
    }

    function displayAverageRow() {
        const averageRow = calculateSubjectAverages(subjects, students.map(student => student.grades));
        averageRow.classList.add("average-row"); 
        tableBody.appendChild(averageRow);
    }

    addStudentRows();
    displayAverageRow();
    displaySubjectHighLowMarksLastRow();
});
