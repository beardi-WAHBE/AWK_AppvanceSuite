/**
 * @aiq.webdesigner
 * This script requires AIQ Web Designer
*/


const FPLCalculatorData = {
    name: "HPF Contact Us Adaptive Form (English)",
    url: "https://qa.wahpf.org/us/en/tools-and-resources/connect-with-us/contact-us/customer-support.html",
    formXPath: "//form[@id='guideContainerForm']",

    pages: [
        {
            fields: {
                firstName: {
                    label: "First name",
                    required: true,
                    type: "input_text",
                    xpath: "//input[@id='guideContainer-rootPanel-guidetextbox_copy___widget']",
                    options: [],
                },
                lastName: {
                    label: "Last name",
                    required: true,
                    type: "input_text",
                    xpath: "//input[@id='guideContainer-rootPanel-guidetextbox_1880158___widget']",
                    options: [],
                },
                email: {
                    label: "Email",
                    required: true,
                    type: "input_email",
                    xpath: "//input[@id='']",
                    options: [],
                },
                phone: {
                    label: "Phone number",
                    required: true,
                    type: "input_phone",
                    xpath: "//input[@id='']",
                    options: [],
                },
                subject: {
                    label: "Subject",
                    required: false,
                    type: "input_text",
                    xpath: "//input[@id='']",
                    options: [],
                },
                message: {
                    label: "First name",
                    required: true,
                    type: "textarea",
                    xpath: "//textarea[@id='']",
                    options: [],
                },
            },
            button: {
                type: "submit",
                label: "Submit",
                xpath: "//button[@id='guideContainer-rootPanel-submit___widget']",
            }
        },
    ]
}