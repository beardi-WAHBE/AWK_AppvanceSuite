/**
 * @aiq.webdesigner
 * This script requires AIQ Web Designer
*/

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