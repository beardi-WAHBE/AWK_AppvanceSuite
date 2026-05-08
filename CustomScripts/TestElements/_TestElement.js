/**
 * @aiq.webdesigner
 * This script requires AIQ Web Designer
*/

class _TestElement {
    parentXPath;
    myXPath;
    href;

    constructor(in_webElement, in_parentXPath) {
        this.parentXPath = in_parentXPath;
        this.myXPath = GenerateUniqueXPath(in_webElement, in_parentXPath);
        this.href = getAttribute(in_webElement, "href");
    }

    RefreshWebElement() {
        this.webElement = _byXPath(this.myXPath);
    }

    RunTest() {
        return true;
    }
}