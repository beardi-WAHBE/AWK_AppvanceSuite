/**
 * @aiq.webdesigner
 * This script requires AIQ Web Designer
*/

include("{ds}/../../ReusableFunctions/AccessorFunctions.js");
include("{ds}/../../ReusableFunctions/PageDataFunctions.js");
include("{ds}/../../TestElements/ContentElements/Link_ContentElement.js");

function GetPageLinks(p_parentXPath, p_ignoreHidden = true) {
    const elements = FindElementsByXPath(p_parentXPath + "//a", p_ignoreHidden);
    let pageLinks = [];
    
    elements.forEach((elem) => {
        pageLinks.push(new Link_ContentElement(elem, p_parentXPath));
    });

    return pageLinks;
}

function ScanPageLinks(p_originPage) {
    navigateTo(p_originPage);
    assertEqual(_get("/").status, 200);
    let parentXPath = GetMainContentXPath(p_originPage);
    let pageLinks = GetPageLinks(parentXPath);

    pageLinks.forEach((link) => {
        link.RunTests();
        navigateTo(p_originPage);
    });
}

function UnitTest_ClickOnAllLinks(in_page, in_parentXPath, in_ignoreHidden = true) {
    navigateTo(in_page);

    const elements = FindElementsByXPath(in_parentXPath + "//a", in_ignoreHidden);
    let elementAccessors = [];
    elements.forEach((elem) => {
        elementAccessors.push(GenerateUniqueXPath(elem, in_parentXPath));
    });

    elementAccessors.forEach((in_xpath) => {
        click(byXPath(in_xpath));
        navigateTo(in_page);
    });
}

ScanPageLinks("https://qa.wahpf.org/us/en/home-page.html")