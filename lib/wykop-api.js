const assert = require('assert');

module.exports = class API {    
	#core; #errors; #instance; 
	constructor(core) {
		this.#core = core; this.#errors = core.errors; this.#instance = core.instance;
	}

	#getClass;
	getClass(classString) {
		if (!this.#getClass) { 
			this.#getClass = require('./wykop-api-objects.js');
		}
		return this.#getClass(classString);
	}

	wrapListing(classString, responsePromise, context, overrideProxy) {
		if (typeof responsePromise.then === 'function') {
			return responsePromise.then(response => this.#_wrapListing(classString, response, context, overrideProxy));
		}
		return this.#_wrapListing(classString, responsePromise, context, overrideProxy);
	}

	#_wrapListing(classString, response, context, overrideProxy = false) {
		if (!response) { return []; }

		let config = null;
		if (response.__config) {
			config = response.__config;
			config.classString = classString;
			delete response.__config;
		}
		
		let content = response;
		const Class = this.getClass(classString);
		let parsedContent = content.data ?? content.items ?? content;
		if (Class !== null) {
			parsedContent = parsedContent.map(content => new Class(this.#core, content, overrideProxy, context));
		}
		if (content.data) {
			content.items = parsedContent;
			delete content.data;
		} else if (content.items) {
			content.items = parsedContent;
		} else {
			content = parsedContent;
		}
		content = this.wrapContent('listing', content, config, true);
		return content;
	}

	wrapContent(classString, responsePromise, context, overrideProxy) {
		if (typeof responsePromise.then === 'function') {
			return responsePromise.then(response => this.#_wrapContent(classString, response, context, overrideProxy));
		}
		return this.#_wrapContent(classString, responsePromise, context, overrideProxy);
	}

	#_wrapContent(classString, response, context, overrideProxy = false) {
		if (!response) { return null; }

		if (response.__config) {
			delete response.__config;
		}

		let content = response;
		const Class = this.getClass(classString);
		let parsedContent = content.data ?? content;
		if (Class !== null) {
			parsedContent = new Class(this.#core, parsedContent, overrideProxy, context);
		}
		return parsedContent;
	}

	wrapListingMixed(responsePromise) {
		if (typeof responsePromise.then === 'function') {
			return responsePromise.then(response => this.#_wrapListingMixed(response));
		}
		return this.#_wrapListingMixed(responsePromise);
	}

	#_wrapListingMixed(response) {
		if (!response) { return null; }

		let config = null;
		if (response.__config) {
			config = response.__config;
			config.classString = 'mixed';
			delete response.__config;
		}

		let content = response;
		if (content.data.items) {
			content.data = content.data.items;
		}
		let items = [];
		for (const item of content.data) {
			items.push(this.wrapContent(item.resource, item, null, true));
		}
		content.items = items;
		delete content.data;

		content = this.wrapContent('listing', content, config, true);
		return content;
	}

	// === Listing stream generator ===
	_stream(listing) {
		return async function*() {
			for (const item of listing.items) { yield item; }
			if (!listing.pagination) { return; }
			let request = listing.pagination.next;
			while (request) {
				listing = await request();
				for (const item of listing.items) {
					yield item;
				}
				request = listing.pagination.next;
			}
		};
	}

	// === Favourite generic ===
	#favoriteRequestBody = function({ linkId = null, entryId = null, linkCommentId = null, entryCommentId = null } = {}, deleteAction = false) {
		assert(linkId ?? entryId ?? linkCommentId ?? entryCommentId, this.#errors.assert.notSpecified('linkId, entryId, linkCommentId or entryCommentId'));

		let type = null;

		if (entryCommentId) { type = 'entry_comment'; }
		if (linkCommentId) { type = 'link_comment'; }
		if (entryId) { type = 'entry'; }
		if (linkId) { type = 'link'; }

		const data = {
			data: {
				type: type,
				source_id: linkId ?? entryId ?? linkCommentId ?? entryCommentId 
			}
		};

		return deleteAction ? { data: data } : data;
	};

	async _favorite(config = {}) {
		return this.wrapContent('none', this.#instance.post('/favourites', this.#favoriteRequestBody(config)));
	}

	async _unfavorite(config = {}) {
		return this.wrapContent('none', this.#instance.delete('/favourites', this.#favoriteRequestBody(config, true)));
	}
};