/**
 * @aiq.webdesigner
 * This script requires AIQ Web Designer
*/

include("{ds}/../_TestElement.js");

class _ContentElement extends _TestElement {
    parentXPath;
    myXPath;
    href;

    constructor(in_webElement, in_parentXPath) {
        log("Construct Content Element");
        super(in_webElement, in_parentXPath);
    }
    
    CheckStyles(p_data) {
        log(p_data);
    }
}
