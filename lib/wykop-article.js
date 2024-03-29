const API = require('./wykop-api.js');
const assert = require('assert');
const proxymise = require('./proxymise.js');

module.exports = class Article extends API {
	#core; #errors; #instance;
	constructor(core, data, overrideProxy = false) {
		super(core); this.#core = core; this.#errors = core.errors; this.#instance = core.instance;
		Object.assign(this, data);
    
		if (this.author) { this.author = this.wrapContent('profile', this.author, null, true); }
		if (this.histories) { this.histories = this.wrapListing('article_history', { items: this.histories }, this.id, true); }

		if (!overrideProxy && core.useProxies) { return proxymise(this); }
		return this;
	}

	get = async function({ id = this.id } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		return this.wrapContent('article', this.#instance.get('/articles/' + id));
	};

	edit = async function({ id = this.id, title = this.title, content = this.content, html = this.html } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		assert(title, this.#errors.assert.notSpecified('title'));
		assert(content, this.#errors.assert.notSpecified('content'));
		assert(html, this.#errors.assert.notSpecified('html'));
		return this.wrapContent('article', this.#instance.put('/articles/' + id, {
			data: {
				title: title,
				content: content,
				content_html: html
			}
		}));
	};

	remove = async function({ id = this.id } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		return this.wrapContent('none', this.#instance.delete('/articles/' + id));
	};
};