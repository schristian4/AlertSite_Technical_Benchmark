/* 
All AlertSite Location IP's: https://www.alertsite.com/cgi-bin/helpme.cgi?page=monitoring_locations.html
*/
//load JSON Data when ready

function loadJSON() {
    return new Promise(function (resolve, reject) {
        var xobj = new XMLHttpRequest();
        xobj.onreadystatechange = function () {
            if (xobj.readyState === 4 && xobj.status === 200) {
                resolve(xobj.response);
            }
        };
        xobj.open('GET', './CityStatus.json', true);
        xobj.send();
    });
}

//Load then parse content
async function askForJson() {
    var data = await loadJSON();
    var cityObject = JSON.parse(data);
    return cityObject;
}
/* ========> Function Create Element <========= */
function createEle(type, content, styleClass) {
    let newObject = document.createElement(type);
    if (
        content != null &&
        content !== undefined &&
        (typeof content === 'string' || typeof content === 'number')
    ) {
        newObject.innerHTML = content;
    }
    if (styleClass != null && styleClass !== undefined) {
      for(let i = 0; i < styleClass.length; i++){
        newObject.classList.add(`${styleClass[i]}`);     
      }
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
                grouped[key] = nestGroupsBy(
                    grouped[key],
                    Array.from(properties)
                );
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

        /*
        Dynamic Grouping Function 
        *Conversion: target parent object property
        *Property: any final nesting property
        */
        function groupBy(conversions, property) {
            return conversions.reduce((acc, obj) => {
                let key = obj[property];
                if (!acc[key]) {
                    acc[key] = [];
                }
                acc[key].push(obj);
                return acc;
            }, {});
        }

        //  location > Sitename > each run from location


        let siteObject = nestGroupsBy(actual_JSON, ['obj_location','device_descrip',]);
        //console.log(siteObject[Object.keys(siteObject)[1]])

        // Created for additional filtering
        //let siteObject2 = nestGroupsBy(actual_JSON, ['device_descrip','obj_location']);
        /*
        let responseTIme = nestGroupsBy(actual_JSON, [
            'device_descrip',
            'dt_status',
        ]);
        */
        //Create parameters based on MajorSite ("IE.. Texas") Selection and the Parameter (" IE.. response Times") of choice
        function createParameterArray(location, param) {
            //console.log(siteObject[majorSite])

            let filters = siteObject[location];
            let majorSiteArray = Object.keys(filters);
            //console.log(majorSiteArray);
            let tempArray = [];
            for (let i in filters) {
                for (let key in filters[i]) {
                    tempArray.push(filters[i][key][param]);
                }
            }
            //console.log(tempArray)
            return tempArray;
        }
        
        /*
        Calculate the metrics
        *Availability*
        */
        let calcMetric = {
            availability: function (paramArray) {
                let errorCounter = 0;
                for (let i = 0; i < paramArray.length; i++) {
                    if (parseInt(paramArray[i]) !== 0) {
                        errorCounter++;
                    }
                }
                return 100 - Math.round((errorCounter / paramArray.length) * 100);
            },
        };

        function appendAllElements(elementArray, targetElement) {
            for (let i = 0; i < elementArray.length; i++) {
                targetElement.appendChild(elementArray[i]);
            }
            return targetElement;
        }

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
        
        //Create Response Time Grid
        function createResponseTimeGrid(timestampArray, responseTimeArray) {
            let tempArray = [];
            tempArray.push(timestampArray, responseTimeArray);

            let divCardGrid = createEle('div', null, ['response_time_grid']);
            let td = createEle('td');
            /*
                By using a counter we can limit the number of empty box div's. Without having to fill in information stating information unavailable. 
            */
            //Configure counter; If tempArray count is < 10 =  Counter = 0 : Counter-10
            let counter = tempArray[0].length - 10;
            if (counter < 0) {
                counter = 0;
            }
            //Count up to the length of one of the Arrays
            for (counter; counter < tempArray[0].length; counter++) {
                let divCard = createEle('div', null, ['item'], counter);
                if(counter === tempArray[0].length - 1){
                    divCard.classList.add('last')
                }
                divCardGrid.appendChild(divCard);
            }
            td.appendChild(divCardGrid);
            /*
        double array object {0:[1,2,3,...], 1:[1,2,3,...]}
        */
            return td;
        }
        // Creat tbody element to append as last element to table
        function createTable(objectContent, location) {
            /*
            
            Re-design
            So we choose the location from Object 20: {} , 55:{}
            create siteName List of available locations [55].Object.keys === sitename. then genarate tables
        
            */ 
            //Name of all major Sites
            
            let siteNameArray = Object.keys(objectContent[location]);
            
            //let locationNameArray = Object.keys(objectContent);
            //console.log(locationNameArray[0])
            //console.log(objectContent[location][siteNameArray[0]]);
            
            for (let i = 0; i < siteNameArray.length; i++) {
                majorSiteObjectTarget = objectContent[location][siteNameArray[i]];
                console.log(majorSiteObjectTarget)
                console.log(`Major Site Target: ${siteNameArray[i]}`, majorSiteObjectTarget)
                //console.log(objectContent[location][siteNameArray[i]])
                createParameterArray(location, 'status')
                console.log(createParameterArray(location, 'status'))
            }










            /*
            let tbody = createEle('tbody', null, ['location_tbody']);
            for (let i = 0; i < siteNameArray.length; i++) {
                let tempObject = objectContent[location][siteNameArray[i]];
                //console.log(tempObject)
                //console.log(tempObject[i]);
                //console.log(createParameterArray(siteNameArray[i], 'status'));
                //responseTime can be undefined if not Available condition: "undefined" or "number" or "null"
                let avail = calcMetric.availability(createParameterArray(siteNameArray[i], 'status', objectContent));
                //console.log(avail)

                //console.log(createParameterArray(siteNameArray[i], 'status'))
                let tdAvailability = createEle('td', avail, ['availablityCharm']);
                let tdSiteName = createEle('td', siteNameArray[i]);
                let tdResp = createResponseTimeGrid(
                    createParameterArray(siteNameArray[i], 'dt_status'),
                    createParameterArray(siteNameArray[i], 'resptime')
                );

                let tdStatus;
                if (tempObject !== undefined && tempObject !== null) {
                    let trElement = createEle('tr');
                    let tdWrapper = createEle('td', null, ["iconWrapper"]);
                    if (avail === 100) {
                        tdStatus = createEle('i',null, ["iconStatus", "icon-check"]);
                    } else if (avail < 100 || avail > 75) {
                        tdStatus = createEle('i',null, ["iconStatus", "icon-warning"]);
                    } else if (avail < 75 || avail > 0) {
                        tdStatus = createEle('i',null, ["iconStatus", "icon-danger"]);
                    }
                    tdWrapper.appendChild(tdStatus);
                    //Append Array of createElements to trElement (Major site Row)
                    appendAllElements(
                        [tdWrapper ,tdSiteName, tdAvailability, tdResp],
                        trElement
                    );
                    tbody.appendChild(trElement);

                    let techTable = document.querySelector('#techTable');
                    //let techContainer = document.querySelector("body > div > div");
                    appendElementToTarget(tbody, techTable);
                }
            }*/
        }
        function createDropDownList(selectedIndex) {
            let LocationKeyList = Object.keys(siteObject);
            let siteKeyList = Object.keys(siteObject[LocationKeyList[0]]);
            let selectionElement = document.getElementById('cityDropDown');
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
                let locationName = siteObject[LocationKeyList[i]][siteKeyList[0]][0].location_descrip;
                
                let tempOption = createEle('option', locationName );
                tempOption.value = LocationKeyList[i];
                document.getElementById('cityDropDown').appendChild(tempOption);
            }
            selectionElement.selectedIndex = drop_selection_index;
        }
        /* ========> Create DropDown Table <======== */
        createDropDownList(drop_selection_index);
        //Target Location DropDown List After Being Generated
        let dropDownSelect = document.querySelector('#cityDropDown');

        /* ========> Create Table <======== */
        createTable(
            siteObject,
            dropDownSelect.options[dropDownSelect.selectedIndex].value
        );
        const ctBanner = function createAlertBanner(){
            let alertBanner = document.querySelector('.alertBanner');
            
            alertBanner.appendChild(alertCards)
        }
        /*
      //Match based on Object Location Number: 
          .obj_location
      //Website Description Name:
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
        //let respTime = document.querySelector('.resptime_grid');
        /*
        */ 

        for (let i = 0; i < itemList.length; i++) {
            itemList[i].addEventListener('mouseenter', (event) => {
                //Create Message BOx
                let divEle = createEle('div', null, ['item_message']);
                /*
                  !We will be replacing this --Content with responseTime
                */
                let Contents = '1.5s';
                let triangleShape = createEle('div', null, ['triangleShape']);
                let innerDivElement = createEle(
                    'div',`Response Time: ${Contents}`,['innerMessage']);
                appendAllElements([innerDivElement, triangleShape], divEle);
                getComputedStyle(divEle).width;
                if (
                    event.target.parentNode.firstChild.classList.value !=
                    'item_message'
                ) {
                    event.target.parentNode.prepend(divEle);
                    divEle.style.left = `-${getComputedStyle(divEle).width}`;
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

            itemList[i].addEventListener('mouseout', (event) => {
                if (
                    event.target.parentNode.firstChild.classList.value ===
                    'item_message'
                ) {
                    event.currentTarget.parentNode.firstElementChild.remove();
                }
            });
        }
    });
}

window.addEventListener('DOMContentLoaded', () => {
    
  
    const select = document.querySelector('#cityDropDown');
    select.addEventListener('input', (event) => {
        //console.log("🚀 ~ Select index Value",select.children[event.target.selectedIndex]  );
        init(event.target.selectedIndex);
        // Use selected index to output detail report based on Value
        //const optionValue = select.children[event.target.selectedIndex].value;
        //console.log(`Option Location: ${optionValue}`);
        //pullContent(optionValue)
    });
});
