import API from './wykop-api.js';

export default class PmNotification extends API {
	#core; #errors; #instance
    constructor(core, data) {
        super(core); this.#core = core; this.#errors = core.errors; this.#instance = core.instance;
    	Object.assign(this, data)
    }

	get = function({ id = this.id } = {}) {
		return this.#instance.get('/notifications/pm/' + id);
	}

	markAsRead = function({ id = this.id } = {}) {
		return this.#instance.put('/notifications/pm/' + id);
	}

	remove = function({ id = this.id } = {}) {
		return this.#instance.delete('/notifications/pm/' + id);
	}
}