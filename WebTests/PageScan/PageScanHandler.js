/**
 * @aiq.webdesigner
 * This script requires AIQ Web Designer
*/

include("{ds}/../../CustomScripts/ReusableFunctions/ReportResults.js");
/** Aliases for ReportResults.js functions */
class Report {
    /** @ -- Generate a log string for a failed test -- @param {string} p_failCategory A few words broadly describing the kind of failure that occured @param {string} p_failDesc A detailed description of why the test failed @param {boolean} p_endTest Flag whether or not the failure prevents the test from continuing (false by default) @returns {string} Formatted string that will appear in the test log */
    GenerateFailureLog = (p_failCategory, p_failDesc, p_endTest = false) => Report_GenerateFailureLog(p_failCategory, p_failDesc, p_endTest);
}

include("{ds}/../../CustomScripts/ReusableFunctions/PageNavigation.js");
// region --=|| Included Page Navigation Functions ||=--
/** @ -- Uses JQuery to check if an element can be interacted with -- @param p_jqElementStr {string} JQuery string to find element @returns {boolean} True/False if the element can be interacted with */
var PageNav_CheckIsInteractable = (p_jqElementStr) => CheckIsInteractable(p_jqElementStr);
/** @ -- Uses JQuery to wait and see if an element loaded within a set amount of time -- @param {string} p_jqElementStr JQuery string to locate element @param p_waitTimeMS {number} Number of miliseconds to wait for the element (default is 5000ms) @returns {boolean} True/False if element was found within the timeframe */
var PageNav_WaitForElement = (p_jqElementStr, p_waitTimeMS = 5000) => PageNav_WaitForElement(p_jqElementStr, p_waitTimeMS);
/** @ -- Uses JQuery to navigate to the specified URL -- @param {string} p_url String formatted as URL @returns {boolean} True/False if the body of the page loaded */
var PageNav_NavigateToPage = (p_url) => NavigateToPage(p_url);
/** @ -- Gets the URL of the current page -- @returns String formatted as URL */
var PageNav_GetCurrentURL = () => GetCurrentURL();
/** @ -- Gets which site the URL goes to -- @param {string} p_url String formatted as valid URL (default value gets URL of the current page) @returns {SITE_ID} SITE_ID ( HPF, HBE, WA_PATH, EXTERNAL ) */
var PageNav_GetSite = (p_url = PageNav_GetCurrentURL()) => GetSite(p_url);
/** @ -- Gets which environment the URL goes to. -- @param {string} p_url String formatted as valid URL (default value gets URL of the current page) @returns {ENV_ID} ENV_ID ( DEV, UAT, QA, PROD, EXTERNAL ) */
var PageNav_GetEnv = (p_url = PageNav_GetCurrentURL()) => GetEnv(p_url);
/** @ -- Changes the input URL to the given Environment -- @param {string} p_url String formatted as valid URL @param {ENV_ID} p_env ENV_ID ( DEV, UAT, QA, PROD, EXTERNAL ) @returns {string} URL changed to match target environment (External links and links already in the right environemnt return unchanged) */
var PageNav_ChangeURLToTestENV = (p_url, p_env) => ChangeURLToTestENV(p_url, p_env);
// endregion

function Util_ContainsOneOfMany(p_string, p_checklist) {
    return p_checklist.some((listItem) => p_string.includes(listItem));
}

/** @ -- Use JQuery to check if a given element has a given ancestor -- @param {string} p_jqString A JQuery string to fing the element under test formatted as "ds$('[locator]')" @param {string} p_ancestorLocator A locator (#id, .class, tag, etc...) for the ancestor element @returns {boolean} True/False if the given element is a child of the given ancestor */
function Check_HasAncestor(p_jqString, p_ancestorLocator) {
    return _eval(`(${p_jqString}.parents("${p_ancestorLocator}").length > 0)`);
}

function Check_HasChild(p_jqString, p_ancestorLocator) {
    return _eval(`(${p_jqString}.find("${p_ancestorLocator}").length > 0)`);
}

/** @ -- Use JQuery to check if a given element has a given attribute -- @param {string} p_jqString A JQuery string to fing the element under test formatted as "ds$('[locator]')" @param {string} p_attName Name of the attribute being checked for @returns {boolean} True/False if the given element has the specified attribute */
function Check_HasAttribute(p_jqString, p_attName) {
    return _eval(`${p_jqString}.is("[${p_attName}]")`);
}

function Check_CSSValue(p_jqString, p_attName, p_value) {
    return _eval(`${p_jqString}.css("${p_attName}") == "${p_value}"`);
}

