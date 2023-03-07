import API from './wykop-api.js';
import assert from 'assert';

import Profile from './wykop-profile.js';
import EntryComment from './wykop-entry-comment.js';

export default class Entry extends API {
	#core; #errors; #instance
    constructor(core, data) {
        super(core); this.#core = core; this.#errors = core.errors; this.#instance = core.instance;
        Object.assign(this, data)
        
        if (this.comments?.items) { this.comments.items = this.comments.items.map(x => { return new EntryComment(this.#core, x) }) }
        if (this.author) { this.author = new Profile(this.#core, this.author) }
    }

	get = function({ id = this.id } = {}) {
	    assert(id, this.#errors.assert.notSpecified('id'));
	    return this.wrapContent('entry', this.#instance.get('/entries/' + id));
	}

	getComment = function(commentId, { id = this.id } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		assert(commentId, this.#errors.assert.notSpecified('commentId'));
		return this.wrapContent('entry_comment', this.#instance.get('/entries/' + id + '/comments/' + commentId));
	}

	getComments = function({ id = this.id } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		return this.wrapListing('entry_comment', this.#instance.get('/entries/' + id + '/comments'));
	}

	submitComment = function({ id = this.id, content = null, photo = null, embed = null, adult = false } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		return this.wrapContent('entry_comment', this.#instance.post('/entries/' + id + '/comments', {
			data: {
				content: content,
				photo: photo,
				embed: embed,
				adult: adult
			}
		}));
	}

	edit = function({ id = this.id, content = this.content, photo = this.media?.photo?.key, embed = this.media?.embed?.key, survey = this.media?.survey?.key, adult = this.adult } = {}) {
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
	}

	remove = function({ id = this.id } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		return this.#instance.delete('/entries/' + id);
	}

	getUpvoters = function({ id = this.id } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		return this.wrapListing('profile', this.#instance.get('/entries/' + id + '/votes'));
	}

	upvote = function({ id = this.id } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		return this.#instance.post('/entries/' + id + '/votes').then(_ => { return this })
	}

	unvote = function({ id = this.id } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		return this.#instance.delete('/entries/' + id + '/votes').then(_ => { return this })
	}

	favorite = function(id = this.id) {
        return this._favorite({ entryId: id }).then(_ => { return this });
    }

    unfavorite = function(id = this.id) {
        return this._unfavorite({ entryId: id }).then(_ => { return this });
    }

    surveyVote = function(id = null) {
		assert(id, this.#errors.assert.notSpecified('id'));
        return this.#instance.post('/entries/' + id + '/survey/votes').then(_ => { return this })
    }
}