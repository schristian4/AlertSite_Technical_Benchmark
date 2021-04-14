/* 
All AlertSite Location IP's: https://www.alertsite.com/cgi-bin/helpme.cgi?page=monitoring_locations.html
*/
function loadJSON() {
  return new Promise(function (resolve, reject) {
    var xobj = new XMLHttpRequest();

    xobj.onreadystatechange = function () {
      if (xobj.readyState == 4 && xobj.status == 200) {
        resolve(xobj.response);
      }
    };

    xobj.open("GET", "./src/CityStatus.json", true);
    xobj.send();
  });
}

async function askForJson() {
  var data = await loadJSON();
  var cityObject = JSON.parse(data);
  return cityObject;
}

function init() {
  var actual_JSON;
  askForJson().then((value) => {
    actual_JSON = value;

    console.log("Start Init function");
    //console.log(actual_JSON);
    //console.log(testing());
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
    let siteObjectArray = nestGroupsBy(actual_JSON, [
      "device_descrip",
      "location_descrip"
    ]);

    console.log(siteObjectArray);
    //Create parameters based on MajorSite ("IE.. Texas") Selection and the Parameter (" IE.. response Times") of choice
    function createParameterArray(majorSite, param) {
      let filters = siteObjectArray[majorSite];
      let tempArray = [];
      for (let i in filters) {
        for (let key in filters[i]) {
          tempArray.push(filters[i][key][param]);
        }
      }
      return tempArray;
    }
    //createParameterArray("BBCi", "status");
    let status = createParameterArray("Target", "status");
    console.log(status);

    let calcMetric = {
      test: function () {
        console.log("test");
      },
      //Return array = [percentage, number of errors]
      availability: function (paramArray) {
        let errorCounter = 0;
        let tempArray = [];
        for (let x in paramArray) {
          if (x != 0) {
            errorCounter++;
          }
        }
        tempArray.push(Math.round((errorCounter / paramArray.length) * 100));
        tempArray.push(errorCounter);
        return tempArray;
      },
      // Return number of total runs not in error
      numberOfRuns: function (paramArray) {}
    };
    let x = calcMetric.availability(createParameterArray("Target", "status"));
    console.log(x);
  });

  //.then((data) => actual_JSON = JSON.parse(data);;
}
init();

const select = document.querySelector("#cityDropDown");
select.addEventListener("input", (event) => {
  console.log(event.target.selectedIndex);
  // Use selected index to output detail report based on Value
  const optionValue = select.children[event.target.selectedIndex].value;
  console.log(`Option value: ${optionValue}`);
  //pullContent(optionValue)
  console.log(
    "🚀 ~ Select index Value",
    select.children[event.target.selectedIndex].value
  );
});
function createEle(type, content, styleClass) {
  let newObject = document.createElement(type);
  if (content != null || (content != undefined && typeof content === string)) {
    newObject.classList.add(`${styleClass}`);
  }
  if (styleClass != null || styleClass != undefined) {
    newObject.innerText = content;
  }
  return newObject;
}
//CreateEmpty Table
function createTable() {
  let tbody = createEle("tbody", null, "cityTable");
  let tb = createEle("tb");
  tbody.appendChild(tb);
  return tbody;
}
//Add items to createdTable
function appendItemsToTable() {}
//appendItemsToTable();
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
