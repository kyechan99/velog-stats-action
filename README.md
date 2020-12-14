# Velog Stats
개발자 블로그 서비스, [velog](https://velog.io/) 에 최근 작성한 포스트들을 표시해줍니다.

![Update Stats](https://github.com/kyechan99/velog-stats/workflows/Update%20Stats/badge.svg)

## 사용법
### 1. 현 레포를 Fork 하여 내 저장소에 만듭니다.

### 2. `.github/workflows/schedule.yml` 로 이동하여 with 에 포함된 값을 변경합니다.
- VELOG_ID : 벨로그에서 사용하는 아이디를 입력합니다.
- GITHUB_ID : 깃허브 아이디를 입력합니다.
- GITHUB_EMAIL : 깃허브 메인 이메일을 입력합니다.
- README_PATH : 레포지터리에 수정할 README 파일 경로를 입력합니다.
> (root)/README 일시 "README.md" 를 입력합니다.
- COMMIT_MSG : 레포를 수정할때 올라갈 커밋 메세지의 내용을 입력합니다.
- TYPE : 포스트 내역을 어떠한 형식으로 출력할지에 대한 값입니다.
> NONE : 어떤 형식도 갖지 않습니다.
>
> DOT : ● 형식을 갖습니다.
>
> NUM : 숫자 형식을 갖습니다.

### 3. [GitHub/Personal access tokens](https://github.com/settings/tokens) 으로 이동하여 권한을 생성합니다.

1. Note 명은 기억하기 쉬운 이름(ex. GITHUB_TOKEN)

2. repo 권한 체크

3. 생성후 발급된 토큰 코드 복사

### 4. Fork 한 내 저장소 > Settings > Secrets > New repository secret(생성)

1. **GH_TOKEN** 으로 된 이름과 복사한 토큰을 붙여넣어 secret 생성

### 5. README 에 조건 붙이기
```
<!--VELOG:START-->
<!--VELOG:END-->
```
Fork 한 레포에 다음과 같은 주석을 입력해주세요.

START 와 END 사이에 최근 포스트 목록을 작성해줍니다.

