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


function ParseBDDExample(p_headerRow, p_exampleRow = 0) {
    let exampleArr = p_exampleRow.split("|");
    let headerArr = p_headerRow.split("|");

	let output = new Map();

    // Process field value/result groups together, using the header row to find each group.
    for (let i = 0; i < headerArr.length; i++) {
        if (!headerArr[i].toLowerCase().contains("_input")) continue;

        let fieldName = headerArr[i].split("_")[0];
        let fieldInput = exampleArr[i];
        let fieldResult = exampleArr[i + 1];

        output.set(fieldName, {input: fieldInput, result: fieldResult});
    }

	return output;
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
			case InputType.TEXTAREA:
				this.XPath += `//textarea[@id='${p_id}']`;
			default:
				this.XPath += `//input[@id='${p_id}']`;
		}
	}

	SendData(p_input, p_result) {
		_log(this.XPath);
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

	let logStr = "\n -| Initialize Adaptive Form Data |- \n\n" +
				 `Name: ${contactUsFormData.name}\n` + 
				 `URL: ${contactUsFormData.url}\n` +
				 `Pages:\n`;

	let page = contactUsFormData.pages[0];
	let testData = ParseBDDExample(contactUsFormData.bddHeader, p_bddExample);


	_navigateTo(contactUsFormData.url);
	//_selectFrame(frame("aemFormFrame"));
	_log(testData);


	for (field in page) {
		logStr += ` - (${field}) ${page[field].toString()}\n`;
		page[field].SendData(testData[field], "");
	}

	_log(logStr);

	TEST_ParseInputData(contactUsFormData.bddHeader, p_bddExample);
	
}

TEST_InitializeAdaptiveFormData("| Smoke Test: Valid Input | Test | No Error | Test | No Error | FormsTesting@wahbexchange.org | No Error | 1234567890  | No Error |  | No Error | This is a test | No Error | Form should submit |");