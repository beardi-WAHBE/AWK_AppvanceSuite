/**
 * @aiq.webdesigner
 * This script requires AIQ Web Designer
*/

const FPLCalculatorMetaData = {
    name: "HBE FPL Calculator",
    url: "https://uat-corp.wahpf.org/resources/tools/affordability-exemption-calculators/federal-poverty-level/",

    fields: {
        planYear: {
            type: "Dropdown",
            xpath: "//select[@id='year_fpl']",
            options: ['Select','2026','2025','2024','2023','2022','2021','2020','2019','2018','2017','2016','2015','2014'],
        },
        householdSize: {
            type: "Dropdown",
            xpath: "//select[@id='household']",
            options: ['Select your Household Size','1','2','3','4','5','6','7','8'],
        },
        yearlyIncome: {
            type: "Input_Number",
            xpath: "//input[@id='hbeyincome']",
        },
        monthlyIncome: {
            type: "Input_Number",
            xpath: "//input[@id='hbemincome']",
        },
        percentFPL: {
            type: "Input_Number",
            xpath: "//input[@id='hbefpl']",
        },
    }
}

const FPLCalculatorTestCases = [
    {
        checkMonthOrYear: "year",
        planYear: "2026",
        householdSize: "1",
        yearlyIncome: "",
        monthlyIncome: "",
        expectedFPL: ""
    },
]