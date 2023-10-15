const API = require('./wykop-api.js');
const assert = require('assert');
const proxymise = require('./proxymise.js');

module.exports = class ArticleHistory extends API {
	#core; #errors; #instance;
	constructor(core, data, overrideProxy = false, articleId) {
		super(core); this.#core = core; this.#errors = core.errors; this.#instance = core.instance;
		Object.assign(this, data);
		this.articleId = articleId;

		if (!overrideProxy && core.useProxies) { return proxymise(this); }
		return this;
	}

	get = async function({ id = this.id, articleId = this.articleId } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		assert(articleId, this.#errors.assert.notSpecified('articleId'));
		return this.wrapContent('article', this.#instance.get('/articles/' + articleId + '/histories/' + id));
	};
};