/**
 * @aiq.webdesigner
 * This script requires AIQ Web Designer
*/

const InputType = Object.freeze({
	INPUT_TEXT: 'input_text',
	INPUT_EMAIL: 'input_email',
	INPUT_NUMBER: 'input_number',
	INPUT_PHONE: 'input_phone',
	TEXTAREA: 'textarea',
	DROPDOWN: 'dropdown',
	FILE_UPLOAD: 'file_upload',
});


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

class AdaptiveFormTest {
	constructor(p_bddHeader, p_bddExample) {
		
	}

	TestForm() {
	}
}

class AdaptiveFormPage {
	constructor(p_btnXPath, p_expectedResult, p_isLastPage = true) {
		this.fields = new Map();
		this.btn = P_btn;
		this.expectedResult = p_expectedResult;
		this.flag_lastPage = p_isLastPage;
	}

	AddField(p_adaptiveFormField) {
		this.fields.push(p_adaptiveFormField);
	}

	TestPage() {
		// Click on submit button. Submission should fail and error messages should appear of required fields
		for (field of this.fields) {
			if(field.flag_required) {
				// Check for error message
			}

			field.SendData();

			
		}
	}
}

class AdaptiveFormField {
	constructor(p_name, p_type, p_required, p_id, p_input, p_result, p_options = [], p_parentXPath = '//form') {
		this.name = p_name;
		this.type = p_type;
		this.flag_required = p_required;
		this.input = p_input;
		this.result = p_result;
		this.options = p_options;

		this.XPath = p_parentXPath;
		switch(p_type) {
			case InputType.DROPDOWN:
				this.XPath += `//select[@id='${p_id}']`;
			case InputType.TEXTAREA:
				this.XPath += `//textarea[@id='${p_id}']`;
			default:
				this.XPath += `//input[@id='${p_id}']`;
		}
	}

	SendData() {
		const element = _byXPath(this.m_XPath);
		
		switch(this.type) {
			case InputType.DROPDOWN:
				_setSelected(element, p_input);
				break;
			case InputType.FILE_UPLOAD:
				_log("File upload not supported");
				break;
			default:
				_setValue(element, p_input);
				break;
		}
	}
}