export async function addBehavior(studentId, behaviorName) {
    const res = await fetch("behavior/add/" + studentId, {
        method: "GET",
        body: JSON.stringify({
            behavior_name: behaviorName
          })
    })
    return res;
}