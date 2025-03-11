const servicesNavContainer = document.querySelector(".services-nav-container");
const smallVersionNav = document.querySelector(".small-version-nav");
const bottomNavBar = document.querySelector(".bottom-nav-links-container");
const topNavLinksText = document.querySelectorAll(".top-nav-links-text");
// console.log(topNavLinksText);
function adjustLayout()
{
    const headerHeight = document.querySelector(".main-top-header").getBoundingClientRect().height;
    document.documentElement.style.setProperty("--header-height", `${headerHeight}px`);
}

document.addEventListener("DOMContentLoaded", () =>
{
    // Adjust layout initially and on resize
    setTimeout(adjustLayout, 90);
    window.addEventListener("resize", adjustLayout);
});

window.addEventListener("scroll", () =>
{
    // const header = document.querySelector(".main-top-header");
    if (window.scrollY > 0)
    {
        servicesNavContainer.classList.add("hidden");
        smallVersionNav.classList.remove("hidden");
        bottomNavBar.classList.add("scrolled-header");
        topNavLinksText.forEach((linkText) =>
        {
            linkText.classList.add("hidden");
            linkText.nextElementSibling.setAttribute("alt", linkText.textContent);
        });

        adjustLayout();
    }
    else
    {
        servicesNavContainer.classList.remove("hidden");
        smallVersionNav.classList.add("hidden");
        bottomNavBar.classList.remove("scrolled-header");
        topNavLinksText.forEach((linkText) =>
        {
            linkText.classList.remove("hidden");
            linkText.nextElementSibling.setAttribute("alt", "");
        });

        adjustLayout();
    }
});