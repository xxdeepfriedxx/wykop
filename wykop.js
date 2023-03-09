import assert from 'assert';
import proxymise from 'proxymise';
import FormData from 'form-data';
 
import API from './lib/wykop-api.js';
import Core from './lib/wykop-core.js';
import Errors from './lib/wykop-errors.js';

import Entry from './lib/wykop-entry.js';
import EntryComment from './lib/wykop-entry-comment.js';
import Link from './lib/wykop-link.js';
import LinkComment from './lib/wykop-link-comment.js';
import LinkRelated from './lib/wykop-link-related.js';
import Draft from './lib/wykop-link-draft.js';
import Article from './lib/wykop-article.js';
import Profile from './lib/wykop-profile.js';
import Tag from './lib/wykop-tag.js';
import Conversation from './lib/wykop-conversation.js';
import Badge from './lib/wykop-badge.js';
import Bucket from './lib/wykop-bucket.js';
import {AccountSettings, ProfileSettings} from './lib/wykop-settings.js';

export default class Wykop extends API {
	#core; #database; #instance; #errors
	constructor({ appkey, secret, token, rtoken, environment, proxies = true, debug = false } = {}) {
		if ((!token || typeof token !== 'string') &&
			(!rtoken || typeof rtoken !== 'string') &&
			(appkey === undefined || secret === undefined)
		) {
			assert(false, (new Errors).assert.noCredentials());
		}

		const core = new Core({ appkey: appkey, secret: secret, token: token, rtoken: rtoken, environment: environment, debug: debug });
		super(core); this.#core = core; this.#instance = core.instance; this.#errors = core.errors; this.#database = core.database

		return proxies ? proxymise(this) : this
	}

