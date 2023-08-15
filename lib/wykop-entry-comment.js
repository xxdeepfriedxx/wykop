const API = require('./wykop-api.js');
const assert = require('assert');

module.exports = class EntryComment extends API {
	#core; #errors; #instance;
	constructor(core, data) {
		super(core); this.#core = core; this.#errors = core.errors; this.#instance = core.instance;
		Object.assign(this, data);

		if (this.author) { this.author = this.wrapContent('profile', this.author); }
		if (this.votes?.users) { this.votes.users = this.wrapListing('profile', this.votes.users); }
		if (this.tags) { this.tags = this.tags.map(tag => this.wrapContent('tag', { name: tag })); }
		if (this.parent) { this.parent = this.wrapContent('entry', this.parent); }
	}

	get = async function({ entryId = this.parent?.id, id = this.id } = {}) {
		assert(entryId, this.#errors.assert.notSpecified('entryId'));
		assert(id, this.#errors.assert.notSpecified('id'));
		return this.wrapContent('entry_comment', this.#instance.get('/entries/' + entryId + '/comments/' + id));
	};

	edit = async function({ entryId = this.parent?.id, id = this.id, content = this.content, photo = this.media?.photo?.key, embed = this.media?.embed?.key, adult = this.adult } = {}) {
		assert(entryId, this.#errors.assert.notSpecified('entryId'));
		assert(id, this.#errors.assert.notSpecified('id'));
		return this.wrapContent('entry_comment', this.#instance.put('/entries/' + entryId + '/comments/' + id, {
			data: {
				content: content,
				photo: photo,
				embed: embed,
				adult: adult
			}
		}));
	};

	remove = async function({ entryId = this.parent?.id, id = this.id }  = {}) {
		assert(entryId, this.#errors.assert.notSpecified('entryId'));
		assert(id, this.#errors.assert.notSpecified('id'));
		return this.wrapContent('none', this.#instance.delete('/entries/' + entryId + '/comments/' + id));
	};

	getUpvoters = async function({ entryId = this.parent?.id, id = this.id }  = {}) {
		assert(entryId, this.#errors.assert.notSpecified('entryId'));
		assert(id, this.#errors.assert.notSpecified('id'));
		return this.wrapListing('profile', this.#instance.get('/entries/' + entryId + '/comments/' + id + '/votes'));
	};

	upvote = async function({ entryId = this.parent?.id, id = this.id }  = {}) {
		assert(entryId, this.#errors.assert.notSpecified('entryId'));
		assert(id, this.#errors.assert.notSpecified('id'));
		return this.wrapContent('none', this.#instance.post('/entries/' + entryId + '/comments/' + id + '/votes')).then(() => this);
	};

	unvote = async function({ entryId = this.parent?.id, id = this.id }  = {}) {
		assert(entryId, this.#errors.assert.notSpecified('entryId'));
		assert(id, this.#errors.assert.notSpecified('id'));
		return this.wrapContent('none', this.#instance.delete('/entries/' + entryId + '/comments/' + id + '/votes')).then(() => this);
	};

	favorite = async function(id = this.id) {
		assert(id, this.#errors.assert.notSpecified('id'));
		return this._favorite({ entryCommentId: id }).then(() => this);
	};

	unfavorite = async function(id = this.id) {
		assert(id, this.#errors.assert.notSpecified('id'));
		return this._unfavorite({ entryCommentId: id }).then(() => this);
	};
};