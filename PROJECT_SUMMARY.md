# 🎯 보물찾기 앱 프로젝트 요약

## 프로젝트 개요
키즈카페를 위한 20개 QR 코드 보물찾기 게임 앱

## 🛠️ 기술 스택
- **프론트엔드**: Next.js 16 + TypeScript
- **스타일링**: TailwindCSS
- **애니메이션**: Framer Motion
- **데이터베이스**: Supabase
- **배포**: Vercel
- **QR 스캔**: qr-scanner 라이브러리

## 📱 주요 기능
1. **QR 코드 스캐너** - 카메라 연동하여 실시간 스캔
2. **진행 상황 추적** - 20개 보물찾기 진행률 표시
3. **선물 시스템** - 10개 이상 찾으면 선물 받기 가능
4. **하루 제한** - 선물 하루 한 번만 받도록 제한
5. **관리자 페이지** - QR 코드 생성 및 인쇄 기능
6. **한국어 UI** - 아이들을 위한 친절한 한국어 인터페이스

## 📁 프로젝트 구조
```
src/
├── app/
│   ├── page.tsx          # 메인 게임 페이지
│   └── admin/page.tsx    # 관리자 QR 코드 생성기
├── components/
│   ├── QRScanner.tsx      # QR 코드 스캐너
│   ├── ProgressDisplay.tsx # 진행 상황 표시
│   ├── PrizeRedemption.tsx # 선물 받기
│   └── SuccessAnimation.tsx # 성공 애니메이션
├── lib/
│   ├── storage.ts         # localStorage 관리
│   └── supabase.ts       # Supabase 연동
└── types/
    └── index.ts          # TypeScript 타입 정의
```

## 🚀 배포 정보
- **Git Repository**: https://github.com/priming2023/qr.git
- **배포 플랫폼**: Vercel
- **데이터베이스**: Supabase
- **환경 변수**: .env.local 파일에 설정

## 🎮 사용 방법
1. **관리자**: `/admin` 접속 → QR 코드 생성/인쇄 → 카페에 숨기기
2. **아이들**: 메인 페이지 → QR 코드 스캔 → 보물찾기 → 선물 받기

## ✨ 특별 기능
- 아이들을 위한 크고 화사한 버튼
- 재미있는 애니메이션 효과
- 중복 스캔 방지
- 성취감 강화 시스템
- 반응형 디자인 (모바일 최적화)

## 🎉 프로젝트 완성
모든 기능이 구현되고 배포 준비가 완료된 상태입니다!
