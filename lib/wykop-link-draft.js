import API from './wykop-api.js';
import assert from 'assert';

export default class Draft extends API {
	#core; #errors; #instance
    constructor(core, data) {
        super(core); this.#core = core; this.#errors = core.errors; this.#instance = core.instance;
    	Object.assign(this, data)
    }

	get = function({ key = this.key } = {}) {
		assert(key, this.#errors.assert.notSpecified('key'));
		return this.wrapContent('draft', this.#instance.get('/links/draft/' + key));
	}

	edit = function({ key = this.key, title = this.title, description = this.description, tags = this.tags, photo = null, adult = this.adult, selectedImage = this.images.map(x => { if (x.selected) { return x }}) } = {}) {
		assert(key, this.#errors.assert.notSpecified('key'));
		assert(title, this.#errors.assert.notSpecified('title'));
		assert(description, this.#errors.assert.notSpecified('description'));
		assert(tags, this.#errors.assert.notSpecified('tags'));
		assert(Array.isArray(tags), this.#errors.assert.invalidType('tags', 'Array'));
		return this.#instance.put('/links/draft/' + key, {
			data: {
			    title: title,
			    description: description,
			    tags: tags,
			    photo: photo,
			    adult: adult,
			    selected_image: selectedImage
			}
		}).then(_ => { return this.get() })
	}

	remove = function({ key = this.key } = {}) {
		assert(key, this.#errors.assert.notSpecified('key'));
		return this.#instance.delete('/links/draft/' + key);
	}

	publish = function({ key = this.key, title = null, description = null, tags = null, photo = null, adult = false, selectedImage = null } = {}) {
		assert(key, this.#errors.assert.notSpecified('key'));
		assert(title, this.#errors.assert.notSpecified('title'));
		assert(description, this.#errors.assert.notSpecified('description'));
		assert(tags, this.#errors.assert.notSpecified('tags'));
		assert(Array.isArray(tags), this.#errors.assert.invalidType('tags', 'Array'));
		return this.#instance.post('/links/draft/' + key, {
			data: {
			    title: title,
			    description: description,
			    tags: tags,
			    photo: photo,
			    adult: adult,
			    selected_image: selectedImage
			}
		});
	}
}
