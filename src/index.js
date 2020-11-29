// import { resolve } from 'path';
// import { config } from 'dotenv';
const { Octokit } = require('@octokit/rest');

// import githubQuery from './githubQuery';
// import generateBarChart from './generateBarChart';
// import { userInfoQuery, createContributedRepoQuery, createCommittedDateQuery } from './queries';

(async() => {
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
				content: 'THIS IS TEST'
			},
		},
	});
	
})();