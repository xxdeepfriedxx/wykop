const API = require('./wykop-api.js');
const assert = require('assert');
const proxymise = require('./proxymise.js');

module.exports = class Entry extends API {
	#core; #errors; #instance;
	constructor(core, data, overrideProxy = false) {
		super(core); this.#core = core; this.#errors = core.errors; this.#instance = core.instance;
		Object.assign(this, data);
		
		if (this.comments?.items) { this.comments = this.wrapListing('entry_comment', this.comments, null, true); }
		if (this.votes?.users) {
			this.votes.items = this.votes.users;
			delete this.votes.users;
			this.votes = this.wrapListing('profile', this.votes, null, true); 
		}
		if (this.tags) { 
			this.tags = this.tags.map(tag => { return { name: tag }; } );
			this.tags = this.wrapListing('tag', { items: this.tags }, null, true); 
		}
		if (this.author) { this.author = this.wrapContent('profile', this.author, null, true); }

		if (!overrideProxy && core.useProxies) { return proxymise(this); }
		return this;
	}

	get = async function({ id = this.id } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		return this.wrapContent('entry', this.#instance.get('/entries/' + id));
	};

	getComment = async function(commentId, { id = this.id } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		assert(commentId, this.#errors.assert.notSpecified('commentId'));
		return this.wrapContent('entry_comment', this.#instance.get('/entries/' + id + '/comments/' + commentId));
	};

	getComments = async function({ id = this.id, page = null } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		return this.wrapListing('entry_comment', this.#instance.get('/entries/' + id + '/comments', {
			params: {
				page: page
			}
		}));
	};

	getNewerCommentsCount = async function({ id = this.id, date = null } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		assert(date, this.#errors.assert.notSpecified('date'));
		return this.wrapContent('none', this.#instance.get('/entries/' + id + '/comments/newer', {
			params: {
				date: date
			}
		})).then(res => res.count);
	};

	submitComment = async function({ id = this.id, content = null, photo = null, embed = null, adult = false } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		return this.wrapContent('entry_comment', this.#instance.post('/entries/' + id + '/comments', {
			data: {
				content: content,
				photo: photo,
				embed: embed,
				adult: adult
			}
		}));
	};

	edit = async function({ id = this.id, content = this.content, photo = this.media?.photo?.key, embed = this.media?.embed?.key, survey = this.media?.survey?.key, adult = this.adult } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		return this.wrapContent('entry', this.#instance.put('/entries/' + id, {
			data: {
				content: content,
				photo: photo,
				embed: embed,
				survey: survey,
				adult: adult
			}
		}));
	};

	remove = async function({ id = this.id } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		return this.wrapContent('none', this.#instance.delete('/entries/' + id));
	};

	getUpvoters = async function({ id = this.id } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		return this.wrapListing('profile', this.#instance.get('/entries/' + id + '/votes'));
	};

	upvote = async function({ id = this.id } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		return this.wrapContent('none', this.#instance.post('/entries/' + id + '/votes')).then(() => this);
	};

	unvote = async function({ id = this.id } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		return this.wrapContent('none', this.#instance.delete('/entries/' + id + '/votes')).then(() => this);
	};

	observe = async function({ id = this.id } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		return this.wrapContent('none', this.#instance.post('/entries/' + id + '/observed-discussions')).then(() => this);
	};

	unobserve = async function({ id = this.id } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		return this.wrapContent('none', this.#instance.delete('/entries/' + id + '/observed-discussions')).then(() => this);
	};

	favorite = async function(id = this.id) {
		assert(id, this.#errors.assert.notSpecified('id'));
		return this._favorite({ entryId: id }).then(() => this);
	};

	unfavorite = async function(id = this.id) {
		assert(id, this.#errors.assert.notSpecified('id'));
		return this._unfavorite({ entryId: id }).then(() => this);
	};

	surveyVote = async function(vote, { id = this.id } = {}) {
		assert(vote, this.#errors.assert.notSpecified('vote'));
		assert(id, this.#errors.assert.notSpecified('id'));
		return this.wrapContent('none', this.#instance.post('/entries/' + id + '/survey/votes', {
			data: {
				vote: vote
			}
		})).then(() => this);
	};
};