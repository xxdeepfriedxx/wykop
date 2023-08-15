const API = require('./wykop-api.js');
const assert = require('assert');

module.exports = class Bucket extends API {
	#core; #errors; #instance;
	constructor(core, data) {
		super(core); this.#core = core; this.#errors = core.errors; this.#instance = core.instance;
		Object.assign(this, data);
	}

	get = async function({ hash = this.hash } = {}) {
		assert(hash, this.#errors.assert.notSpecified('hash'));
		return this.wrapListing('bucket', this.#instance.get('/buckets')).then(buckets => {
			const res = buckets.items.find(bucket => { return bucket.hash === hash; });
			if (res) { return res; }
			throw { code: 404, hash: '', error: { message: 'Bucket not found', key: 0 } };
		});
	};

	getContent = async function({ hash = this.hash, page = null} = {}) {
		assert(hash, this.#errors.assert.notSpecified('hash'));
		return this.wrapListingMixed(this.#instance.get('/buckets/stream/' + hash, {
			params: {
				page: page
			}
		}));
	};

	edit = async function({ hash = this.hash, title = this.title, query = this.query, defaultPage = this.default_page } = {}) {
		assert(hash, this.#errors.assert.notSpecified('hash'));
		return this.wrapContent('bucket', this.#instance.put('/buckets/' + hash, {
			data: {
				title: title,
				query: query,
				default_page: defaultPage
			}
		}));
	};

	remove = async function({ hash = this.hash } = {}) {
		assert(hash, this.#errors.assert.notSpecified('hash'));
		return this.wrapContent('none', this.#instance.delete('/buckets/' + hash));
	};
};