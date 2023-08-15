const API = require('./wykop-api.js');
const assert = require('assert');

module.exports = class LinkComment extends API {
	#core; #errors; #instance
	constructor(core, data) {
		super(core); this.#core = core; this.#errors = core.errors; this.#instance = core.instance;
		Object.assign(this, data)

		if (this.author) { this.author = this.wrapContent('profile', this.author) }
		if (this.comments?.items) { this.comments.items = this.wrapListing('link_comment', this.comments.items) }
        if (this.tags) { this.tags = this.tags.map(tag => this.wrapContent('tag', { name: tag })) }
		if (this.parent) { this.parent = this.wrapContent('link', this.parent) }
	}

	get = async function({ id = this.id, linkId = this.parent?.id } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		assert(linkId, this.#errors.assert.notSpecified('linkId'));
		return this.wrapContent('link_comment', this.#instance.get('/links/' + linkId + '/comments/' + id));
	}

	getComments = async function({ id = this.id, linkId = this.parent?.id, page = null } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		assert(linkId, this.#errors.assert.notSpecified('linkId'));
		return this.wrapListing('link_comment', this.#instance.get('/links/' + linkId + '/comments/' + id + '/comments', {
			params: {
				page: page
			}
		}));
	}

	submitComment = async function({ id = this.id, linkId = this.parent?.id, content = this.content, photo = this.media?.photo?.key, embed = this.media?.embed?.key, adult = this.adult ?? false } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		assert(linkId, this.#errors.assert.notSpecified('linkId'));
		return this.wrapContent('link_comment', this.#instance.post('/links/' + linkId + '/comments/' + id, {
			data: {
				content: content,
				photo: photo,
				embed: embed,
				adult: adult
			}
		}));
	}

	edit = async function({ id = this.id, linkId = this.parent?.id, content = this.content, photo = this.media?.photo?.key, embed = this.media?.embed?.key, adult = this.adult ?? false } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		assert(linkId, this.#errors.assert.notSpecified('linkId'));
		return this.wrapContent('link_comment', this.#instance.put('/links/' + linkId + '/comments/' + id));
	}

	remove = async function({ id = this.id, linkId = this.parent?.id } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		assert(linkId, this.#errors.assert.notSpecified('linkId'));
		return this.wrapContent('none', this.#instance.delete('/links/' + linkId + '/comments/' + id));
	}

	upvote = async function({ id = this.id, linkId = this.parent?.id } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		assert(linkId, this.#errors.assert.notSpecified('linkId'));
		return this.wrapContent('none', this.#instance.post('/links/' + linkId + '/comments/' + id + '/votes/up')).then(_ => this);
	}

	downvote = async function({ id = this.id, linkId = this.parent?.id } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		assert(linkId, this.#errors.assert.notSpecified('linkId'));
		return this.wrapContent('none', this.#instance.post('/links/' + linkId + '/comments/' + id + '/votes/down')).then(_ => this);
	}

	unvote = async function({ id = this.id, linkId = this.parent?.id } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		assert(linkId, this.#errors.assert.notSpecified('linkId'));
		return this.wrapContent('none', this.#instance.delete('/links/' + linkId + '/comments/' + id + '/votes')).then(_ => this);
	}

	favorite = async function(id = this.id) {
		assert(id, this.#errors.assert.notSpecified('id'));
		return this._favorite({ linkCommentId: id }).then(_ => this);
	}

	unfavorite = async function(id = this.id) {
		assert(id, this.#errors.assert.notSpecified('id'));
		return this._unfavorite({ linkCommentId: id }).then(_ => this);
	}
}