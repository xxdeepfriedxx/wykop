const API = require('./wykop-api.js');
const assert = require('assert');

module.exports = class Badge extends API {
	#core; #errors; #instance;
	constructor(core, data) {
		super(core); this.#core = core; this.#errors = core.errors; this.#instance = core.instance;
		Object.assign(this, data);
	}

	get = async function({ slug = this.slug } = {}) {
		assert(slug, this.#errors.assert.notSpecified('slug'));
		return this.wrapContent('badge', this.#instance.get('/badges/' + slug));
	};

	users = async function({ slug = this.slug } = {}) {
		assert(slug, this.#errors.assert.notSpecified('slug'));
		return this.wrapListing('profile', this.#instance.get('/badges/' + slug + '/users'));
	};
};