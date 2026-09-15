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
	DATE_PICKER: 'date_picker',
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
});

var testResultString = "";
function EndTest() {
	if (testResultString == "") {
		_log("\n --=|| TEST PASSED ||=-- \n");
	}
	else {
		testResultString = "\n| --=|| TEST FAILED ||=-- \n|" + testResultString
		_log(testResultString);
	}
	_assertEquals("", testResultString);
}

function CheckIsInteractable(p_jqElementStr) {
	var flag_check = _eval(`(${p_jqElementStr}.length && ${p_jqElementStr}.is(':visible') && !${p_jqElementStr}.is(':disabled'))`);
	if (flag_check == true) return true;
	else return false;
}

function WaitForElement(p_jqElementStr, p_waitTimeMS = 5000, p_failIfNotFound = true) {
	//_log("Interactable before checking: " + CheckIsInteractable(p_jqElementStr));
	wait(p_waitTimeMS, () => CheckIsInteractable(p_jqElementStr));

	var elementFound = CheckIsInteractable(p_jqElementStr);
	if (!elementFound && p_failIfNotFound) {
		testResultString += `\n| FAILURE: Element not found after ${p_waitTimeMS}ms \n|`
		+ ` - Identifier: ${p_jqElementStr} \n|`
		+ "\n| FAILED ASSERT: ENDING TEST \n|";

		EndTest();

	}
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
	let logStr = "\n| --=|| PARSE BDD EXAMPLE ||=-- \n|";

    // Process field value/result groups together, using the header row to find each group.
    for (let i = 0; i < headerArr.length; i++) {
        if (headerArr[i].toLowerCase().contains("_input")) {
			let fieldName = headerArr[i].split("_")[0].trim();
			let fieldInput = exampleArr[i].trim();
			let fieldResult = exampleArr[i + 1].trim();

			output.set(fieldName, {input: fieldInput, result: fieldResult});
			logStr += `\n| ${fieldName}: ${fieldInput} - ${fieldResult}`;
		}
		else if (headerArr[i].toLowerCase().contains("page_")) {
			output.set(headerArr[i].trim(), exampleArr[i].trim());
			logStr += `\n| ${headerArr[i].trim()}: ${exampleArr[i].trim()}`;
		}
		else continue;
    }

	_log(logStr + "\n| ");

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
		url: hpfBaseURL + "/us/es/herramientas-y-recursos/contactenos/encuentre-un-orientador/comuniquese-con-servicio-al-cliente.html",
		bddHeader:  "| TestName " +
					"| FirstName_Input | FirstName_Result " +
					"| LastName_Input | LastName_Result " +
					"| Email_Input | Email_Result " +
					"| Phone_Input | Phone_Result " +
					"| Subject_Input | Subject_Result " +
					"| Message_Input | Message_Result " +
					"| Page_1_Result |",
		pages: [
			{
				FirstName:            new AdaptiveFormField("Nombre",             InputType.INPUT_TEXT,  true,  "guideContainer-rootPanel-guidetextbox_copy_co___widget"), 
				LastName:          new AdaptiveFormField("Apellido",           InputType.INPUT_TEXT,  true,  "guideContainer-rootPanel-guidetextbox_1880158___widget"), 
				Email: new AdaptiveFormField("Correo electrónico", InputType.INPUT_EMAIL, true,  "guideContainer-rootPanel-guidetextbox_1495532___widget"), 
				Phone:  new AdaptiveFormField("Número de teléfono", InputType.INPUT_PHONE, true,  "guideContainer-rootPanel-guidetextbox_4808239___widget"), 
				Subject:            new AdaptiveFormField("Sujeto",             InputType.INPUT_TEXT,  false, "guideContainer-rootPanel-guidetextdraw___widget"), 
				Message:           new AdaptiveFormField("Mensaje",            InputType.TEXTAREA,    true,  "guideContainer-rootPanel-guidetextbox_3287953___widget")
			}, 
		]
	});

	// -| HPF - Web Accessibility Form (English) |-
	formDataMap.set(FormKeys.HPF_WebAccessibility_English, {
		name: "HPF - Contact Us Form (English)",
		url: hpfBaseURL + "/us/en/about-us/our-organization/website-accessibility.html",
		bddHeader: "| TestName "
				 + "| FirstName_Input | FirstName_Result "
				 + "| LastName_Input | LastName_Result "
				 + "| Email_Input | Email_Result "
				 + "| Phone_Input | Phone_Result "
				 + "| Feedback_Input | Feedback_Result "
				 + "| WhatSite_Input | WhatSite_Result "
				 + "| WhichDeviceComputer_Input | WhichDeviceComputer_Result "
				 + "| WhichBrowserComputer_Input | WhichBrowserComputer_Result "
				 + "| WhichDevicePhone_Input | WhichDevicePhone_Result "
				 + "| WhichBrowserPhone_Input | WhichBrowserPhone_Result "
				 + "| WhichDeviceAPP_Input | WhichDeviceAPP_Result "
				 + "| MobileDevice_Input | MobileDevice_Result "
				 + "| AttachFile_Input | AttachFile_Result "
				 + "| Page_1_Result |",
		pages: [
			{
				FirstName: new AdaptiveFormField("First Name", InputType.INPUT_TEXT,  true,  "guideContainer-rootPanel-guidetextbox___widget"), 
				LastName:  new AdaptiveFormField("Last Name",  InputType.INPUT_TEXT,  true,  "guideContainer-rootPanel-guidetextbox_1880158892___widget"), 
				Email:     new AdaptiveFormField("Email",      InputType.INPUT_EMAIL, true,  "guideContainer-rootPanel-guidetextbox_1495532___widget"), 
				Phone:     new AdaptiveFormField("Phone",      InputType.INPUT_PHONE, true,  "guideContainer-rootPanel-guidetextbox_4808239___widget"), 
				Feedback:  new AdaptiveFormField("Feedback",   InputType.TEXTAREA,    true,  "guideContainer-rootPanel-guidetextbox_328795377___widget"),
				
				// NOTE: Skip the following dynamic feilds since we want to remake this form??
				WhatSite:  new AdaptiveFormField("What site are you referencing?",   InputType.RADIO_BTNS, false,  "guideContainer-rootPanel-guideradiobutton___guide-item", 
					{
						"wahealthplanfinder.org": "guideContainer-rootPanel-guideradiobutton__-1_widget", 
						"wahbexchange.org": "guideContainer-rootPanel-guideradiobutton__-2_widget"
					}
				),
				WhichDeviceComputer: new AdaptiveFormField("Which device...Computer", InputType.CHECKBOX, false, "guideContainer-rootPanel-guidecheckbox_copy___1_widget"),
				WhichBrowserComputer:  new AdaptiveFormField("Which browser...Computer",   InputType.DROPDOWN, false,  "guideContainer-rootPanel-panel1676498978500_c-guidedropdownlist___widget", 
					["Select browser", "Chrome", "Edge", "Firefox", "Safari", "Other"]
				),
				WhichDevicePhone: new AdaptiveFormField("Which device...Phone or tablet", InputType.CHECKBOX, false, "guideContainer-rootPanel-guidecheckbox___1_widget"),
				WhichBrowserPhone:  new AdaptiveFormField("Which browser...Phone or tablet",   InputType.DROPDOWN, false,  "guideContainer-rootPanel-panel1676498978500-guidedropdownlist___widget", 
					["Select browser", "Chrome", "Edge", "Firefox", "Safari", "Other"]
				),
				WhichDeviceAPP: new AdaptiveFormField("Which device...WAPlanfinder mobile app", InputType.CHECKBOX, false, "guideContainer-rootPanel-guideradiobutton_204___1_widget"),
				MobileDevice:  new AdaptiveFormField("Mobile Device?",   InputType.DROPDOWN, false,  "guideContainer-rootPanel-panel_1239610443-guidedropdownlist_co___widget", 
					["Select mobile device", "Apple(iOS)", "Android"]
				),

				AttachFile: new AdaptiveFormField("Attach a file", InputType.FILE_UPLOAD, false, "guideContainer-rootPanel-guidefileupload_copy___widget"),
			}, 
		]
	});

	// -| HPF - Web Accessibility Form (Spanish) |-
	formDataMap.set(FormKeys.HPF_WebAccessibility_Spanish, {
		name: "HPF - Contact Us Form (Spanish)",
		url: hpfBaseURL + "/us/es/acerca-de-nosotros/nuestra-organizacion/accesibilidad-del-sitio-de-internet.html",
		bddHeader:  "| TestName " +
					"|  " +
					"| Page_1_Result |",
		pages: [
			{
				FirstName: new AdaptiveFormField("Nombre", InputType.INPUT_TEXT,  true,  "guideContainer-rootPanel-guidetextbox___widget"), 
				LastName:  new AdaptiveFormField("Apellido",  InputType.INPUT_TEXT,  true,  "guideContainer-rootPanel-guidetextbox_1880158892___widget"), 
				Email:     new AdaptiveFormField("Correo electrónico",      InputType.INPUT_EMAIL, true,  "guideContainer-rootPanel-guidetextbox_1495532___widget"), 
				Phone:     new AdaptiveFormField("Número de teléfono",      InputType.INPUT_PHONE, true,  "guideContainer-rootPanel-guidetextbox_4808239___widget"), 
				Feedback:  new AdaptiveFormField("Comentarios",   InputType.TEXTAREA,    true,  "guideContainer-rootPanel-guidetextbox_328795377___widget"),
				
				// NOTE: Skip the following dynamic feilds since we want to remake this form??
				WhatSite:  new AdaptiveFormField("¿A qué sitio está haciendo referencia?",   InputType.RADIO_BTNS, false,  "guideContainer-rootPanel-guideradiobutton___guide-item", 
					["wahealthplanfinder.org", "wahbexchange.org"]
				),
				WhichDevice_Computer: new AdaptiveFormField("Qué dispositivo...Computadora", InputType.CHECKBOX, false, "guideContainer-rootPanel-guidecheckbox_copy___1_widget value=1"),
				WhichBrowser_Computer:  new AdaptiveFormField("Qué navegador...Computadora",   InputType.DROPDOWN, false,  "guideContainer-rootPanel-panel1676498978500_c-guidedropdownlist___widget[0]", 
					["Seleccione un navegador", "Chrome", "Edge", "Firefox", "Safari", "Otro"]
				),
				WhichDevice_Phone: new AdaptiveFormField("Qué dispositivo...Teléfono o tableta", InputType.CHECKBOX, false, "guideContainer-rootPanel-guidecheckbox___1_widget value=2"),
				WhichBrowser_Phone:  new AdaptiveFormField("Qué navegador...Teléfono o tableta",   InputType.DROPDOWN, false,  "guideContainer-rootPanel-panel1676498978500-guidedropdownlist___widget[1]", 
					["Seleccione un navegador", "Chrome", "Edge", "Firefox", "Safari", "Otro"]
				),
				WhichDevice_APP: new AdaptiveFormField("Qué dispositivo...WAPlanfinder mobile app", InputType.CHECKBOX, false, "guideContainer-rootPanel-guideradiobutton_204___1_widget value=0"),
				MobileDevice:  new AdaptiveFormField("¿Dispositivo móvil?",   InputType.DROPDOWN, false,  "guideContainer-rootPanel-panel_1239610443-guidedropdownlist_co___widget", 
					["Select mobile device", "Apple(iOS)", "Android"]
				),

				AttachFile: new AdaptiveFormField("Adjuntar un archivo", InputType.FILE_UPLOAD, false, "guideContainer-rootPanel-guidefileupload_copy___widget"),
			}, 
		]
	});

	//  -| HBE - Contact Us Form |-
	formDataMap.set(FormKeys.HBE_ContactUs, {
		name: "HBE - Contact Us Form",
		url: hbeBaseURL + "/contact-us/contact-us/",
		bddHeader:  "| TestName " +
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

	//  -| HBE - Individual Appeals Form |-
	formDataMap.set(FormKeys.HBE_IndividualAppeals, {
		name: "HBE - Individual Appeals Form",
		url: hbeBaseURL + "/contact-us/appeals/individual-appeal-request-form/",
		bddHeader:  "| TestName " +
					"|  " +
					"| Page_1_Result " + 
					"|" + 
					"| Page_2_Result |",
		pages: [
			{
				FirstName: new AdaptiveFormField("First Name", InputType.INPUT_TEXT,  true,  ""), 
			}, 
			{},
		]
	});

	//  -| HBE - Employer Appeals Form |-
	formDataMap.set(FormKeys.HBE_EmployerAppeals, {
		name: "HBE - Employer Appeals Form",
		url: hbeBaseURL + "/contact-us/appeals/employer-appeal-request-form/",
		bddHeader:  "| TestName " +
					"|  " +
					"| Page_1_Result |",
		pages: [
			{
				FirstName: new AdaptiveFormField("First Name", InputType.INPUT_TEXT,  true,  ""), 
			}, 
		]
	});

	//  -| HBE - Feedback & Complaints Form |-
	formDataMap.set(FormKeys.HBE_FeedbackAndComplaints, {
		name: "HBE - Feedback & Complaints Form",
		url: hbeBaseURL + "/contact-us/feedback-complaints/",
		bddHeader:  "| TestName " +
					"|  " +
					"| Page_1_Result |",
		pages: [
			{
				FirstName: new AdaptiveFormField("First Name", InputType.INPUT_TEXT,  true,  ""), 
			}, 
		]
	});

	//  -| HBE - HBE - Share Your Story Form |-

	// NOTE: User gets option to submit instead of going to the second page if they say "no" to the last question

	formDataMap.set(FormKeys.HBE_ShareYourStory, {
		name: "HBE - Share Your Story Form",
		url: hbeBaseURL + "/contact-us/feedback-complaints/share-your-story/",
		bddHeader:  "| TestName " +
					"|  " +
					"| Page_1_Result " + 
					"|" + 
					"| Page_2_Result |",
		pages: [
			{
				FirstName: new AdaptiveFormField("First Name", InputType.INPUT_TEXT,  true,  ""), 
			}, 
		]
	});

	//  -| HBE - HBE - Provider Directory Feedback Form |-
	formDataMap.set(FormKeys.HBE_DirectoryFeedback, {
		name: "HBE - Provider Directory Feedback Form",
		url: hbeBaseURL + "/contact-us/feedback-complaints/provider-directory-feedback/",
		bddHeader:  "| TestName " +
					"|  " +
					"| Page_1_Result |",
		pages: [
			{
				FirstName: new AdaptiveFormField("First Name", InputType.INPUT_TEXT,  true,  ""), 
			}, 
		]
	});

	//  -| HBE -  |-
	formDataMap.set(FormKeys.HBE_RequestASpeaker, {
		name: "HBE - Request a Speaker Form",
		url: hbeBaseURL + "/contact-us/request-a-speaker/",
		bddHeader:  "| TestName " +
					"|  " +
					"| Page_1_Result " + 
					"|" + 
					"| Page_2_Result " + 
					"|" + 
					"| Page_3_Result |",
		pages: [
			{
				FirstName: new AdaptiveFormField("First Name", InputType.INPUT_TEXT,  true,  ""), 
			}, 
		]
	});

	return formDataMap.get(p_formKey);
	
}

class AdaptiveForm {
	constructor(p_name, p_url, p_bddHeader, p_pages) {
		this.name = p_name; // String - Arbitrary name for form
		this.url = p_url; // String - Full URL of form
		this.bddHeader = p_bddHeader; // String: "| Test Name | <BDD Field Name 1>_Input | <BDD Field Name 1>_Result | <BDD Field Name 2>_Input | ... | Page_1_Result | Page_2_Result | ... | Page_<#>_Result |"
		this.pages = p_pages; // Array of objects. Each object is a list of AdaptiveFormFields indexed by the BDD field name
	}

	TestForm(p_bddExample) {
		// Initialize Test
		testResultString = "";
		let testData = ParseBDDExample(this.bddHeader, p_bddExample);
		NavigateToPage(this.url);

		for (let i = 0; i < this.pages.length; i++) {
			// Fail the test if the submit/next button can't be found
			var flag_lastPage = (i + 1 == this.pages.length);
			var btnClass = (flag_lastPage) ? "submit" : "moveNext";
			WaitForElement(`ds$('#aemFormFrame').contents().find('.${btnClass}')`);
			
			// Press the Next/Submit button to make error messages start appearing
			var btnXPath = `//button[contains(@class, '${btnClass}')]`;
			_click(_byXPath(btnXPath));

			// Fill out form
			var firstField = null;
			for (const [fieldName, fieldObj] of Object.entries(this.pages[i])) {
				if (firstField == null) firstField = fieldObj;

				if(!testData.get(fieldName)) {
					testResultString += `\n| FAILURE: Field not initialized in testData Map \n|`
					+ ` - Field: ${fieldName} \n|`
					EndTest();
				}

				fieldObj.SendData(testData.get(fieldName).input, testData.get(fieldName).result);
			}

			// Verify the results
			var pageResult = testData.get(`Page_${i + 1}_Result`);
			_click(_byXPath(btnXPath));
			// If the current page should not have submitted/progressed
			var flag_expectedToFail = pageResult.toLowerCase().contains("should not");
			var flag_pageFirstInputAccessible = WaitForElement(firstField.jqString_Field, 1000, false);
			if (flag_expectedToFail) {
				_log("Page should not have submitted or progressed");
				if (!flag_pageFirstInputAccessible) {
					testResultString += `\n| FAILURE: Form submitted/progressed when it should not have \n|`
					+ ` - First field of the current page not accessible: ${firstField.toString()} \n|`;
				}
				EndTest();
			}
			else if (flag_lastPage) { 
				// If the page is expected to pass and isn't the last page, make sure the form submitted
				_log("Should have submitted.");
				
				if (flag_pageFirstInputAccessible) {
					testResultString += `\n| FAILURE: Form did not submit after clicking submit button \n|` 
					+ ` - First field of current page was still accesible: ${firstField.toString()}\n|`;
					EndTest();
				}

				var submitWaitTimeS = 10;
				var secondsWaited = 0;
				while (CheckIsInteractable("ds$('#aemFormFrame').contents().find('#loadingPage h1')") && secondsWaited < submitWaitTimeS) {
					secondsWaited += 1;
					wait(1000);
				}
				var flag_formSubmitted = CheckIsInteractable("ds$('#aemFormFrame').contents().find('.tyMessage')");
				if (!flag_formSubmitted) {
					testResultString += `\n| FAILURE: Form did not submit within ${submitWaitTimeMS} \n|`
					+ ` - Thank you message did not load \n|`;
				}
				EndTest();
			}

			// If the page is expected to pass and isn't the last page, make sure the form progressed to the next page
			_log("Should have progressed to the next page");

		}

		EndTest();
	}
}

class AdaptiveFormField {
	constructor(p_name, p_type, p_required, p_id, p_options = []) {
		this.name = p_name;
		this.id = p_id;
		this.type = p_type;
		this.flag_required = p_required;
		this.options = p_options;

		this.jqString_Field = `ds$('#aemFormFrame').contents().find('#${this.id}')`;
		this.jqString_ErrorMsg = `ds$('#aemFormFrame').contents().find('#${this.id}_desc.guideFieldError')`;

	}

	CheckFieldIsInteractable() {
		return CheckIsInteractable(this.jqString_Field);
	}

	SendData(p_input, p_result) {
		//const element = _eval(`ds$('#aemFormFrame').contents().find('#${this.id}')`);
		
		if (p_input != "") switch(this.type) {
			case InputType.INPUT_TEXT:
			case InputType.INPUT_EMAIL:
			case InputType.INPUT_NUMBER:
			case InputType.INPUT_PHONE:
			case InputType.TEXTAREA:
			case InputType.DATE_PICKER:
				_eval(`${this.jqString_Field}.focus().val('${p_input}').blur();`);
				break;
			case InputType.DROPDOWN:
				_setSelected(element, p_input);
				break;
			case InputType.CHECKBOX:
				if (p_input == "" || p_input.toLowerCase() == "unchecked") break;
				_eval(`${this.jqString_Field}.focus().trigger("click").blur()`);
				break;
			case InputType.RADIO_BTNS: 
				if(!Object.keys(this.options).includes(p_input)) break;
				var optionID = this.options[p_input];
				_eval(`ds$('#aemFormFrame').contents().find('#${optionID}').focus().trigger("click").blur()`);
				break;
			case InputType.FILE_UPLOAD:
				_log("File upload not supported");
				break;
			default:
				_log(`${this.type} not yet supported`);
				testResultString + `\n| TODO: Implement ${this.type} fields \n|`;
				break;
		}
		
		var errorMsgText = _eval(`${this.jqString_ErrorMsg}.focus().text();`).trim();
		_log(errorMsgText);
		
		/*
		_log(`\n| - Check Error Message - \n|
				p_result: '${p_result}' \n|
				errorMessage: '${errorMsgText}' \n|`);
		*/
		var flag_expectedNoError = p_result == "" || p_result.toLowerCase().contains("no error")
		if (flag_expectedNoError && !errorMsgText) return;
		
		var errorLogStr = ` - Field: ${this.toString()} \n|`
			+ ` - Input: ${p_input} \n|`
			+ ` - Expected Error Message (${!flag_expectedNoError}): ${p_result} \n|`
			+ ` - Actual Error Message: ${errorMsgText} \n|`;

		if(flag_expectedNoError && errorMsgText) {
			testResultString += `\n| FAILURE: A field expected to have valid input is throwing an error \n|` + errorLogStr;
		}
		else if (!flag_expectedNoError && !errorMsgText){
			testResultString += `\n| FAILURE: A field expected to have invalid input did not throw an error \n|` + errorLogStr;
		}
		else if (p_result != errorMsgText){
			testResultString += `\n| FAILURE: A field expected to have invalid input is not throwing the right error \n|` + errorLogStr;
		}
	}

	toString() {
		let requiredStr = this.flag_required ? "required" : "not required";
		return `${this.name}: ${this.type} | ${requiredStr} | ${this.id}`;
	}
}

function TEST_ParseInputData(p_headerRow, p_bddExample) {
	const headerRow = "| TestName                | FirstName_Input | FirstName_Result | LastName_Input | LastName_Result | Email_Input                   | Email_Result | Phone_Input | Phone_Result | Subject_Input | Subject_Result | Message_Input  |Message_Result | Page_1_Result      |";
	const testData =  "| Smoke Test: Valid Input | Test            | No Error         | Test           | No Error        | FormsTesting@wahbexchange.org | No Error     | 1234567890  | No Error     |               | No Error       | This is a test | No Error      | Form should submit |";

	let output = ParseBDDExample(p_headerRow, p_bddExample);
	let logText = "\n| -| Example Output |-\n|"
	for (entry of output.keys()) {
		logText += `${entry}: ${output.get(entry).input} (${output.get(entry).result})\n|`;
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
	let logStr = "\n| -| Initialize Adaptive Form Data |- \n|\n|" +
				 `Name: ${contactUsFormData.name}\n|` + 
				 `URL: ${contactUsFormData.url}\n|` +
				 `Pages:\n|`;

	let page = contactUsFormData.pages[0];
	let testData = ParseBDDExample(contactUsFormData.bddHeader, p_bddExample);


	_eval(`window.location.href = '${contactUsFormData.url}'`);
	WaitForElement("ds$('#aemFormFrame').contents().find('form')");
	
	_eval(`
		ds$('#aemFormFrame').contents().find('button.submit')[0].click();
	`);

	for (field in page) {
		_log(field)
		logStr += ` - (${field}) ${page[field].toString()}\n|`;
		page[field].SendData(testData.get(field).input, testData.get(field).result);
	}

	_log(logStr);
	
	_click(_byXPath("//button[contains(@class, 'submit')]"));

	_verifyTrue(WaitForElement("ds$('#aemFormFrame').contents().find('#loadingPage h1')"));
	
	
	//_verifyExists(_byXPath("//div[@class='tyMessage']"));

	//TEST_ParseInputData(contactUsFormData.bddHeader, p_bddExample);
*/
	
}

//TEST_InitializeAdaptiveFormData("| Smoke Test: Valid Input | Test | No Error | Test | No Error | FormsTesting@wahbexchange.org | No Error | 1234567890  | No Error |  | No Error | This is a test | No Error | Form should submit |");
//TEST_InitializeAdaptiveFormData("| Smoke Test: No Input |  | First name is required. |  | Last name is required. |  | Email is required. |  | Phone number is required. |  | No Error |  | Message is required. | Form should not submit |");