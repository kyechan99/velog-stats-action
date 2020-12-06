"use strict";

const core = require('@actions/core');
let RSSParser = require('rss-parser');
let parser = new RSSParser();
const { Octokit } = require('@octokit/rest');
const { Base64 } = require("js-base64");

// ENV 값 가져오기
const {
    GIST_ID: _gistID,
    GH_TOKEN: _githubToken
} = process.env;

// WITH 값 가져오기
const _velogID = core.getInput('VELOG_ID');
const _ownerID = core.getInput('GITHUB_ID') || 'kyechan99';
const _ownerEMAIL = core.getInput('GITHUB_EMAIL') || 'kyechan99@gmail.com';
const _readmePath = core.getInput('README_PATH') || 'README.md';

// GH_TOKEN 인증
const octokit = new Octokit({
	auth: `token ${_githubToken}`
});

async function updateREADME() {	
	// Velog 최근 글 목록 가져오기
	let curVelogContent = '';
	try {
		let feed = await parser.parseURL(`https://v2.velog.io/rss/${_velogID}`);
		feed.items.slice(0, 5).forEach(item => {
			curVelogContent += `[${item.title}](${item.link})\n\n`;
		});
	} catch (err) {
        console.error(`틀린 _velogID 혹은 RSS 주소\n${err}`);
    }
	
	// README 파일 정보 가져오기
	let readmeContent;
    try {
		readmeContent = await octokit.repos.getContent({
			owner: _ownerID,
			repo: _ownerID,
			path: _readmePath
		});
    } catch (err) {
        console.error(`틀린 Gist 값\n${err}`);
    }
	
	const readmeSHA = readmeContent.data.sha;
	readmeContent = Base64.decode(readmeContent.data.content);
	
	let beforeVelogContent;
	// <!--VELOG:START--> 와 <!--VELOG:END--> 사이 내용 가져오기
    try {
		beforeVelogContent = /<!--VELOG:START-->([^;]+)<!--VELOG:END-->/.exec(readmeContent)[1];
    } catch (err) {
        console.error(`Worng VELOG:START , VELOG:END\n${err}`);
		return;
    }

	// velog 에 새로 올린 글이 있다면 취소. (커밋을 새로 올릴 필요가 없기 때문)
	if (beforeVelogContent == curVelogContent)
		return;
	
	// 이전글과 현재글을 변경
	readmeContent = Base64.encode(readmeContent.replace(beforeVelogContent, curVelogContent));
	
	try {
		// README 파일 업데이트
		await octokit.repos.createOrUpdateFileContents({
			owner: _ownerID,
			repo: _ownerID,
			path: _readmePath,
			message: 'Update Acitivty README',
			content: readmeContent,
			sha: readmeSHA,
			committer: {
				name: _ownerID,
				email: _ownerEMAIL
			},
			author: {
				name: _ownerID,
				email: _ownerEMAIL
			}
		})
    } catch (error) {
        console.error(`Unable to update README : ${error}`);
    }
}
 
(async () => {
    await updateREADME();
})();