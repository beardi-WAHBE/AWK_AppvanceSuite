/**
 * @aiq.webdesigner
 * This script requires AIQ Web Designer
*/

function ParseBDDExample(p_formData, p_exampleRowIndex = 0) {
    let exampleArr = p_formData.bddExamples[p_exampleRowIndex].split(" | ");
    let headerArr = p_formData.bddHeaderRow.split(" | ");

    // Process field value/result groups together, using the header row to find each group.
    for (let i = 0; i > headerArr.length; i++) {
        if (!headerArr[i].contains("_input")) continue;

        let fieldName = headerRow[i].split("_")[0];
        let fieldInput = exampleArr[i];
        let fieldResult = exampleArr[i + 1];

        let fieldData = new AdaptiveFormField()
    }
}

class AdaptiveFormData {
    constructor() {
        this.formName = "";
        this.bddHeaderRow =  "BDD Header";
        this.bddExamples = [ "BDD Example Row",
                             "BDD Example Row",
        ];

        // fieldID = name of field in BDD Examples. (firstName_input -> fieldID = firstName)
        this.fields = new Map();
        fields.set("fieldID", new AdaptiveFormField("Field Name", "Field Type", "XPath"));
    }
}

class AdaptiveFormField {
    constructor(p_name, p_type, p_xpath) {
        this.fieldName = p_name;
        this.type = p_type;
        this.xpath = p_xpath;
        this.input = "";
        this.expectedResult = "";
    }
}