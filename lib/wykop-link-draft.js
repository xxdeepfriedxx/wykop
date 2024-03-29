const API = require('./wykop-api.js');
const assert = require('assert');
const proxymise = require('./proxymise.js');

module.exports = class Draft extends API {
	#core; #errors; #instance;
	constructor(core, data, overrideProxy = false) {
		super(core); this.#core = core; this.#errors = core.errors; this.#instance = core.instance;
		Object.assign(this, data);

		if (!overrideProxy && core.useProxies) { return proxymise(this); }
		return this;
	}

	get = async function({ key = this.key } = {}) {
		assert(key, this.#errors.assert.notSpecified('key'));
		return this.wrapContent('draft', this.#instance.get('/links/draft/' + key));
	};

	edit = async function({ key = this.key, title = this.title, description = this.description, tags = this.tags, photo = null, adult = this.adult, selectedImage = this.images.find(x => x.selected) } = {}) {
		assert(key, this.#errors.assert.notSpecified('key'));
		assert(title, this.#errors.assert.notSpecified('title'));
		assert(description, this.#errors.assert.notSpecified('description'));
		assert(Array.isArray(tags) && tags.every(tag => typeof tag === 'string'), this.#errors.assert.invalidType('tags', 'string[]'));
		return this.wrapContent('none', this.#instance.put('/links/draft/' + key, {
			data: {
				title: title,
				description: description,
				tags: tags,
				photo: photo,
				adult: adult,
				selected_image: selectedImage
			}
		})).then(() => this);
	};

	remove = async function({ key = this.key } = {}) {
		assert(key, this.#errors.assert.notSpecified('key'));
		return this.wrapContent('none', this.#instance.delete('/links/draft/' + key));
	};

	publish = async function({ key = this.key, title = null, description = null, tags = null, photo = null, adult = false, selectedImage = null } = {}) {
		assert(key, this.#errors.assert.notSpecified('key'));
		assert(title, this.#errors.assert.notSpecified('title'));
		assert(description, this.#errors.assert.notSpecified('description'));
		assert(tags, this.#errors.assert.notSpecified('tags'));
		assert(Array.isArray(tags), this.#errors.assert.invalidType('tags', 'Array'));
		return this.wrapContent('none', this.#instance.post('/links/draft/' + key, {
			data: {
				title: title,
				description: description,
				tags: tags,
				photo: photo,
				adult: adult,
				selected_image: selectedImage
			}
		}));
	};
};