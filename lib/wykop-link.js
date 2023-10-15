const API = require('./wykop-api.js');
const assert = require('assert');
const proxymise = require('./proxymise.js');

module.exports = class Link extends API {
	#core; #errors; #instance;
	constructor(core, data, overrideProxy = false) {
		super(core); this.#core = core; this.#errors = core.errors; this.#instance = core.instance;
		Object.assign(this, data);

		if (this.comments?.items) { this.comments = this.wrapListing('link_comment', this.comments, null, true); }
		if (this.tags) { this.tags = this.tags.map(tag => this.wrapContent('tag', { name: tag }, null, true)); }
		if (this.author) { this.author = this.wrapContent('profile', this.author, null, true); }
		if (!overrideProxy && core.useProxies) { return proxymise(this); }
		return this;
	}

	get = async function({ id = this.id } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		return this.wrapContent('link', this.#instance.get('/links/' + id));
	};

	getComment = async function(commentId, { id = this.id } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		assert(commentId, this.#errors.assert.notSpecified('commentId'));
		return this.wrapContent('link_comment', this.#instance.get('/links/' + id + '/comments/' + commentId));
	};

	submitComment = async function({ id = this.id, commentId = null, content = null, photo = null, embed = null, adult = false } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		return this.wrapContent('link_comment', this.#instance.post('/links/' + id + '/comments' + (commentId ? '/' + commentId : ''), {
			data: {
				content: content,
				photo: photo,
				embed: embed,
				adult: adult
			}
		}));
	};

	getComments = async function({ id = this.id, commentId = null, page = null, sort = null, ama = null } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		assert(commentId || ['best', 'newest', 'oldest', null].includes(sort), this.#errors.assert.invalidValue('sort', 'best, newest, oldest'));
		if (commentId) {
			return this.wrapListing('link_comment', this.#instance.get('/links/' + id + '/comments/' + commentId + '/comments', {
				params: {
					page: page
				}
			}));
		}
		return this.wrapListing('link_comment', this.#instance.get('/links/' + id + '/comments', {
			params: {
				page: page,
				sort: sort,
				ama: ama
			}
		}));
	};

	getRelatedLinks = async function({ id = this.id } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		return this.wrapListing('link_related', this.#instance.get('/links/' + id + '/related'), id);
	};

	submitRelatedLink = async function({ id = this.id, title = null, url = null, adult = false } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		assert(title, this.#errors.assert.notSpecified('title'));
		assert(url, this.#errors.assert.notSpecified('url'));
		return this.wrapContent('link_related', this.#instance.post('/links/' + id + '/related', {
			data: {
				title: title,
				url: url,
				adult: adult
			}
		}), id);
	};

	// Edit your own link (only works for 15 mins after publications)
	edit = async function({ id = this.id, title = this.title, description = this.description, tags = this.tags, photo = this.media?.photo?.key, adult = this.adult } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		return this.wrapContent('none', this.#instance.put('/links/' + id, {
			data: {
				title: title,
				description: description,
				tags: tags,
				photo: photo,
				adult: adult
			}
		})).then(() => this);
	};

	// Delete your own link (only works for 15 mins after publications)
	remove = async function({ id = this.id } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		return this.wrapContent('none', this.#instance.delete('/links/' + id));
	};

	// Upvote a link
	upvote = async function({ id = this.id } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		return this.wrapContent('none', this.#instance.post('/links/' + id + '/votes/up')).then(() => this);
	};

	get downvoteReason() {
		return {
			duplicate: 1,
			spam: 2,
			fakeNews: 3,
			inappropriate: 4,
			unsuitable: 5
		};
	}

	// Downvote a link
	downvote = async function({ id = this.id, reason = null } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		assert([1,2,3,4,5].includes(reason), this.#errors.assert.invalidValue('reason', '1: duplicate, 2: spam, 3: false info, 4: inappropriate content, 5: generally unsuitable'));
		return this.wrapContent('none', this.#instance.post('/links/' + id + '/votes/down')).then(() => this);
	};

	// Remove upvote or downvote from link
	unvote = async function({ id = this.id } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		return this.wrapContent('none', this.#instance.delete('/links/' + id + '/votes')).then(() => this);
	};

	favorite = async function(id = this.id) {
		assert(id, this.#errors.assert.notSpecified('id'));
		return this._favorite({ linkId: id }).then(() => this);
	};

	unfavorite = async function(id = this.id) {
		assert(id, this.#errors.assert.notSpecified('id'));
		return this._unfavorite({ linkId: id }).then(() => this);
	};

	toggleMuteAMA = async function({ id = this.id } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		return this.wrapContent('none', this.#instance.get('/links/' + id + '/ama/start')).then(() => this);
	};

	finishAMA = async function({ id = this.id, content = null } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		assert(content, this.#errors.assert.notSpecified('content'));
		return this.wrapContent('none', this.#instance.post('/links/' + id + '/ama/finish', {
			data: {
				content: content
			}
		})).then(() => this);
	};

	// Get a list of users who upvoted a link
	getUpvotes = async function({ id = this.id } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		return this.wrapListing('none', this.#instance.get('/links/' + id + '/upvotes/up')).then(res => {
			res.items.map(x => {
				x.user = this.wrapContent('profile', x.user);
			});
			return res;
		});
	};

	// Get a list of users who downvoted a link
	getDownvotes = async function({ id = this.id } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		return this.wrapListing('none', this.#instance.get('/links/' + id + '/upvotes/down')).then(res => {
			res.items.map(x => {
				x.user = this.wrapContent('profile', x.user);
			});
			return res;
		});
	};

	// Get the counters for a link
	getCounters = async function({ id = this.id } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		return this.wrapContent('none', this.#instance.get('/links/' + id + '/counters'));
	};

	// Get the redirect URL for a link
	getRedirectURL = async function({ id = this.id } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		return this.wrapContent('none', this.#instance.get('/links/' + id + '/redirect')).then(res => res.url);
	};
};