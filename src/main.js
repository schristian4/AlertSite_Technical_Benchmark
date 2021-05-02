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
    //console.log(siteObject);
    // Create DropDown list after retrieving siteobject on line 90.

    // FirstObject Keyname > [locationID Value] > [0] > .location_descrip

    //console.log(siteObject[selectedLocationKeyNameArray[]]);

    /*
      for (let i = 0; i < selectedLocationKeyNameArray.length; i++) {
        let tempOption = createEle("option");
        tempOption.value = selectedLocationKeyNameArray[i];
      }*/

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
    // Creat tbody element to append as last element to table
    function createTable(objectContent, location) {
      //console.log("start creat table");
      let siteNameArray = Object.keys(objectContent);
      let tbody = createEle("tbody", null, "location_tbody");
      for (let i = 0; i < siteNameArray.length; i++) {
        let tempObject = objectContent[siteNameArray[i]][location];
        //console.log(objectContent[siteNameArray[i]][location]);
        let avail = calcMetric.availability(
          createParameterArray(siteNameArray[i], "status")
        );
        let tdAvailability = createEle("td", avail);
        let tdSiteName = createEle("td", siteNameArray[i]);
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
    let siteNameArray = Object.keys(siteObject);
    console.log(siteObject);
    //Loop each major Site and post response time for location on

    console.log(createParameterArray("eBay", "dt_status"));
    let myChart = document.getElementById("myChart").getContext("2d");

    // Global Options

    const data = {
      datasets: [
        {
          label: "BBCi",
          data: createParameterArray("BBCi", "resptime")
          // borderColor: Utils.CHART_COLORS.red,
          //  backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5)
        },
        {
          label: "eBay",
          data: createParameterArray("eBay", "resptime")
          //  borderColor: Utils.CHART_COLORS.blue,
          //backgroundColor: Utils.transparentize(Utils.CHART_COLORS.blue, 0.5)
        }
      ]
    };
    //console.log(myChart);
    //add name then create
    let massPopChart = new Chart(myChart, {
      type: "line", // bar, horizontalBar, pie, line, doughnut, radar, polarArea
      data: {
        //we need the range between lowest to highest  timestamps entries
        /*
        Ebay

        (4) ["0.543383002281189", "0.4788469970226288", "0.6049579977989197", "0.6169800162315369"]

        */

        labels: createParameterArray("eBay", "dt_status"),
        datasets: data.datasets
      },

      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top"
          },
          title: {
            display: true,
            text: "Chart.js Line Chart"
          }
        }
      }
    });
  });
}
//Initialize Drop Down menu

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
