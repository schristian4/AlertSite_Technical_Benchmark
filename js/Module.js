class Module{
    constructor(siteObject){
        this.siteObject = siteObject
    }
    
    outputTest(){
        let siteObject = this.nestGroupsBy(actual_JSON, ['obj_location','device_descrip',])
        console.log(siteObject);
    }
    createEle(type, content, styleClass) {
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
    appendAllElements(elementArray, targetElement) {
        for (let i = 0; i < elementArray.length; i++) {
            targetElement.appendChild(elementArray[i]);
        }
        return targetElement;
    }
    appendElementToTarget(element, parentNodeTarget) {
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
}