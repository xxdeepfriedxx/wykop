const API = require('./wykop-api.js');
const assert = require('assert');

module.exports = class EntryComment extends API {
	#core; #errors; #instance
    constructor(core, data) {
        super(core); this.#core = core; this.#errors = core.errors; this.#instance = core.instance;
        Object.assign(this, data)

        if (this.author) { this.author = this.wrapContent('profile', this.author) }
        if (this.parent) { this.parent = this.wrapContent('entry', this.author) }
    }

	get = async function({ entryId = this.parent?.id, id = this.id } = {}) {
		assert(entryId, this.#errors.assert.notSpecified('entryId'));
		assert(id, this.#errors.assert.notSpecified('id'));
		return this.wrapContent('entry_comment', await this.#instance.get('/entries/' + entryId + '/comments/' + id))
	}

	edit = async function({ entryId = this.parent?.id, id = this.id, ontent = this.content, photo = this.media?.photo?.key, embed = this.media?.embed?.key, adult = this.adult } = {}) {
		assert(entryId, this.#errors.assert.notSpecified('entryId'));
		assert(id, this.#errors.assert.notSpecified('id'));
		return this.wrapContent('entry_comment', await this.#instance.put("/entries/" + entryId + '/comments/' + id, {
			data: {
				content: content,
				photo: photo,
				embed: embed,
				adult: adult
			}
		}));
	}

	remove = async function({ entryId = this.parent?.id, id = this.id }  = {}) {
		assert(entryId, this.#errors.assert.notSpecified('entryId'));
		assert(id, this.#errors.assert.notSpecified('id'));
		return await this.#instance.delete("/entries/" + entryId + '/comments/' + id);
	}

	getUpvoters = async function({ entryId = this.parent?.id, id = this.id }  = {}) {
		assert(entryId, this.#errors.assert.notSpecified('entryId'));
		assert(id, this.#errors.assert.notSpecified('id'));
		return this.wrapListing('profile', await this.#instance.get('/entries/' + entryId + '/comments/' + id + '/votes'));
	}

	upvote = async function({ entryId = this.parent?.id, id = this.id }  = {}) {
		assert(entryId, this.#errors.assert.notSpecified('entryId'));
		assert(id, this.#errors.assert.notSpecified('id'));
		return await this.#instance.post('/entries/' + entryId + '/comments/' + id + '/votes').then(_ => { return this });
	}

	unvote = async function({ entryId = this.parent?.id, id = this.id }  = {}) {
		assert(entryId, this.#errors.assert.notSpecified('entryId'));
		assert(id, this.#errors.assert.notSpecified('id'));
		return await this.#instance.delete('/entries/' + entryId + '/comments/' + id + '/votes').then(_ => { return this });
	}

	favorite = async function(id = this.id) {
        return await this._favorite({ entryCommentId: id }).then(_ => { return this });
    }

    unfavorite = async function(id = this.id) {
        // This #doesn't work, can't figure out why..
        return await this._unfavorite({ entryCommentId: id }).then(_ => { return this });
    }
}