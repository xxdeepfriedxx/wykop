const assert = require('assert');

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

	wrapListing(classString, contentPromise) {
		if (typeof contentPromise.then === 'function') {
			return contentPromise.then(content => this.#_wrapListing(classString, content))
		}
		return this.#_wrapListing(classString, contentPromise)
	}

	#_wrapListing(classString, content) {
		if (!content) { return [] }
		const Class = this.getClass(classString);
		let parsedContent = content.data ?? content
		if (Class !== null) {
			parsedContent = parsedContent.map(content => new Class(this.#core, content));
		}
		if (content.data) {
			content.items = parsedContent
			delete content.data
		} else {
			content = parsedContent
		}
		return content
	}

	wrapContent(classString, contentPromise) {
		if (typeof contentPromise.then === 'function') {
			return contentPromise.then(content => this.#_wrapContent(classString, content))
		}
		return this.#_wrapContent(classString, contentPromise)
	}

	#_wrapContent(classString, content) {
		if (!content) { return null }
		const Class = this.getClass(classString);
		let parsedContent = content.data ?? content
		if (Class !== null) {
			parsedContent = new Class(this.#core, parsedContent);
		}
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
	#favoriteRequestBody = function({ linkId = null, entryId = null, linkCommentId = null, entryCommentId = null } = {}) {
		assert(linkId ?? entryId ?? linkCommentId ?? entryCommentId, this.#errors.assert.notSpecified('linkId, entryId, linkCommentId or entryCommentId'))

		let type = null

		if (entryCommentId) { type = 'entry_comment' }
		if (linkCommentId) { type = 'link_comment' }
		if (entryId) { type = 'entry' }
		if (linkId) { type = 'link' }

		return {
			data: {
				type: type,
				// Swagger says 'sourceId' but API expects 'source_id'
				source_id: linkId ?? entryId ?? linkCommentId ?? entryCommentId 
			}
		}
	}

	async _favorite(config = {}) {
		return this.#instance.post('/favourites', this.#favoriteRequestBody(config));
	}

	async _unfavorite(config = {}) {
		// This doesn't work, can't figure out why..
		return this.#instance.delete('/favourites', this.#favoriteRequestBody(config));
	}

	get #pageType() {
		if (!this.pagination) { return null }
	}

	get #nextPageValue() {
		if (this.#pageType === 'hash') { return this.pagination.next }
		if (this.#pageType === 'numerical') { 
			const lastPage = Math.ceil(this.pagination.total/this.pagination.per_page)
			const nextPage = this.pagination.current_page + 1
			if (nextPage <= lastPage) { return nextPage }
 		}
		return null
	}

	get #prevPageValue() {
		if (this.#pageType === 'hash') { return this.pagination.prev }
		if (this.#pageType === 'numerical') { 
			return (this.pagination.current_page-1) < 1 ? null : this.pagination.current_page-1
		}
		return null
	}

	#nextPage = function() {
		return this.get({page: this.nextPageValue})
	}

	#prevPage = function() {
		return this.get({page: this.prevPageValue})
	}
}