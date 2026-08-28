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

function CheckIsInteractable(p_jqElementStr) {
	return _eval(`(${p_jqElementStr}.length && ${p_jqElementStr}.is(':visible') && !${p_jqElementStr}.is(':disabled'))`);
}

function WaitForElement(p_jqElementStr, p_waitTimeMS = 5000) {
	wait(p_waitTimeMS, CheckIsInteractable(p_jqElementStr));
	return CheckIsInteractable(p_jqElementStr);
}

function NavigateToPage(p_url) {
		_eval(`window.location.href = '${p_url}'`);
		WaitForElement("ds$('body')");
}

function ParseBDDExample(p_headerRow, p_exampleRow = 0) {
    let exampleArr = p_exampleRow.split("|");
    let headerArr = p_headerRow.split("|");

	let output = new Map();

    // Process field value/result groups together, using the header row to find each group.
    for (let i = 0; i < headerArr.length; i++) {
        if (headerArr[i].toLowerCase().contains("_input")) {
			let fieldName = headerArr[i].split("_")[0].trim();
			let fieldInput = exampleArr[i].trim();
			let fieldResult = exampleArr[i + 1].trim();

			output.set(fieldName, {input: fieldInput, result: fieldResult});
		}
		else if (headerArr[i].toLowerCase().contains("page_")) {
			output.set(headerArr[i].trim(), exampleArr[i].trim());
		}
		else continue;
    }

	return output;
}

class AdaptiveForm {
	constructor(p_name, p_url, p_bddHeader, p_pages) {
		this.name = p_name; // String - Arbitrary name for form
		this.url = p_url; // String - Full URL of form
		this.bddHeader = p_bddHeader; // String: "| Test Name | <BDD Field Name 1>_Input | <BDD Field Name 1>_Result | <BDD Field Name 2>_Input | ... | Page_1_Result | Page_2_Result | ... | Page_<#>_Result |"
		this.pages = p_pages; // Array of objects. Each object is a list of AdaptiveFormFields indexed by the BDD field name
	}

	TestForm(p_bddExample) {
		// Format the data from the input BDD Example
		let testData = ParseBDDExample(this.bddHeader, p_bddExample);

		// Navigate to the form
		NavigateToPage(this.url);
		WaitForElement("ds$('#aemFormFrame').contents().find('form')");

		for (let i = 0; i < this.pages.length; i++) {
			// Wait for form to be interactable
			WaitForElement("ds$('#aemFormFrame').contents().find('form')");
			
			// Press the Next/Submit button to make error messages start appearing
			var btnClass = (i + 1 < this.pages.length) ? "moveNext" : "submit";
			var btnXPath = `//button[contains(@class, '${btnClass}')]`;
			_click(_byXPath(btnXPath));

			// Fill out form
			for (const [fieldName, fieldObj] of Object.entries(this.pages[i])) {
				fieldObj.SendData(testData.get(fieldName).input, testData.get(fieldName).result);
			}

			// Verify the results
			var pageResult = testData.get(`Page_${i + 1}_Result`);
			_click(_byXPath(btnXPath));
			if (pageResult.toLowerCase().contains("should not")) {
				// If page is expected to fail, make sure the page didn't submit then end the test
				_log("Page should not have submitted");
				continue;
			}
			else if (i + 1 < this.pages.length) {
				// If the page is expected to pass and isn't the last page, make sure the form progressed to the next page
				_log("Should have progressed to the next page");
			}
			else {
				// If the page is expected to pass and isn't the last page, make sure the form submitted
				_log("Should have submitted.");
				_log(WaitForElement("ds$('#aemFormFrame').contents().find('#loadingPage h1')"));
			}

		}
	}
}

class AdaptiveFormField {
	constructor(p_name, p_type, p_required, p_id, p_options = [], p_parentXPath = '') {
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
		//const element = _eval(`ds$('#aemFormFrame').contents().find('#${this.id}')`);
		
		switch(this.type) {
			case InputType.DROPDOWN:
				_setSelected(element, p_input);
				break;
			case InputType.FILE_UPLOAD:
				_log("File upload not supported");
				break;
			default:
				_eval(`
					ds$('#aemFormFrame').contents().find('#${this.id}').focus().val('${p_input}').blur();
				`);
				break;
		}
		
		var errorMsgText = _eval(`ds$('#aemFormFrame').contents().find('#${this.id}_desc.guideFieldError').focus().text();`);
		
		_log(`\n - Check Error Message - \n
				p_result: '${p_result}' \n
				errorMessage: '${errorMsgText}' \n`);

		if(p_result.contains("No Error")) {
			_verifyEqual(errorMsgText, "");
		}
		else {
			_verifyEqual(p_result, errorMsgText);
		}
	}

