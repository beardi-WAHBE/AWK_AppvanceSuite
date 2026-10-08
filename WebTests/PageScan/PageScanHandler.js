/**
 * @aiq.webdesigner
 * This script requires AIQ Web Designer
*/

// --=|| UTILIY FUNCTIONS ||=--
// Move to external file?
// #region


function PageNav_CheckIsInteractable(p_jqElementStr) {
	var flag_check = _eval(`(${p_jqElementStr}.length && ${p_jqElementStr}.is(':visible') && !${p_jqElementStr}.is(':disabled'))`);
	if (flag_check == true) return true;
	else return false;
}

function PageNav_WaitForElement(p_jqElementStr, p_waitTimeMS = 5000, p_failIfNotFound = true) {
	wait(p_waitTimeMS, () => PageNav_CheckIsInteractable(p_jqElementStr));

	var elementFound = PageNav_CheckIsInteractable(p_jqElementStr);
    /*
	if (!elementFound && p_failIfNotFound) {
		testResultString += `\n| FAILURE: Element not found after ${p_waitTimeMS}ms \n|`
		+ ` - Identifier: ${p_jqElementStr} \n|`
		+ "\n| FAILED ASSERT: ENDING TEST \n|";

		//EndTest();

	}
    */
	return elementFound;
}

function PageNav_NavigateToPage(p_url) {
		_eval(`window.location.href = '${p_url}'`);
		PageNav_WaitForElement("ds$('body')");
}

function Util_ContainsOneOfMany(p_string, p_checklist) {
    return p_checklist.some((listItem) => p_string.includes(listItem));
}

const ENV_ID = {
    DEV: 0,
    UAT: 1,
    QA: 2,
    PROD: 3,
    EXTERNAL: 4
}
const SITE_ID = {
    HPF: 0,
    HBE: 1,
    WA_PATH: 2,
    EXTERNAL: 3
}

const HomepageURLs_HPF = [
            "https://qa.wahpf.org/us/en/home-page.html",
            "https://qa.wahpf.org/content/wahpf/us/en/home-page.html",
            "https://dev.wahpf.org/us/en/home-page.html",
            "https://www.wahealthplanfinder.org/us/en/home-page.html",
            "https://qa.wahpf.org/us/es/home-page.html",
            "https://qa.wahpf.org/content/wahpf/us/es/home-page.html",
            "https://dev.wahpf.org/us/es/home-page.html",
            "https://www.wahealthplanfinder.org/us/es/home-page.html",
            "https://www.wahealthplanfinder.org/",
            "/content/wahpf/us/en/home-page.html",
            "/content/wahpf/us/es/home-page.html"
]
const HomepageURLs_HBE = [
            "https://uat-corp.wahpf.org/",
            "https://dev-corp.wahpf.org/",
            "https://www.wahbexchange.org/home-page/"
]
function PageNav_GetSite(p_url) {
    if (Util_ContainsOneOfMany(p_url, HomepageURLs_HPF)) return SITE_ID.HPF;
    else if (Util_ContainsOneOfMany(p_url, HomepageURLs_HBE)) return SITE_ID.HBE;
    else if (p_url.contains("wapathways.org")) return SITE_ID.WA_PATH;
    else return SITE_ID.EXTERNAL;
}
function PageNav_GetEnv(p_url) {
    if(PageNav_GetSite(p_url) == SITE_ID.EXTERNAL) return ENV_ID.EXTERNAL;
    else if (p_url.contains("//dev")) return ENV_ID.DEV;
    else if (p_url.contains("//uat")) return ENV_ID.UAT;
    else if (p_url.contains("//qa")) return ENV_ID.QA;
    else return ENV_ID.PROD;
}
function PageNav_ChangeURLToTestENV(p_url, p_env) {
    var currentSite = PageNav_GetSite(p_url);
    if (currentSite == SITE_ID.EXTERNAL || PageNav_GetEnv(p_url) == p_env) return p_url;

    var targetEnvStr = "www";
    if (p_env == ENV_ID.DEV) targetEnvStr = "dev";
    else if (p_env == ENV_ID.UAT) targetEnvStr = "uat";
    else if (p_env == ENV_ID.QA) targetEnvStr = "qa";

    if (p_env != ENV_ID.PROD) {
        return p_url.replace(/www|qa|uat|dev/g, targetEnvStr);
    }

    if (currentSite == SITE_ID.HBE) targetEnvStr += "-corp"

    // From PROD to NON-PROD
    if (PageNav_GetEnv(p_url) == ENV_ID.PROD && PageNav_GetSite(p_url) == SITE_ID.HPF) {
        return p_url.replace(/www.wahealthplanfinder.org|www.wahbexchange.org/g, targetEnvStr + ".wahpf.org");
    }
    // From NON-PROD to PROD
    else if (p_env = ENV_ID.PROD) {

    }

}

// #endregion

// --=|| GLOBAL TEST CONFIG ||=--
// #region

const linkTypes = {
    INTERNAL: 0,
    APP: 1,
    EXTERNAL: 2,
    VIEW_FILE: 3,
    DOWNLOAD_FILE: 4,
    MAILTO: 5,
    PHONE: 6,
    EMB_VIDEO: 7,
    JS_NAV: 8
}

const downloadableFileTypes = [".docx", ".xlsx", ".pptx", ".ics" ]

const viewableFileTypes = [".jpeg", ".jpg", ".png", ".gif", ".svg", ".pdf", ".mp3" ]

var linkFlags = {
    InHeader: (p_link) => { return false }, // can find "./ancestor::header"
    InFooter: (p_link) => { return false }, // can find "./ancestor::footer | ./ancestor::div[@class='page__footer' or @id='ash-footer-wrapper']"
    InNav: (p_link) => { return false }, // can find "./ancestor::nav"
    InList: (p_link) => { return false }, // can find "./ancestor::ol | .ancestor::ul"
    IsButton:  (p_link) => { return false }, // link has class ".btn" or ".button"
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

var config_PageScan = {
    // Skip regions that are tagged as false
    flag_testHeader: false,
    flag_testMegaMenu: false,
    flag_testNav: false,
    flag_testImages: false,
    flag_testFooter: false,

    target_env: ENV_ID.QA, // Change URL based on target environment (QA and UAT just use input URL)
    target_linkTypes: [], // Test all types if empty
}

// --=|| LINK FUNCTIONS ||=--

function Link_GetLinkType(p_link) {
    var href = (linkFlags.HasHREF(p_link)) ? "get href" : "NO HREF FOUND";

    if (href.contains("mailto:")) return linkTypes.MAILTO;
    else if (href.contains("tel:")) return linkTypes.PHONE;
    else if (viewableFileTypes.some((p_fileType) => href.includes(p_fileType))) return linkTypes.VIEW_FILE;
    else if (downloadableFileTypes.some((p_fileType) => href.includes(p_fileType))) return linkTypes.DOWNLOAD_FILE;
    else if (href.contains("youtube.com") && !linkFlags.ContainsText(p_link)) return linkTypes.EMB_VIDEO;
    else if (href.contains("HBEWeb/")) return linkTypes.APP;
}
