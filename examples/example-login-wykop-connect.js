import Wykop from '../wykop.js';

(async function () {
	// appkey and secret that you received from Wykop support after contacting them on https://wykop.pl/dla-programistow
	const w = new Wykop({
		appkey: '<your-appkey>',
		secret: '<your-secret>',
	});

	// generate a new WykopConnect URL for your application and save the token
	const token = await w.getWykopConnectURL().token

	// the public appkey and secret from wykop.pl
	const w2 = new Wykop({
		appkey: '<public-appkey>',
		secret: '<public-secret>',
	});

	// login using login and password on wykop.pl
	await w2.login('<your-username>', '<your-password>');

	// accept the permissions that you need and generate 
	const tokens = await w2.acceptWykopConnectPermissions(token, { add_link: true, add_entry: true })

	// save the tokens to your instance
	await w.saveConnectTokens(tokens)

	// you are now logged in on your app through WykopConnect
	await w.getMe().then(console.log)

})();