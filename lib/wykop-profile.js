import API from './wykop-api.js';
import assert from 'assert';

export default class Profile extends API {
    #core; #errors; #instance
    constructor(core, data) {
        super(core); this.#core = core; this.#errors = core.errors; this.#instance = core.instance;
        Object.assign(this, data);
    }

    get = function(username = this.username) {
        return this.wrapContent('profile', this.#instance.get('/profile/users/' + username));
    }

    observe = function({ username = this.username } = {}) {
        assert(username, this.#errors.assert.notSpecified('username'));
        return this.#instance.post('/observed/users/' + username).then(_ => { return this });
    }

    unobserve = function({ username = this.username } = {}) {
        assert(username, this.#errors.assert.notSpecified('username'));
        return this.#instance.delete('/observed/users/' + username).then(_ => { return this });
    }

    // ACTIONS
    getActions = function({ username = this.username, page = null } = {}) {
        assert(username, this.#errors.assert.notSpecified('username'));
        return this.wrapListingMixed(this.#instance.get('/profile/users/' + username + '/actions', { params: { page: page }}));
    }

    // LINKS
    getLinksAdded = function({ username = this.username, page = null } = {}) {
        assert(username, this.#errors.assert.notSpecified('username'));
        return this.wrapListing('link', this.#instance.get('/profile/users/' + username + '/links/added', { params: { page: page }}));
    }

    getLinksPublished = function({ username = this.username, page = null } = {}) {
        assert(username, this.#errors.assert.notSpecified('username'));
        return this.wrapListing('link', this.#instance.get('/profile/users/' + username + '/links/published', { params: { page: page }}));
    }

    getLinksUpvoted = function({ username = this.username, page = null } = {}) {
        assert(username, this.#errors.assert.notSpecified('username'));
        return this.wrapListing('link', this.#instance.get('/profile/users/' + username + '/links/up', { params: { page: page }}));
    }

    getLinksDownvoted = function({ username = this.username, page = null } = {}) {
        assert(username, this.#errors.assert.notSpecified('username'));
        return this.wrapListing('link', this.#instance.get('/profile/users/' + username + '/links/down', { params: { page: page }}));
    }

    getLinksCommented = function({ username = this.username, page = null } = {}) {
        assert(username, this.#errors.assert.notSpecified('username'));
        return this.wrapListing('link', this.#instance.get('/profile/users/' + username + '/links/commented', { params: { page: page }}));
    }


    // ENTRIES
    getEntriesAdded = function({ username = this.username, page = null } = {}) {
        assert(username, this.#errors.assert.notSpecified('username'));
        return this.wrapListing('entry', this.#instance.get('/profile/users/' + username + '/entries/added', { params: { page: page }}));
    }

    getEntriesUpvoted = function({ username = this.username, page = null } = {}) {
        assert(username, this.#errors.assert.notSpecified('username'));
        return this.wrapListing('entry', this.#instance.get('/profile/users/' + username + '/entries/voted', { params: { page: page }}));
    }

    getEntriesCommented = function({ username = this.username, page = null } = {}) {
        assert(username, this.#errors.assert.notSpecified('username'));
        return this.wrapListing('entry', this.#instance.get('/profile/users/' + username + '/entries/commented', { params: { page: page }}));
    }


    // BADGES
    getBadges = function({ username = this.username } = {}) {
        assert(username, this.#errors.assert.notSpecified('username'));
        return this.wrapListing('badge', this.#instance.get('/profile/users/' + username + '/badges'));
    }


    // AUTHORED TAGS
    getAuthoredTags = function({ username = this.username } = {}) {
        assert(username, this.#errors.assert.notSpecified('username'));
        return this.wrapListing('tag', this.#instance.get('/profile/users/' + username + '/tags'));
    }


    // OBSERVED
    getFollowedTags = function({ username = this.username, page = null} = {}) {
        assert(username, this.#errors.assert.notSpecified('username'));
        return this.wrapListing('tag', this.#instance.get('/profile/users/' + username + '/observed/tags', { params: { page: page }}));
    }

    getFollowedUsers = function({ username = this.username, page = null } = {}) {
        assert(username, this.#errors.assert.notSpecified('username'));
        return this.wrapListing('profile', this.#instance.get('/profile/users/' + username + '/observed/users/following', { params: { page: page }}));
    }

    getFollowers = function({ username = this.username, page = null } = {}) {
        assert(username, this.#errors.assert.notSpecified('username'));
        return this.wrapListing('profile', this.#instance.get('/profile/users/' + username + '/observed/users/followers', { params: { page: page }}));
    }


    // NOTES
    getNote = function({ username = this.username } = {}) {
        assert(username, this.#errors.assert.notSpecified('username'));
        return this.#instance.get('/notes/' + username);
    }

    createNote = function({ username = this.username, content = null } = {}) {
        assert(username, this.#errors.assert.notSpecified('username'));
        return this.#instance.put('/notes/' + username, {
            data: {
                content: content
            }
        }).then(_ => { return this });
    }

    clearNote = function({ username = this.username } = {}) {
        return this.createNote(username)
    }

    // PM
    getConversation = function({ username = this.username } = {}) {
        assert(username, this.#errors.assert.notSpecified('username'));
        return new Conversation(this.#core, { username: username }).get()
    }    
}