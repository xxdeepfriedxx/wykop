const API = require('./wykop-api.js');
const assert = require('assert');

module.exports = class PmNotification extends API {
	#core; #errors; #instance
    constructor(core, data) {
        super(core); this.#core = core; this.#errors = core.errors; this.#instance = core.instance;
    	Object.assign(this, data)

		if (this.user) { 
			this.user = this.wrapContent('profile', this.user)
			this.conversation = this.wrapContent('conversation', { user: { username: this.user.username }})
		}
    }

	get = async function({ id = this.id } = {}) {
		return this.wrapContent('notification_pm', this.#instance.get('/notifications/pm/' + id));
	}

	markAsRead = async function({ id = this.id } = {}) {
		return this.wrapContent('none', this.#instance.put('/notifications/pm/' + id));
	}

	remove = async function({ id = this.id } = {}) {
		return this.wrapContent('none', this.#instance.delete('/notifications/pm/' + id));
	}
}