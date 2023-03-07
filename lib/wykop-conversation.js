import API from './wykop-api.js';
import assert from 'assert';

import Profile from './wykop-profile.js';

export default class Conversation extends API {
    #core; #errors; #instance
    constructor(core, data) {
        super(core); this.#core = core; this.#errors = core.errors; this.#instance = core.instance;
        Object.assign(this, data);

        if (this.user) { this.user = new Profile(this.#core, this.user) }
    }

    get = function({ username = this.user?.username, nextMessage = null, prevMessage } = {}) {
        assert(username, this.#errors.assert.notSpecified('username'));
        return this.wrapContent('conversation', this.#instance.get('/pm/conversations/' + username), {
            params: {
                next_message: nextMessage,
                prev_message: prevMessage
            }
        });
    }

    message = function(content = null, { username = this.user?.username, photo = null, embed = null } = {}) {
        assert(content, this.#errors.assert.notSpecified('content'));
        assert(username, this.#errors.assert.notSpecified('username'));
        return this.#instance.post('/pm/conversations/' + username, {
            data: {
                content: content,
                photo: photo,
                embed: embed
            }
        }).then(_ => { return this });
    }
    
    clearHistory = function({ username = this.user?.username } = {}) {
        assert(username, this.#errors.assert.notSpecified('username'));
        return this.#instance.delete('/pm/conversations/' + username);
    }

    isNewerMessageAvailable = function({ username = this.user?.username } = {}) {
        assert(username, this.#errors.assert.notSpecified('username'));
        return this.#instance.get('/pm/conversations/' + username + '/newer').then(res => res.data);
    }
}
