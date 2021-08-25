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
let navBarLinks = ""; // Global variable that will be used later to store NODE list of new navigation links
let backToTop = null;
let targetSection = null;

/**
 * End Global Variables
 * Start Helper Functions
 *
*/
function clearActiveClass () { // Iterate through all navigation links and sections to remove 'your-active-class' class
  let navBarLink = "";
  for (navBarLink of navBarLinks) {
      navBarLink.classList.remove(a); // Remove active class attribute from navBar link
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

function showHideNavBar() { // Show navBar briefly then hide it again
  if (typeof navBarTimeOut !== undefined && typeof opacityInterval !==undefined) { // this check to prevent unidentifed errors of navBarTimeOut and opacityInterval
    clearTimeout(navBarTimeOut); // Stop the navBar hiding animation on user scroll
    disappearingHeader.style.opacity= 1; // Show navBar with 100% opacity
    hideNavBar(); // Then call the hideNavBar function again to start a new timeout
  }
}


/**
 * End Helper Functions
 * Begin Main Functions
 *
*/

// build the nav
function buildNav () { // This function runs once and builds the navigation links (navBar Links)
  let mySection = "";
  for (mySection of sections) { // Iterate through document sections
    let sectionDataNav = mySection.getAttribute("data-nav"); // Read 'data-nav' attribute from each section
    let newLiItem=document.createElement('li'); // Create a new list item that will be used as a navBar Link later
    newLiItem.innerHTML = sectionDataNav; // Set the innerHTML for the newly created NavBar Link
    newLiItem.setAttribute("data-nav",sectionDataNav); // Add 'data-nav' attribute to the new navBar link
    newLiItem.setAttribute("class","navLink");// Add navLink class to the newly created NavBar link
    newLiItem.style.userSelect = "none"; // Prevent user from accidentally selecting the link text
    docFragment.appendChild(newLiItem); // Add the new NavBar link to temporary document fragment
  }
  navBarList.append(docFragment); // Append all NavBar links in one step to the document NavBarList <ul> element
  navBarLinks = document.getElementsByClassName("navLink"); // Create a NODE list containing the newly added navBar links
  navBarLinks[0].classList.add(a); // Add active class attribute to the first navBar link as default
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
  clearActiveClass(); // remove active class attributefrom all navBar links and sections
  clickEvent.target.classList.add (a); // Add active class attribute to the link clicked by user
  let targetSectionDataNav = clickEvent.target.getAttribute("data-nav"); // Read the 'data-nav' attribute value of the link clicked by user
  let targetSectionId = "";
  let section = "";
  for (section of sections) {
    if (section.getAttribute("data-nav") === targetSectionDataNav) {
    targetSectionId=section.getAttribute("id"); // Get the unique id attribute of the section
    }
  }
  targetSection = document.getElementById(targetSectionId); // Use the 'data-nav' attribute value to identify the target section
  targetSection.scrollIntoView({behavior:"smooth"}); // scroll to the target section
  setActiveSectionOnScroll();
}

// Add class 'active' to section when near top of viewport
function setActiveSectionOnScroll () { // Sets the active section & navBar link upon scrolling and shows the navBar and 'Back to Top' button
    let section = "";
    for (section of sections) {
      let sectionTop = section.getBoundingClientRect().top;
      let sectionDataNav = "";
      if (sectionTop <= (screen.height/3) && (sectionTop >= -5)) { // section.top is more than 0 and less than third the view port height
        clearActiveClass(); // clear class attribute from both navBar links and sections
        section.classList.add(a); // sets the current section as active
        sectionDataNav = section.getAttribute("data-nav"); // read 'data-nav' attribute of the current section in view
        let navBarLink = "";
          for (navBarLink of navBarLinks) {
              let navBarLinkDataNav = navBarLink.getAttribute("data-nav"); // read 'data-nav' attribute of the navBar link
              if (navBarLinkDataNav === sectionDataNav) { // compare both 'data-nav' attributes
                navBarLink.classList.add(a); // sets the matching navBar link as active
              }
          }
        }
    }
  showHideBackToTopButton(); // these two functions will run upon event firing
  showHideNavBar();
}

function hideNavBar () {
  let headerOpacity = 1;
  navBarTimeOut = setTimeout (function(){ // Wait for 1 second then begin to reduce navBar opacity until 100% transparent
  opacityInterval = setInterval (function() { // concept from w3schools.com
      if (disappearingHeader.style.opacity <= 0) { // navBar is 100% transparent, clear the interval
        clearInterval(opacityInterval);
      }
      else {
        headerOpacity -= 0.05;
        disappearingHeader.style.opacity = headerOpacity;
      }
    },20);
  },1000);
}

function resetView () {
window.onbeforeunload = function () { // Reset the view to the top when user refreshes the page
    document.removeEventListener("scroll",setActiveSectionOnScroll,true);
    window.scrollTo(0,0); // concept from w3schools.com
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
// Build 'Back to Top Button'
buildBackToTopButton();
// Hide NavBar when user is not scrolling or moving mousemove
hideNavBar();
// Start the checkScrolling interval
resetView();

// Events
// Scroll to section on link click
navBarList.addEventListener("click",setActiveSectionOnClick); // Detect when user clicks NavBar Link
// Style active section on scroll
document.addEventListener("scroll",setActiveSectionOnScroll); // Detect when user scrolls
// Show NavBar when user moves mouse
document.addEventListener("mousemove",showHideNavBar);
// Scroll to page top when user clicks 'Back to Page Top' button
backToTopButton.addEventListener("click",function() {
  window.scrollTo(0,0);
  clearActiveClass();
  navBarLinks[0].classList.add(a); // Set active class attribute to first navBar link
  sections[0].classList.add(a); // Set active class attribute to first section
  setActiveSectionOnScroll();

});

});
