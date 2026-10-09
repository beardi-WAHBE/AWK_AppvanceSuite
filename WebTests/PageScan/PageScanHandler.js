/**
 * @aiq.webdesigner
 * This script requires AIQ Web Designer
*/

include("{ds}/../../ReusableFunctions/ReportResults.js");
/** Aliases for ReportResults.js functions */
class Report {
    /** @ -- Generate a log string for a failed test -- @param {string} p_failCategory A few words broadly describing the kind of failure that occured @param {string} p_failDesc A detailed description of why the test failed @param {boolean} p_endTest Flag whether or not the failure prevents the test from continuing (false by default) @returns {string} Formatted string that will appear in the test log */
    GenerateFailureLog = (p_failCategory, p_failDesc, p_endTest = false) => Report_GenerateFailureLog(p_failCategory, p_failDesc, p_endTest);
}

include("{ds}/../../ReusableFunctions/PageNavigation.js");

/** @ -- Uses JQuery to check if an element can be interacted with -- @param p_jqElementStr {string} JQuery string to find element @returns {boolean} True/False if the element can be interacted with */
const PageNav_CheckIsInteractable = (p_jqElementStr) => CheckIsInteractable(p_jqElementStr);

/** @ -- Uses JQuery to wait and see if an element loaded within a set amount of time -- @param {string} p_jqElementStr JQuery string to locate element @param p_waitTimeMS {number} Number of miliseconds to wait for the element (default is 5000ms) @returns {boolean} True/False if element was found within the timeframe */
const PageNav_WaitForElement = (p_jqElementStr, p_waitTimeMS = 5000) => PageNav_WaitForElement(p_jqElementStr, p_waitTimeMS);

/** @ -- Uses JQuery to navigate to the specified URL -- @param {string} p_url String formatted as URL @returns {boolean} True/False if the body of the page loaded */
const PageNav_NavigateToPage = (p_url) => NavigateToPage(p_url);

/** @ -- Uses JQuery to navigate to the specified URL -- @param {string} p_url String formatted as URL @returns {boolean} True/False if the body of the page loaded */
const PageNav_GetCurrentURL = () => GetCurrentURL();

/** @ -- Gets which site the URL goes to -- @param {string} p_url String formatted as valid URL (default value gets URL of the current page) @returns {SITE_ID} SITE_ID ( HPF, HBE, WA_PATH, EXTERNAL ) */
const PageNav_GetSite = (p_url = PageNav_GetCurrentURL()) => GetSite(p_url);

/** @ -- Gets which environment the URL goes to. -- @param {string} p_url String formatted as valid URL (default value gets URL of the current page) @returns {ENV_ID} ENV_ID ( DEV, UAT, QA, PROD, EXTERNAL ) */
const PageNav_GetEnv = (p_url = PageNav_GetCurrentURL()) => GetEnv(p_url);

/** @ -- Changes the input URL to the given Environment @param {string} p_url String formatted as valid URL @param {ENV_ID} p_env ENV_ID ( DEV, UAT, QA, PROD, EXTERNAL ) @returns {string} URL changed to match target environment (External links and links already in the right environemnt return unchanged) */
const PageNav_ChangeURLToTestENV = (p_url, p_env) => ChangeURLToTestENV(p_url, p_env);


function Util_ContainsOneOfMany(p_string, p_checklist) {
    return p_checklist.some((listItem) => p_string.includes(listItem));
}

// --=|| GLOBAL TEST CONFIG ||=--
// #region

const LINK_TYPE = { INTERNAL: 0, APP: 1, EXTERNAL: 2, VIEW_FILE: 3, DOWNLOAD_FILE: 4, MAILTO: 5, PHONE: 6, EMB_VIDEO: 7, JS_NAV: 8 }

/** List of file extensions for links that download a file to the user's computer instead of opening a new page */
const downloadableFileTypes = [".docx", ".xlsx", ".pptx", ".ics" ]
/** List of file extensions for links that open a file in the browser */
const viewableFileTypes = [".jpeg", ".jpg", ".png", ".gif", ".svg", ".pdf", ".mp3" ]

var linkFlags = {
    InHeader: (p_link) => { return false }, // can find "./ancestor::header"
    InFooter: (p_link) => { return false }, // can find "./ancestor::footer | ./ancestor::div[@class='page__footer' or @id='ash-footer-wrapper']"
    InNav: (p_link) => { return false }, // can find "./ancestor::nav"
    InList: (p_link) => { return false }, // can find "./ancestor::ol | .ancestor::ul"
    IsButton:  (p_link) => { return false }, // link has class ".btn" or ".button"
    IsUnderlinedCSS: (p_link) => {return false}, // css value "text-decoration" includes "underline"
    IsUnderlinedTag: (p_link) => {return false}, // has ancestor or child <u> tag
    IsBoldedTag: (p_link) => {return false}, // has ancestor or child <b> tag
    OpensNewTab: (p_link) => { return false }, // has attribute "target = '_blank'"
    HasHREF: (p_link) => { return false }, // has attribute "href"
    HasNewTabIcon: (p_link) => { return false }, 
    // Not null or undefined: "return window.getComputedStyle(arguments[0], '::after').getPropertyValue('content');"
    // OR Find ".//span[@class='external--icon' or contains(@class, 'cmp-button__icon')]"
    // OR Find ".//img[@class='cmp-image__image']"
    ContainsImage: (p_link) => { return false }, // has child "img"
    ContainsText: (p_link) => { return false }, // elemet.text not null, undefined, or empty
    IsSamePageNav: (p_link) => { return false }, // has attribute "href" which contains "#"
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

function Link_GetLinkType(p_link) {
    var href = (linkFlags.HasHREF(p_link)) ? "get href" : "NO HREF FOUND";

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
}

class Link {
    constructor(p_jqString) {
        this.jqString = p_jqString;
    }

    TestLink_HTTP() {
        var failMessage = "";

        Report.GenerateFailureLog("", "");

        
    }
}
