import { checkExpiration } from "./api"

export async function addBehavior(studentId, behaviorName, email, period) {
    const res = await fetch("api/behavior/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
          },
        body: JSON.stringify({
            behavior_name: behaviorName,
            email: email,
            period: period._id
          })
    })
    return checkExpiration(res);
}