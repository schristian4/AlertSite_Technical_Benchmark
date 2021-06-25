const module = new Module();
const table = new Table();
const calcmetric = new CalcMetric();
const incidentbanner = new IncidentBanner();


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

window.addEventListener('DOMContentLoaded', () => {
    const cityJSON = fetch('/js/CityStatus.json')
    .then((response) => response.json())
    .then((items) => {
        return items;
    });
    const printItems = async () => {
        let a = await cityJSON;
        cityObject = a;
        let siteObject = nestGroupsBy(cityObject, ['obj_location','device_descrip',]);
        
        module.siteObject = siteObject;
        
        table.initialize();
        table.outputTest()
        incidentbanner.initialize();
        const select = document.querySelector('#cityDropDown');
    
        select.addEventListener('input', (event) => {
            table.dropDownSelection = event.target.selectedIndex;
            incidentbanner.dropDownSelection = event.target.selectedIndex;
            console.log("🚀 ~ Select index Value: " + event.target.selectedIndex)

            table.initialize(event.target.selectedIndex);
            table.createGridHoverElements();
            incidentbanner.initialize(event.target.selectedIndex);
        });
        table.createGridHoverElements();
        
        
    };
    printItems();
});

