# 🚀 보물찾기 앱 배포 가이드

## Vercel 배포 단계

### 1. Vercel 프로젝트 생성
1. [vercel.com](https://vercel.com) 접속
2. GitHub `priming2023/qr` 연동
3. Deploy 버튼 클릭

### 2. 환경 변수 설정
Vercel 대시보드 → Settings → Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_NAME=Treasure Hunt App
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### 3. 배포 확인
- 자동 빌드 및 배포
- 배포 URL 확인

## 📱 사용 방법

### 키즈카페 직원
1. `도메인/admin` 접속
2. QR 코드 생성 및 인쇄
3. 카페 곳곳에 QR 코드 숨기기

### 아이들
1. `도메인` 접속
2. QR 코드 스캔하여 보물찾기
3. 10개 이상 찾으면 선물 받기

## ✅ 기능 목록

- QR 코드 스캐너 (카메라 연동)
- 20개 보물찾기 진행 추적
- 10개부터 선물 받기 가능
- 하루 한 번 선물 제한
- 한국어 UI/UX 디자인
- 관리자 QR 코드 생성기
- Supabase 데이터베이스 연동

## 🎉 완성!

모든 기능이 구현되고 배포 준비가 완료되었습니다!