	toString() {
		let requiredStr = this.flag_required ? "required" : "not required";
		return `${this.name}: ${this.type} | ${requiredStr} | ${this.XPath}`;
	}
}

function TEST_ParseInputData(p_headerRow, p_bddExample) {
	const headerRow = "| TestName                | FirstName_Input | FirstName_Result | LastName_Input | LastName_Result | Email_Input                   | Email_Result | Phone_Input | Phone_Result | Subject_Input | Subject_Result | Message_Input  |Message_Result | Page_1_Result      |";
	const testData =  "| Smoke Test: Valid Input | Test            | No Error         | Test           | No Error        | FormsTesting@wahbexchange.org | No Error     | 1234567890  | No Error     |               | No Error       | This is a test | No Error      | Form should submit |";

	let output = ParseBDDExample(p_headerRow, p_bddExample);
	let logText = "\n -| Example Output |-\n"
	for (entry of output.keys()) {
		logText += `${entry}: ${output.get(entry).input} (${output.get(entry).result})\n`;
	}
	_log(logText);
}

function TEST_InitializeAdaptiveFormData(p_bddExample) {
	const contactUsFormData = {
		name: "Contact Us Form (English)",
		url: "https://qa.wahpf.org/us/en/tools-and-resources/connect-with-us/contact-us/customer-support.html",
		bddHeader: "| TestName | FirstName_Input | FirstName_Result | LastName_Input | LastName_Result | Email_Input | Email_Result | Phone_Input | Phone_Result | Subject_Input | Subject_Result | Message_Input | Message_Result | Page_1_Result |",
		pages: [
			{
				FirstName: new AdaptiveFormField("First Name", InputType.INPUT_TEXT,  true,  "guideContainer-rootPanel-guidetextbox_copy___widget"), 
				LastName:  new AdaptiveFormField("Last Name",  InputType.INPUT_TEXT,  true,  "guideContainer-rootPanel-guidetextbox_1880158___widget"), 
				Email:     new AdaptiveFormField("Email",      InputType.INPUT_EMAIL, true,  "guideContainer-rootPanel-guidetextbox_1495532___widget"), 
				Phone:     new AdaptiveFormField("Phone",      InputType.INPUT_PHONE, true,  "guideContainer-rootPanel-guidetextbox_4808239___widget"), 
				Subject:   new AdaptiveFormField("Subject",    InputType.INPUT_TEXT,  false, "guideContainer-rootPanel-guidetextdraw___widget"), 
				Message:   new AdaptiveFormField("Message",    InputType.TEXTAREA,    true,  "guideContainer-rootPanel-guidetextbox_3287953___widget")
			}, 
		]
	} 

	var form = new AdaptiveForm(contactUsFormData.name, contactUsFormData.url, contactUsFormData.bddHeader, contactUsFormData.pages);
	form.TestForm(p_bddExample);

/*
	let logStr = "\n -| Initialize Adaptive Form Data |- \n\n" +
				 `Name: ${contactUsFormData.name}\n` + 
				 `URL: ${contactUsFormData.url}\n` +
				 `Pages:\n`;

	let page = contactUsFormData.pages[0];
	let testData = ParseBDDExample(contactUsFormData.bddHeader, p_bddExample);


	_eval(`window.location.href = '${contactUsFormData.url}'`);
	WaitForElement("ds$('#aemFormFrame').contents().find('form')");
	
	_eval(`
		ds$('#aemFormFrame').contents().find('button.submit')[0].click();
	`);

	for (field in page) {
		_log(field)
		logStr += ` - (${field}) ${page[field].toString()}\n`;
		page[field].SendData(testData.get(field).input, testData.get(field).result);
	}

	_log(logStr);
	
	_click(_byXPath("//button[contains(@class, 'submit')]"));

	_verifyTrue(WaitForElement("ds$('#aemFormFrame').contents().find('#loadingPage h1')"));
	
	
	//_verifyExists(_byXPath("//div[@class='tyMessage']"));

	//TEST_ParseInputData(contactUsFormData.bddHeader, p_bddExample);
*/
	
}

TEST_InitializeAdaptiveFormData("| Smoke Test: Valid Input | Test | No Error | Test | No Error | FormsTesting@wahbexchange.org | No Error | 1234567890  | No Error |  | No Error | This is a test | No Error | Form should submit |");
//TEST_InitializeAdaptiveFormData("| Smoke Test: No Input |  | First name is required. |  | Last name is required. |  | Email is required. |  | Phone number is required. |  | No Error |  | Message is required. | Form should submit |");