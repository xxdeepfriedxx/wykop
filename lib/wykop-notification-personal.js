const API = require('./wykop-api.js');
const assert = require('assert');
const proxymise = require('./proxymise.js');

module.exports = class PersonalNotification extends API {
	#core; #errors; #instance;
	constructor(core, data, overrideProxy = false) {
		super(core); this.#core = core; this.#errors = core.errors; this.#instance = core.instance;
		Object.assign(this, data);

		if (this.user) { this.user = this.wrapContent('profile', this.user, null, true); }
		if (this.entry) { this.entry = this.wrapContent('entry', this.entry, null, true); }
		if (this.link) { this.link = this.wrapContent('link', this.link, null, true); }
		if (this.comment) { this.comment = this.wrapContent(this.comment.resource, this.comment, null, true); }

		if (!overrideProxy && core.useProxies) { return proxymise(this); }
		return this;
	}

	get = async function({ id = this.id } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		return this.wrapContent('notification_personal', this.#instance.get('/notifications/entries/' + id));
	};

	markAsRead = async function({ id = this.id } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		return this.wrapContent('none', this.#instance.put('/notifications/entries/' + id));
	};

	remove = async function({ id = this.id } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		return this.wrapContent('none', this.#instance.delete('/notifications/entries/' + id));
	};
};