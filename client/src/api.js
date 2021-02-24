export function callAPI(){
    return fetch('/getTest').then((response) => {
        return response.text();
    });
}