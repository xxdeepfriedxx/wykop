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
    	assert(relatedId, this.#errors.assert.notSpecified('relatedId'));
        return await this.#instance.delete('/links/' + id + '/related/' + relatedId);
    }


    edit = async function({ id = this.id, linkId = this.parentId, title = null, url = null, adult = false} = {}) {
    	assert(id, this.#errors.assert.notSpecified('id'));
    	assert(relatedId, this.#errors.assert.notSpecified('relatedId'));
        return this.wrapContent('link_related', await this.#instance.put('/links/' + id + '/related/' + relatedId, {
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
    	assert(relatedId, this.#errors.assert.notSpecified('relatedId'));
        return await this.#instance.get('/links/' + id + '/related/' + relatedId + '/votes/up').then(_ => { return this });
    }

    downvote = async function({ id = this.id, linkId = this.parentId } = {}) {
    	assert(id, this.#errors.assert.notSpecified('id'));
    	assert(relatedId, this.#errors.assert.notSpecified('relatedId'));
        return await this.#instance.get('/links/' + id + '/related/' + relatedId + '/votes/down').then(_ => { return this });
    }

    unvote = async function({ id = this.id, linkId = this.parentId } = {}) {
    	assert(id, this.#errors.assert.notSpecified('id'));
    	assert(relatedId, this.#errors.assert.notSpecified('relatedId'));
        return await this.#instance.get('/links/' + id + '/related/' + relatedId + '/votes').then(_ => { return this });
    }
}