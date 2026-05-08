/**
 * @aiq.webdesigner
 * This script requires AIQ Web Designer
*/
//include("{ds}/ReusableFunctions/AccessorFunctions.js");
//include("{ds}/ReusableFunctions/TestLinkHelperFunctions.js");

include("{ds}/TestElements/ContentElements/_ContentElement.js");

// Test Change 2

// Link Class

const viewableFileTypes = [".jpeg", ".jpg", ".png", ".gif", ".svg", ".pdf", ".mp3"];
const downloadableFileTypes = [".docx", ".xlsx", ".pptx", ".ics"];
const deniedSymbols = ["|", "[", "]", "\\"];

class Link_ContentElement extends _ContentElement {

    constructor(in_webElement, in_parentXPath) {
        super(in_webElement, in_parentXPath);

        this.flags = {
            appLink: (this.href.contains("/HBEWeb/")),
            opensNewTab: false,
            hasNewTabIcon: false,
            externalLink: false,
            viewableFile: false,
            downloadableFile: false,
            inHeader: false,
            inFooter: false,
            inNavElement: false,
            isButton: false,
            containsImage: false,
            hasText: false,

            shouldNotBeUnderlined: (inHeader || inFooter || inNavElement || isButton || containsImage),
            shouldNotHaveExternalIcon: (inHeader || inFooter || isButton || containsImage || !hasText),
        }
    }

    
}