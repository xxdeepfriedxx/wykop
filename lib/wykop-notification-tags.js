const API = require('./wykop-api.js');
const assert = require('assert');

module.exports = class TagNotification extends API {
	#core; #errors; #instance
    constructor(core, data) {
        super(core); this.#core = core; this.#errors = core.errors; this.#instance = core.instance;
    	Object.assign(this, data)

		if (this.user) { this.user = this.wrapContent('profile', this.user) }
		if (this.entry) { this.entry = this.wrapContent('entry', this.entry) }
		if (this.link) { this.link = this.wrapContent('link', this.link) }
		if (this.tag) { this.tag = this.wrapContent('tag', this.tag) }
    }

	get = async function({ id = this.id } = {}) {
		return this.wrapContent('notification_tag', this.#instance.get('/notifications/tags/' + notificationId));
	}

	markAsRead = async function({ id = this.id } = {}) {
		return this.wrapContent('none', this.#instance.put('/notifications/tags/' + notificationId));
	}

	remove = async function({ id = this.id } = {}) {
		return this.wrapContent('none', this.#instance.delete('/notifications/tags/' + notificationId));
	}
}