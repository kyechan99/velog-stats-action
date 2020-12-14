/**
 * GIST 파일을 변경할때 사용하는 파일입니다.
 * 제작은 됐는데 GitHub 측이 프로필 pinned-gist에서 MARKDOWN 형태를 지원하지 않아 파일만 남깁니다.
 */
"use strict";

const core = require('@actions/core');
let RSSParser = require('rss-parser');
let parser = new RSSParser();
const { Octokit } = require('@octokit/rest');

// ENV 값 가져오기
const {
    GIST_ID: _gistID,
    GH_TOKEN: _githubToken
} = process.env;

// WITH 값 가져오기
const _velogID = core.getInput('VELOG_ID');

// GIST_ID 인증
const octokit = new Octokit({
	auth: `token ${_githubToken}`
});

async function updateGist() {
	// GIST 데이터 가져오기
    let gist;
    try {
        gist = await octokit.gists.get({ gist_id: _gistID });
    } catch (err) {
        console.error(`틀린 Gist 값\n${err}`);
    }
	
	// Velog 최근 글 목록 가져오기
	let velogContent = '';
	try {
		let feed = await parser.parseURL(`https://v2.velog.io/rss/${_velogID}`);
		feed.items.slice(0, 5).forEach(item => {
			velogContent += `[${item.title}](${item.link})\n\n`;
		});
	} catch (err) {
        console.error(`틀린 _velogID 혹은 RSS 주소\n${err}`);
    }
	
	// 첫번째 파일만 수정하기(하나의 gist에 여러개의 파일을 올리기가 가능함)
    const filename = Object.keys(gist.data.files)[0];
	
	// GIST 파일 업데이트(수정)
    try {
        await octokit.gists.update({
            gist_id: _gistID,
            description: `Velog Stats`,
            files: {
                [filename]: {
					filename: `${_velogID}\'s Velog Stats.md`,
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