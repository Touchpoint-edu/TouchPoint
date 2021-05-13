import Cookies from "js-cookie";

export async function fetchAllPeriods() {
    console.log(Cookies.get())
    console.log(Cookies.get("c_user"))
    const res = await fetch("/api/period/retrieve-all", {
        method: "GET"
    })
    return res;
}

export async function createPeriod(period) {
    const res = await fetch("/api/period/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
          },
        body: JSON.stringify({
            period: period
          })
    })
    return res;
}


export async function uploadCSV(uploadFile, period) {
    const res = await fetch("/api/period/csv/upload", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            uploadFile: uploadFile,
            period: period
          })
    })
    return res;
}

export async function downloadCSV(studentsArray, start , end) {
    const res = await fetch("/api/period/csv/download", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            students: studentsArray,
            start: start,
            end: end
          })
    })
    return res;
}

export async function fetchSeatingChart(period_id) {
    const res = await fetch("/api/period/students/seating/" + period_id, {
        method: "GET"
    })
    return res;
}

export async function updateSeatingChart(periodId, numRow, numCol, studentsArray) {
    const res = await fetch("/api/period/students/update/" + periodId, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
          },
        body: JSON.stringify({
            rows: numRow,
            columns: numCol,
            students: studentsArray
          })
    })
    return res;
}

export async function addStudent(periodId, studentName, studentEmail) {
    const res = await fetch("/api/period/students/add-one/" + periodId, {
        method: "POST",
        body: JSON.stringify({
            name: studentName,
            email: studentEmail
          })
    })
    return res;
}

export async function removeStudent(periodId, studentEmail) {
    const res = await fetch("/api/period/students/remove-one/" + periodId, {
        method: "DELETE",
        body: JSON.stringify({
            email: studentEmail
          })
    })
    return res;
}