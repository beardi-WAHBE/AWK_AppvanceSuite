/**
 * @aiq.webdesigner
 * This script requires AIQ Web Designer
*/


function Check_PageLoaded() {
    const errorCodes = {
        badRequest: "400",
        unauthorized: "401",
        forbidden: "403",
        notFound: "404",
        internalServerError: "500",
        badGateway: "502",
    }
    const errorHeadings = {
        hpfENG: "Oops!",
        hpfES: "¡Ups!",
        hbe: "Oops!",
        notFound: "Not Found",
        noResourceFound: "No resource found",
    }

    // Check HTTP response
    let pageResponse = _get("/").response;
    log("Page Response: " + pageResponse);
    if(pageResponse != 200) return false;

    // Check page title
    if(!Object.values(errorCodes).some((code) => getTitle().includes(code))) return false;

    // Check page heading
    let headingText = getText(byTagName("h1"));
    if(!Object.values(errorCodes).some((code) => headingText.includes(code))) return false;
    if(Object.values(errorHeadings).some((subStr) => headingText.includes(subStr))) return false;

    return true;
}