export async function addBehavior(studentId, behaviorName, email) {
    const res = await fetch("api/behavior/add/" + studentId, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
          },
        body: JSON.stringify({
            behavior_name: behaviorName,
            email: email
          })
    })
    return res;
}