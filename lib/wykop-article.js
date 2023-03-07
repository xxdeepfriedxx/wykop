import API from './wykop-api.js';
import assert from 'assert';

import Profile from './wykop-profile.js';

export default class Article extends API {
	#core; #errors; #instance
    constructor(core, data) {
        super(core); this.#core = core; this.#errors = core.errors; this.#instance = core.instance;
        Object.assign(this, data);
    
		if (this.author) { this.author = new Profile(this.#core, this.author) }
		if (this.histories) { this.histories = this.histories.map(history => new ArticleHistory(this.#core, history, this.id)) }
    }

	get = function({ id = this.id } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		return this.wrapContent('article', this.#instance.get('/articles/' + id));
	}

	edit = function({ id = this.id, title = this.title, content = this.content, html = this.html } = {}) {
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
	}

	remove = function({ id = this.id } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		return this.#instance.delete('/articles/' + id);
	}
}

export class ArticleHistory extends API {
	#core; #errors; #instance
    constructor(core, data, articleId) {
        super(core); this.#core = core; this.#errors = core.errors; this.#instance = core.instance;
        Object.assign(this, data);
        this.articleId = articleId;
    }

	get = function({ id = this.id, articleId = this.articleId } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		assert(articleId, this.#errors.assert.notSpecified('articleId'));
		return this.wrapContent('article', this.#instance.get('/articles/' + articleId + '/histories/' + id));
	}
}

