//const chart = window["Chart.min.js"];

/* 
All AlertSite Location IP's: https://www.alertsite.com/cgi-bin/helpme.cgi?page=monitoring_locations.html
*/

//not liking the design change chart and table or remove chart and finish table

//load JSON Data when ready
function loadJSON() {
  return new Promise(function (resolve, reject) {
    var xobj = new XMLHttpRequest();

    xobj.onreadystatechange = function () {
      if (xobj.readyState === 4 && xobj.status === 200) {
        resolve(xobj.response);
      }
    };

    xobj.open("GET", "./src/CityStatus.json", true);
    xobj.send();
  });
}
//Load then parse content
async function askForJson() {
  var data = await loadJSON();
  var cityObject = JSON.parse(data);
  return cityObject;
}

//Create Element
function createEle(type, content, styleClass) {
  let newObject = document.createElement(type);
  if (
    content != null &&
    content !== undefined &&
    (typeof content === "string" || typeof content === "number")
  ) {
    newObject.innerHTML = content;
  }
  if (styleClass != null && styleClass !== undefined) {
    newObject.classList.add(`${styleClass}`);
  }
  
  return newObject;
}
// attr_value array type
function addAttributeValues(attr_value){
  
}
/*------------------------
Main Initializer function
-------------------------*/
function init(drop_selection_index) {
  //console.log(`init funct - Your Selection: ${drop_selection}`);
  var actual_JSON;
  askForJson().then((value) => {
    actual_JSON = value;

    /* Creates nested groups by object properties.
      Credit Goes to https://gist.github.com/holmberd/945375f099cbb4139e37fef8055bc430
       * `properties` array nest from highest(index = 0) to lowest level.
       * @param {String[]} properties
       * @returns {Object}
       */
    function nestGroupsBy(arr, properties) {
      properties = Array.from(properties);
      if (properties.length === 1) {
        return groupBy(arr, properties[0]);
      }
      const property = properties.shift();
      var grouped = groupBy(arr, property);
      for (let key in grouped) {
        grouped[key] = nestGroupsBy(grouped[key], Array.from(properties));
      }
      return grouped;
    }
    /**
     * Group objects by property.
     * `nestGroupsBy` helper method.
     * @param {String} property
     * @param {Object[]} conversions
     * @returns {Object}
     */
    function groupBy(conversions, property) {
      //console.log(conversions + property);
      return conversions.reduce((acc, obj) => {
        let key = obj[property];
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(obj);
        return acc;
      }, {});
    }

    //sitename > location > each run from location
    let siteObject = nestGroupsBy(actual_JSON, [
      "device_descrip",
      "obj_location"
    ]);
    let responseTIme = nestGroupsBy(actual_JSON, [
      "device_descrip",
      "dt_status", 
    ]);
  
    //Create parameters based on MajorSite ("IE.. Texas") Selection and the Parameter (" IE.. response Times") of choice
    function createParameterArray(majorSite, param) {
      let filters = siteObject[majorSite];
      let tempArray = [];
      for (let i in filters) {
        for (let key in filters[i]) {
          tempArray.push(filters[i][key][param]);
        }
      }
      return tempArray;
    }
    let calcMetric = {
      availability: function (paramArray) {
        let errorCounter = 0;
        for (let i = 0; i < paramArray.length; i++) {
          if (paramArray[i] !== 0) {
            errorCounter++;
          }
        }
        return Math.round((errorCounter / paramArray.length) * 100);
      }
    };

    //Function append Element to target element - Used to update table
    function appendElementToTarget(element, parentNodeTarget) {
      if (parentNodeTarget.childElementCount > 1) {
        parentNodeTarget.lastElementChild.remove();
        if (element !== null && element !== undefined) {
          parentNodeTarget.appendChild(element);
        }
      } else {
        if (element !== null && element !== undefined) {
          parentNodeTarget.appendChild(element);
        }
      }
    }
    function createResponseTimeGrid(timestampArray, respTimeArray){
        let tempArray = [];
        tempArray.push(timestampArray)
        tempArray.push(respTimeArray)
        //64 - 10 = 54
        console.log(tempArray[0].length);
        let tdCardGrid = createEle('div',null, 'resptime_grid');
        let td = createEle('td'); 
        //Grab length of first of available timestamps and only use the last 10 entries
        for(let counter = tempArray[0].length - 10; counter < tempArray[0].length; counter++){
          let divCard = createEle('div', null,'item', i)
          //console.log(divCard.attributes.value.value)
          tdCardGrid.appendChild(divCard);
        }
        td.appendChild(tdCardGrid);
        /*
        double array object {0:[1,2,3,...], 1:[1,2,3,...]}
        */ 
        return td;
    };

    // Creat tbody element to append as last element to table
    function createTable(objectContent, location) {
      console.log("start creat table");
      
      let siteNameArray = Object.keys(objectContent);
      
      let tbody = createEle("tbody", null, "location_tbody");
      for (let i = 0; i < siteNameArray.length; i++) {
        let tempObject = objectContent[siteNameArray[i]][location];
 //responseTime can be undefined if not Available condition: "undefined" or "number" or "null"
 //console.log(createParameterArray(siteNameArray[i], ""));
        //console.log(tempObject[4]);
        let avail = calcMetric.availability(
          createParameterArray(siteNameArray[i], "status")
        );
        let tdAvailability = createEle("td", avail);
        let tdSiteName = createEle("td", siteNameArray[i]);
        let tdResp = createResponseTimeGrid(
          createParameterArray(siteNameArray[i], "dt_status"),createParameterArray(siteNameArray[i], "resptime")
        );
        
        let tdHTTP;
        if (tempObject !== undefined && tempObject !== null) {
          tdHTTP = createEle(
            "td",
            tempObject[tempObject.length - 1]["http_status"]
          );

          let trElement;
          if (avail === 100) {
            trElement = createEle("tr", null, "table-success");
          } else if (avail < 100 || avail > 75) {
            trElement = createEle("tr", null, "table-warning");
          } else if (avail < 75 || avail > 0) {
            trElement = createEle("tr", null, "table-danger");
          }

          trElement.appendChild(tdSiteName);
          trElement.appendChild(tdHTTP);
          trElement.appendChild(tdAvailability);
          trElement.appendChild(tdResp);
          tbody.appendChild(trElement);
          let techTable = document.querySelector("#techTable");
          //let techContainer = document.querySelector("body > div > div");

          appendElementToTarget(tbody, techTable);
        }
      }
    }

    function createDropDownList(selectedIndex) {
      let siteKeyList = Object.keys(siteObject);
      let LocationKeyList = Object.keys(siteObject[siteKeyList[0]]);
      let selectionElement = document.getElementById("cityDropDown");
      //Remove all elements
      function removeAllChildNodes(parent) {
        while (parent.firstChild) {
          parent.removeChild(parent.firstChild);
        }
      }
      // Condition for new, existing, and updated location list
      if (
        selectionElement.childElementCount !== LocationKeyList.length ||
        selectionElement.childElementCount === LocationKeyList.length
      ) {
        removeAllChildNodes(selectionElement);
      }
      //Loop through location list and append created option element
      for (let i = 0; i < LocationKeyList.length; i++) {
        let locationName =
          siteObject[siteKeyList[0]][LocationKeyList[i]][0].location_descrip;
        let tempOption = createEle("option", locationName);
        tempOption.value = LocationKeyList[i];

        document.getElementById("cityDropDown").appendChild(tempOption);
      }
      selectionElement.selectedIndex = drop_selection_index;
    }

    createDropDownList(drop_selection_index);
    //Element is defined for drop
    //console.log(siteObject);
    let dropDownSelect = document.querySelector("#cityDropDown");
    createTable(
      siteObject,
      dropDownSelect.options[dropDownSelect.selectedIndex].value
    );

    /*
      Match based on Object Location Number: 
          .obj_location
      Website Description Name:
          .device_descrip
      Website Status OK or Error 
          .status ie: 0 
          .http_status
      Website Timestamp: 
          .dt_status
      !Average response times for the hour: 
          push into empty array and replace entire array when building a new page or based on a time clock
          .resptime

    */

    //Loop each major Site and post response time for location on
    let itemList = document.querySelectorAll('.item');
    let respTime = document.querySelector('.resptime_grid');
      
    for(let i = 0; i < itemList.length;i++){
      itemList[i].addEventListener("mouseenter", (event) => {
        let divEle = createEle('div', 'testing value', 'item_message');
        if(event.target.parentNode.firstChild.classList.value != "item_message"){
          divEle.style.left = `-${getComputedStyle(respTime).width}`; 
          event.target.parentNode.prepend(divEle)
        }
        //console.log(event.target.getAttribute('value'))
        //console.log(event.target.parentNode.prepend(div))
        /*
        if (event.target.lastElementChild === null) {
          createEle(type, content, styleClass,value)
          let tempElement = createEle("div", "temp" ,"foo", null);
          tempElement.style.width = getComputedStyle(availablityBoxStyle).width;
          event.target.append(tempElement);
        }*/
        //console.log(/*event.target.parentNode.lastElementChild*/);
        //console.log("enter");
        
      });
  
      itemList[i].addEventListener("mouseout", (event) => {
        if (event.target.parentNode.firstChild.classList.value === "item_message") {
          event.currentTarget.parentNode.firstElementChild.remove();
        }
      });
    }

  });
}

window.addEventListener('DOMContentLoaded', ()=>{
  init(document.querySelector("#cityDropDown").value);
  
  const select = document.querySelector("#cityDropDown");
  select.addEventListener("input", (event) => {
    //console.log("🚀 ~ Select index Value",select.children[event.target.selectedIndex]  );
    init(event.target.selectedIndex);
    // Use selected index to output detail report based on Value
    //const optionValue = select.children[event.target.selectedIndex].value;
    //console.log(`Option Location: ${optionValue}`);
    //pullContent(optionValue)
  });
})
