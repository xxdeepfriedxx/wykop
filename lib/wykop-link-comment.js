import API from './wykop-api.js';
import assert from 'assert';

import Profile from './wykop-profile.js';
import Link from './wykop-link.js';

export default class LinkComment extends API {
	#core; #errors; #instance
	constructor(core, data) {
		super(core); this.#core = core; this.#errors = core.errors; this.#instance = core.instance;
		Object.assign(this, data)

		if (this.author) { this.author = new Profile(this.#core, this.author) }
		if (this.comments?.items) { this.comments.items = this.comments.items.map(x => new LinkComment(this.#core, x)) }
		if (this.parent) { this.parent = new Link(this.#core, this.parent) }
	}

	get = function({ id = this.id, linkId = this.parent?.id } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		assert(linkId, this.#errors.assert.notSpecified('linkId'));
		return this.wrapContent('link_comment', this.#instance.get('/links/' + linkId + '/comments/' + id));
	}

	getComments = function({ id = this.id, linkId = this.parent?.id, page = null } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		assert(commentId, this.#errors.assert.notSpecified('commentId'));
		return this.wrapListing('link_comment', this.#instance.get('/links/' + id + '/comments/' + commentId + '/comments', {
			params: {
				page: page
			}
		}));
	}

	submitComment = function({ id = this.id, linkId = this.parent?.id, content = this.content, photo = this.media?.photo?.key, embed = this.media?.embed?.key, adult = this.adult ?? false } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		assert(linkId, this.#errors.assert.notSpecified('linkId'));
		return this.wrapContent('link_comment', this.#instance.post('/links/' + linkId + '/comments/' + id), {
			data: {
				content: content,
				photo: photo,
				embed: embed,
				adult: adult
			}
		});
	}

	edit = function({ id = this.id, linkId = this.parent?.id, content = this.content, photo = this.media?.photo?.key, embed = this.media?.embed?.key, adult = this.adult ?? false } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		assert(linkId, this.#errors.assert.notSpecified('linkId'));
		return this.wrapContent('link_comment', this.#instance.put('/links/' + linkId + '/comments/' + id));
	}

	remove = function({ id = this.id, linkId = this.parent?.id } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		assert(linkId, this.#errors.assert.notSpecified('linkId'));
		return this.#instance.delete('/links/' + linkId + '/comments/' + id);
	}

	upvote = function({ id = this.id, linkId = this.parent?.id } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		return this.#instance.post('/links/' + linkId + '/comments/' + id + '/votes/up').then(_ => { return this });
	}

	downvote = function({ id = this.id, linkId = this.parent?.id } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		return this.#instance.post('/links/' + linkId + '/comments/' + id + '/votes/down').then(_ => { return this });
	}

	unvote = function({ id = this.id, linkId = this.parent?.id } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		return this.#instance.delete('/links/' + linkId + '/comments/' + id + '/votes').then(_ => { return this });
	}

	favorite = function(id = this.id) {
		return this._favorite({ linkCommentId: id }).then(_ => { return this });
	}

	unfavorite = function(id = this.id) {
		return this._unfavorite({ linkCommentId: id }).then(_ => { return this });
	}
}