const API = require('./wykop-api.js');
const assert = require('assert');
const proxymise = require('./proxymise.js');

module.exports = class LinkComment extends API {
	#core; #errors; #instance;
	constructor(core, data, overrideProxy = false) {
		super(core); this.#core = core; this.#errors = core.errors; this.#instance = core.instance;
		Object.assign(this, data);

		if (this.author) { this.author = this.wrapContent('profile', this.author, null, true); }
		if (this.comments?.items) { this.comments = this.wrapListing('link_comment', this.comments, null, true); }
		if (this.tags) { 
			this.tags = this.tags.map(tag => { return { name: tag }; } );
			this.tags = this.wrapListing('tag', { items: this.tags }, null, true); 
		}
		if (this.parent) { this.parent = this.wrapContent('link', this.parent, null, true); }

		if (!overrideProxy && core.useProxies) { return proxymise(this); }
		return this;
	}

	get = async function({ id = this.id, linkId = this.parent?.id } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		assert(linkId, this.#errors.assert.notSpecified('linkId'));
		return this.wrapContent('link_comment', this.#instance.get('/links/' + linkId + '/comments/' + id));
	};

	getComments = async function({ id = this.id, linkId = this.parent?.id, page = null } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		assert(linkId, this.#errors.assert.notSpecified('linkId'));
		return this.wrapListing('link_comment', this.#instance.get('/links/' + linkId + '/comments/' + id + '/comments', {
			params: {
				page: page
			}
		}));
	};

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
	};

	edit = async function({ id = this.id, linkId = this.parent?.id, content = this.content, photo = this.media?.photo?.key, embed = this.media?.embed?.key, adult = this.adult ?? false } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		assert(linkId, this.#errors.assert.notSpecified('linkId'));
		return this.wrapContent('link_comment', this.#instance.put('/links/' + linkId + '/comments/' + id, {
			data: {
				content: content,
				photo: photo,
				embed: embed,
				adult: adult
			}
		}));
	};

	remove = async function({ id = this.id, linkId = this.parent?.id } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		assert(linkId, this.#errors.assert.notSpecified('linkId'));
		return this.wrapContent('none', this.#instance.delete('/links/' + linkId + '/comments/' + id));
	};

	upvote = async function({ id = this.id, linkId = this.parent?.id } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		assert(linkId, this.#errors.assert.notSpecified('linkId'));
		return this.wrapContent('none', this.#instance.post('/links/' + linkId + '/comments/' + id + '/votes/up')).then(() => this);
	};

	downvote = async function({ id = this.id, linkId = this.parent?.id } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		assert(linkId, this.#errors.assert.notSpecified('linkId'));
		return this.wrapContent('none', this.#instance.post('/links/' + linkId + '/comments/' + id + '/votes/down')).then(() => this);
	};

	unvote = async function({ id = this.id, linkId = this.parent?.id } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		assert(linkId, this.#errors.assert.notSpecified('linkId'));
		return this.wrapContent('none', this.#instance.delete('/links/' + linkId + '/comments/' + id + '/votes')).then(() => this);
	};

	observe = async function({ id = this.id, linkId = this.parent?.id } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		return this.wrapContent('none', this.#instance.post('/links/' + linkId + '/comments/' + id + '/observed-discussions')).then(() => this);
	};

	unobserve = async function({ id = this.id, linkId = this.parent?.id } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		return this.wrapContent('none', this.#instance.delete('/links/' + linkId + '/comments/' + id + '/observed-discussions')).then(() => this);
	};

	favorite = async function(id = this.id) {
		assert(id, this.#errors.assert.notSpecified('id'));
		return this._favorite({ linkCommentId: id }).then(() => this);
	};

	unfavorite = async function(id = this.id) {
		assert(id, this.#errors.assert.notSpecified('id'));
		return this._unfavorite({ linkCommentId: id }).then(() => this);
	};
};