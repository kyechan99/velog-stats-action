// "use strict";

const core = require('@actions/core');

let RSSParser = require('rss-parser');
let parser = new RSSParser();

require('dotenv').config();

const { Octokit } = require('@octokit/rest');

// 환경값 가져오기
// const {
//     GIST_ID: _gistID,
//     GH_TOKEN: _githubToken,
//     VELOG_ID: _velogID
// } = process.env;

// const _gistID = '2ca0ced45ecf85f7e6ac1fbf04b14ac5';
// const _githubToken = '66811e3589afa372b87d16953f7f1c2e51a99412';

const _gistID = core.getInput('GIST_ID');
const _githubToken = core.getInput('GH_TOKEN');

// GIST_ID 인증
const octokit = new Octokit({
	auth: `token ${_githubToken}`
});

// ( async() => {
// 	let velogContent = '';
	
// 	let feed = await parser.parseURL('https://v2.velog.io/rss/velopert');
// 	// console.log(feed.title);
	
// 	feed.items.slice(0, 5).forEach(item => {
// 		// console.log(item.title + ':' + item.link)
// 		velogContent += `[${item.title}](${item.link})\n`;
// 	});
// 	console.log(velogContent);
	
// 	console.log(_gistID, ' : ', _githubToken, ' : ', _velogID);

// 	// GIST 데이터 가져오기
// 	const gist = await octokit.gists.get({
// 		gist_id: _gistID
// 	}).catch(err => console.error(`Wrong GIST_ID : ${err}`));
	
// 	if (!gist) return;
// 	console.log(gist);
	
// 	const { headers } = await octokit.request('/');
// 	console.log(`Scopes: ${headers['x-oauth-scopes']}`);
	
// 	const filename = Object.keys(gist.data.files)[0];
// 	console.log('FN ', filename);
	
// 	await octokit.gists.update({
// 		gist_id: _gistID,
// 		description: `This is some description`,
// 		files: {
// 			[filename]: {
// 				// filename: "\'s Velog Stats",
// 				// content: lines.join('\n'),
// 				// content: velogContent
// 				content: 'TESTTTTTTTTTTTTTTTTTTTTTTTTT'
// 			},
// 		},
// 	}).catch(err => console.error(`Unwork gist update : ${err}`));
	
// 	console.log('__DONE__');
// })();

// Function to update the gist contents
async function updateGist() {
    let gist;
    try {
		// GIST 데이터 가져오기
        gist = await octokit.gists.get({ gist_id: _gistID });
    } catch (error) {
        console.error(`Unable to get gist\n${error}`);
    }
	
	
	let velogContent = '';
	
	let feed = await parser.parseURL('https://v2.velog.io/rss/kyechan99');
	// console.log(feed.title);
	
	// Velog 최근 글 목록 가져오기
	feed.items.slice(0, 5).forEach(item => {
		// console.log(item.title + ':' + item.link)
		velogContent += `[${item.title}](${item.link})\n`;
	});
	console.log(velogContent);
 
	console.log(_gistID, _githubToken);
	
    const filename = Object.keys(gist.data.files)[0];
 
    try {
        await octokit.gists.update({
            gist_id: _gistID,
            description: `Velog Stats`,
            files: {
                [filename]: {
					filename: "\'s Velog Stats",
					content: velogContent
                }
            }
        });
    } catch (error) {
        console.error(`Unable to update gist\n${error}`);
    }
}
 
(async () => {
    await updateGist();
})();