	// === Objects
	entry = function(id) {
		assert(id, this.#errors.assert.notSpecified('id'));
		return new Entry(this.#core, { id: id })
	}

	entryComment = function({ id, entryId } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		assert(entryId, this.#errors.assert.notSpecified('entryId'));
		return new EntryComment(this.#core, { id: id, parent: { id: entryId }})
	}

	link = function(id) {
		assert(id, this.#errors.assert.notSpecified('id'));
		return new Link(this.#core, { id: id })
	}

	linkComment = function({ id, linkId } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		assert(linkId, this.#errors.assert.notSpecified('linkId'));
		return new LinkComment(this.#core, { id: id, parent: { id: linkId }});
	}

	article = function(id) {
		assert(id, this.#errors.assert.notSpecified('id'));
		return new Article(this.#core, { id: id })
	}

	draft = function(id) {
		assert(key, this.#errors.assert.notSpecified('key'));
		return new Draft(this.#core, { key: key })
	}

	profile = function(username) {
		assert(username, this.#errors.assert.notSpecified('username'));
		return new Profile(this.#core, { username: username });
	}

	tag = function(tag) {
		assert(tag, this.#errors.assert.notSpecified('tag'));
        return new Tag(this.#core, { name: tag })
	}

	conversation = function(username) {
		assert(username, this.#errors.assert.notSpecified('username'));
        return new Conversation(this.#core, { user: { username: username }})
	}

	badge = function(slug) {
		assert(slug, this.#errors.assert.notSpecified('slug'));
		return new Badge(this.#core, { slug: slug })
	}

	// === Content ===
	getEntry = function(id) {
		return this.entry(id).get();
	}

	getEntryComment = function({ id, entryId } = {}) {
		return this.entryComment({ id: id, entryId: entryId });
	}

	submitEntry = function({ content = null, photo = null, embed = null, survey = null, adult = false } = {}) {
		return this.wrapContent('entry', this.#instance.post('/entries', {
			data: {
				content: content,
				photo: photo,
				embed: embed,
				survey: survey,
				adult: adult
			}
		}));
	}

	submitEntryComment = function({ entryId = null, content = null, photo = null, embed = null, survey = null, adult = false } = {}) {
		assert(entryId, this.#errors.assert.notSpecified('entryId'));
		return this.entry(entryId).submitComment({ 
			content: content, 
			photo: photo, 
			embed: embed, 
			adult: adult 
		});
	}

	createSurvey = function({ question = null, answers = null, entryId = null } = {}) {
		assert(question, this.#errors.assert.notSpecified('question'));
		assert(answers, this.#errors.assert.notSpecified('answers'));

		return this.#instance.post('/entries/survey', {
			data: {
				question: question,
				answers: answers
			}
		},{
			params: {
				entryId: entryId,
			}
		}).then(res => res.data.survey_id);
	}

	createEmbed = function(url) {
		assert(url, this.#errors.assert.notSpecified('url'));
		return this.#instance.post('/media/embed', {
			data: {
				url: url
			}
		}).then(res => res.data);
	}

	createPhoto = function({ type = null, url = null } = {}) {
		assert(['settings', 'comments', 'links'].includes(type), this.#errors.assert.invalidValue('type', '"settings", "comments" (also used for entries), "links"'));
		assert(url, this.#errors.assert.notSpecified('url'));
		
		return this.#instance.post('/media/photos', {
			data: {
				url: url
			}
		},{
			params: {
				type: type,
			}
		}).then(res => res.data);
	}

	uploadPhoto = function({ type = null, file = null, fileName = null } = {}) {
		assert(['settings', 'comments', 'links'].includes(type), this.#errors.assert.invalidValue('type', '"settings", "comments" (also used for entries), "links"'));
		assert(file, this.#errors.assert.notSpecified('file'));

		const form = new FormData();
		form.append('file', file, fileName ?? 'image');
		return this.#instance.post('/media/photos/upload', form, {
			params: {
				type: type,
			}
		}).then(res => res.data);
	}

	getLink = function(id) {
		return this.link(id).get();
	}

	getLinkComment = function({ id, linkId } = {}) {
		return this.linkComment({ id: id, linkId: linkId }).get();
	}

	createURLDraft = function(url) {
		assert(url, this.#errors.assert.notSpecified('url'));
		return this.wrapContent('draft', this.#instance.post('/links/draft', {
			data: {
				url: url
			}
		}));
	}

	getArticle = function(id) {
		this.article(id).get();
	}

	createArticleDraft = function({ title = null, content = null, html = null } = {}) {
		assert(title, this.#errors.assert.notSpecified('title'));
		assert(content, this.#errors.assert.notSpecified('content'));
		assert(html, this.#errors.assert.notSpecified('html'));
		return this.wrapContent('draft', this.#instance.post('/articles', {
			data: {
				title: title,
				content: `{"time":1112470620000,"blocks":[{"type":"paragraph","data":{"text":"${content}"}}],"version":"21.3.7"}`,
				content_html: html
			}
		}));
	}

	getDraft = function(key) {
		this.draft(key).get()
	}

    getConversation = function(username) {
		this.conversation(username).get()
    }

    getTag = function(tag, config) {
		this.tag(tag).get()
    }

    getTagContent = function(tag, config) {
		this.tag(tag).getContent(config)
    }

	getProfile = function(username) {
		return this.profile(username).get();
	}

	getMe = async function() {
		return this.getProfile(await this.getLoggedUser());
	}

	getMeShort = function() {
		return this.wrapContent('profile', this.#instance.get('/profile/short'));
	}

	getBadge = function(slug) {
		this.badge(slug).get();
	}

	// Get links that are on the homepage or in upcomming
	#getLinks = function({ type = null, sort = null, category = null, bucket = null, page = null } = {}) {
		assert(['homepage', 'upcomming', null].includes(type), this.#errors.assert.invalidValue('type', 'homepage, upcomming'))
		return this.wrapListingMixed(this.#instance.get('/links', {
			params: {
				type: type,
				sort: sort,
				category: category,
				bucket: bucket,
				page: page
			}
		}));
	}

	// Helper function for getting homepage data from `getLinks()`
	getHomepage = function({ sort = null, category = null, bucket = null, page = null } = {}) {
		assert(['newest', 'active', null].includes(sort), this.#errors.assert.invalidValue('sort', 'newest, active'));
		return this.#getLinks({
			type: 'homepage',
			sort: sort,
			category: category,
			bucket: bucket,
			page: page
		});
	}

	// Helper function for getting upcoming data from `getLinks()`
	getUpcomming = function({ sort = null, category = null, bucket = null, page = null } = {}) {
		assert(['newest', 'active', 'commented', 'digged', null].includes(sort), this.#errors.assert.invalidValue('sort', 'newest, active, commented, digged'));
		return this.#getLinks({
			type: 'upcomming',
			sort: sort,
			category: category,
			bucket: bucket,
			page: page
		});
	}

	// Get the number of links currently in the 'upcoming' section
	getUpcommingCount = function({ category = null, bucket = null } = {}) {
		return this.wrapContent('none', this.#instance.get('/links/stats/upcoming', { 
			params: {
				category: category,
				bucket: bucket
			}
		})).then(res => res.count);
	}

	// Get a link based on an URL
	getLinkByURL = function(url) {
		assert(url, this.#errors.assert.notSpecified('url'));
		return this.wrapContent('link', this.#instance.get('/links/url', {
			params: {
				url: url
			}
		}));
	}

	getHits = function({ year = null, month = null, sort = null } = {}) {
		assert(['all', 'day', 'week', 'month', 'year', null].includes(sort), this.#errors.assert.invalidValue('sort', 'all, day, week, month, year'));
		return this.wrapListingMixed(this.#instance.get("/hits/links", {
			params: {
				year: year,
				month: month,
				sort: sort
			}
		}));
	}

	#getEntries = function({ sort = 'hot', lastUpdate = '12', category = null, bucket = null, page = null } = {}) {
		assert(['newest', 'active', 'hot', null].includes(sort), this.#errors.assert.invalidValue('sort', 'newest, active, hot'));
		assert(['1', 1, '2', 2, '3', 3, '6', 6, '12', 12, '24', 24, null].includes(lastUpdate), this.#errors.assert.invalidValue('lastUpdate', '1, 2, 3, 6, 12, 24'));
		
		return this.wrapListing('entry', this.#instance.get('/entries', {
			params: {
				sort: sort,
				last_update: lastUpdate,
				category: category,
				bucket: bucket,
				page: page
			}
		}));
	}

	getMicroblog = function(config = {}) {
		return this.#getEntries(config);
	}

	getFavoriteContent = function({ sort = null, type = null, page = null } = {}) {
		assert(['newest', 'oldest', null].includes(sort), this.#errors.assert.invalidValue('sort', 'newest, oldest'));
		assert(['link', 'entry', 'link_comment', 'entry_comment', null].includes(type), this.#errors.assert.invalidValue('type', 'link, entry, link_comment, entry_comment'));
		return this.wrapListingMixed(this.#instance.get('/favourites', {
			data: {
				sort: sort,
				resource: type,
				page: page
			}
		}));
	}

	getObservedContent = function({ page = null } = {}) {
		return this.wrapListingMixed(this.#instance.get('/observed/all', {
			params: {
				page: page
			}
		}));
	}

	getObservedUsersContent = function({ page = null } = {}) {
		return this.wrapListingMixed(this.#instance.get('/observed/users', {
			params: {
				page: page
			}
		}));
	}

	// date should be formatted “yyyy-MM-dd HH:mm:ss”
	getNewerObservedUsersContentCount = function({ date = null, lastId = null } = {}) {
		assert(date || lastId, this.#errors.assert.notSpecified('date or lastId'));
		return this.wrapListingMixed(this.#instance.get('/observed/users/newer', {
			data: {
				date: date,
				lastId: lastId
			}
		}));
	}

	getObservedTagsContent = function({ page = null } = {}) {
		return this.wrapListingMixed(this.#instance.get('/observed/tags/stream', {
			params: {
				page: page
			}
		}));
	}

	getAutocompleteSuggestionsForTag = function(query) {
		assert(query, this.#errors.assert.notSpecified('query'));
		return this.wrapListing('tag', this.#instance.get('/tags/autocomplete', {
			params: {
				query: query
			}
		}));
	}

	getAutocompleteSuggestionsForUser = function(query) {
		return this.wrapListing('profile', this.#instance.get('/users/autocomplete', {
			params: {
				query: query
			}
		}));
	}

