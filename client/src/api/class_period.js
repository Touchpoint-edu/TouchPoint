export async function fetchAllPeriods() {
    const res = await fetch("period/retrieve-all", {
        method: "GET"
    })
    return res;
}

export async function uploadCSV(uploadFile) {
    // make FormData object to pass into request
    const formData = new FormData()
    formData.append('file', uploadFile)

    const res = await fetch("/period/csv/upload", {
        method: "POST",
        body: formData
    })
    return res;
}

export async function downloadCSV(studentsArray, start , end) {
    const res = await fetch("/period/csv/download", {
        method: "GET",
        body: JSON.stringify({
            students: studentsArray,
            start: start,
            end: end
          })
    })
    return res;
}

export async function fetchSeatingChart(period_id) {
    const res = await fetch("/period/students/seating/" + period_id, {
        method: "GET"
    })
    return res;
}

export async function updateSeatingChart(periodId, numCol, studentsArray) {
    const res = await fetch("/period/students/update/" + periodId, {
        method: "POST",
        body: JSON.stringify({
            columns: numCol,
            students: studentsArray
          })
    })
    return res;
}

export async function addStudent(periodId, studentName, studentEmail) {
    const res = await fetch("/period/students/add-one/" + periodId, {
        method: "POST",
        body: JSON.stringify({
            name: studentName,
            email: studentEmail
          })
    })
    return res;
}

export async function removeStudent(periodId, studentEmail) {
    const res = await fetch("/period/students/remove-one/" + periodId, {
        method: "DELETE",
        body: JSON.stringify({
            email: studentEmail
          })
    })
    return res;
}