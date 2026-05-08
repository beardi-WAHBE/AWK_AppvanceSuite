/**
 * @aiq.webdesigner
 * This script requires AIQ Web Designer
*/

const homepageURLs = {
    HPF: [
        ".wahpf.org/us/en/home-page.html",
        ".wahpf.org/us/es/home-page.html",
        ".wahpf.org/content/wahpf/us/en/home-page.html",
        ".wahpf.org/content/wahpf/us/es/home-page.html",
        "/content/wahpf/us/en/home-page.html",
        "/content/wahpf/us/es/home-page.html",
        ".wahealthplanfinder.org/",
        ".wahealthplanfinder.org/us/en/home-page.html",
        ".wahealthplanfinder.org/us/es/home-page.html",
    ],
    HBE: [
        "-corp.wahpf.org/",
        ".wahbexchange.org/home-page/",
    ],
    PWS: [
        ".wapathways.org/",
    ],
};
const sites = {
    HPF: [".wahpf.org/us", ".wahealthplanfinder.org/us"],
    APP: [".wahpf.org/HBEWeb", ".wahealthplanfinder.org/HBEWeb/"],
    HBE: ["-corp.wahpf.org", ".wahbexchange.org"],
    PWS: [".wapathways.org"],
    EXT: [""],
}
const envs = {
    UAT: "https://uat",
    DEV: "https://dev",
    PRD: "https://www",
    QA:  "https://qa",
}
const mainContentXPaths = {
    HPF: "//div[@id = 'main-content']",
    HBE: "//main[@id = 'msite-main']",
    PWS: "//div[@id = 'main-content']",
}
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

// Link Helper Functions

function GetSite(in_url) {
    // Default to External Site
    let returnSite = "EXT";

    for(let site of Object.keys(sites)) {
        if (site == "EXT") continue;
        try {
            sites[site].some((identifier) => {
                if(in_url.includes(identifier)) {
                    returnSite = site
                    return;
                };
            });
        }
        catch(TypeError) {
            log(`ERROR - TypeError: Sites[${site}] was undefined.`);
        }
        

        if (returnSite != "EXT") break;
    }

    return returnSite;
}

function GetEnv(in_url) {
    // Default to External Environment
    let returnEnv = "EXT";
    
    for(let env of Object.keys(envs)) {
        // Check the URL for an identifier that corrsponds to one of our Sites
        if(in_url.contains(envs[env])) {
            returnEnv = env;
            break;
        }
    }

    return returnEnv;
}

function GetMainContentXPath(p_url) {
    let returnXPath = "";
    let site = GetSite(p_url);
    if(site in mainContentXPaths) {
        returnXPath = mainContentXPaths[site];
    }
    return returnXPath;
}

function IsOnHomepage(in_url) {
    const env = GetEnv(in_url);
    const site = GetSite(in_url);

    if (["EXT", "APP"].includes(site)) return false;

    let returnVal = false;
    try {
        for(let val of homepageURLs[site]) {
            if (in_url == envs[env] + val) {
                returnVal = true;
                break;
            }
        }
    }
    catch(TypeError) {
        log(`ERROR - Index out of bounds: Looking for ${site} in homepageURLs [${Object.keys(homepageURLs)}]`)
    }
    finally {
        return returnVal;
    }

}


// Unit Tests
function UnitTest_GetPageData(in_url) {
    //navigateTo(in_url);
    log(`
        GET PAGE DATA: ${in_url} \n
         - ENV:  ${GetEnv(in_url)}
         - SITE: ${GetSite(in_url)}
         - On Homepage: ${IsOnHomepage(in_url)}
    `);
}


//UnitTest_GetPageData("https://qa.wapathways.org/");
//UnitTest_GetPageData("https://uat.wahpf.org/HBEWeb/Annon_DisplayHomePage.action?request_locale=en&id=TnqlsfmaF73rqnNO2D3qCSMxUGidjZpQ");
//UnitTest_GetPageData("https://dev.wahpf.org/us/en/tools-and-resources/how-to/language-support.html");
//UnitTest_GetPageData("https://dev.wahpf.org/us/es/home-page.html");
//UnitTest_GetPageData("https://www.wahbexchange.org/home-page/");
//UnitTest_GetPageData("https://www.google.com");