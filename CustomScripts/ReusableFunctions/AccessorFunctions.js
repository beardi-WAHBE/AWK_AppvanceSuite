/**
 * @aiq.webdesigner
 * This script requires AIQ Web Designer
*/  

// --=|| Helpers ||=--

function FilterAppLinks(in_href) {
    if(in_href.contains("/HBEWeb/")) return in_href.split("&id=")[0];
    else return in_href;
}

function ElementIsNotHidden(in_element) {
    return getComputedStyle(in_element, "visibility") != "hidden";
}

function GenerateXPathProp(in_att, in_val) {
    if (in_val === undefined) return "";
    return (in_val.contains(`"`)) ? `contains(${in_att}, '${in_val}') ` : `contains(${in_att}, "${in_val}") `;
}

function XPathIsUnique(in_XPath) {
    return (FindElementsByXPath(in_XPath).length == 1);
}

// --=|| Reusable Functions ||=--

function FindElementsByXPath(in_xpath, in_ignoreHidden = false) {
    let elements = _eval(`
        const parentNode = ds$(document)[0]; 
        const result = parentNode.evaluate(\`${in_xpath}\`, parentNode, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
        let nodes = [];
        let node;
        while ((node = result.iterateNext()) !== null) {
            nodes.push(node);
        }
        nodes;
    `);

    if (in_ignoreHidden) {
        elements = elements.filter(ElementIsNotHidden);
    }

    return elements;
}

function GenerateUniqueXPath(in_webElement, in_parentXPath) {
    log(`Run GenerateUniqueXPath(${in_webElement}, ${in_parentXPath})`)
    let xpath = in_parentXPath;
    
    const arr_XPathProps = [
        GenerateXPathProp("@name", getAttribute(in_webElement, "name")),
        GenerateXPathProp("@href", FilterAppLinks(getAttribute(in_webElement, "href"))),
        GenerateXPathProp("@class", getAttribute(in_webElement, "name")),
        GenerateXPathProp(".", getTextSelenium(in_webElement)),
    ]

    xpath += `//${getProp(in_webElement, "tagName")}[`;
    for(let i = 0; i < arr_XPathProps.length; i++) {
        if (arr_XPathProps[i] == "") continue;
        
        xpath += arr_XPathProps[i];

        if (i != arr_XPathProps.length - 1) xpath += " and "
    }
    xpath += "]";
    
    return xpath;
}

// Unit Tests
function UnitTest_FindElementsByXPath(in_page, in_xpath, in_parentXPath = "", in_ignoreHidden = false) {
    navigateTo(in_page);
    const elements = FindElementsByXPath(in_parentXPath + in_xpath, in_ignoreHidden);

    let logStr = `
        -=|| FindElementsByXPath('${in_parentXPath + in_xpath}, ${in_ignoreHidden}) ||=- \n
        Elements(${elements.length}): \n
    `;

    for(let i = 0; i < elements.length; i++) {
        let elem = elements[i];
        let elementXPath = GenerateUniqueXPath(elem, in_parentXPath);
        let isUnique = (XPathIsUnique(elementXPath)) ? "Unique" : "Not Unique";
        let isHidden = (getComputedStyle(elem, "visibility") == "hidden") ? " HIDDEN ": " ";

        logStr += ` -${isHidden}${getTextSelenium(elem)}: ${elementXPath} (${isUnique}) \n`;
    }

    log(logStr);
}

function UnitTest_XpathIsUnique(in_page, in_XPath, in_expectedResult) {
    navigateTo(in_page);
    let actualResult = XPathIsUnique(in_XPath);
    log(`
    \n${in_XPath}: 
    \n - Length: ${FindElementsByXPath(in_XPath).length}
    \n - Expected: ${in_expectedResult}
    \n - Actual:   ${actualResult}
    `);
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


//UnitTest_FindElementsByXPath("https://uat.wahpf.org/us/en/home-page.html", "//a", "//*[@id = 'navbar' or contains(@class, 'page__main-nav') or contains(@class, 'page__primary-nav')]", true);
//UnitTest_XpathIsUnique("https://uat.wahpf.org/us/en/home-page.html", `//A[contains(@href, "#") and contains(., "My Account") ]`, true)
//UnitTest_ClickOnAllLinks("https://qa.wahpf.org/us/en/home-page.html", "//div[@id = 'main-content']");



