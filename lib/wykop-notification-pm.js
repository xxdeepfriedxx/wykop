import API from './wykop-api.js';

import Profile from './wykop-profile.js';
import Conversation from './wykop-conversation.js';

export default class PmNotification extends API {
	#core; #errors; #instance
    constructor(core, data) {
        super(core); this.#core = core; this.#errors = core.errors; this.#instance = core.instance;
    	Object.assign(this, data)

		if (this.user) { 
			this.user = new Profile(this.#core, this.user) 
			this.conversation = new Conversation(this.#core, { user: { username: this.user.username }})
		}
    }

	get = function({ id = this.id } = {}) {
		return this.#instance.get('/notifications/pm/' + id);
	}

	markAsRead = function({ id = this.id } = {}) {
		return this.#instance.put('/notifications/pm/' + id);
	}

	remove = function({ id = this.id } = {}) {
		return this.#instance.delete('/notifications/pm/' + id);
	}
}