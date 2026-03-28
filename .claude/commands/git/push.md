---
description: '현재 브랜치를 GitHub에 push합니다'
allowed-tools:
  [
    'Bash(git status:*)',
    'Bash(git log:*)',
    'Bash(git push:*)',
    'Bash(git branch:*)',
    'Bash(git remote:*)',
  ]
---

# Claude 명령어: Push

현재 브랜치를 GitHub origin에 push합니다.

## 사용법

```
/git:push
```

## 프로세스

1. 현재 브랜치 및 원격 추적 브랜치 확인
2. origin보다 앞선 커밋 목록 표시
3. push 실행
4. 결과 보고

## 규칙

- `main` / `master` 브랜치에 `--force` push 절대 금지
- 원격 브랜치가 없으면 `-u origin <브랜치명>`으로 upstream 설정
- push 전 앞선 커밋 수와 요약을 먼저 보여줄 것
- push 후 원격 URL과 브랜치명을 알려줄 것