	getPopularTags = function() {
		return this.wrapListing('tag', this.#instance.get('/tags/popular'));
	}

	getPopularAuthoredTags = function() {
		return this.wrapListing('tag', this.#instance.get('/tags/popular-user-tags'));
	}

	// === Search ===
	getSearchContent = function(query, { type = 'all', sort = null, votes = null, dateFrom = null, dateTo = null, tags = null, users = null, category = null, bucket = null, page = null } = {}) {
		assert(['all', 'links', 'entries', 'users'].includes(type), this.#errors.assert.invalidValue('type', ['all', 'links', 'entries', 'users']))
		assert([null, 'score', 'popular', 'comments', 'newest'].includes(sort), this.#errors.assert.invalidValue('sort', ['score', 'popular', 'comments', 'newest']))
		assert([null, '50', '100', '500', '1000', 50, 100, 500, 1000].includes(votes), this.#errors.assert.invalidValue('votes', '50, 100, 500, 1000'))

		let params = {};
		if (query) { params.query = query }
		if (sort) { params.sort = sort }
		if (votes) { params.votes = votes }
		if (tags) { params.tags = tags }
		if (users) { params.users = users }
		if (category) { params.category = category }
		if (bucket) { params.bucket = bucket }
		if (page) { params.page = page }

		let stringParams = '';
		if (dateFrom) { 
			dateFrom.setHours(2,0,0);
			stringParams += `date_from=${this.formatDate(dateFrom)}` 
		}
		
		if (dateTo) { 
			dateTo.setHours(25,59,59);
			if (stringParams.length) { stringParams += '&' }
			stringParams += `date_to=${this.formatDate(dateTo)}` 
		}

		if (type === 'all') {
			return this.#instance.get('/search/' + type + (stringParams.length ? `?${stringParams}` : ''), { 
				params: params
			}).then(async res => {
				res = res.data
				if (res.links.items) { res.links.items = await this.wrapListing('link', res.links.items) }
				if (res.entries.items) { res.entries.items = await this.wrapListing('entry', res.entries.items) }
				if (res.users.items) { res.users.items = await this.wrapListing('profile', res.users.items) }
				return res;
			})
		}

		return this.wrapListing(type, this.#instance.get('/search/' + type + (stringParams.length ? `?${stringParams}` : ''), { 
			params: params
		}));
	}

	// === Notifications ===
	getNotificationStatus = function() {
		return this.wrapContent('none', this.#instance.get('/notifications/status'));
	}

    getPersonalNotifications = function({ page } = {}) {
		return this.wrapListing('notification_personal', this.#instance.get('/notifications/entries', {
			params: {
				page: page
			}
		}));
	}