/** @ -- Use JQuery to check if a given element has a given attribute with a given value -- @param {string} p_jqString A JQuery string to fing the element under test formatted as "ds$('[locator]')" @param {string} p_attName Name of the attribute being checked for @param {string} p_attValue Value of the attribute being checked for @returns {boolean} True/False if the given element has the specified attribute and that attriblute has the given value */
function Check_HasAttributeValue(p_jqString, p_attName, p_attValue) {
    return _eval(`${p_jqString}.is("[${p_attName}*='${p_attValue}']")`);
}

function Check_HasText(p_jqString) {
    return _eval(`$.trim((${p_jqString}.text()).length > 0)`);
}

/** @ -- Use JQuery to check if a link has a New Tab Icon -- @param {string} p_jqString jQuery string it identify the link @returns {boolean} True/False if the link has a new tab icon  */
function Check_HasNewTabIcon(p_jqString) {
    var hasAfterElement = false;
    var hasSpan = Check_HasChild(p_jqString, "span.external--icon, span.cmp-button__icon");
    var hasImg = Check_HasChild(p_jqString, "img.cmp-image__image");

    _log(`Has Icon = ${hasAfterElement} || ${hasSpan} || ${hasImg}`);

    return Boolean(hasAfterElement || hasSpan || hasImg);
}

// --=|| GLOBAL TEST CONFIG ||=--
// #region

const LINK_TYPE = { INTERNAL: 0, APP: 1, EXTERNAL: 2, VIEW_FILE: 3, DOWNLOAD_FILE: 4, MAILTO: 5, PHONE: 6, EMB_VIDEO: 7, JS_NAV: 8 }

/** List of file extensions for links that download a file to the user's computer instead of opening a new page */
const downloadableFileTypes = [".docx", ".xlsx", ".pptx", ".ics" ]
/** List of file extensions for links that open a file in the browser */
const viewableFileTypes = [".jpeg", ".jpg", ".png", ".gif", ".svg", ".pdf", ".mp3" ]

var linkFlags = {
    InHeader: (p_link) => { return Check_HasAncestor(p_link, "header"); }, 
    InFooter: (p_link) => { return Check_HasAncestor(p_link, "footer, .page__footer, #ash-footer-wrapper"); }, 
    InNav: (p_link) => { return Check_HasAncestor(p_link, "nav"); }, 
    InList: (p_link) => { return Check_HasAncestor(p_link, "ol, ul"); }, 
    IsButton:  (p_link) => { return Check_HasAttributeValue(p_link, "class", "btn"); }, 
    IsUnderlinedCSS: (p_link) => {return Check_CSSValue(p_link, "text-decoration", "underline"); }, 
    IsUnderlinedTag: (p_link) => {return (Check_HasAncestor(p_link, "u") || Check_HasChild(p_link, "u")); }, 
    IsBoldedTag: (p_link) => {return (Check_HasAncestor(p_link, "b") || Check_HasChild(p_link, "b")); }, 
    OpensNewTab: (p_link) => { return Check_HasAttributeValue(p_link, "target", "_blank"); }, 
    HasHREF: (p_link) => { return Check_HasAttribute(p_link, "href"); }, 
    HasNewTabIcon: (p_link) => { return Check_HasNewTabIcon(p_link); }, 
    ContainsImage: (p_link) => { return Check_HasChild(p_link, "img"); }, 
    ContainsText: (p_link) => { return Check_HasText(p_link); }, 
    IsSamePageNav: (p_link) => { return Check_HasAttributeValue(p_link, "href", "#"); }, 
}

// #endregion

// --=|| TEST CASE CONFIG ||=--

/** 
 * Values to be set in the test designer before running the test case  
 * telling the script which tests to run on the page 
 * 
 * ---
 * -
 * @type {{ flag_testHeader: boolean, flag_testFooter: boolean, flag_testMegaMenu: boolean, flag_testNav: boolean, flag_testImages: boolean, flag_checkCSS: boolean, target_env: ENV_ID, target_linkTypes: Array<LINK_TYPE> }}
 */
var config_PageScan = {
    flag_testHeader: false,
    flag_testFooter: false,
    flag_testMegaMenu: false,
    flag_testNav: false,
    flag_testImages: false,

    // Skip tests that are marked as false
    flag_checkCSS: false,

    target_env: ENV_ID.QA, // Change URL based on target environment (QA and UAT just use input URL)
    target_linkTypes: [], // Test all types if empty
}

// --=|| LINK FUNCTIONS ||=--

function Link_GetHref(p_link) {
    return _eval(`${p_link}.attr("href")`);
}

