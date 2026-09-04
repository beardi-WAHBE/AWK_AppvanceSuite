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
	RADIO_BTNS: 'radio_buttons',
	CHECKBOX: "checkbox",
	FILE_UPLOAD: 'file_upload',
});

const FormKeys = Object.freeze({
	HPF_ContactUs_English: 0,
	HPF_ContactUs_Spanish: 1,
	HPF_WebAccessibility_English: 2,
	HPF_WebAccessibility_Spanish: 3,
	HBE_ContactUs: 4,
	HBE_IndividualAppeals: 5,
	HBE_EmployerAppeals: 6,
	HBE_FeedbackAndComplaints: 7,
	HBE_ShareYourStory: 8,
	HBE_DirectoryFeedback: 9,
	HBE_RequestASpeaker: 10,
});

const EnvKeys = Object.freeze({
	DEV: 0,
	UAT: 1,
	QA: 2,
	PROD: 3,
})

function CheckIsInteractable(p_jqElementStr) {
	var flag_check = _eval(`(${p_jqElementStr}.length && ${p_jqElementStr}.is(':visible') && !${p_jqElementStr}.is(':disabled'))`);
	if (flag_check == true) return true;
	else return false;
}

function WaitForElement(p_jqElementStr, p_waitTimeMS = 5000) {
	//_log("Interactable before checking: " + CheckIsInteractable(p_jqElementStr));
	wait(p_waitTimeMS, () => CheckIsInteractable(p_jqElementStr));
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

function GetFormData(p_formKey, p_env) {

	// --=|| Form Data ||=--
	let formDataMap = new Map();
	let hpfBaseURL = "https://qa.wahpf.org";
	let hbeBaseURL = "https://uat-corp.wahpf.org";

	if (p_env == EnvKeys.DEV) {
		hpfBaseURL = "https://dev.wahpf.org";
		hbeBaseURL = "https://dev-corp.wahpf.org";
	}
	else if (p_env == EnvKeys.PROD) {
		hpfBaseURL = "https://www.wahealthplanfinder.org";
		hbeBaseURL = "https://www.wahbexchange.org";
	}

	// -| HPF - Contact Us (English) |-
	formDataMap.set(FormKeys.HPF_ContactUs_English, {
		name: "HPF - Contact Us Form (English)",
		url: hpfBaseURL + "/us/en/tools-and-resources/connect-with-us/contact-us/customer-support.html",
		bddHeader: "| TestName " +
					"| FirstName_Input | FirstName_Result " +
					"| LastName_Input | LastName_Result " +
					"| Email_Input | Email_Result " +
					"| Phone_Input | Phone_Result " +
					"| Subject_Input | Subject_Result " +
					"| Message_Input | Message_Result " +
					"| Page_1_Result |",
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
	});

	// -| HPF - Contact Us (Spanish) |-
	formDataMap.set(FormKeys.HPF_ContactUs_Spanish, {
		name: "HPF - Contact Us Form (Spanish)",
		url: hpfBaseURL + "/es/herramientas-y-recursos/contactenos/encuentre-un-orientador/comuniquese-con-servicio-al-cliente.html",
		bddHeader: " | TestName " +
					"| Nombre_Input | Nombre_Result " +
					"| Apellido_Input | Apellido_Result " +
					"| CorreoElectronico_Input | CorreoElectronico_Result " +
					"| NumeroDeTelefono_Input | NumeroDeTelefono_Result " +
					"| Sujeto_Input | Sujeto_Result " +
					"| Mensaje_Input | Mensaje_Result " +
					"| Page_1_Result |",
		pages: [
			{
				Nombre:            new AdaptiveFormField("Nombre",             InputType.INPUT_TEXT,  true,  "guideContainer-rootPanel-guidetextbox_copy___widget"), 
				Apellido:          new AdaptiveFormField("Apellido",           InputType.INPUT_TEXT,  true,  "guideContainer-rootPanel-guidetextbox_1880158___widget"), 
				CorreoElectronico: new AdaptiveFormField("Correo electrónico", InputType.INPUT_EMAIL, true,  "guideContainer-rootPanel-guidetextbox_1495532___widget"), 
				NumeroDeTelefono:  new AdaptiveFormField("Número de teléfono", InputType.INPUT_PHONE, true,  "guideContainer-rootPanel-guidetextbox_4808239___widget"), 
				Sujeto:            new AdaptiveFormField("Sujeto",             InputType.INPUT_TEXT,  false, "guideContainer-rootPanel-guidetextdraw___widget"), 
				Mensaje:           new AdaptiveFormField("Mensaje",            InputType.TEXTAREA,    true,  "guideContainer-rootPanel-guidetextbox_3287953___widget")
			}, 
		]
	});

	// -| HPF - Web Accessibility Form (English) |-
	formDataMap.set(FormKeys.HPF_WebAccessibility_English, {
		name: "HPF - Contact Us Form (English)",
		url: hpfBaseURL + "",
		bddHeader: "| TestName | | Page_1_Result |",
		pages: [
			{
				FirstName: new AdaptiveFormField("First Name", InputType.INPUT_TEXT,  true,  "guideContainer-rootPanel-guidetextbox___widget"), 
				LastName:  new AdaptiveFormField("Last Name",  InputType.INPUT_TEXT,  true,  "guideContainer-rootPanel-guidetextbox_1880158892___widget"), 
				Email:     new AdaptiveFormField("Email",      InputType.INPUT_EMAIL, true,  ""), 
				Phone:     new AdaptiveFormField("Phone",      InputType.INPUT_PHONE, true,  ""), 
				Feedback:  new AdaptiveFormField("Feedback",   InputType.TEXTAREA,    true,  ""),
				
				WhatSite:  new AdaptiveFormField("What site are you referencing?",   InputType.RADIO_BTNS, false,  "", 
					["wahealthplanfinder.org", "wahbexchange.org"]
				),
				WhichDevice_Computer: new AdaptiveFormField("Which device...Computer", InputType.CHECKBOX, false, ""),
				WhichBrowser_Computer:  new AdaptiveFormField("Which browser...Computer",   InputType.RADIO_BTNS, false,  "", 
					["Select browser", "Chrome", "Edge", "Firefox", "Safari", "Other"]
				),
				WhichDevice_Phone: new AdaptiveFormField("Which device...Phone or tablet", InputType.CHECKBOX, false, ""),
				WhichBrowser_Phone:  new AdaptiveFormField("Which browser...Phone or tablet",   InputType.RADIO_BTNS, false,  "", 
					["Select browser", "Chrome", "Edge", "Firefox", "Safari", "Other"]
				),
				WhichDevice_APP: new AdaptiveFormField("Which device...WAPlanfinder mobile app", InputType.CHECKBOX, false, ""),
				MobileDevice:  new AdaptiveFormField("Mobile Device?",   InputType.RADIO_BTNS, false,  "", 
					["Select mobile device", "Apple(iOS)", "Android"]
				),

				AttachFile: new AdaptiveFormField("Attach a file", InputType.FILE_UPLOAD, false, ""),
			}, 
		]
	});

	// -| HPF - Web Accessibility Form (Spanish) |-
	formDataMap.set(FormKeys.HPF_WebAccessibility_Spanish, {
		name: "HPF - Contact Us Form (Spanish)",
		url: hpfBaseURL + "",
		bddHeader:  "| TestName " +
					"|  " +
					"| Page_1_Result |",
		pages: [
			{
				FirstName: new AdaptiveFormField("First Name", InputType.INPUT_TEXT,  true,  ""), 
			}, 
		]
	});

	//  -|HBE - Contact Us Form |-
	formDataMap.set(FormKeys.HBE_ContactUs, {
		name: "HBE - Contact Us Form",
		url: hbeBaseURL + "",
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
	});

	//  -|HBE - Contact Us Form |-
	formDataMap.set(FormKeys.HBE_IndividualAppeals, {
		name: "HBE - Individual Appeals Form",
		url: hbeBaseURL + "",
		bddHeader:  "| TestName " +
					"|  " +
					"| Page_1_Result |",
		pages: [
			{
				FirstName: new AdaptiveFormField("First Name", InputType.INPUT_TEXT,  true,  ""), 
			}, 
		]
	});
	
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

		for (let i = 0; i < this.pages.length; i++) {
			// Wait for form to be interactable
			var flag_lastPage = (i + 1 == this.pages.length);
			WaitForElement("ds$('#aemFormFrame').contents().find('form')");
			
			// Press the Next/Submit button to make error messages start appearing
			var btnClass = (flag_lastPage) ? "submit" : "moveNext";
			var btnXPath = `//button[contains(@class, '${btnClass}')]`;
			_click(_byXPath(btnXPath));

			// Fill out form
			var firstField = null;
			for (const [fieldName, fieldObj] of Object.entries(this.pages[i])) {
				if (firstField == null) firstField = fieldObj;
				fieldObj.SendData(testData.get(fieldName).input, testData.get(fieldName).result);
			}

			// Verify the results
			var pageResult = testData.get(`Page_${i + 1}_Result`);
			_click(_byXPath(btnXPath));
			if (pageResult.toLowerCase().contains("should not")) {
				// If page is expected to fail, make sure the page didn't submit then end the test
				_log("Page should not have submitted");
				if (flag_lastPage) _verifyFalse(WaitForElement("ds$('#aemFormFrame').contents().find('#loadingPage h1')"));
				else _verifyTrue(firstField.CheckFieldIsInteractable());
				continue;
			}
			else if (!flag_lastPage) {
				// If the page is expected to pass and isn't the last page, make sure the form progressed to the next page
				_log("Should have progressed to the next page");
				_verifyFalse(firstField.CheckFieldIsInteractable());
			}
			else {
				// If the page is expected to pass and isn't the last page, make sure the form submitted
				_log("Should have submitted.");
				_verifyTrue(WaitForElement("ds$('#aemFormFrame').contents().find('#loadingPage h1')"));
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

		this.jqString = `ds$('#aemFormFrame').contents().find('#${this.id}')`;

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

	CheckFieldIsInteractable() {
		return CheckIsInteractable(jqString);
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
		
		/*
		_log(`\n - Check Error Message - \n
				p_result: '${p_result}' \n
				errorMessage: '${errorMsgText}' \n`);
		*/

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
//TEST_InitializeAdaptiveFormData("| Smoke Test: No Input |  | First name is required. |  | Last name is required. |  | Email is required. |  | Phone number is required. |  | No Error |  | Message is required. | Form should not submit |");