export async function addBehavior(studentId, behaviorName) {
    const res = await fetch("api/behavior/add/" + studentId, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
          },
        body: JSON.stringify({
            behavior_name: behaviorName
          })
    })
    return res;
}