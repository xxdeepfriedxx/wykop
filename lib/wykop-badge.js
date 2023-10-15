const API = require('./wykop-api.js');
const assert = require('assert');
const proxymise = require('./proxymise.js');

module.exports = class Badge extends API {
	#core; #errors; #instance;
	constructor(core, data, overrideProxy = false) {
		super(core); this.#core = core; this.#errors = core.errors; this.#instance = core.instance;
		Object.assign(this, data);

		if (!overrideProxy && core.useProxies) { return proxymise(this); }
		return this;
	}

	get = async function({ slug = this.slug } = {}) {
		assert(slug, this.#errors.assert.notSpecified('slug'));
		return this.wrapContent('badge', this.#instance.get('/badges/' + slug));
	};

	getUsers = async function({ slug = this.slug } = {}) {
		assert(slug, this.#errors.assert.notSpecified('slug'));
		return this.wrapListing('profile', this.#instance.get('/badges/' + slug + '/users'));
	};
};