	markPersonalNotificationsAsRead = function() {
		return this.#instance.put('/notifications/entries/all');
	}

	removePersonalNotifications = function() {
		return this.#instance.delete('/notifications/entries/all');
	}

    getTagNotifications = function({ page } = {}) {
		return this.wrapListing('notification_tag', this.#instance.get('/notifications/tags', {
			params: {
				page: page
			}
		}));
	}

	markTagNotificationsAsRead = function() {
		return this.#instance.put('/notifications/tags/all');
	}

	removeTagNotifications = function() {
		return this.#instance.delete('/notifications/tags/all');
	}

    getPMNotifications = function({ page } = {}) {
		return this.wrapListing('notification_pm', this.#instance.get('/notifications/pm', {
			params: {
				page: page
			}
		}));
	}

	markPmNotificationsAsRead = function() {
		return this.#instance.put('/notifications/pm/all');
	}

	removePmNotifications = function() {
		return this.#instance.delete('/notifications/pm/all');
	}

    getOpenConversation = async function() {
		return new Conversation(this.#core, { user: { username: await this.#instance.get('/pm/open').then(res => res.data) }}).get();
	}

	markAllConversationsAsRead = function() {
		return this.#instance.put('/pm/read-all');
	}

	getConversations = function({ query = null } = {}) {
		return this.wrapListing('conversation', this.#instance.get('/pm/conversations', {
			params: {
				query: query
			}
		}));
	}

	// === Categories ===
	getCategories = function() {
		return this.wrapListing('none', this.#instance.get('/categories'));
	}

	getUserCategories = function() {
		return this.wrapListing('bucket', this.#instance.get('/buckets'));
	}

	getUserCategoryStatus = function() {
		return this.#instance.get('/buckets/status');
	}

	addUserCategory = function({ title = null, query = null } = {}) {
		assert(title, this.#errors.assert.notSpecified('title'));
		assert(query, this.#errors.assert.notSpecified('query'));
		return this.wrapContent('bucket', this.#instance.post('/buckets', {
			data: {
				title: title,
				query: query
			}
		}));
	}

	getUserCategoryContentPreview = function(query) {
		assert(query, this.#errors.assert.notSpecified('query'));
		return this.wrapListingMixed(this.#instance.get('/buckets/search', {
			data: {
				query: query
			}
		}));
	}

	getBadges = function() {
		return this.wrapListing('badge', this.#instance.get('/badges').then(res => res.data.flat())); 
	}

	getRanking = function({ page = null } = {}) {
		return this.wrapListing('profile', this.#instance.get('/rank', {
			params: {
				page: page
			}
		}));
	}

	getMyRank = function() {
		return this.getMeShort().then(res => res.rank)
	}

	// === Security ===
	login = function(username, password, { captcha = null } = {}) {
		assert(username, this.#errors.assert.notSpecified('username'));
		assert(password, this.#errors.assert.notSpecified('password'));

		this.#core.clearRefreshToken();

		let request = {
			data: {
				username: username,
				password: password
			}
		};

		if (captcha) {
			request.data.captcha = captcha;
		}

		return this.wrapContent('none', this.#instance.post('/login', request)).then(res => {
			if (!res.refresh_token) { 
				res.info = 'This means the user has 2FA turned on, call w.submit2FACode with this token and 2FA code'
				return res 
			}
			return this.#core.saveTokens(res.token, res.refresh_token);
		});
	}

	logout = function() {
		this.#core.clearRefreshToken();
		
		return this.#instance.get('/logout').finally(_ => {
			this.#core.clearTokens()
		});
	}

	submit2FACode = function({ token, code } = {}) {
		return this.wrapContent('none', this.#instance.post('/2fa/' + token, {
			data: {
				code: code
			}
		})).then(res => {
			return this.#core.saveTokens(res.token, res.refresh_token);
		});
	}

	submit2FARecoveryCode = function({ token, code } = {}) {
		return this.wrapContent('none', this.#instance.post('/2fa/' + token + '/recover', {
			data: {
				code: code
			}
		})).then(res => {
			return this.#core.saveTokens(res.token, res.refresh_token);
		});
	}

	requestPasswordReset = function(email) {
		return this.wrapContent('none', this.#instance.post('/password', {
			data: {
				email: email
			}
		}));
	}

	submitPasswordReset = function({ token, password } = {}) {
		return this.wrapContent('none', this.#instance.post('/password/' + token, {
			data: {
				password: password,
				password_confirmation: password
			}
		}));
	}

	// === Registration ===
	registerNewAccount = function({ username = null, email = null, password = null, phone = null } = {}) {
		assert(username, this.#errors.assert.notSpecified('username'));
		assert(email, this.#errors.assert.notSpecified('email'));
		assert(password, this.#errors.assert.notSpecified('password'));
		assert(phone, this.#errors.assert.notSpecified('phone'));
		return this.wrapContent('none', this.#instance.post('/users', {
			data: {
				username: username,
				email: email,
				password: password,
				phone: phone,
				rules: true
			}
		})).then(res => res.hash);
	}

	rerequestRegistrationSMS = function({ hash = null } = {}) {
		assert(hash, this.#errors.assert.notSpecified('hash'));
		return this.#instance.get('/users/resend/' + hash);
	}

	submitRegistrationSMS = function({ hash = null, code = null } = {}) {
		assert(hash, this.#errors.assert.notSpecified('hash'));
		assert(code, this.#errors.assert.notSpecified('code'));
		return this.#instance.post('/users/sms/' + hash, {
			data: {
				code: code
			}
		});
	}

	submitRegistrationEmailToken = function({ token = null } = {}) {
		assert(token, this.#errors.assert.notSpecified('token'));
		return this.#instance.post('/users/confirmation/' + token).then(res => {
			return this.#core.saveTokens(res.data.token, res.data.refresh_token);
		})
	}

	// === Wykop Connect ===
	getWykopConnectURL = function() {
		return this.wrapContent('none', this.#instance.get('/connect')).then(res => {
			res.token = res.connect_url.split('/').pop()
			return res
		});
	}

	// Doesn't seem to work?
	getWykopConnectStatus = function(token) {
		assert(token, this.#errors.assert.notSpecified('token'));
		return this.wrapContent('none', this.#instance.get('/connect/' + token))
	}

	acceptWykopConnectPermissions = function(token, { send_message = false, read_profile = false, add_comment = false, add_link = false, add_entry = false, add_vote = false } = {}) {
		assert(token, this.#errors.assert.notSpecified('token'));
		return this.wrapContent('none', this.#instance.put('/connect/' + token, {
			data: {
				send_message: send_message,
				read_profile: read_profile,
				add_comment: add_comment,
				add_link: add_link,
				add_entry: add_entry,
				add_vote: add_vote
			}
		})).then(res => {
			res.domain = res.redirect_url.match(/(.+)\?/)[1]
			res.token = res.redirect_url.match(/(?:token=)([\w.-]+)/)[1]
			res.rtoken = res.redirect_url.match(/(?:rtoken=)([\w.-]+)/)[1]
			return res
		});
	}


	// === Authorize ===
	// Get a list of account blockades - what kind of blokades?
	getAccountBlockades = function() {
		return this.#instance.get('/security/authorize')
	}

	requestAccountBlockadeSMS = function() {
		return this.#instance.post('/security/authorize/sms/send')
	}

	rerequestAccountBlockadeSMS = function() {
		return this.#instance.get('/security/authorize/sms/resend')
	}

	submitAccountBlockadeSMS = function(code) {
		assert(code, this.#errors.assert.notSpecified('code'));
		return this.#instance.post('/security/authorize/sms', {
			data: {
				code: code
			}
		});
	}

	submitAccountBlockadeCaptcha = function(code) {
		assert(code, this.#errors.assert.notSpecified('code'));
		return this.#instance.post('/security/authorize/recaptcha', {
			data: {
				code: code
			}
		});
	}

	acceptTermsAndConditions = function() {
		return this.#instance.post('/security/authorize/statute');
	}

	// === Settings === 

    // twoFactor = new TwoFactor(this.#core);
	// blacklists = new Blacklists(this.#core);
	// general = new General(this.#core);
	// sessions = new Sessions(this.#core);

	getAccountSettings = function() {
		return new AccountSettings(this.#core).get()
	}

	getProfileSettings = function() {
		return new ProfileSettings(this.#core).get()

	}

	getPhone = function() {
		return this.wrapContent('none', this.#instance.get('/settings/phone')).then(res => res.phone);
	}

	getEmail = function() {
		return this.wrapContent('none', this.#instance.get('/settings/email')).then(res => res.email);
	}

	requestChangePhoneNumber = function(phone) {
		assert(phone, this.#errors.assert.notSpecified('phone'));
		return this.#instance.put('/settings/changephone', {
			data: {
				phone: phone
			}
		});
	}

	submitChangePhoneNumberSMS = function(code) {
		assert(code, this.#errors.assert.notSpecified('code'));
		return this.#instance.post('/settings/changephone', {
			data: {
				code: code
			}
		});
	}

	// === Config ===
	getAccountColorHexes = function() {
		return this.wrapListing('none', this.#instance.get('/config/colors'));
	}

	getAccountColorHex = function(name) {
		assert(name, this.#errors.assert.notSpecified('name'));
		return this.wrapContent('none', this.#instance.get('/config/colors/' + name));
	}

	// === Contact ===
	get supportReasons() {
		return {
			technicalProblems: 1,
			moderationRelated: 2,
			breachOfTermsAndConditions: 3,
			featureSuggestions: 4,
			problemWithEmail: 5,
			cooperationRequest: 6,
			accessToAPI: 7,
			companyVerification: 8,
			deleteAccount: 9,
			other: 10,
			iodo: 11
		}
	}

	submitSupportMessage = function({ reason = null, email = null, message = null, file = null, info = null, url = null } = {}) {
		assert(reason, this.#errors.assert.invalidValue('reason', '1: Problemy techniczne, 2: Sprawy moderacyjne, 3: Zgłoszenia naruszeń regulaminu, 4: Sugestie nt. funkcjonalności serwisu, 5: Problemy z adresem e-mail, 6: Propozycja współpracy, 7: Dostęp do API, 8: Weryfikacja profilu firmowego, 9: Usunięcie konta, 10: Inne, 11: IOD'));
		assert(email, this.#errors.assert.notSpecified('email'));
		assert(message, this.#errors.assert.notSpecified('message'));

		const requestData = {
			data: {
				reason: reason,
				email: email,
				message: message,
				info: info,
				url: url
			}
		}

		if (file) {
			let form = new FormData();
			form.append('file', file, 'image');
			return this.#instance.post('/contact/support', form, requestData);
		}

		return this.#instance.post('/contact/support', requestData);
	}

	submitGDPRMessage = function({ email = null, message = null } = {}) {
		assert(email, this.#errors.assert.notSpecified('email'));
		assert(message, this.#errors.assert.notSpecified('message'));
		return this.#instance.post('/contact/gdpr', {
			data: {
				email: email,
				message: message
			}
		});
	}

	// === Moderation ===
	getReportedContent = function({ page = null } = {}) {
        return this.wrapListing('none', this.#instance.get('/reports/reports', {
        	params: {
        		page: page
        	}
        }));
	}

	generateReportURL = function({ linkId = null, entryId = null, linkCommentId = null, entryCommentId = null, profile = null, relatedId = null } = {}) {
        let data = null

        if (profile)  		  { data = { type: 'profile', 	  	id: profile }}
        if (entryId)  		  { data = { type: 'entry', 		id: entryId }}
        if (linkId)  		  { data = { type: 'link', 		  	id: linkId 	}}
        if (entryCommentId)   { data = { type: 'entry_comment', id: entryCommentId,  parent_id: entryId }}
        if (linkCommentId)    { data = { type: 'link_comment',  id: linkCommentId,   parent_id: linkId 	}}
        if (relatedId)  	  { data = { type: 'link_related',  id: relatedId, 	   	 parent_id: linkId 	}}

		return this.wrapContent('none', this.#instance.post('reports/reports', {
			data: data
		})).then(res => res.url);
	}

	getModeratedContent = function({ page = null } = {}) {
        return this.wrapListing('none', this.#instance.get('/reports/moderated', {
        	params: {
        		page: page
        	}
        }));
	}

	submitAppeal = function({ reportId = null, content = null } = {}) {
		assert(reportId, this.#errors.assert.notSpecified('reportId'));
		assert(content, this.#errors.assert.notSpecified('content'));
		return this.#instance.post('/reports/moderated/' + reportId + '/appeal', {
			data: {
				content: content
			}
		});
	}

	getAppeals = function({ page = null } = {}) {
        return this.wrapListing('none', this.#instance.get('/reports/appeals', {
        	params: {
        		page: page
        	}
        }));
	}

	// === Helpful ===
	getToken = async function() {
		return this.#core.getTokens()
	}

    formatDate = async function(date) {
		assert(date, this.#errors.assert.notSpecified('date'));
	  	return date.toISOString().replace(/T/, '+').replace(/\..+/, '');
	}

	// === Token info ===
	saveConnectTokens = async function(data) {
		return this.#core.saveTokens(data.token, data.rtoken)
	}

	databaseExtract = async function() {
		return this.#database.extract
	}

	get #tokenData() {
		if (!this.#database.token) { return null }
		return JSON.parse(atob(this.#database.token.split('.')[1]));
	}

	tokenExpireDate = async function() {
		return new Date((this.#tokenData?.exp?? 0) * 1000)
	}

	hasTokenExpired = async function() {
		return this.tokenExpiry < Date.now()
	}

	getLoggedUsername = async function() {
		return (this.#tokenData?.username ?? null)
	}

	isLogged = async function() {
		return (this.#tokenData?.roles ?? []).includes('ROLE_USER');
	}
}