/**
 * @aiq.webdesigner
 * This script requires AIQ Web Designer
*/

function Util_ContainsOneOfMany(p_string, p_checklist) {
    return p_checklist.some((listItem) => p_string.includes(listItem));
}

function Util_ExtractTextFromHTML(p_htmlString, p_tag) {
    var startIndex = p_htmlString.indexOf(`<${p_tag}`);
    if (startIndex == -1) return `No <${p_tag}> on page`;
    var endIndex = p_htmlString.indexOf(`</${p_tag}>`);
    return p_htmlString.slice(startIndex, endIndex).split(">")[1].trim();
}