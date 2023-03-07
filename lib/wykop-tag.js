import API from './wykop-api.js';
import assert from 'assert';

import Profile from './wykop-profile.js';

export default class Tag extends API {
	#core; #errors; #instance
	constructor(core, data) {
		super(core); this.#core = core; this.#errors = core.errors; this.#instance = core.instance;
		Object.assign(this, data);

		if (this.author) { this.author = new Profile(this.#core, this.author) }
	}

	get = function({ tag = this.name } = {}) {
		assert(tag, this.#errors.assert.notSpecified('tag'));
		return this.wrapContent('tag', this.#instance.get('/tags/' + tag));
	}

	getContent = function({ tag = this.name, page = null, sort = null, type = null, year = null, month = null } = {}) {
		assert(['all', 'best', null].includes(sort), this.#errors.assert.invalidValue('sort', 'all, best'))
		assert(['all', 'author', 'link', 'entry', null].includes(type), this.#errors.assert.invalidValue('type', 'all, author, link, entry'))
		assert(tag, this.#errors.assert.notSpecified('tag'));
		return this.wrapListingMixed(this.#instance.get('/tags/' + tag + '/stream', {
			params: {
				page: page,
				sort: sort,
				type: type,
				year: year,
				month: month
			}
		}));
	}

	getNewerContent = function({ tag = this.name, sort = null, type = null, date = null, lastId = null } = {}) {
		assert(tag, this.#errors.assert.notSpecified('tag'));
		assert(['all', 'best', null].includes(sort), this.#errors.assert.invalidValue('sort', 'all, best'))
		assert(['all', 'author', 'link', 'entry', null].includes(type), this.#errors.assert.invalidValue('type', 'all, author, link, entry'))
		assert(date, this.#errors.assert.notSpecified('date (yyyy-MM-dd HH:mm:ss)'));
		assert(lastId, this.#errors.assert.notSpecified('lastId'));
		return this.wrapListingMixed(this.#instance.get('/tags/' + tag + '/newer', {
			params: {
				sort: sort,
				type: type,
				date: date,
				id: id
			}
		}));
	}

	getRelatedTags = function({ tag = this.name } = {}) {
		assert(tag, this.#errors.assert.notSpecified('tag'));
		return this.wrapListing('tag', this.#instance.get('/tags/' + tag + '/related'));
	}

	getAuthors = function({ tag = this.name } = {}) {
		assert(tag, this.#errors.assert.notSpecified('tag'));
		return this.wrapListing('profile', this.#instance.get('/tags/' + tag + '/users'));
	}

	addAuthor = function({ tag = this.name, username = null } = {}) {
		assert(tag, this.#errors.assert.notSpecified('tag'));
		assert(username, this.#errors.assert.notSpecified('username'));
		return this.#instance.post('/tags/' + tag + '/users/' + username).then(_ => { return this });
	}

	removeAuthor = function({ tag = this.name, username = null } = {}) {
		assert(tag, this.#errors.assert.notSpecified('tag'));
		assert(username, this.#errors.assert.notSpecified('username'));
		return this.#instance.delete('/tags/' + tag + '/users/' + username).then(_ => { return this });
	}

	edit = function({ tag = this.name, photo = null, description = null } = {}) {
		assert(tag, this.#errors.assert.notSpecified('tag'));
		return this.#instance.get('/tags/' + tag, {
			params: {
				photo: photo,
				description: description,
			}
		}).then(_ => { 
			this.media.photo.key = photo
			this.description = description
			return this
		});
	}

	observe = function({ tag = this.name } = {}) {
		assert(tag, this.#errors.assert.notSpecified('tag'));
		return this.#instance.post('/observed/tags/' + tag).then(_ => { return this });
	}

	unobserve = function({ tag = this.name } = {}) {
		assert(tag, this.#errors.assert.notSpecified('tag'));
		return this.#instance.delete('/observed/tags/' + tag).then(_ => { return this });
	}

	notify = function({ tag = this.name } = {}) {
		assert(tag, this.#errors.assert.notSpecified('tag'));
		return this.#instance.put('/observed/tags/' + tag + '/notifications').then(_ => { return this });
	}

	mute = function({ tag = this.name } = {}) {
		assert(tag, this.#errors.assert.notSpecified('tag'));
		return this.#instance.delete('/observed/tags/' + tag + '/notifications').then(_ => { return this });
	}

}