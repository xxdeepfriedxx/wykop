import API from './wykop-api.js';
import assert from 'assert';

import Profile from './wykop-profile.js';
import Entry from './wykop-entry.js';

export default class EntryComment extends API {
	#core; #errors; #instance
    constructor(core, data) {
        super(core); this.#core = core; this.#errors = core.errors; this.#instance = core.instance;
        Object.assign(this, data)

        if (this.author) { this.author = new Profile(this.#core, this.author) }
        if (this.parent) { this.parent = new Entry(this.#core, this.parent) }
    }

	get = function({ entryId = this.parent?.id, id = this.id } = {}) {
		assert(entryId, this.#errors.assert.notSpecified('entryId'));
		assert(id, this.#errors.assert.notSpecified('id'));
		return this.wrapContent('entry_comment', this.#instance.get('/entries/' + entryId + '/comments/' + id))
	}

	edit = function({ entryId = this.parent?.id, id = this.id, ontent = this.content, photo = this.media?.photo?.key, embed = this.media?.embed?.key, adult = this.adult } = {}) {
		assert(entryId, this.#errors.assert.notSpecified('entryId'));
		assert(id, this.#errors.assert.notSpecified('id'));
		return this.wrapContent('entry_comment', this.#instance.put("/entries/" + entryId + '/comments/' + id, {
			data: {
				content: content,
				photo: photo,
				embed: embed,
				adult: adult
			}
		}));
	}

	remove = function({ entryId = this.parent?.id, id = this.id }  = {}) {
		assert(entryId, this.#errors.assert.notSpecified('entryId'));
		assert(id, this.#errors.assert.notSpecified('id'));
		return this.#instance.delete("/entries/" + entryId + '/comments/' + id);
	}

	getUpvoters = function({ entryId = this.parent?.id, id = this.id }  = {}) {
		assert(entryId, this.#errors.assert.notSpecified('entryId'));
		assert(id, this.#errors.assert.notSpecified('id'));
		return this.wrapListing('profile', this.#instance.get('/entries/' + entryId + '/comments/' + id + '/votes'));
	}

	upvote = function({ entryId = this.parent?.id, id = this.id }  = {}) {
		assert(entryId, this.#errors.assert.notSpecified('entryId'));
		assert(id, this.#errors.assert.notSpecified('id'));
		return this.#instance.post('/entries/' + entryId + '/comments/' + id + '/votes').then(_ => { return this });
	}

	unvote = function({ entryId = this.parent?.id, id = this.id }  = {}) {
		assert(entryId, this.#errors.assert.notSpecified('entryId'));
		assert(id, this.#errors.assert.notSpecified('id'));
		return this.#instance.delete('/entries/' + entryId + '/comments/' + id + '/votes').then(_ => { return this });
	}

	favorite = function(id = this.id) {
        return this._favorite({ entryCommentId: id }).then(_ => { return this });
    }

    unfavorite = function(id = this.id) {
        // This #doesn't work, can't figure out why..
        return this._unfavorite({ entryCommentId: id }).then(_ => { return this });
    }
}