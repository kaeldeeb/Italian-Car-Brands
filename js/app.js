/**
 *
 * Manipulating the DOM exercise.
 * Exercise programmatically builds navigation,
 * scrolls to anchors from navigation,
 * and highlights section in viewport upon scrolling.
 *
 * Dependencies: None
 *
 * JS Version: ES2015/ES6
 *
 * JS Standard: ESlint
 *
 * Coded by: Karim El-Deeb
 *
*/
document.addEventListener('DOMContentLoaded', function () { // The whole script will run only after the DOM is loaded
/**
 * Define Global Variables
 *
*/
const sections = document.querySelectorAll("section"); // Create a NODE list containing document sections
const navBarList = document.getElementById("navbar__list"); // Create a NODE list containing elements inside navBar
const docFragment = document.createDocumentFragment(); // Create a document fragment to append list items (NavBar Links) to, to improve performance
const docHeader= document.getElementsByClassName("page__header");
const disappearingHeader = docHeader[0]; // This is the header element that will be shown and hidden by the script
const a = "your-active-class"; // Short name for the active class attribute
let menuLinks = ""; // Global variable that will be used later to store NODE list of new navigation links
let backToTop = null;
let targetSection = null;
let idleSeconds = 0; // Global variable to store the time the user did not scroll or move mouse
let headerOpacity = 1; // The initial opacity for the navBar menu
/**
 * End Global Variables
 * Start Helper Functions
 *
*/
function clearActiveClass () { // Iterate through all navigation links and sections to remove 'your-active-class' class
  let menuLink = "";
  for (menuLink of menuLinks) {
      menuLink.classList.remove(a); // Remove active class attribute from navBar link
  }
  let activeSection = "";
  for (activeSection of sections) {
      activeSection.classList.remove(a); // Remove active class attribute from section
  }
}

function showHideBackToTopButton () { // Show or hide 'Back to Top' button according to scrollY parameter of the window
  if (window.scrollY < 10) { // if the page is still at the top, keep the 'Back to Top' button hidden
    backToTopButton.style.display = 'none';
  } else {
    backToTopButton.style.display = 'inline'; // show the 'Back to Top' button when user scrolls downv further more
  }
}


/**
 * End Helper Functions
 * Begin Main Functions
 *
*/

// build the nav
function buildNav () { // This function runs once and builds the navigation links (navBar Links)
  let section = "";
  for (section of sections) { // Iterate through document sections
    let sectionDataNav = section.getAttribute("data-nav"); // Read 'data-nav' attribute from each section
    let newMenuLink=document.createElement('li'); // Create a new list item that will be used as a navBar Link later
    newMenuLink.innerHTML = sectionDataNav; // Set the innerHTML for the newly created NavBar Link
    newMenuLink.setAttribute("data-nav",sectionDataNav); // Add 'data-nav' attribute to the new navBar link
    newMenuLink.setAttribute("class","menu__link");// Add navLink class to the newly created NavBar link
    newMenuLink.style.userSelect = "none"; // Prevent user from accidentally selecting the link text
    docFragment.appendChild(newMenuLink); // Add the new NavBar link to temporary document fragment
  }
  navBarList.append(docFragment); // Append all NavBar links in one step to the document NavBarList <ul> element
  menuLinks = document.getElementsByClassName("menu__link"); // Create a NODE list containing the newly added navBar links
  menuLinks[0].classList.add(a); // Add active class attribute to the first navBar link as default
}

function buildBackToTopButton() { // Create a 'Back to Top' button
  let newBackToTop = document.createElement("button");
  newBackToTop.setAttribute("id","backToTopButton");
  newBackToTop.innerHTML = "Back to Page Top";
  newBackToTop.style.padding = '10px'; // Add inline CSS style for the newly created 'Back to Top' button
  newBackToTop.style.textAlign = 'center';
  newBackToTop.style.fontWeight = 'bold';
  newBackToTop.style.position = 'fixed'; // fixed position at the bottom right corner
  newBackToTop.style.bottom = 10;
  newBackToTop.style.right = 10;
  newBackToTop.style.cursor = 'pointer';
  newBackToTop.style.display = 'none'; // the button is hidden by default
  document.body.appendChild(newBackToTop);
  backToTopButton = document.getElementById("backToTopButton");
}

function setActiveSectionOnClick (clickEvent) {
  let targetSectionDataNav = clickEvent.target.getAttribute("data-nav"); // Read the 'data-nav' attribute value of the link clicked by user
  let targetSectionId = "";
  let section = "";
  for (section of sections) {
    if (section.getAttribute("data-nav") === targetSectionDataNav) {
    targetSectionId=section.getAttribute("id"); // Get the unique id attribute of the section
    }
  }
  targetSection = document.getElementById(targetSectionId); // Use the 'data-nav' attribute value to identify the target section
  targetSection.scrollIntoView({behavior:"smooth"}); // scroll to the target section smoothly
}

// Add class 'active' to section when near top of viewport
function setActiveSectionOnScroll () { // Sets the active section & navBar link upon scrolling and shows the navBar and 'Back to Top' button
    let section = "";
    for (section of sections) {
      let sectionTop = section.getBoundingClientRect().top;
      let sectionDataNav = "";
      if (sectionTop <= (screen.height/3) && section.getBoundingClientRect().bottom > (screen.height/3)) { // section.top is more than 0 and less than third the view port height
        //clearActiveClass(); // clear class attribute from both navBar links and sections
        section.classList.add(a); // sets the current section as active
        sectionDataNav = section.getAttribute("data-nav"); // read 'data-nav' attribute of the current section in view
        let menuLink = "";
          for (menuLink of menuLinks) {
              let menuLinkDataNav = menuLink.getAttribute("data-nav"); // read 'data-nav' attribute of the navBar link
              if (menuLinkDataNav === sectionDataNav) { // compare both 'data-nav' attributes
                menuLink.classList.add(a); // sets the matching navBar link as active
              }
              else {
                menuLink.classList.remove(a);
              }
          }
        } else {
          section.classList.remove(a);
        }
    }
  showHideBackToTopButton(); // these two functions will run upon event firing
  headerOpacity = 1;
  disappearingHeader.style.opacity=headerOpacity; // show the navBar menu and reset the uder navBar timer
  idleSeconds = 0;
}

function hideNavBar () {
  navBarTimer = setInterval(function(){ // start the timer to count idle seconds
    idleSeconds += 1;
    if (idleSeconds >= 2) { // User idle for 2 seconds
      if (headerOpacity === 1){ // if the header is visible, start to fade it out
        opacityInterval = setInterval (function() { // concept from w3schools.com
          if (disappearingHeader.style.opacity <= 0) { // navBar is 100% transparent, clear the interval / stop
            clearInterval(opacityInterval);
          }
          else { // navBar is not yet 100% transparent, proceed to fade out
            headerOpacity -= 0.05;
            disappearingHeader.style.opacity = headerOpacity;
          }
        },20);
      } else { // header is already invisible, do nothing

      }
      idleSeconds=0; // reset the navBarTimer
    } else {

    }
  },1000);
}

function resetView () {
window.onbeforeunload = function () { // Reset the view to the top when user refreshes the page
  window.scrollTo({top:0,left:0}); // upon window refresh so no smooth scrolling here - concept from w3schools.com -
}
};

/**
 * End Main Functions
 * Begin Events
 *
*/

let htmlElements = document.getElementsByTagName("HTML");
let htmlElement = htmlElements[0];
// Build menu
buildNav();
// Start the navBarTimer
hideNavBar();
// Build 'Back to Top Button'
buildBackToTopButton();
//
resetView();

// Events
// Scroll to section on link click
navBarList.addEventListener("click",setActiveSectionOnClick); // Detect when user clicks NavBar Link
// Style active section on scroll
window.addEventListener("scroll",setActiveSectionOnScroll); // Detect when user scrolls
// Show NavBar when user moves mouse
window.addEventListener("mousemove",function(){ // Show the navBar when user moves mouse
    headerOpacity = 1;
    disappearingHeader.style.opacity=headerOpacity;
    idleSeconds = 0;
});

window.addEventListener("load",function(){ // Hide navBar after document load
  let firstRun = setTimeout(function(){
  disappearingHeader.style.opacity=0;
  clearTimeout(firstRun);
},1000);
})
backToTopButton.addEventListener("click",function() {
  window.scrollTo({top:0,left:0,behavior:"smooth"});
});

});
