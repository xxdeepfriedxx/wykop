import API from './wykop-api.js';
import assert from 'assert';

export default class LinkRelated extends API {
    #core; #errors; #instance
    constructor(core, data, linkId) {
        super(core); this.#core = core; this.#errors = core.errors; this.#instance = core.instance;
        Object.assign(this, data);
        this.parentId = linkId;

        
    }

    remove = function({ id = this.id, linkId = this.parentId } = {}) {
    	assert(id, this.#errors.assert.notSpecified('id'));
    	assert(relatedId, this.#errors.assert.notSpecified('relatedId'));
        return this.#instance.delete('/links/' + id + '/related/' + relatedId);
    }


    edit = function({ id = this.id, linkId = this.parentId, title = null, url = null, adult = false} = {}) {
    	assert(id, this.#errors.assert.notSpecified('id'));
    	assert(relatedId, this.#errors.assert.notSpecified('relatedId'));
        return this.wrapContent('link_related', this.#instance.put('/links/' + id + '/related/' + relatedId, {
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

    upvote = function({ id = this.id, linkId = this.parentId } = {}) {
    	assert(id, this.#errors.assert.notSpecified('id'));
    	assert(relatedId, this.#errors.assert.notSpecified('relatedId'));
        return this.#instance.get('/links/' + id + '/related/' + relatedId + '/votes/up').then(_ => { return this });
    }

    downvote = function({ id = this.id, linkId = this.parentId } = {}) {
    	assert(id, this.#errors.assert.notSpecified('id'));
    	assert(relatedId, this.#errors.assert.notSpecified('relatedId'));
        return this.#instance.get('/links/' + id + '/related/' + relatedId + '/votes/down').then(_ => { return this });
    }

    unvote = function({ id = this.id, linkId = this.parentId } = {}) {
    	assert(id, this.#errors.assert.notSpecified('id'));
    	assert(relatedId, this.#errors.assert.notSpecified('relatedId'));
        return this.#instance.get('/links/' + id + '/related/' + relatedId + '/votes').then(_ => { return this });
    }
}