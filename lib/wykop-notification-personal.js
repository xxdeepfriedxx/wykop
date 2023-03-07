import API from './wykop-api.js';

import Profile from './wykop-profile.js';
import Entry from './wykop-entry.js';
import Link from './wykop-link.js';
import EntryComment from './wykop-entry-comment.js';
import LinkComment from './wykop-link-comment.js';

export default class PersonalNotification extends API {
	#core; #errors; #instance
	constructor(core, data) {
		super(core); this.#core = core; this.#errors = core.errors; this.#instance = core.instance;
		Object.assign(this, data)

		if (this.user) { this.user = new Profile(this.#core, this.user) }
		if (this.entry) { this.entry = new Entry(this.#core, this.entry) }
		if (this.link) { this.link = new Link(this.#core, this.link) }
		if (this.comment) { 
			if (this.comment.resource === 'link_comment') {
				this.comment = new LinkComment(this.#core, this.comment) 
			} else if (this.comment.resource === 'entry_comment') {
				this.comment = new EntryComment(this.#core, this.comment) 
			}
		}
	}

	get = function({ id = this.id } = {}) {
		return this.#instance.get('/notifications/entries/' + id);
	}

	markAsRead = function({ id = this.id } = {}) {
		return this.#instance.put('/notifications/entries/' + id);
	}

	remove = function({ id = this.id } = {}) {
		return this.#instance.delete('/notifications/entries/' + id);
	}
}