function Link_GetLinkType(p_link) {
    var href = (linkFlags.HasHREF(p_link)) ? Link_GetHref(p_link) : "NO HREF FOUND";

    if (href.contains("mailto:")) return LINK_TYPE.MAILTO;
    else if (href.contains("tel:")) return LINK_TYPE.PHONE;
    else if (viewableFileTypes.some((p_fileType) => href.includes(p_fileType))) return LINK_TYPE.VIEW_FILE;
    else if (downloadableFileTypes.some((p_fileType) => href.includes(p_fileType))) return LINK_TYPE.DOWNLOAD_FILE;
    else if (href.contains("youtube.com") && !linkFlags.ContainsText(p_link)) return LINK_TYPE.EMB_VIDEO;
    else if (href.contains("HBEWeb/")) return LINK_TYPE.APP;
    else if (PageNav_GetSite(href) == PageNav_GetSite()) return LINK_TYPE.INTERNAL;
    else return LINK_TYPE.EXTERNAL;
}

function Link_GetAllLinksInCOntainer(p_container) {

}

function Link_CheckCSSRules(p_link) {
    var failCategory = "STYLING ISSUE";

    // --=|| Underlines ||=--
    var flag_shouldBeUnderlined = !(
           linkFlags.InNav(p_link)
        || linkFlags.InHeader(p_link)
        || linkFlags.InFooter(p_link)
        || linkFlags.ContainsImage(p_link)
        || linkFlags.IsButton(p_link)
        || linkFlags.InList(p_link)
        || !linkFlags.ContainsText(p_link)
    );

    if (flag_shouldBeUnderlined && ! linkFlags.IsUnderlinedCSS(p_link)) {
        // Failed - link that should be underlined is not underlined with CSS
    }
    else if (!flag_shouldBeUnderlined && (linkFlags.IsUnderlinedCSS(p_link) || linkFlags.IsUnderlinedTag(p_link))) {
        // Failed - link that should not be underlined is underlined
    }
    if (linkFlags.IsUnderlinedTag(p_link)) {
        // Failed - <u> detected
    }

    // --=|| Bold Text ||=--
    if (linkFlags.IsBoldedTag(p_link)) {
        // Failed - <b> detected
    }

    // --=|| New Tab Icons ||=--
    var linkType = Link_GetLinkType(p_link);
    var flag_shouldHaveIcon = (
           linkType == LINK_TYPE.EXTERNAL
        || linkType == LINK_TYPE.VIEW_FILE
        || linkType == LINK_TYPE.DOWNLOAD_FILE
        || (linkType == LINK_TYPE.APP && PageNav_GetSite() != SITE_ID.HPF)
    );
    if (flag_shouldHaveIcon && !linkFlags.HasNewTabIcon(p_link)) {
        // Failed - Link that should have a new tab icon did not
    }
    else if (!flag_shouldHaveIcon && linkFlags.HasNewTabIcon(p_link)) {
        // Failed - Link that should not have a new tab icon has one
    }
}

function Link_TestHTTP(p_link) {
    var responseHead = head(Link_GetHref(p_link));
    _log(responseHead.status);
}

class Link {
    constructor(p_jqString) {
        this.jqString = p_jqString;
    }

    toString() {
        var logStr = `\n -- LINK: ${this.jqString} -- \n\n`
        for (const flag of Object.keys(linkFlags)) {
            _log(flag);
            logStr += `${flag}: ${linkFlags[flag](this.jqString)}\n`;
        }

        return logStr;
    }
}

function ScanPage(p_url) {
    PageNav_NavigateToPage(p_url);
}

function UnitTest_LinkFlags(p_url, p_link) {
    PageNav_NavigateToPage(p_url);

    _log(`jqString = ${p_link}`);

    var testLink = new Link(p_link);
    _log(testLink.toString());
}

function UnitTest_GetLinks(p_url) {
    PageNav_NavigateToPage(p_url);



    var logStr = _eval(`var logStr = ''` 
    + `ds$('div#main-content').find('a').each(() => {`
    + `    logStr += $(this).text() + '\n';`
    + `});`
    + `logStr;`);
    _log(logStr);
}

//UnitTest_LinkFlags("https://qa.wahpf.org/us/en/home-page.html", "ds$('a#button-6ccc1d1238')");
//UnitTest_LinkFlags("https://qa.wahpf.org/us/en/health-coverage/who-can-sign-up/tribal-members.html", "ds$(\"a:contains('Glossary')\")");

UnitTest_GetLinks("https://qa.wahpf.org/us/en/home-page.html");