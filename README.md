## 설정 및 실행 방법

### 환경변수 설정

1. .env.example 파일을 참고하여 프로젝트 루트에 .env 파일을 생성합니다.
2. OPENWEATHER_API_KEY 항목에 발급받은 OpenWeather API 키를 입력합니다.
### 방법 1: 소스코드 직접 빌드 및 실행
1. Next.js 12와 호환되는 Node.js 환경(v16 또는 v18 권장)에서 진행합니다.
2. 저장소 복제: `git clone https://github.com/jdk829355/weather_app.git`
3. 프로젝트 폴더로 이동: `cd weather_app`
4. 의존성 설치: `npm install --legacy-peer-deps`
5. 실행 모드 선택:
    - 개발 모드: `npm run dev`
    - 프로덕션 빌드 및 실행: `npm run build && npm run start`
### 방법 2: Docker Container로 실행
1. Docker 환경(Daemon 및 CLI)이 설치된 상태에서 진행합니다.
2. 이미지 다운로드: `docker pull jungdae/weather-app:latest`
3. 컨테이너 실행: `docker run -p 3000:3000 --name weather-app -e OPENWEATHER_API_KEY=본인의_키_입력 jungdae/weather-app:latest`
    - 환경변수 주입(-e)을 하지 않을 경우 백엔드 리졸버가 정상 작동하지 않습니다.
    - -e 대신 `--env-file <path to .env file>`를 사용하셔도 됩니다.
    - 백그라운드 실행을 원할 경우 -d 옵션을 추가합니다.