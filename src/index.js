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
const _ownerID = core.getInput('GITHUB_ID') || '';
const _ownerEMAIL = core.getInput('GITHUB_EMAIL') || ''
const _readmePath = core.getInput('README_PATH') || 'README.md';
const _commitMSG = core.getInput('COMMIT_MSG') || 'Update Acitivty README';
const _limit = core.getInput('LIMIT') || 5;
const _type = core.getInput('TYPE') || 'NONE';

// GH_TOKEN 인증
const octokit = new Octokit({
	auth: `token ${_githubToken}`
});

function contentType(idx) {
	let liDesign = '';
	switch(_type) {
		case 'NONE':
			liDesign = '';
			break;
		case 'DOT':
			liDesign = '- ';
			break;
		case 'NUM':
			liDesign = `${idx+1}. `;
			break;
		default:
			liDesign = `${_type} `;
			break;
	}
	return liDesign;
	
}

async function updateREADME() {	
	// Velog 최근 글 목록 가져오기
	let curVelogContent = '';
	try {
		let feed = await parser.parseURL(`https://v2.velog.io/rss/${_velogID}`);
		feed.items.slice(0, _limit).forEach((item, idx) => {
			curVelogContent += `${contentType(idx)}[${item.title}](${item.link})\n\n`;
		});
	} catch (err) {
        console.error(`틀린 VELOG_ID 혹은 RSS 주소\n(VELOG_ID 값이 정확하다면 RSS 주소가 변경되었을 가능성이 있습니다.)\n${err}`);
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
        console.error(`틀린 GITHUB_ID 혹은 README_PATH 경로 값\n${err}`);
    }
	
	const readmeSHA = readmeContent.data.sha;
	readmeContent = Base64.decode(readmeContent.data.content);
	
	let replaceTarget;
	let beforeVelogContent;
    try {
		// <!--VELOG:START--> 와 <!--VELOG:END--> 사이 내용 가져오기
		beforeVelogContent = /<!--VELOG:START-->([^;]+)<!--VELOG:END-->/.exec(readmeContent)[1];
		
		// 아무 내용도 안들어 갔단 뜻 (초기 빌드거나 VELOG 에 아무 내용이 없을때)
		if (beforeVelogContent.trim() == '')
			beforeVelogContent = '\n';
		
		replaceTarget = '<!--VELOG:START-->' + beforeVelogContent + '<!--VELOG:END-->';
		curVelogContent = '<!--VELOG:START-->\n' + curVelogContent + '<!--VELOG:END-->';
    } catch (err) {
        console.error(`틀린 VELOG:START , VELOG:END 선언\n${err}`);
		return;
    }
		
	// velog 에 새로 올린 글이 있다면 취소. (커밋을 새로 올릴 필요가 없기 때문)
	if (replaceTarget.trim() == curVelogContent.trim()) {
		console.log('내용이 이전과 같음. 커밋을 올리지 않음.');
		return;
	}
	
	// 이전글과 현재글을 변경
	readmeContent = Base64.encode(readmeContent.replace(replaceTarget, curVelogContent));
	
	try {
		// README 파일 업데이트
		await octokit.repos.createOrUpdateFileContents({
			owner: _ownerID,
			repo: _ownerID,
			path: _readmePath,
			message: _commitMSG,
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
        console.error(`README 가 정상적으로 변경되지 못했습니다. : ${error}`);
    }
}
 
(async () => {
    await updateREADME();
})();