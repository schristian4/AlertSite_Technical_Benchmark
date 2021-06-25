class Table{
    constructor(dropDownSelection){
        this.dropDownSelection = dropDownSelection;
    }

    initialize(){
        //setDrop Down State to selectedDropDownValue

        console.log("Initialize")
        //console.log(dropDownSelection)
        this.createDropDownList(this.dropDownSelection);
        let select = document.querySelector('#cityDropDown');
        this.createTable(module.siteObject,select.options[this.dropDownSelection].value)
    
        //this.dropDownSelection = selectedDropDownValue
        
        
    }
    outputTest(){
        console.log(this.dropDownSelection);
    }
    
    //Create parameters based on MajorSite ("IE.. Texas") Selection and the Parameter (" IE.. response Times") of choice
    createParameterArray(location, param, majoreSiteName) {
        let filters = module.siteObject[location];
        let tempArray = [];
        if(majoreSiteName === undefined || majoreSiteName === null){
            for (let i in filters) {
                for (let key in filters[i]) {
                    tempArray.push(filters[i][key][param]);
                }
            }
        }
        else{
            for (let i in filters) {
                if(i === majoreSiteName){
                    for (let key in filters[i]) {
                        tempArray.push(filters[majoreSiteName][key][param]);
                    }
                }
            }
        }
        return tempArray;
    }
    
    createTable(objectContent, location) {
         //Name of all major Sites
        let tbody = module.createEle('tbody', null, ['location_tbody']);
        let siteNameArray = Object.keys(objectContent[location]);
        for (let i = 0; i < siteNameArray.length; i++) {
            let majorSiteObjectTarget = objectContent[location][siteNameArray[i]];
            //(`Major Site Target: ${siteNameArray[i]}`, majorSiteObjectTarget)
            
            let avail = calcmetric.availability(this.createParameterArray(location, 'status', siteNameArray[i]))
            let tdAvailability = module.createEle('td', `${avail}%`, ['availablityCharm']);
            let tdSiteName = module.createEle('td', siteNameArray[i]);
            let dt_statusOutput = this.createParameterArray(location, 'dt_status', siteNameArray[i])
            let resptimeOutput = this.createParameterArray(location, 'resptime', siteNameArray[i])
            let tdResp = this.createResponseTimeGrid(dt_statusOutput,resptimeOutput);
            let tdStatus;
            if (majorSiteObjectTarget !== undefined && majorSiteObjectTarget !== null) {
                let trElement = module.createEle('tr');
               // console.log(`Avail: ${avail}`)
                let tdWrapper = module.createEle('td', null, ["iconWrapper"]);
                if (avail >= 95) {
                    tdStatus = module.createEle('i',null, ["iconStatus", "icon-check"]);
                } else if (avail >= 75 && avail <= 95) {
                    tdStatus = module.createEle('i',null, ["iconStatus", "icon-warning"]);
                } else if (avail < 75 && avail >= 0) {
                    tdStatus = module.createEle('i',null, ["iconStatus", "icon-danger"]);
                }
                tdWrapper.appendChild(tdStatus);
                //Append Array of createElements to trElement (Major site Row)
                module.appendAllElements([tdWrapper ,tdSiteName, tdAvailability, tdResp],trElement);
                tbody.appendChild(trElement);

                let techTable = document.querySelector('#techTable');
                //let techContainer = document.querySelector("body > div > div");
                module.appendElementToTarget(tbody, techTable);
            }
        }
    }

    createDropDownList() {
        let LocationKeyList = Object.keys(module.siteObject);
        // Select First Key
        let siteKeyList = Object.keys(module.siteObject[LocationKeyList[0]]);
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
            let locationName = module.siteObject[LocationKeyList[i]][siteKeyList[0]][0].location_descrip;
            
            let tempOption = module.createEle('option', locationName );
            tempOption.value = LocationKeyList[i];
            document.getElementById('cityDropDown').appendChild(tempOption);
        }
        // On initialization of create dropdown value of dropdown selection is undefined
        if(this.dropDownSelection === undefined){
            this.dropDownSelection = 0;
        }
        // set the drop down menu index to the constructor value 
        selectionElement.selectedIndex = this.dropDownSelection;
        
    }
    gridEntry(percentage, inputDate, inputTime){
        let minibar__bar = module.createEle('div', null, ['minibar__bar']);
        let minibar__tooltip = module.createEle('span', `<div>Date: ${inputDate}</div><div>Response Time: ${Number(inputTime).toFixed(3)}s</div>`, ['minibar__tooltip']);  
        let minibar__fill = module.createEle('div', null , ['minibar__fill']);
        minibar__fill.setAttribute('style', `height:${percentage}%` )

        if(Number(inputTime) == 0){
            minibar__bar.classList.add("red")
            minibar__fill.classList.add("red")
        }
        module.appendAllElements([minibar__tooltip,minibar__fill], minibar__bar);
        return minibar__bar
    }
    createResponseTimeGrid(timestampArray, responseTimeArray) {
        let tempArray = [];
        tempArray.push(timestampArray, responseTimeArray);
        let minibar_mini = module.createEle('td', null, ['minibar','minibar--mini']);
        let inputSelection,  heightPercentage;
    
        for (let i = 0; i < tempArray[0].length; i++) {
            if (tempArray[1].length > 1){

                inputSelection = tempArray[1][i]
                let minValue = Math.min(...tempArray[1])
                let maxValue = Math.max(...tempArray[1])

                heightPercentage = ((inputSelection - minValue) * 100) / (maxValue - minValue)
                if(isNaN(heightPercentage)){
                    heightPercentage = 100
                }
            }
            else{  
                inputSelection = tempArray[1][i]
                heightPercentage = 100
            }
            minibar_mini.appendChild(this.gridEntry(heightPercentage, tempArray[0][i], tempArray[1][i]))
        }
        return minibar_mini;
    }
    createGridHoverElements(){
        let itemList = document.querySelectorAll('.item');
        //let respTime = document.querySelector('.resptime_grid');

        for (let i = 0; i < itemList.length; i++) {
            itemList[i].addEventListener('mouseenter', (event) => {
                //Create Message Box
                let divEle = module.createEle('div', null, ['item_message']);
                let dateContent = event.target.getAttribute('date')
                let responseTime = event.target.getAttribute('response_time')
                console.log(" Response TIme:  "+responseTime)
                let triangleShape = module.createEle('div', null, ['triangleShape']);

                let innerDivElement = module.createEle('div',`${dateContent}`,['innerMessage']);
                let innerDivElement2 = module.createEle('div',`Response Time: ${Number(responseTime)}`,['innerMessage']);
                module.appendAllElements([innerDivElement,innerDivElement2, triangleShape], divEle);
                getComputedStyle(divEle).width;
                if (
                    event.target.parentNode.firstChild.classList.value !=
                    'item_message'
                ) {
                    event.target.parentNode.prepend(divEle);
                    divEle.style.left = `-${getComputedStyle(divEle).width}`;
                }
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
    }
}