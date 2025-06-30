async function fetchAndInsertHtml(targetId, htmlPage) {
  try {
    const target = document.getElementById(targetId);
    const resp = await fetch(htmlPage);
    const html = await resp.text();
    target.innerHTML = html;
  } catch (error) {
    console.error(error);
  }
}

async function addHtmlPage(htmlPage) {
  try {
    const siderbar = document.getElementById("sidebar");
    const navbar = document.getElementById("navbar");
    const resp = await fetch(htmlPage);
    const html = await resp.text();
    siderbar.innerHTML = html;
  } catch (error) {
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await fetchAndInsertHtml("sidebar", "./html-templates/siderbar.html");
  await fetchAndInsertHtml("navbar", "./html-templates/navbar.html");
  await fetchAndInsertHtml("content-wrapper", "./html-templates/summary.html");
});