export async function addBehavior(studentId, behaviorName) {
    const res = await fetch("behavior/add/" + studentId, {
        method: "POST",
        body: JSON.stringify({
            behavior_name: behaviorName
          })
    })
    return res;
}

export async function countBehaviors(studentId) {
    const res = await fetch("behavior/count-list/" + studentId, {
        method: "GET",
    });
    return res;
}