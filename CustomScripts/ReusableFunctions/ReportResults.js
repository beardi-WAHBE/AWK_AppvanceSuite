/**
 * @aiq.webdesigner
 * This script requires AIQ Web Designer
*/

/**
 * Generate a log string for a failed test
 * @param {string} p_failCategory A few words broadly describing the kind of failure that occured
 * @param {string} p_failDesc A detailed description of why the test failed
 * @param {boolean} p_endTest Flag whether or not the failure prevents the test from continuing (false by default)
 * @returns {string} Returns a formatted string that will appear in the test log
 */
function GenerateFailureLog(p_failCategory, p_failDesc, p_endTest = false) {
    var failType = (p_endTest) ? "CRITICAL FAILURE" : "FAILURE";
    var logStr = `\n -- ${failType} - ${p_failCategory}: ${p_failDesc}\n`;
    if (p_endTest) logStr += "\n --=|| FAILURE PREVENTS FURTHER TESTING - ENDING TEST ||=-- \n";

    return logStr;
}