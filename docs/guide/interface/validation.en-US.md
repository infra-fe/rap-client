# Validation
We provide api validation tools to validate the real interface is matched with the document, it can simples used as postman.

1. As a [back-end developers], the [Interface Verification] function can be used to find out whether the request parameters are correctly, whether the returned results are standardized, and BUG debugging.
2. As a [front-end developers], you can verify whether the back-end real interfaces are implemented in accordance with the the platform document

In the repository edit page, find the `Validation` icon button to use validation

<code src="./component/entrance.tsx" inline=true></code>

## Basic Settings

This tab provide some global settings, such as target server's headers or auth tokens.Generally, an interface repository corresponds to one backend service. This configuration is to improve the reusability of these global configurations.

* Edit【interface service settings】
    1. default settings
    - 【Setting Base Server】as the repository-level scope, it will be automatically filled in according to the last configuration. If this repository has not been set up, the address of the mock service will be automatically filled in according to the interface document data.
    - click【edit】icon
    <code src="./component/server_setting.tsx" inline=true></code>
    1. edit settings
    * 【Domain/IP】Target interface domain or ip address
    * 【Port】Target interface port. The default value will according to the protocol.
    * 【Base Path】It is the common prefix of a url address, for example, `/user/login` full path is `/api/v2/user/login`，then the base path is `/api/v2`
    * 【Protocol Type】HTTP RESTful、websocket（temporarily not supported）、RPC（temporarily not supported）
    * 【Use SSL】If the target interface need to use https or wss, then turn it on
    * 【With Cookie】If the target need to take some cookies, then turn it on（**In non-proxy mode, the target interface is accessed by the browser, please make sure that the target interface and rap are under the same main domain name. The proxy pattern has not been implemented yet.**）

    2. After done all the settings, click the `save` button

    <code src="./component/basic_settings.tsx" inline=true></code>

* Edit【global headers settings】
    1. default settings
    【global headers setting】It is a warehouse-level scope, which will be automatically filled in according to the last configuration. If this warehouse has not been set, it will be empty.Click the `edit` icon, starting to edit
    <code src="./component/global_header_setting.tsx" inline=true></code>

    2. edit settings
    Click【+】to add one header，please ensure the【name】is not empty, otherwise it will be deleted when blur, click the `save` icon to confirm the settings
    <code src="./component/edit_global_header.tsx" inline=true></code>

## Target Result
【Target Result】It is to facilitate the comparison with the interface response results, such as: whether there is an undefined field, whether the field is indeed required, whether the field type is correct, whether the field value is the specified literal value, etc. Of course, the system has automatically generated default values and default validation rules according to the definition of the interface document. Users can edit and correct based on the default values.
1. Default Settings
    【Target Result】is the interface-level scope, it will be filled in automatically according to the last configuration. If it has not been set, the default value will be generated according to the interface document definition and filled in. Click the `edit` icon to start edit
    <code src="./component/target_result.tsx" inline=true></code>
2. Edit Settings
    Modify in the JSON editor area, if the field does not match its definition, a corresponding error will be prompted. <br>
     If there is an error message in JSON editing, it cannot be saved. If the tab is switched at this time, the editing content will be discarded. <br>
    <code src="./component/edit_target_result.tsx" inline=true></code>

## Send Request

* [Interface Request], configure the required business parameters and invocation methods (if necessary), and click the [send] button to request the target interface.
* If the invocation of the target interface fails, there will be a corresponding prompt. Please verify whether the interface service configuration and global header information are configured correctly.
* If the target interface is successfully called, the corresponding result will be displayed in the JSON editor area, and field verification will be performed according to the interface definition (for example, whether there are redundant fields, whether required fields are missing, whether the field type is correct, etc.).
(**Currently interface calls are based on browser capabilities, so cross-domain, cookie and other security issues cannot be bypassed. Of course, users can use familiar client-side proxy software for settings, or configure the response header of the target interface to allow cross-domain, cookie, etc. security issues. Domain. A simple server-side proxy function will be provided in the future.**)

1. Edit request params
   * The system will display the corresponding modules and generate default values according to the request parameters (Headers parameter, Query parameter, Body parameter) in the interface definition.
   * Modify the content of request parameters (add or delete fields, modify field types and values, etc.) as needed.
    <code src="./component/query.tsx" inline=true></code>

2. Send Request
    * Configure the request method
     The system will initialize the interface address information and body encoding method according to the interface document. Generally, it is not recommended to modify it to prevent inconsistency with the definition of the interface document. If you want to test the real implementation of the interface, you can try it by modifying it.
    * Click the [Send] button to request the target interface.
    <code src="./component/post_request.tsx" inline=true></code>

    1. Send Request
     If the interface request fails (service address configuration error, service 4xx or 5xx), an error message will be displayed.
     The prompt information will be automatically closed after 6 seconds of display. If the mouse stays on the prompt information, it will not be closed automatically.
    <code src="./component/post_request_failed.tsx" inline=true></code>

3. Validate the target result
* If the target interface request is successful, the response result will be displayed in the JSON editing area, and it will be checked against the [response content] rules defined by the interface. If the verification fails, a corresponding prompt will be given.
The test result prompt is divided into two levels. If there are fields that are not defined in the interface document (multiple fields), it is at the WARNING level; otherwise (missing required fields, wrong field types, etc.), it is at the ERROR level.
* success
    <code src="./component/result_validate_success.tsx" inline=true></code>
   * failed
    <code src="./component/result_validate_fail.tsx" inline=true></code>