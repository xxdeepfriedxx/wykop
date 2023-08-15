module.exports = class Database {
	constructor(config) {
		if (!config) { return this; }
		this._appkey = config.appkey;
		this._secret = config.secret;
		this._environment = config.environment;
		this._token = config.token;
		this._rtoken = config.rtoken;
	}

	get extract() {
		return {
			appkey: this._appkey,
			secret: this._secret,
			environment: this._environment,
			token: this._token,
			rtoken: this._rtoken
		};
	}

	get appkey() { return this._appkey; }
	set appkey(appkey) { this._appkey = appkey; }

	get secret() { return this._secret; }
	set secret(secret) { this._secret = secret; }

	get environment() { return this._environment; }
	set environment(environment) { this._environment = environment; }

	get token() { return this._token; }
	set token(token) { this._token = token; }

	get rtoken() { return this._rtoken; }
	set rtoken(rtoken) { this._rtoken = rtoken; }

	clearTokens() { 
		delete this._token;
		delete this._rtoken;
	}

	clearRefreshToken() { 
		delete this._rtoken;
	}

	clearAll() { 
		delete this._appkey;
		delete this._secret;
		delete this._token;
		delete this._rtoken;
	}
};