/*
const locationListTarget = document.querySelector(".locationList");
const listOfLocations = {
  NewYork: {
    name: "New York, NY",
    ID: 1234,
    TimeZone: "EST",
    availability: 80
  },
  SanDiego: {
    name: "Sand Diego, CA",
    ID: 321,
    TimeZone: "PST",

    availability: 20
  },
  Texas: {
    name: "Texas",
    ID: 654,
    TimeZone: "CST",
    availability: 100
  }
};

// Function Short hand Create Element
function createEle(tagName, styleSheet, dataContent) {
  let tempObject = document.createElement(`${tagName}`);
  tempObject.classList.add(`${styleSheet}`);
  tempObject.innerText = dataContent;
  return tempObject;
}

// let location = createElement("DIV", "locations", "Content");

// Create list of locations and render on screen
function generateList() {
  //start generate list
  const locationKeys = Object.keys(listOfLocations);
  for (let i = 0; i < locationKeys.length; i++) {
    let objKey = Object.keys(listOfLocations)[i];
    let div_ele = createEle("div", "locationTile", " ");
    let h1_ele = createEle(
      "h1",
      "locationHeading",
      listOfLocations[objKey].name
    );
    let p_ele = createEle(
      "p",
      "cityStatus",
      `Availability: ${listOfLocations[objKey].availability}%`
    );
    console.log("appended");
    div_ele.appendChild(h1_ele);
function generateList() {
  const locationKeys = Object.keys(listOfLocations);
  for (let i = 0; i < locationKeys.length; i++) {
    let objKey = Object.keys(listOfLocations)[i];
    let div_ele = createEle("div", "locationTile", " ");
    let h1_ele = createEle("h1", "locationHeading", listOfLocations[objKey].name);
    let p_ele = createEle(
      "p",
      "cityStatus",
      `Availability: ${listOfLocations[objKey].availability}%`
    );
    locationListTarget.appendChild(div_ele);
    div_ele.appendChild(h1_ele);
    div_ele.appendChild(p_ele);
  }
}
window.addEventListener("DOMContentLoaded", ()=>{
  document.querySelector('.loading').style.display = "none";
  generateList();
});

    div_ele.appendChild(p_ele);
    locationListTarget.appendChild(div_ele);
  }
}
//Confirm DOM Content has loaded
if (document.readyState == "complete") {
  document.querySelector(".loading").style.display = "none";
  console.log("DOM content LOaded");
  generateList();
} else {
  document.querySelector("DOMContentLoaded", () => {
    generateList();
  });
}

*/
