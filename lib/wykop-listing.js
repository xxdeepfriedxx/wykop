const API = require('./wykop-api.js');
const proxymise = require('./proxymise.js');

module.exports = class Listing extends API {
	#core; #errors; #instance; #config;
	constructor(core, data, overrideProxy = false, config) {
		super(core); this.#core = core; this.#errors = core.errors; this.#instance = core.instance;
		Object.assign(this, data);

		this.#config = config;
		if (this.#config && this.#config._retry) { delete this.#config._retry; }
		if (this.pagination) { this.pagination = this.wrapContent('pagination', this.pagination, this.#config); }

		if (!overrideProxy && core.useProxies) { return proxymise(this); }
		return this;
	}

	stream = this._stream(this);
};