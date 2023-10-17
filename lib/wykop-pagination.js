const API = require('./wykop-api.js');

module.exports = class Pagination extends API {
	#core; #errors; #instance; #config; #classString;
	constructor(core, data, _, config) {
		super(core); this.#core = core; this.#errors = core.errors; this.#instance = core.instance;

		if (data.next !== undefined || data.prev !== undefined ) {
			data.nextHash = data.next;
			data.prevHash = data.prev;
			delete data.next;
			delete data.prev;
		} 

		if (data.per_page) {
			data.perPage = data.per_page;
			delete data.per_page;
		}

		if (config.classString) {
			this.#classString = config.classString;
			delete config.classString;
		}

		this.#config = config;
		Object.assign(this, data);
		this.#setupPages();
	}

	currentPage = undefined;
	get = undefined;
	next = undefined;
	prev = undefined;

	#setupPages = function() {
		this.currentPage = this.#currentPageValue;
		this.get = this.#requestPageFunction(this.#currentPageValue);
		if (this.#nextPageValue) { this.next = this.#requestPageFunction(this.#nextPageValue); }
		if (this.#prevPageValue) { this.prev = this.#requestPageFunction(this.#prevPageValue); }
	};

	#requestPageFunction = function(page) {
		return async () => {
			let config = this.#config;
			if (!config.params) { config.params = {}; }
			config.params.page = page;
			if (this.#classString === 'mixed') {
				return this.wrapListingMixed(this.#instance.request(config));
			}
			return this.wrapListing(this.#classString, this.#instance.request(config));
		};
	};

	get #pageType() {
		if (this.perPage !== undefined) { return 'numerical'; }
		if (this.nextHash !== undefined || this.prevHash !== undefined) { return 'hash'; }
		return null;
	}

	get #currentPageValue() {
		if (this.#config && this.#config.params && this.#config.params.page) { return this.#config.params.page; }
		if (this.#pageType === 'hash') { return undefined; }
		if (this.#pageType === 'numerical') { return 1; }
		return null;
	}

	get #nextPageValue() {
		if (this.#pageType === 'hash') { return this.nextHash; }
		if (this.#pageType === 'numerical') { 
			const lastPage = Math.ceil(this.total/this.perPage);
			const nextPage = this.#currentPageValue + 1;
			if (nextPage <= lastPage) { return nextPage; }
		}
		return null;
	}

	get #prevPageValue() {
		if (this.#pageType === 'hash') { return this.prevHash; }
		if (this.#pageType === 'numerical') { 
			const prevPage = this.#currentPageValue + 1;
			if (prevPage >= 1) { return prevPage; }
		}
		return null;
	}
};