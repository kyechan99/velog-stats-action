let RSSParser = require('rss-parser');
let parser = new RSSParser();
const { Octokit } = require('@octokit/rest');

( async() => {
	let velogContent = '';
	
	let feed = await parser.parseURL('https://v2.velog.io/rss/velopert');
	console.log(feed.title);
	
	feed.items.slice(0, 5).forEach(item => {
		console.log(item.title + ':' + item.link)
		velogContent += `[${item.title}](${item.link})\n`;
	});
	
	// GH_TOKEN 인증
	const octokit = new Octokit({
		auth: `token ${process.env.GH_TOKEN}`
	});

	// GIST 데이터 가져오기
	const gist = await octokit.gists.get({
		gist_id: process.env.GIST_ID
	}).catch(error => console.error(`Wrong GIST_ID : ${error}`));
	
	if (!gist) return;
	console.log(gist);
	
	const filename = Object.keys(gist.data.files)[0];
	await octokit.gists.update({
		gist_id: process.env.GIST_ID,
		files: {
			[filename]: {
				filename: "\'s Velog Stats",
				// content: lines.join('\n'),
				content: velogContent
			},
		},
	});
	
})();