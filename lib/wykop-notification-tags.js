import API from './wykop-api.js';

import Profile from './wykop-profile.js';
import Entry from './wykop-entry.js';
import Link from './wykop-link.js';
import Tag from './wykop-tag.js';

export default class TagNotification extends API {
	#core; #errors; #instance
    constructor(core, data) {
        super(core); this.#core = core; this.#errors = core.errors; this.#instance = core.instance;
    	Object.assign(this, data)

		if (this.user) { this.user = new Profile(this.#core, this.user) }
		if (this.entry) { this.entry = new Entry(this.#core, this.entry) }
		if (this.link) { this.link = new Link(this.#core, this.link) }
		if (this.tag) { this.tag = new Tag(this.#core, this.tag) }
    }

	get = function({ notificationId } = {}) {
		return this.#instance.get('/notifications/tags/' + notificationId);
	}

	markAsRead = function({ notificationId } = {}) {
		return this.#instance.put('/notifications/tags/' + notificationId);
	}

	remove = function({ notificationId } = {}) {
		return this.#instance.delete('/notifications/tags/' + notificationId);
	}
}