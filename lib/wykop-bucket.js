const API = require('./wykop-api.js');
const assert = require('assert');

module.exports = class Bucket extends API {
	#core; #errors; #instance
    constructor(core, data) {
        super(core); this.#core = core; this.#errors = core.errors; this.#instance = core.instance;
        Object.assign(this, data)
    }

    getContent = async function({ hash = this.hash, page = null} = {}) {
        return this.wrapListingMixed(this.#instance.get('/buckets/stream/' + hash, {
            params: {
                page: page
            }
        }));
    }

    edit = async function({ hash = this.hash, title = this.title, query = this.query } = {}) {
        return this.wrapContent('bucket', this.#instance.put('/buckets/' + hash, {
            data: {
                title: title,
                query: query
            }
        }))
    }

    remove = async function({ hash = this.hash } = {}) {
        return this.#instance.delete('/buckets/' + hash)
    }
}