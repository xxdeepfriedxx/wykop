const API = require('./wykop-api.js');
const assert = require('assert');
const proxymise = require('./proxymise.js');

module.exports = class TagNotification extends API {
	#core; #errors; #instance;
	constructor(core, data, overrideProxy = false) {
		super(core); this.#core = core; this.#errors = core.errors; this.#instance = core.instance;
		Object.assign(this, data);

		if (this.user) { this.user = this.wrapContent('profile', this.user, null, true); }
		if (this.entry) { this.entry = this.wrapContent('entry', this.entry, null, true); }
		if (this.link) { this.link = this.wrapContent('link', this.link, null, true); }
		if (this.tag) { this.tag = this.wrapContent('tag', this.tag, null, true); }

		if (!overrideProxy && core.useProxies) { return proxymise(this); }
		return this;
	}

	get = async function({ id = this.id } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		return this.wrapContent('notification_tag', this.#instance.get('/notifications/tags/' + id));
	};

	markAsRead = async function({ id = this.id } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		return this.wrapContent('none', this.#instance.put('/notifications/tags/' + id));
	};

	remove = async function({ id = this.id } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		return this.wrapContent('none', this.#instance.delete('/notifications/tags/' + id));
	};
};