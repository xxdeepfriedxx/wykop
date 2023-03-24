const API = require('./wykop-api.js');
const assert = require('assert');

module.exports = class PmNotification extends API {
	#core; #errors; #instance
    constructor(core, data) {
        super(core); this.#core = core; this.#errors = core.errors; this.#instance = core.instance;
    	Object.assign(this, data)

		if (this.user) { 
			this.user = this.wrapContent('profile', this.user)
			this.conversation = this.wrapContent('conversation', this.conversation)
		}
    }

	get = async function({ id = this.id } = {}) {
		return await this.#instance.get('/notifications/pm/' + id);
	}

	markAsRead = async function({ id = this.id } = {}) {
		return await this.#instance.put('/notifications/pm/' + id);
	}

	remove = async function({ id = this.id } = {}) {
		return await this.#instance.delete('/notifications/pm/' + id);
	}
}