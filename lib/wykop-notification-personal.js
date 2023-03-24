const API = require('./wykop-api.js');
const assert = require('assert');

module.exports = class PersonalNotification extends API {
	#core; #errors; #instance
	constructor(core, data) {
		super(core); this.#core = core; this.#errors = core.errors; this.#instance = core.instance;
		Object.assign(this, data)

		if (this.user) { this.user = this.wrapContent('profile', this.user) }
		if (this.entry) { this.entry = this.wrapContent('entry', this.entry) }
		if (this.link) { this.link = this.wrapContent('link', this.link) }
		if (this.comment) { this.comment = this.wrapContent(this.comment.resource, this.comment) }
	}

	get = async function({ id = this.id } = {}) {
		return await this.#instance.get('/notifications/entries/' + id);
	}

	markAsRead = async function({ id = this.id } = {}) {
		return await this.#instance.put('/notifications/entries/' + id);
	}

	remove = async function({ id = this.id } = {}) {
		return await this.#instance.delete('/notifications/entries/' + id);
	}
}