const assert = require('assert');
const proxymise = require('./proxymise.js')

module.exports = class API {    
	#core; #errors; #instance; 
	constructor(core) {
		this.#core = core; this.#errors = core.errors; this.#instance = core.instance;
	}

	#getClass
	getClass(classString) {
		if (!this.#getClass) { 
			this.#getClass = require('./wykop-api-objects.js') 
		}
		return this.#getClass(classString)
	}

	wrapListing(classString, contentPromise, context) {
		if (typeof contentPromise.then === 'function') {
			return contentPromise.then(content => this.#_wrapListing(classString, content, context))
		}
		return this.#_wrapListing(classString, contentPromise, context)
	}

	#_wrapListing(classString, content, context) {
		if (!content) { return [] }
		const Class = this.getClass(classString);
		let parsedContent = content.data ?? content
		if (Class !== null) {
			parsedContent = parsedContent.map(content => new Class(this.#core, content, context));
		}
		if (content.data) {
			content.items = parsedContent
			delete content.data
		} else {
			content = parsedContent
		}
		if (this.#core.useProxies) { return proxymise(content) }
		return content
	}

	wrapContent(classString, contentPromise, context) {
		if (typeof contentPromise.then === 'function') {
			return contentPromise.then(content => this.#_wrapContent(classString, content, context))
		}
		return this.#_wrapContent(classString, contentPromise, context)
	}

	#_wrapContent(classString, content, context) {
		if (!content) { return null }
		const Class = this.getClass(classString);
		let parsedContent = content.data ?? content
		if (Class !== null) {
			parsedContent = new Class(this.#core, parsedContent, context);
		}
		if (this.#core.useProxies) { return proxymise(parsedContent) }
		return parsedContent
	}

	wrapListingMixed(contentPromise) {
		if (typeof contentPromise.then === 'function') {
			return contentPromise.then(content => this.#_wrapListingMixed(content))
		}
		return this.#_wrapListingMixed(classString, contentPromise)
	}

	#_wrapListingMixed(content) {
		if (!content) { return null }
		if (content.data.items) {
			content.data = content.data.items
		}
		let items = [];
		for (const item of content.data) {
			items.push(this.wrapContent(item.resource, item))
		}
		content.items = items
		delete content.data
		return content;
	}

	// === Favourite generic ===
	#favoriteRequestBody = function({ linkId = null, entryId = null, linkCommentId = null, entryCommentId = null } = {}, deleteAction = false) {
		assert(linkId ?? entryId ?? linkCommentId ?? entryCommentId, this.#errors.assert.notSpecified('linkId, entryId, linkCommentId or entryCommentId'))

		let type = null

		if (entryCommentId) { type = 'entry_comment' }
		if (linkCommentId) { type = 'link_comment' }
		if (entryId) { type = 'entry' }
		if (linkId) { type = 'link' }

		const data = {
			data: {
				type: type,
				source_id: linkId ?? entryId ?? linkCommentId ?? entryCommentId 
			}
		}

		return deleteAction ? { data: data } : data
	}

	async _favorite(config = {}) {
		return this.wrapContent('none', this.#instance.post('/favourites', this.#favoriteRequestBody(config)));
	}

	async _unfavorite(config = {}) {
		return this.wrapContent('none', this.#instance.delete('/favourites', this.#favoriteRequestBody(config, true)));
	}
}