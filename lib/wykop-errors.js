module.exports = class Error { 
	constructor() {}

	assert = {
		notSpecified: function(variable) { return `[WykopJS] '${variable}' is null or undefined. You need to specify a value for: '${variable}'`; },
		invalidValue: function(variable, values) { return `[WykopJS] '${variable}' has an invalid value, the available values for '${variable}' are: ${values}`; },
		invalidType: function(variable, type) { return `[WykopJS] '${variable}' should be of type: ${type}`; },
		noCredentials: function() { return '[WykopJS] Missing credentials. You must specify either (a) clientId, clientSecret, (b) rtoken, or (c) token'; },
	};

	request = {
		error: function(error) {
			let errorMessage = JSON.stringify(error.message ?? error.generatedMessage);
			if (error.response !== null && error.response !== undefined) { 
				if (error.response.data) { errorMessage = JSON.stringify(error.response.data); }
				return `[WykopJS] API Error for:\n---Request URL: [${error.response.config.method.toUpperCase()}] ${error.response.config.baseURL + error.response.config.url}\n---Request Params: ${JSON.stringify(error.response.config.params)}\n---Request Data: ${error.response.config.data}\n---Response: [${error.response.status}] ${errorMessage}`;
			}

			return errorMessage;
		},
		info: function(response) {
			return `[WykopJS] API Request for:\n---Request URL: [${response.config.method}] ${response.config.baseURL + response.config.url}\n---Request Params: ${JSON.stringify(response.config.params)}\n---Request Data: ${response.config.data}\n---Response: ${JSON.stringify(response.data).substring(0,2000)}`;
		}
	};
};