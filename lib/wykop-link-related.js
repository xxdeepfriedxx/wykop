const API = require('./wykop-api.js');
const assert = require('assert');
const proxymise = require('./proxymise.js');

module.exports = class LinkRelated extends API {
	#core; #errors; #instance;
	constructor(core, data, overrideProxy = false, linkId) {
		super(core); this.#core = core; this.#errors = core.errors; this.#instance = core.instance;
		Object.assign(this, data);
		this.parent_id = linkId;

		if (!overrideProxy && core.useProxies) { return proxymise(this); }
		return this;
	}

	get = async function({ id = this.id, linkId = this.parent_id } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		assert(linkId, this.#errors.assert.notSpecified('linkId'));
		return this.wrapListing('link_related', this.#instance.get('/links/' + linkId + '/related'), linkId).then(links => {
			const res = links.items.find(link => { return link.id.toString() === id.toString(); });
			if (res) { return res; }
			throw { code: 404, hash: '', error: { message: 'Related link not found', key: 0 }};
		});
	};

	edit = async function({ id = this.id, linkId = this.parent_id, title = null, url = null, adult = false} = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		assert(linkId, this.#errors.assert.notSpecified('linkId'));
		return this.wrapContent('none', this.#instance.put('/links/' + linkId + '/related/' + id, {
			data: {
				title: title,
				url: url,
				adult: adult
			}
		})).then(() => this);
	};

	remove = async function({ id = this.id, linkId = this.parent_id } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		assert(linkId, this.#errors.assert.notSpecified('linkId'));
		return this.wrapContent('none', this.#instance.delete('/links/' + linkId + '/related/' + id));
	};

	upvote = async function({ id = this.id, linkId = this.parent_id } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		assert(linkId, this.#errors.assert.notSpecified('linkId'));
		return this.wrapContent('none', this.#instance.get('/links/' + linkId + '/related/' + id + '/votes/up')).then(() => this);
	};

	downvote = async function({ id = this.id, linkId = this.parent_id } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		assert(linkId, this.#errors.assert.notSpecified('linkId'));
		return this.wrapContent('none', this.#instance.get('/links/' + linkId + '/related/' + id + '/votes/down')).then(() => this);
	};

	unvote = async function({ id = this.id, linkId = this.parent_id } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		assert(linkId, this.#errors.assert.notSpecified('linkId'));
		return this.wrapContent('none', this.#instance.get('/links/' + linkId + '/related/' + id + '/votes')).then(() => this);
	};
};