<img src="https://wykop.pl/static/img/svg/wykop-min-logo.svg" width="100">

# WykopJS 
A wrapper for the new Wykop API v3 written in NodeJS 

- Still a work-in-progress
- No need to worry about new tokens or refresh tokens
- Most common objects are wrapped in a class
- The ["Documentation"](#documentation) is currently just a list of functions that are available with their return value
- Wykop.pl seems to be working on the API, they might occasionally break something
- For an example inplementation see [WykopMonitorJS](https://github.com/xxdeepfriedxx/wykop-monitor)

## Getting started
### Add the package
```
npm i wykop
```
### Import WykopJS and initialise
```javascript
const Wykop = require('wykop');
const w = new Wykop({ /*config*/ });
```

### Examples
Here we get the list of upvotes from the newest post currently on the homepage:
```javascript
const upvotes = await w.getHomepage({ sort: 'newest' }).items[0].getUpvotes();
```
The wrapper 'wraps' most response data in classes that have their own functions, so for example, we can use the list of upvotes from the previous example and check the activity of the first upvoter like this:
```javascript
const activity = await upvotes.items[0].user.getActions()
```
instead of like this (which but would also work):
```javascript
const activity = await w.getProfile(upvotes.items[0].user.username).getActions()
```
Here's the full code of the simple example above in CommonJS:
```javascript
const Wykop = require('wykop');

(async () => {
    const w = new Wykop({
        token: '<your-token>'
    });

    // get the list of upvotes from the newest post currently on the homepage
    const upvotes = await w.getHomepage({ sort: 'newest' }).items[0].getUpvotes();

    // get the latest activity of the first upvoter
    const activity = await upvotes.items[0].user.getActions();

    console.log(activity);
})();
```

- See also: [Example: Simple wołacz](/examples/example-wołacz.js)

## "Documentation"
- [`new Wykop(config)`](#new-wykopconfig)
- [`Wykop` functions](#available-functions-directly-on-the-wykop-object)
- [`Entry` functions](#available-functions-on-entry-objects)
- [`EntryComment` functions](#available-functions-on-entrycomment-objects)
- [`Link` functions](#available-functions-on-link-objects)
- [`LinkComment` functions](#available-functions-on-linkcomment-objects)
- [`LinkRelated` functions](#available-functions-on-linkrelated-objects)
- [`Draft` functions](#available-functions-on-draft-objects)
- [`Article` functions](#available-functions-on-article-objects)
- [`ArticleHistory` functions](#available-functions-on-articlehistory-objects)
- [`Conversation` functions](#available-functions-on-conversation-objects)
- [`Profile` functions](#available-functions-on-profile-objects)
- [`Tag` functions](#available-functions-on-tag-objects)
- [`Badge` functions](#available-functions-on-badge-objects)
- [`Bucket` functions](#available-functions-on-bucket-objects)
- [`Notification` functions](#available-functions-on-personalnotification-tagnotification-and-pmnotification-objects)
- [`AccountSettings` functions](#available-functions-on-accountsettings-objects)
- [`ProfileSettings` functions](#available-functions-on-profilesettings-objects)
- [`Listing` functions](#available-functions-directly-on-the-listing-object)
- [`Pagination` functions](#available-functions-directly-on-the-pagination-object)

### new Wykop(config)
This constructs a new instance of WykopJS, available options are:

| Option                | Default                     | Description |
| ---                   | ---                         | --- |
| `config.appkey`       | `null`                      | \<optional> The appkey you received from Wykop (1) |
| `config.secret`       | `null`                      | \<optional> The secret you received from Wykop (1) |
| `config.token`        | `null`                      | \<optional> Your access token (1) |
| `config.rtoken`       | `null`                      | \<optional> Your refresh token (1) |
| `config.environment`  | `https://wykop.pl/api/v3`   | \<optional> The environment (we probably never need this) |
| `config.proxies`      | `true`                      | \<optional> Proxies allow for Promise chaining but you can turn them off here. This option wraps a Proxy around the `new Wykop({ /*config*/ })` object |
| `config.debug`        | `false`                     | \<optional> Mostly just logs the requests and responses we get from the API |

(1) For an instance to successfully initialize, you need to provide at least (a) an `appkey` and a `secret`, (b) a `rtoken` or (c) a `token`. The best option is to provide an `appkey` and `secret`, that way we can generate tokens whenever we need a new one and you don't need to keep track of them. The second best option is to provide a `rtoken`, you'll be logged in and we can generate new tokens, but you'll need to keep track of the latest `rtoken` somewhere, so you can easily create a new Wykop instance. The last option is to provide a `token` but you'll be limited by the expiration date on the token, so it'll just stop working after some time

### Available functions directly on the `Wykop` object:

```javascript
w.entry('1234')
// returns an empty Entry object that can be used to access its class functions
```
```javascript
w.entryComment({ id: '4321', entryId: 1234 })
// returns an empty EntryComment object that can be used to access its class functions
```
```javascript
w.link('1234')
// returns an empty Link object that can be used to access its class functions
```
```javascript
w.linkComment({ id: '4321', linkId: '1234' })
// returns an empty LinkComment object that can be used to access its class functions
```
```javascript
w.linkRelated({ id: '4321', linkId: '1234' })
// returns an empty LinkRelated object that can be used to access its class functions
```
```javascript
w.article('1234')
// returns an empty Article object that can be used to access its class functions
```
```javascript
w.draft('3hbh2jg3b')
// returns an empty Draft object that can be used to access its class functions
```
```javascript
w.profile('wykop')
// returns an empty Profile object that can be used to access its class functions
```
```javascript
w.tag('heheszki')
// returns an empty Tag object that can be used to access its class functions
```
```javascript
w.conversation('wykop')
// returns an empty Conversation object that can be used to access its class functions
```
```javascript
w.badge('3hbh2jg3b')
// returns an empty Badge object that can be used to access its class functions
```
```javascript
w.bucket('3hbh2jg3b')
// returns an empty Bucket object that can be used to access its class functions
```
```javascript
w.getEntry('1234')
// returns a Promise that resolves to an Entry object
```
```javascript
w.getEntryComment({ id: '4321', entryId: '1234' })
// returns a Promise that resolves to an EntryComment object
```
```javascript
w.submitEntry({ content: 'Hello World!', photo: '3hbh2jg3b', embed: '3hbh2jg3b', survey: '3hbh2jg3b', adult: false })
// returns a Promise that resolves to an Entry object
```
```javascript
w.submitEntryComment({ entryId: '1234', content: 'Hello again!', photo: '3hbh2jg3b', embed: '3hbh2jg3b', adult: false })
// returns a Promise that resolves to an EntryComment object
```
```javascript
w.createSurvey({ question: 'Pizza or Pasta?', answers: ['Pizza', 'Pasta'], entryId: '1234' })
// returns a Promise that resolves to a string
```
```javascript
w.createEmbed('https://youtube.com/watch?v=123456789')
// returns a Promise that resolves to an object, where object.key is the embed 'id'
```
```javascript
w.createPhoto({ type: 'comments', url: 'https://cataas.com/cat/says/hello%20world!' })
// returns a Promise that resolves to an object, where object.key is the photo 'id'
```
```javascript
w.uploadPhoto({ type: 'links', file: await Buffer.from(image.data, 'binary'), fileName: 'wykop-js-image' })
// returns a Promise that resolves to an object, where object.key is the photo 'id'
```
```javascript
w.removePhoto('3hbh2jg3b')
// returns a Promise that resolves to an empty string
```
```javascript
w.getLink('1234')
// returns a Promise that resolves to a Link object
```
```javascript
w.getLinkComment({ id: '4321', linkId: '1234' })
// returns a Promise that resolves to a LinkComment object
```
```javascript
w.getLinkRelated({ id: '4321', linkId: '1234' })
// returns a Promise that resolves to a LinkRelated object
```
```javascript
w.createURLDraft('https://cataas.com/#/')
// returns a Promise that resolves to a Draft object
```
```javascript
w.getArticle('1234')
// returns a Promise that resolves to an Article object
```
```javascript
w.createArticleDraft({ 
    title: 'Hello world!', 
    // The format used for the 'content' seems to be https://editorjs.io
    content: '{"time":1112470620000,"blocks":[{"type":"paragraph","data":{"text":"This is an example that just shows a string"}}],"version":"21.3.7"}', 
    html: "Anything random, don't think this is used" 
})
// returns a Promise that resolves to a Draft object
```
```javascript
w.getDraft('3hbh2jg3b')
// returns a Promise that resolves to a Draft object
```
```javascript
w.getConversation('wykop')
// returns a Promise that resolves to a Conversation object
```
```javascript
w.getTag('heheszki')
// returns a Promise that resolves to a Tag object
```
```javascript
w.getTagContent('heheszki', { sort: 'best' })
// returns a Promise that resolves to a Listing object, where Listing.items is a list of Entry and Link objects
```
```javascript
w.getProfile('m__b')
// returns a Promise that resolves to a Profile object
```
```javascript
w.getMe()
// returns a Promise that resolves to a Profile object
```
```javascript
w.getMeShort()
// returns a Promise that resolves to a Profile object
```
```javascript
w.getBadge('rocznica')
// returns a Promise that resolves to a Badge object
```
```javascript
w.getHomepage({ sort: 'newest', category: null, bucket: '3hbh2jg3b', page: '3hbh2jg3b' })
// returns a Promise that resolves to a Listing object, where Listing.items is a list of Link and Entry objects
```
```javascript
w.getUpcomming({ sort: 'digged', category: '3hbh2jg3b', bucket: null, page: 3 })
// returns a Promise that resolves to a Listing object, where Listing.items is a list of Link and Entry objects
```
```javascript
w.getUpcommingCount({ category: null, bucket: null })
// returns a Promise that resolves to a string
```
```javascript
w.getLinkByURL('https://wykop.pl')
// returns a Promise that resolves to a Link object
```
```javascript
w.getHits({ sort: 'all', year: null, month: null })
// returns a Promise that resolves to a Listing object, where Listing.items is a list of Link objects
```
```javascript
w.getEntryHits({ sort: 'all', year: null, month: null })
// returns a Promise that resolves to a Listing object, where Listing.items is a list of Entry objects
```
```javascript
w.getMicroblog({ sort: 'hot', lastUpdate: '12', category: null, bucket: '3hbh2jg3b', page: '10' })
// returns a Promise that resolves to a Listing object, where Listing.items is a list of Entry objects
```
```javascript
w.getNewerEntriesCount({ lastId: '1234', category: '3hbh2jg3b' })
// returns a Promise that resolves to a string
```
```javascript
w.getFavoriteContent({ sort: 'oldest', type: 'entry', page: null })
// returns a Promise that resolves to a Listing object, where Listing.items is a list of Link, LinkComment, Entry and EntryComment objects
```
```javascript
w.getObservedContent({ page: null })
// returns a Promise that resolves to a Listing object, where Listing.items is a list of Link and Entry objects
```
```javascript
w.getObservedUsersContent({ page: 4 })
// returns a Promise that resolves to a Listing object, where Listing.items is a list of Link and Entry objects
```
```javascript
w.getNewerObservedUsersContentCount({ date: w.formatDate(new Date), lastId: null })
// returns a Promise that resolves to a string
```
```javascript
w.getObservedTagsContent({ page: null })
// returns a Promise that resolves to a Listing object, where Listing.items is a list of Link and Entry objects
```
```javascript
w.getObservedDiscussionsContent({ page: null })
// returns a Promise that resolves to a Listing object, where Listing.items is a list of Link, LinkComment and Entry objects
```
```javascript
w.getAutocompleteSuggestionsForTag('wyko')
// returns a Promise that resolves to a Listing object, where Listing.items is a list of Tag objects
```
```javascript
w.getAutocompleteSuggestionsForUser('wyko')
// returns a Promise that resolves to a Listing object, where Listing.items is a list of Profile objects
```
```javascript
w.getPopularTags()
// returns a Promise that resolves to a Listing object, where Listing.items is a list of Tag objects
```
```javascript
w.getPopularAuthoredTags()
// returns a Promise that resolves to a Listing object, where Listing.items is a list of Tag objects
```
```javascript
w.getSearchContent('wykop api', { type: 'all', sort: null, votes: null, dateFrom: w.formatDate(new Date), dateTo: null, tags: null, users: null, category: null, bucket: null, domains: null, page: null })
// type === 'all' -> returns an object, where object.links.items is a list of Link objects, object.entries.items is a list of Entry objects and object.users.items is a list of Profile objects
// type !== 'all' -> returns a Listing object, where Listing.items is a list of either Link, Entry or Profile objects
```
```javascript
w.getNotificationStatus()
// returns a Promise that resolves to an object
```
```javascript
w.getPersonalNotifications({ page: 2 })
// returns a Promise that resolves to a Listing object, where Listing.items is a list of PersonalNotification objects
```
```javascript
w.markPersonalNotificationsAsRead()
// returns a Promise that resolves to an empty string
```
```javascript
w.removePersonalNotifications()
// returns a Promise that resolves to an empty string
```
```javascript
w.getTagNotifications({ page: '2' })
// returns a Promise that resolves to a Listing object, where Listing.items is a list of TagNotification objects
```
```javascript
w.markTagNotificationsAsRead()
// returns a Promise that resolves to an empty string
```
```javascript
w.removeTagNotifications()
// returns a Promise that resolves to an empty string
```
```javascript
w.getDiscussionNotifications({ page: null })
// returns a Promise that resolves to a Listing object, where Listing.items is a list of PmNotification objects
```
```javascript
w.markDiscussionNotificationsAsRead()
// returns a Promise that resolves to an empty string
```
```javascript
w.removeDiscussionNotifications()
// returns a Promise that resolves to an empty string
```
```javascript
w.getPMNotifications({ page: null })
// returns a Promise that resolves to a Listing object, where Listing.items is a list of PmNotification objects
```
```javascript
w.markPmNotificationsAsRead()
// returns a Promise that resolves to an empty string
```
```javascript
w.removePmNotifications()
// returns a Promise that resolves to an empty string
```
```javascript
w.getOpenConversation()
// returns a Promise that resolves to a Conversation object
```
```javascript
w.markAllConversationsAsRead()
// returns a Promise that resolves to an empty string
```
```javascript
w.getConversations({ 'wyko' })
// returns a Promise that resolves to a Listing object, where Listing.items is a list of Conversation objects
```
```javascript
w.getCategories()
// returns a Promise that resolves to an object
```
```javascript
w.getBucket('3hbh2jg3b')
// returns a Promise that resolves to a Bucket object
```
```javascript
w.getUserCategories()
// returns a Promise that resolves to a Listing object, where Listing.items is a list of Bucket objects
```
```javascript
w.getBucketStatus()
// returns a Promise that resolves to an object
```
```javascript
w.addBucket({ title: 'My first category', query: '#wykop @wykop', defaultPage: 'home' })
// returns a Promise that resolves to a Bucket object
```
```javascript
w.getBucketContentPreview('#wykop @wykop')
// returns a Promise that resolves to a Listing object, where Listing.items is a list of Link and Entry objects
```
```javascript
w.getBadges()
// returns a Promise that resolves to a Listing object, where Listing.items is a list of Badge objects
```
```javascript
w.getRanking({ page: 10 })
// returns a Promise that resolves to a Listing object, where Listing.items is a list of Profile objects
```
```javascript
w.getMyRank()
// returns a Promise that resolves to an object
```
```javascript
w.login(username, password, { captcha: '3hbh2jg3b' })
// returns a Promise that resolves to an object with a token and rtoken OR an object with a token in case the user has 2FA turned on
```
```javascript
w.logout()
// returns a Promise that resolves to an empty string
```
```javascript
w.submit2FACode({ token: '3hbh2jg3b', code: '123123' })
// returns a Promise that resolves to an object with a token and rtoken
```
```javascript
w.submit2FARecoveryCode({ token: '3hbh2jg3b', code: '12D12D' })
// returns a Promise that resolves to an object with a token and rtoken - 2FA is now off
```
```javascript
w.requestPasswordReset('email@example.com')
// returns a Promise that resolves to an empty string
```
```javascript
w.submitPasswordReset({ token: '3hbh2jg3b', password: 'my-new-password' })
// returns a Promise that resolves to an empty string
```
```javascript
w.registerNewAccount({ username: 'username123', email: 'email@example.com', password: 'my-password', phone: '123543678' })
// returns a Promise that resolves to a string that can then be used to confirm the SMS code
```
```javascript
w.rerequestRegistrationSMS({ hash: '3hbh2jg3b' })
// returns a Promise that resolves to an empty string
```
```javascript
w.submitRegistrationSMS({ hash: '3hbh2jg3b', code: '123123' })
// returns a Promise that resolves to an empty string
```
```javascript
w.submitRegistrationEmailToken({ '3hbh2jg3b' })
// returns a Promise that resolves to an object with a token and rtoken
```
```javascript
w.getWykopConnectURL()
// returns a Promise that resolves to an object
```
```javascript
w.acceptWykopConnectPermissions('3hbh2jg3b', { send_message: true, read_profile: false, add_comment: false, add_link: false, add_entry: false, add_vote: false })
// returns a Promise that resolves to an object with a token and rtoken as well as the redirect_url
```
```javascript
w.getAccountBlockades()
// returns a Promise that resolves to an object
```
```javascript
w.requestAccountBlockadeSMS()
// returns a Promise that resolves to empty string?
```
```javascript
w.rerequestAccountBlockadeSMS()
// returns a Promise that resolves to empty string?
```
```javascript
w.submitAccountBlockadeSMS('123123')
// returns a Promise that resolves to empty string?
```
```javascript
w.submitAccountBlockadeCaptcha('123123')
// returns a Promise that resolves to empty string?
```
```javascript
w.acceptTermsAndConditions()
// returns a Promise that resolves to empty string?
```
```javascript
w.getAccountSettings()
// returns a Promise that resolves to an AccountSettings object
```
```javascript
w.getProfileSettings()
// returns a Promise that resolves to an ProfileSettings object
```
```javascript
w.getPhone()
// returns a Promise that resolves to a string
```
```javascript
w.requestChangePhoneNumber('123543678')
// returns a Promise that resolves to an empty string OR an object with a token in case the user has 2FA turned on
```
```javascript
w.submitChangePhoneNumberSMS('123123')
// returns a Promise that resolves to an empty string
```
```javascript
w.getEmail()
// returns a Promise that resolves to a string
```
```javascript
w.requestChangeEmail()
// returns a Promise that resolves to an empty string OR an object with a token in case the user has 2FA turned on
```
```javascript
w.submitChangeEmail()
// returns a Promise that resolves to an empty string
```
```javascript
w.requestAccountDeletion()
// returns a Promise that resolves to an empty string OR an object with a token in case the user has 2FA turned on
```
```javascript
w.confirmAccountDeletion()
// returns a Promise that resolves to an empty string
```
```javascript
w.requestAccountDataCopy()
// returns a Promise that resolves to an empty string OR an object with a token in case the user has 2FA turned on
```
```javascript
w.requestAccountDataTransfer()
// returns a Promise that resolves to an empty string OR an object with a token in case the user has 2FA turned on
```
```javascript
w.is2FAEnabled()
// returns a Promise that resolves to a boolean
```
```javascript
w.get2FASecret({ type: '1' })
// returns a Promise that resolves to a string
```
```javascript
w.activate2FA({ code: '123456', type: '1' })
// returns a Promise that resolves with your recovery code
```
```javascript
w.deactivate2FA({ password: 'itspassword', code: '123456' })
// returns a Promise that resolves to an empty string
```
```javascript
w.handle2FACodeRequired(async ({ type, token }) => {
    // Here you would request user input and then call w.submit2FACode() with the token and 2FA code
})
// this callback will be called whenever a 2FA code is required. Returns a Promise that resolves to undefined
```
```javascript
w.getUserSessions()
// returns a Promise that resolves to a Listing object, where Listing.items is a list of objects
```
```javascript
w.removeUserSession('12341234')
// returns a Promise that resolves to null
```
```javascript
w.removeOtherUserSessions()
// returns a Promise that resolves to null
```
```javascript
w.getConnectApplications()
// returns a Promise that resolves to a Listing object, where Listing.items is a list of objects
```
```javascript
w.removeConnectApplication('12341234')
// returns a Promise that resolves to null
```
```javascript
w.getBlacklistedUsers()
// returns a Promise that resolves to a Listing object, where Listing.items is a list of Profile objects
```
```javascript
w.addUserToBlacklist()
// returns a Promise that resolves to the Wykop object
```
```javascript
w.removeUserFromBlacklist()
// returns a Promise that resolves to the Wykop object
```
```javascript
w.getBlacklistedTags()
// returns a Promise that resolves to a Listing object, where Listing.items is a list of Tag objects
```
```javascript
w.addTagToBlacklist()
// returns a Promise that resolves to the Wykop object
```
```javascript
w.removeTagFromBlacklist()
// returns a Promise that resolves to the Wykop object
```
```javascript
w.getBlacklistedDomains()
// returns a Promise that resolves to a Listing object, where Listing.items is a list of objects
```
```javascript
w.addDomainToBlacklist()
// returns a Promise that resolves to the Wykop object
```
```javascript
w.removeDomainFromBlacklist()
// returns a Promise that resolves to the Wykop object
```
```javascript
w.getDoodle()
// returns a Promise that resolves to an object
```
```javascript
w.getAccountColors()
// returns a Promise that resolves to a Listing object, where Listing.items is a list of objects
```
```javascript
w.getAccountColor('orange')
// returns a Promise that resolves to an object
```
```javascript
w.submitSupportMessage({ reason: w.supportReasons.technicalProblems, email: 'email@example.com', message: 'Please help!', file: null, info: null, url: null })
// returns a Promise that resolves to the Wykop object
```
```javascript
w.submitGDPRMessage({ 'email@example.com', message: 'Please help with my data!' })
// returns a Promise that resolves to the Wykop object
```
```javascript
w.getReportedContent({ page: 2 })
// returns a Promise that resolves to a Listing object, where Listing.items is a list of objects
```
```javascript
w.generateReportURL({ linkId: '1234', entryId: null, linkCommentId: null, entryCommentId: null, profile: null, relatedId: null })
// returns a Promise that resolves to a string (URL)
```
```javascript
w.getModeratedContent({ page: null })
// returns a Promise that resolves to a Listing object, where Listing.items is a list of objects
```
```javascript
w.submitAppeal({ reportId: '1234', content: 'This should not have been deleted!' })
// returns a Promise that resolves to the Wykop object
```
```javascript
w.getAppeals({ page: 5 })
// returns a Promise that resolves to a Listing object, where Listing.items is a list of objects
```
```javascript
w.customRequest({ method: 'GET', url: '/entries/1234' })
// this method takes a standard Axios Request: https://axios-http.com/docs/req_config
// returns a Promise that resolves to a standard Axios Response: https://axios-http.com/docs/res_schema
```
```javascript
w.getToken()
// returns a Promise that resolves to your token (string)
```
```javascript
w.formatDate(new Date())
// returns a Promise that resolves to a date formatted to be generally accepted by the Wykop API
```
```javascript
w.saveConnectTokens({ token: '3hbh2jg3b', rtoken: '3hbh2jg3b' })
// returns a Promise that resolves to an object with the token and rtoken
```
```javascript
w.databaseExtract()
// returns a Promise that resolves to an object with the current config - you can use this before closing your app to save the config for upcoming instances, so you don't need to provide a new rtoken/token every time. When using an appkey and secret, this is not necessary 
```
```javascript
w.getTokenExpireDate()
// returns a Promise that resolves to a Date object
```
```javascript
w.hasTokenExpired()
// returns a Promise that resolves to a boolean
```
```javascript
w.getLoggedUsername()
// returns a Promise that resolves to your username
```
```javascript
w.isLogged()
// returns a Promise that resolves to a boolean
```

### Available functions on `Entry` objects:
After getting an entry, either from a listing like `w.getMicroblog()` or directly from `w.getEntry('1234')`, you can then start interacting with the Entry object
```javascript
entry.get()
// returns a Promise that resolves to an Entry object - you can use this to refresh
```
```javascript
entry.getComment('4321')
// returns a Promise that resolves to an EntryComment object
```
```javascript
entry.getComments()
// returns a Promise that resolves to a Listing object, where Listing.items is a list of EntryComment objects
```
```javascript
entry.getNewerCommentsCount({ date: w.formatDate(new Date) })
// returns a Promise that resolves to a string
```
```javascript
entry.submitComment({ content = 'Nice entry you have there!', photo = null, embed = null, adult = false })
// returns a Promise that resolves to an EntryComment object
```
```javascript
entry.edit({ content: 'Hello yet again!', photo: null, embed: null, survey: null, adult = false })
// returns a Promise that resolves to an Entry object
```
```javascript
entry.remove()
// returns a Promise that resolves to an empty string
```
```javascript
entry.getUpvoters()
// returns a Promise that resolves to a Listing object, where Listing.items is a list of Profile objects
```
```javascript
entry.upvote()
// returns a Promise that resolves to the Entry object
```
```javascript
entry.unvote()
// returns a Promise that resolves to the Entry object
```
```javascript
entry.favorite()
// returns a Promise that resolves to the Entry object
```
```javascript
entry.observe()
// returns a Promise that resolves to the Entry object
```
```javascript
entry.unobserve()
// returns a Promise that resolves to the Entry object
```
```javascript
entry.unfavorite()
// returns a Promise that resolves to the Entry object
```
```javascript
entry.surveyVote('2') 
// returns a Promise that resolves to the Entry object
```

### Available functions on `EntryComment` objects:
Similarly to the entry above, we can interact directly with EntryComment objects
```javascript
comment.get()
// returns a Promise that resolves to an EntryComment object - you can use this to refresh
```
```javascript
comment.edit({ content: 'Nice entry you have there!', photo: '3hbh2jg3b', embed: '3hbh2jg3b', adult: true }) 
// returns a Promise that resolves to an EntryComment object
```
```javascript
comment.remove()
// returns a Promise that resolves to an empty string
```
```javascript
comment.getUpvoters()
// returns a Promise that resolves to a Listing object, where Listing.items is a list of Profile objects
```
```javascript
comment.upvote()
// returns a Promise that resolves to an EntryComment object
```
```javascript
comment.unvote()
// returns a Promise that resolves to an EntryComment object
```
```javascript
comment.favorite()
// returns a Promise that resolves to an EntryComment object
```
```javascript
comment.unfavorite()
// returns a Promise that resolves to an EntryComment object
```

### Available functions on `Link` objects:
```javascript
link.get()
// returns a Promise that resolves to a Link object - you can use this to refresh
```
```javascript
link.getComment('4321')
// returns a Promise that resolves to a LinkComment object
```
```javascript
link.submitComment({ content: 'Nice link!', photo: '3hbh2jg3b', embed: '3hbh2jg3b', adult: false })
// returns a Promise that resolves to a LinkComment object
```
```javascript
link.getComments({ page, sort, ama })
// returns a Promise that resolves to a Listing object, where Listing.items is a list of LinkComment objects
```
```javascript
link.getRelatedLinks()
// returns a Promise that resolves to a Listing object, where Listing.items is a list of LinkRelated objects
```
```javascript
link.submitRelatedLink({ title, url, adult })
// returns a Promise that resolves to a LinkRelated object
```
```javascript
link.edit({ title: 'Hello again :)', description: 'Something interesting!', tags: ['heheszki', 'polityka'], photo: null, adult: true })
// returns a Promise that resolves to a Link object
```
```javascript
link.remove()
// returns a Promise that resolves to an empty string
```
```javascript
link.upvote()
// returns a Promise that resolves to the Link object
```
```javascript
link.downvote({ reason: link.downvoteReason.duplicate })
// returns a Promise that resolves to the Link object
```
```javascript
link.unvote()
// returns a Promise that resolves to the Link object
```
```javascript
link.observe()
// returns a Promise that resolves to the Link object
```
```javascript
link.unobserve()
// returns a Promise that resolves to the Link object
```
```javascript
link.favorite()
// returns a Promise that resolves to the Link object
```
```javascript
link.unfavorite()
// returns a Promise that resolves to the Link object
```
```javascript
link.toggleMuteAMA()
// returns a Promise that resolves to the Link object
```
```javascript
link.finishAMA()
// returns a Promise that resolves to the Link object
```
```javascript
link.getUpvotes()
// returns a Promise that resolves to a Listing object, where Listing.items is a list of objects
```
```javascript
link.getDownvotes()
// returns a Promise that resolves to a Listing object, where Listing.items is a list of objects
```
```javascript
link.getCounters()
// returns a Promise that resolves to an object
```
```javascript
link.getRedirectURL()
// returns a Promise that resolves to a string (URL)
```

### Available functions on `LinkComment` objects:
```javascript
comment.get()
// returns a Promise that resolves to a LinkComment object - you can use this to refresh
```
```javascript
comment.getComments({ page: null })
// returns a Promise that resolves to a Listing object, where Listing.items is a list of LinkComment objects
```
```javascript
comment.submitComment({ content: 'Nice link!', photo: '3hbh2jg3b', embed: '3hbh2jg3b', adult: true })
// returns a Promise that resolves to a LinkComment object
```
```javascript
comment.edit({ content: 'Nice link!', photo: '3hbh2jg3b', embed: '3hbh2jg3b', adult: true })
// returns a Promise that resolves to the LinkComment object
```
```javascript
comment.remove()
// returns a Promise that resolves to an empty string
```
```javascript
comment.upvote()
// returns a Promise that resolves to the LinkComment object
```
```javascript
comment.downvote()
// returns a Promise that resolves to the LinkComment object
```
```javascript
comment.unvote()
// returns a Promise that resolves to the LinkComment object
```
```javascript
comment.observe()
// returns a Promise that resolves to the LinkComment object
```
```javascript
comment.unobserve()
// returns a Promise that resolves to the LinkComment object
```
```javascript
comment.favorite()
// returns a Promise that resolves to the LinkComment object
```
```javascript
comment.unfavorite()
// returns a Promise that resolves to the LinkComment object
```


### Available functions on `LinkRelated` objects:
```javascript
related.get()
// returns a Promise that resolves to a LinkRelated object - you can use this to refresh
```
```javascript
related.edit({ title: 'Related to your link', url: 'https://example.com', adult: false })
// returns a Promise that resolves to the LinkRelated object
```
```javascript
related.remove()
// returns a Promise that resolves to an empty string
```
```javascript
related.upvote()
// returns a Promise that resolves to the LinkRelated object
```
```javascript
related.downvote()
// returns a Promise that resolves to the LinkRelated object
```
```javascript
related.unvote()
// returns a Promise that resolves to the LinkRelated object
```

### Available functions on `Draft` objects:
```javascript
draft.get()
// returns a Promise that resolves to a Draft object - you can use this to refresh
```
```javascript
draft.edit({ title, description, tags, photo, adult = false, selectedImage })
// returns a Promise that resolves to a Draft object
```
```javascript
draft.remove()
// returns a Promise that resolves to an empty string
```
```javascript
draft.publish({ title, description, tags, photo, adult = false, selectedImage })
// returns a Promise that resolves to an empty string
```

### Available functions on `Article` objects:
```javascript
article.get()
// returns a Promise that resolves to an Article object - you can use this to refresh
```
```javascript
article.edit({ title: 'Edited title!', content: 'Edited description', html: 'Random string' })
// returns a Promise that resolves to an Article object
```
```javascript
article.remove()
// returns a Promise that resolves to an empty string
```

### Available functions on `ArticleHistory` objects:
```javascript
history.get()
// returns a Promise that resolves to an Article object
```

### Available functions on `Conversation` objects:
```javascript
conversation.get()
// returns a Promise that resolves to an Conversation object - you can use this to refresh
```
```javascript
conversation.message('Hello!', { photo: '3hbh2jg3b', embed: '3hbh2jg3b' })
// returns a Promise that resolves to the Conversation object
```
```javascript
conversation.clearHistory()
// returns a Promise that resolves to the Conversation object
```
```javascript
conversation.isNewerMessageAvailable()
// returns a Promise that resolves to a boolean
```

### Available functions on `Profile` objects:
```javascript
profile.get()
// returns a Promise that resolves to a Profile object - you can use this to refresh
```
```javascript
profile.getActions({ page: null })
// returns a Promise that resolves to a Listing object, where Listing.items is a list of Link and Entry objects
```
```javascript
profile.getLinksAdded({ page: null })
// returns a Promise that resolves to a Listing object, where Listing.items is a list of Link objects
```
```javascript
profile.getLinksPublished({ page: null })
// returns a Promise that resolves to a Listing object, where Listing.items is a list of Link objects
```
```javascript
profile.getLinksUpvoted({ page: null })
// returns a Promise that resolves to a Listing object, where Listing.items is a list of Link objects
```
```javascript
profile.getLinksDownvoted({ page: null })
// returns a Promise that resolves to a Listing object, where Listing.items is a list of Link objects
```
```javascript
profile.getLinksCommented({ page: null })
// returns a Promise that resolves to a Listing object, where Listing.items is a list of Link objects
```
```javascript
profile.getLinksRelated({ page: null })
// returns a Promise that resolves to a Listing object, where Listing.items is a list of LinkRelated objects
```
```javascript
profile.getEntriesAdded({ page: null })
// returns a Promise that resolves to a Listing object, where Listing.items is a list of Entry objects
```
```javascript
profile.getEntriesUpvoted({ page: null })
// returns a Promise that resolves to a Listing object, where Listing.items is a list of Entry objects
```
```javascript
profile.getEntriesCommented({ page: null })
// returns a Promise that resolves to a Listing object, where Listing.items is a list of Entry objects
```
```javascript
profile.getBadges()
// returns a Promise that resolves to a Listing object, where Listing.items is a list of Badge objects
```
```javascript
profile.getAuthoredTags()
// returns a Promise that resolves to a Listing object, where Listing.items is a list of Tag objects
```
```javascript
profile.getFollowedTags({ page: null})
// returns a Promise that resolves to a Listing object, where Listing.items is a list of Tag objects
```
```javascript
profile.getFollowedUsers({ page: null })
// returns a Promise that resolves to a Listing object, where Listing.items is a list of Profile objects
```
```javascript
profile.getFollowers({ page: null })
// returns a Promise that resolves to a Listing object, where Listing.items is a list of Profile objects
```
```javascript
profile.getNote()
// returns a Promise that resolves to a string
```
```javascript
profile.createNote({ content: 'Seems like a nice guy' })
// returns a Promise that resolves to the Profile object
```
```javascript
profile.clearNote()
// returns a Promise that resolves to the Profile object
```
```javascript
profile.getConversation()
// returns a Promise that resolves to a Conversation object
```
```javascript
profile.observe()
// returns a Promise that resolves to the Profile object
```
```javascript
profile.unobserve()
// returns a Promise that resolves to the Profile object
```
```javascript
profile.blacklist()
// returns a Promise that resolves to the Profile object
```
```javascript
profile.unblacklist()
// returns a Promise that resolves to the Profile object
```

### Available functions on `Tag` objects:
```javascript
tag.get()
// returns a Promise that resolves to a Tag object - you can use this to refresh
```
```javascript
tag.getContent({ page: null, sort: 'newest', type: 'all', year: null, month: null })
// returns a Promise that resolves to a Listing object, where Listing.items is a list of Link and Entry objects
```
```javascript
tag.getNewerContentCount({ sort: 'newest', type: 'entry', date: '2021-01-01 10:11:12', lastId: null })
// returns a Promise that resolves to a string
```
```javascript
tag.getRelatedTags()
// returns a Promise that resolves to a Listing object, where Listing.items is a list of Tag objects
```
```javascript
tag.getCoauthors()
// returns a Promise that resolves to a Listing object, where Listing.items is a list of Profile objects
```
```javascript
tag.addCoauthor({ username: 'wykop' }) 
// returns a Promise that resolves to the Tag object
```
```javascript
tag.removeCoauthor({ username: 'm__b' }) 
// returns a Promise that resolves to the Tag object
```
```javascript
tag.edit({ photo: '3hbh2jg3b', description: 'This tag is about tags' }) 
// returns a Promise that resolves to the Tag object
```
```javascript
tag.observe()
// returns a Promise that resolves to the Tag object
```
```javascript
tag.unobserve()
// returns a Promise that resolves to the Tag object
```
```javascript
tag.notify()
// returns a Promise that resolves to the Tag object
```
```javascript
tag.mute()
// returns a Promise that resolves to the Tag object
```
```javascript
tag.blacklist()
// returns a Promise that resolves to the Tag object
```
```javascript
tag.unblacklist()
// returns a Promise that resolves to the Tag object
```

### Available functions on `Badge` objects:
```javascript
badge.get()
// returns a Promise that resolves to a Badge object - you can use this to refresh
```
```javascript
badge.getUsers()
// returns a Promise that resolves to a Listing object, where Listing.items is a list of Profile objects
```

### Available functions on `Bucket` objects:
```javascript
bucket.get()
// returns a Promise that resolves to a Bucket object - you can use this to refresh
```
```javascript
bucket.getContent({ page: null })
// returns a Promise that resolves to a Listing object, where Listing.items is a list of Link and Entry objects
```
```javascript
bucket.edit({ title: 'New title!', query: '#tags @users keywords', defaultPage: 'entries' })
// returns a Promise that resolves to the Bucket object
```
```javascript
bucket.remove()
// returns a Promise that resolves to an empty string
```

### Available functions on `PersonalNotification`, `TagNotification`, `PmNotification` and `DiscussionNotification` objects:
```javascript
notification.get()
// returns a Promise that resolves to a Notification object - you can use this to refresh
```
```javascript
notification.markAsRead()
// returns a Promise that resolves to the Notification object
```
```javascript
notification.remove()
// returns a Promise that resolves to an empty string
```

### Available functions on `AccountSettings` objects:
```javascript
settings.get()
// returns a Promise that resolves to a AccountSettings object - you can use this to refresh
```
```javascript
settings.update({ show_online: true })
// returns a Promise that resolves to the updated AccountSettings object
```

### Available functions on `ProfileSettings` objects:
```javascript
settings.get()
// returns a Promise that resolves to a ProfileSettings object - you can use this to refresh
```
```javascript
settings.update({ name: '', gender: '', city: '', website: '', public_email: '', facebook: '', twitter: '', instagram: '', about: ''})
// returns a Promise that resolves to the updated ProfileSettings object
```
```javascript
settings.submitAvatar('3hbh2jg3b')
// returns a Promise that resolves to the ProfileSettings object
```
```javascript
settings.removeAvatar()
// returns a Promise that resolves to the ProfileSettings object
```
```javascript
settings.submitBackground('3hbh2jg3b')
// returns a Promise that resolves to the ProfileSettings object
```
```javascript
settings.removeBackground()
// returns a Promise that resolves to the ProfileSettings object
```

### Available functions on `Listing` objects:
```javascript
listing.stream()
// returns a Promise that resolves to an AsyncGeneratorFunction that yields items from the current page and all sequential pages
```

### Available functions on `Pagination` objects:
```javascript
pagination.get()
// returns a Promise that resolves to a Listing object - you can use this to refresh
```
```javascript
pagination.next()
// returns a Promise that resolves to a Listing object
```
```javascript
pagination.prev()
// returns a Promise that resolves to a Listing object
```




### TODO
- Better documentation than just this list
- More testing