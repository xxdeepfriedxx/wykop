import API from './wykop-api.js';
import assert from 'assert';

export default class Badge extends API {
    #core; #errors; #instance
    constructor(core, data) {
        super(core); this.#core = core; this.#errors = core.errors; this.#instance = core.instance;
        Object.assign(this, data);
    }

    get = function({ slug = this.slug } = {}) {
        assert(slug, this.#errors.assert.notSpecified('slug'));
        return this.wrapContent('badge', this.#instance.get('/badges/' + slug));
    }

    users = function({ slug = this.slug } = {}) {
        assert(slug, this.#errors.assert.notSpecified('slug'));
        return this.wrapListing('profile', this.#instance.get('/badges/' + slug + '/users'));
    }
}