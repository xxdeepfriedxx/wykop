const API = require('./wykop-api.js');
const assert = require('assert');

module.exports = class LinkRelated extends API {
    #core; #errors; #instance
    constructor(core, data, linkId) {
        super(core); this.#core = core; this.#errors = core.errors; this.#instance = core.instance;
        Object.assign(this, data);
        this.parentId = linkId;
    }

    remove = async function({ id = this.id, linkId = this.parentId } = {}) {
    	assert(id, this.#errors.assert.notSpecified('id'));
    	assert(linkId, this.#errors.assert.notSpecified('linkId'));
        return this.wrapContent('none', this.#instance.delete('/links/' + linkId + '/related/' + id));
    }

    edit = async function({ id = this.id, linkId = this.parentId, title = null, url = null, adult = false} = {}) {
    	assert(id, this.#errors.assert.notSpecified('id'));
    	assert(linkId, this.#errors.assert.notSpecified('linkId'));
        return this.wrapContent('none', this.#instance.put('/links/' + linkId + '/related/' + id, {
            data: {
                title: title,
                url: url,
                adult: adult
            }
        })).then(_ => { 
            this.title = title
            this.utl = url
            this.adult = adult
            return this
        });
    }

    upvote = async function({ id = this.id, linkId = this.parentId } = {}) {
    	assert(id, this.#errors.assert.notSpecified('id'));
    	assert(linkId, this.#errors.assert.notSpecified('linkId'));
        return this.wrapContent('none', this.#instance.get('/links/' + linkId + '/related/' + id + '/votes/up')).then(_ => { return this });
    }

    downvote = async function({ id = this.id, linkId = this.parentId } = {}) {
    	assert(id, this.#errors.assert.notSpecified('id'));
    	assert(linkId, this.#errors.assert.notSpecified('linkId'));
        return this.wrapContent('none', this.#instance.get('/links/' + linkId + '/related/' + id + '/votes/down')).then(_ => { return this });
    }

    unvote = async function({ id = this.id, linkId = this.parentId } = {}) {
    	assert(id, this.#errors.assert.notSpecified('id'));
    	assert(linkId, this.#errors.assert.notSpecified('linkId'));
        return this.wrapContent('none', this.#instance.get('/links/' + linkId + '/related/' + id + '/votes')).then(_ => { return this });
    }
}