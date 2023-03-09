// A simple example where you can mention all the users that upvoted specific entries

import Wykop from '../wykop.js';

// 20 for green account, 50 for orange or 150 for red
const accountLimit = 50;

// Here you set the ID of your new entry
const newEntryId = '1234';

// Here you add the IDs of the entries with your upvoters
const upvoterLists = [
	'2345',
	'3456'
];

(async function () {

	// here getRefreshToken() would be a function that reads your last rtoken from a file
	const w = new Wykop({
		rtoken: getRefreshToken()
	});

	let users = []
	for (let entryId of upvoterLists) {

		// get the upvoters and append them to our 'users' list
		const upvoters = await w.entry(entryId).getUpvoters()
		users = [...upvoters.items.map(x => '@' + x.username)]
	}

	// here saveRefreshToken() would be a function that saves your last rtoken to a file
	saveRefreshToken(await w.databaseExtract());

	// remove duplicate users in our list
	users = users.filter((value, index, array) => array.indexOf(value) === index );

	// split our list into chunks of 'accountLimit' length
	for (let i = 0; i < users.length; i += accountLimit) {
		const chunk = users.slice(i, i + accountLimit);

		// Wait a couple seconds so we don't get rate-limited
		await new Promise(resolve => setTimeout(resolve, 3000));

		// Add our comment to our entry
		await w.entry(newEntryId).submitComment({ content: '!' + chunk })
	}

})();