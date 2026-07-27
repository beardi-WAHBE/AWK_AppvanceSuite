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

class AdaptiveFormField {
	constructor(p_name, p_type, p_required, p_id, p_options = [], p_parentXPath = '//form') {
		this.name = p_name;
		this.id = p_id;
		this.type = p_type;
		this.flag_required = p_required;
		this.options = p_options;

		this.XPath = p_parentXPath;
		switch(p_type) {
			case InputType.DROPDOWN:
				this.XPath += `//select[@id='${p_id}']`;
				break;
			case InputType.TEXTAREA:
				this.XPath += `//textarea[@id='${p_id}']`;
				break;
			default:
				this.XPath += `//input[@id='${p_id}']`;
				break;
		}
	}

	SendData(p_input, p_result) {
		let resultString = "";
		const element = _byXPath(this.XPath);
		
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
		return resultString;
	}

	toString() {
		let requiredStr = this.flag_required ? "required" : "not required";
		return `${this.name}: ${this.type} | ${requiredStr} | ${this.XPath}`;
	}
}

function ParseBDDExample(p_headerRow, p_exampleRow = 0) {
    let exampleArr = p_exampleRow.split("|");
    let headerArr = p_headerRow.split("|");

	let output = new Map();

    // Process field value/result groups together, using the header row to find each group.
    for (let i = 0; i < headerArr.length; i++) {
        if (!headerArr[i].toLowerCase().contains("_input")) continue;

        let fieldName = headerArr[i].split("_")[0].trim();
        let fieldInput = exampleArr[i].trim();
        let fieldResult = exampleArr[i + 1].trim();

        output.set(fieldName, {input: fieldInput, result: fieldResult});
    }

	return output;
}

class AdaptiveForm {
	constructor(p_name, p_url, p_bddHeader, p_pages) {
		this.name = p_name;
		this.url = p_url;
		this.bddHeader = p_bddHeader;
		this.pages = p_pages;
	}

	TestForm(p_bddExample) {
		let resultString = "";
		let testData = ParseBDDExample(this.bddHeader, p_bddExample);
		let flag_validInput = true;
		_navigateTo(this.url);

		for (let i_page = 0; i_page < this.pages.length; i_page++) {
			let page = this.pages[i_page];
			let btnXPath = (i_page == this.pages.length - 1) ? "//button[contains(@class, 'moveNext')]" : "//button[contains(@class, 'submit')]";

			// Click the next/submit button to make error messages start appearing with bad input.
			_click(_byXPath(btnXPath));

			// Fill out the page
			for (field of page) {
				resultString += page[field].SendData(testData.get(field).input, testData.get(field).result);
				if (testData.get(field).result != "No Error") flag_validInput = false;
			}
			
			// Try to submit the page
			_click(_byXPath(btnXPath));
		}

		return resultString;
	} 
}