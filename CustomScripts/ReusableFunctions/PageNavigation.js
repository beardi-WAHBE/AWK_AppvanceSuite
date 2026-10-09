/**
 * @aiq.webdesigner
 * This script requires AIQ Web Designer
*/

const ENV_ID = { DEV: 0, UAT: 1, QA: 2, PROD: 3, EXTERNAL: 4 };
const SITE_ID = { HPF: 0, HBE: 1, WA_PATH: 2, EXTERNAL: 3 };

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
];
const HomepageURLs_HBE = [
            "https://uat-corp.wahpf.org/",
            "https://dev-corp.wahpf.org/",
            "https://www.wahbexchange.org/home-page/"
];

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

function PageNav_GetCurrentURL() {
    return _eval("window.location.href");
}

/** 
 * Gets which site the URL goes to
 * 
 * ---
 * -
 * @param {string} p_url String formatted as valid URL (default value gets URL of the current page)
 * @returns {SITE_ID} SITE_ID ( HPF, HBE, WA_PATH, EXTERNAL )
 */
function PageNav_GetSite(p_url = PageNav_GetCurrentURL()) {
    if (Util_ContainsOneOfMany(p_url, HomepageURLs_HPF)) return SITE_ID.HPF;
    else if (Util_ContainsOneOfMany(p_url, HomepageURLs_HBE)) return SITE_ID.HBE;
    else if (p_url.contains("wapathways.org")) return SITE_ID.WA_PATH;
    else return SITE_ID.EXTERNAL;
}
/** 
 * Gets which environment the URL goes to. 
 * 
 * ----
 * -
 * @param {string} p_url String formatted as valid URL (default value gets URL of the current page)
 * @returns {ENV_ID} ENV_ID ( DEV, UAT, QA, PROD, EXTERNAL )
 */
function PageNav_GetEnv(p_url = PageNav_GetCurrentURL()) {
    if(PageNav_GetSite(p_url) == SITE_ID.EXTERNAL) return ENV_ID.EXTERNAL;
    else if (p_url.contains("//dev")) return ENV_ID.DEV;
    else if (p_url.contains("//uat")) return ENV_ID.UAT;
    else if (p_url.contains("//qa")) return ENV_ID.QA;
    else return ENV_ID.PROD;
}
/**
 * Changes the input URL to the given Environment
 * 
 * ---
 * -
 * @param {string} p_url String formatted as valid URL
 * @param {ENV_ID} p_env ENV_ID ( DEV, UAT, QA, PROD, EXTERNAL )
 * @returns {string} URL changed to match target environment (External links and links already in the right environemnt return unchanged)
 */
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