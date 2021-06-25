class IncidentBanner {
    constructor(dropDownSelection) {
        this.dropDownSelection = dropDownSelection;
    }
    initialize() {
        //console.log('Banner - Drop Down Select: ' + this.dropDownSelection);
        this.updateAlertBanner();
    
    }
    
    createAlertItem(locationName, count)  {
        let parentDiv = module.createEle('div', null, ["alertItem"])
        let heading = module.createEle('h1', locationName, null)
        let counterDiv = module.createEle('div', null, ["count-text"])
        let pHeading = module.createEle('p', "Error Count:", null)
        let pCount = module.createEle('p', count, null)

        module.appendAllElements([pHeading,pCount], counterDiv)
        module.appendAllElements([heading,counterDiv], parentDiv)
        return parentDiv
        
    }
    //Count the number of Errors return value of count
    counter(targetArray){
        let counter = 0
        for (let i = 0; i < targetArray.length; i++) {
            if(targetArray[i] != "0"){
                counter++
            }
        }
    
        return counter
    }
    updateAlertBanner() {
        function removeAllChildNodes(parent) {
            while (parent.firstChild) {
                parent.removeChild(parent.firstChild);
            }
        }
        let LocationKeyArray = Object.keys(module.siteObject);
        let siteKeyList = Object.keys(module.siteObject[LocationKeyArray[0]]);
        let incidentBannerContainer = document.getElementById('IncidentBanner');

        removeAllChildNodes(incidentBannerContainer);

        for(let i = 0; i < LocationKeyArray.length; i++){
            let locationName = module.siteObject[LocationKeyArray[i]][siteKeyList[0]][0].location_descrip;
            let siteKeyArray = Object.keys(module.siteObject[LocationKeyArray[i]]);
            let location = LocationKeyArray[i];
            let locationErrorCount = 0;
            for (let i = 0; i < siteKeyArray.length; i++) {
                let targetMajorSite = siteKeyArray[i];
                locationErrorCount = locationErrorCount + this.counter(table.createParameterArray(location, "status", targetMajorSite))
            }
            console.log(`${location} Error Count: `+ locationErrorCount)
            if(locationErrorCount > 0){
                console.log("Begin appendContent")
                incidentBannerContainer.appendChild(this.createAlertItem(locationName, locationErrorCount) )
            }
        }
    }
}
