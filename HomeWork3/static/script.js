const url = "http://127.0.0.1:3000/count";
const indexCount = document.querySelector('.index');

async function fetchData() {
    try {
        const response = await fetch(url);
        let data = await response.json();
        return data;
    } catch (error) {
        console.error(`Ошибка - ${error}`);
    }
}

fetchData().then((data) => {
    indexCount.textContent = data.countRootPage;
});
