export async function checkExpiration(response) {
    if (response.status === 401) {
        const resJson = await response.json()
        alert(resJson.message)
        window.location.replace("/");
    }

    return response
}