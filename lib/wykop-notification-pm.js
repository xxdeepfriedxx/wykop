const API = require('./wykop-api.js');
const assert = require('assert');
const proxymise = require('./proxymise.js');

module.exports = class PmNotification extends API {
	#core; #errors; #instance;
	constructor(core, data, overrideProxy = false) {
		super(core); this.#core = core; this.#errors = core.errors; this.#instance = core.instance;
		Object.assign(this, data);

		if (this.user) { 
			this.user = this.wrapContent('profile', this.user, null, true);
			this.conversation = this.wrapContent('conversation', { user: { username: this.user.username }}, null, true);
		}

		if (!overrideProxy && core.useProxies) { return proxymise(this); }
		return this;
	}

	get = async function({ id = this.id } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		return this.wrapContent('notification_pm', this.#instance.get('/notifications/pm/' + id));
	};

	markAsRead = async function({ id = this.id } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		return this.wrapContent('none', this.#instance.put('/notifications/pm/' + id));
	};

	remove = async function({ id = this.id } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		return this.wrapContent('none', this.#instance.delete('/notifications/pm/' + id));
	};
};