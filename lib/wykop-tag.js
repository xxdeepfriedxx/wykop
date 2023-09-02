const API = require('./wykop-api.js');
const assert = require('assert');

module.exports = class Tag extends API {
	#core; #errors; #instance;
	constructor(core, data) {
		super(core); this.#core = core; this.#errors = core.errors; this.#instance = core.instance;
		if (typeof data.blacklist === 'boolean') {
			data.blacklisted = data.blacklist;
			delete data.blacklist;
		}
		Object.assign(this, data);
		
		if (this.author) { this.author = this.wrapContent('profile', this.author); }
	}

	get = async function({ tag = this.name } = {}) {
		assert(tag, this.#errors.assert.notSpecified('tag'));
		return this.wrapContent('tag', this.#instance.get('/tags/' + tag));
	};

	getContent = async function({ tag = this.name, page = null, sort = null, type = null, year = null, month = null } = {}) {
		assert(['all', 'best', null].includes(sort), this.#errors.assert.invalidValue('sort', 'all, best'));
		assert(['all', 'author', 'link', 'entry', null].includes(type), this.#errors.assert.invalidValue('type', 'all, author, link, entry'));
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
	};

	getNewerContentCount = async function({ tag = this.name, sort = null, type = null, date = null, lastId = null } = {}) {
		assert(tag, this.#errors.assert.notSpecified('tag'));
		assert(['all', 'best', null].includes(sort), this.#errors.assert.invalidValue('sort', 'all, best'));
		assert(['all', 'author', 'link', 'entry', null].includes(type), this.#errors.assert.invalidValue('type', 'all, author, link, entry'));
		return this.wrapContent('none', this.#instance.get('/tags/' + tag + '/newer', {
			params: {
				sort: sort,
				type: type,
				date: date,
				id: lastId
			}
		})).then(res => res.count);
	};

	getRelatedTags = async function({ tag = this.name } = {}) {
		assert(tag, this.#errors.assert.notSpecified('tag'));
		return this.wrapListing('tag', this.#instance.get('/tags/' + tag + '/related'));
	};

	getCoauthors = async function({ tag = this.name } = {}) {
		assert(tag, this.#errors.assert.notSpecified('tag'));
		return this.wrapListing('profile', this.#instance.get('/tags/' + tag + '/users'));
	};

	addCoauthor = async function({ tag = this.name, username = null } = {}) {
		assert(tag, this.#errors.assert.notSpecified('tag'));
		assert(username, this.#errors.assert.notSpecified('username'));
		return this.wrapContent('none', this.#instance.post('/tags/' + tag + '/users/' + username)).then(() => this);
	};

	removeCoauthor = async function({ tag = this.name, username = null } = {}) {
		assert(tag, this.#errors.assert.notSpecified('tag'));
		assert(username, this.#errors.assert.notSpecified('username'));
		return this.wrapContent('none', this.#instance.delete('/tags/' + tag + '/users/' + username)).then(() => this);
	};

	edit = async function({ tag = this.name, photo = null, description = null } = {}) {
		assert(tag, this.#errors.assert.notSpecified('tag'));
		return this.wrapContent('none', this.#instance.get('/tags/' + tag, {
			params: {
				photo: photo,
				description: description,
			}
		})).then(() => this);
	};

	observe = async function({ tag = this.name } = {}) {
		assert(tag, this.#errors.assert.notSpecified('tag'));
		return this.wrapContent('none', this.#instance.post('/observed/tags/' + tag)).then(() => this);
	};

	unobserve = async function({ tag = this.name } = {}) {
		assert(tag, this.#errors.assert.notSpecified('tag'));
		return this.wrapContent('none', this.#instance.delete('/observed/tags/' + tag)).then(() => this);
	};

	notify = async function({ tag = this.name } = {}) {
		assert(tag, this.#errors.assert.notSpecified('tag'));
		return this.wrapContent('none', this.#instance.put('/observed/tags/' + tag + '/notifications')).then(() => this);
	};

	mute = async function({ tag = this.name } = {}) {
		assert(tag, this.#errors.assert.notSpecified('tag'));
		return this.wrapContent('none', this.#instance.delete('/observed/tags/' + tag + '/notifications')).then(() => this);
	};

	blacklist = async function({ tag = this.name } = {}) {
		assert(tag, this.#errors.assert.notSpecified('tag'));
		return this.wrapContent('none', this.#instance.post('/settings/blacklists/tags', {
			data: {
				tag: tag
			}
		})).then(() => this);
	};

	unblacklist = async function({ tag = this.name } = {}) {
		assert(tag, this.#errors.assert.notSpecified('tag'));
		return this.wrapContent('none', this.#instance.delete('/settings/blacklists/tags/' + tag)).then(() => this);
	};
};