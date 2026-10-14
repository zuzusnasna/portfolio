/* Project-specific detail content reviewed against the repositories. */
(function () {
  const content = {
    swing: {
      index:"01", name:"SWINGFIT", category:"ANDROID · ON-DEVICE COMPUTER VISION",
      title:"스마트폰 영상으로 골프공의 비행을 분석하다",
      lead:"골프 스윙 영상을 입력하고 공이 있을 영역을 지정하면, 단말기 안에서 골프공을 검출·추적하고 임팩트 시점과 비행 지표를 시각화하는 Android 캡스톤 팀 프로젝트입니다.",
      problem:"전문 분석 장비 없이 스마트폰 영상만으로 골프공의 움직임을 읽으려면 작은 공을 프레임마다 찾아야 하고, 임팩트처럼 짧은 순간을 놓치지 않으면서도 모바일 기기의 추론 비용을 관리해야 합니다.",
      approach:"분석 범위를 ROI로 제한하고 TensorFlow Lite 모델로 골프공을 검출합니다. 프레임별 Detection을 시간순으로 쌓아 궤적을 만들고, 넓은 간격의 Coarse Search로 후보 구간을 찾은 뒤 Fine Search로 임팩트 시점을 좁힙니다.",
      stack:["Kotlin","Android SDK","TensorFlow Lite","GPU Delegate","XNNPACK","Media3 ExoPlayer","Coroutines"],
      features:[
        ["영상 선택·재생","Android 문서 선택기로 로컬 영상을 불러오고 Media3 ExoPlayer에서 재생합니다. 분석 결과를 같은 화면의 영상 위에서 확인합니다.","MainActivity.kt"],
        ["ROI 직접 지정","OverlayView에서 드래그한 관심 영역을 정규화 좌표로 관리해 분석 대상을 좁힙니다.","OverlayView.kt · RoiConfig"],
        ["온디바이스 객체 검출","ball-fp16.tflite / ball-int8.tflite 모델과 640×640 입력을 사용하고 confidence threshold를 적용해 프레임별 검출 결과를 구성합니다.","BallAnalyzer.kt"],
        ["실행 장치 Fallback","GPU Delegate 지원 여부를 확인해 가능한 경우 GPU를 사용하고, 초기화가 실패하거나 지원되지 않으면 XNNPACK 기반 CPU Interpreter로 전환합니다.","BallAnalyzer.createInterpreter()"],
        ["궤적·비행 지표 시각화","Timestamp, confidence, 중심 좌표와 bounding box를 바탕으로 공의 trail을 만들고 임팩트 후보 및 초기 속도·발사각·예상 캐리 거리 등을 영상 위에 표시합니다.","Detection · FlightData · OverlayView"]
      ],
      flow:[
        ["01","영상 선택","OpenDocument로 동영상 URI를 선택하고 ExoPlayer 재생을 준비합니다."],
        ["02","관심 영역 지정","사용자가 영상 위에서 ROI를 드래그하고 분석 범위를 확정합니다."],
        ["03","프레임 추출·전처리","MediaMetadataRetriever 기반 프레임 접근 후 640×640 입력 버퍼로 전처리합니다."],
        ["04","TFLite 추론","GPU Delegate 또는 CPU/XNNPACK으로 골프공 Detection을 수행합니다."],
        ["05","시간축 추적","검출 위치를 프레임 timestamp에 연결해 공의 이동 경로를 구성합니다."],
        ["06","임팩트 탐색·표시","Coarse → Fine 탐색으로 후보 시점을 좁히고 분석 결과를 Canvas Overlay에 그립니다."]
      ],
      engineering:[
        ["모바일 추론 자원","매 프레임을 고비용으로 처리하는 대신 ROI와 단계적 탐색을 사용하고, 기기별 GPU 지원 차이는 CPU Fallback으로 흡수합니다."],
        ["시간 정보와 위치 정보","검출 좌표에 프레임 timestamp를 함께 연결해 위치 변화와 임팩트 후보를 시간 흐름에 맞춰 분석합니다."],
        ["UI와 분석 작업 분리","Coroutine 기반 백그라운드 분석과 메인 스레드 UI 업데이트를 구분해 진행 상태 및 결과를 화면에 전달합니다."]
      ],
      role:"팀 캡스톤 프로젝트입니다. 저장소 코드에서는 영상 선택·재생, 분석 실행 제어, ROI 입력, TFLite 실행 경로, 프레임별 추적 및 결과 Overlay 구조를 확인할 수 있습니다.",
      outcome:"모바일에서 별도 서버 추론에 의존하지 않고 영상 분석 파이프라인을 구성했습니다. 분석 추정값은 모델과 영상 조건에 영향을 받으며, 별도 검증 수치가 없는 성능 개선율은 기재하지 않았습니다.",
      repo:"https://github.com/zuzusnasna/SwingFit", source:"https://github.com/zuzusnasna/SwingFit/blob/main/app/src/main/java/com/example/swingfit/BallAnalyzer.kt", resources:[["논문 PDF","https://github.com/zuzusnasna/SwingFit/blob/main/DCS_2025_%ED%95%98%EA%B3%84%EC%A2%85%ED%95%A9%ED%95%99%EC%88%A0%EB%8C%80%ED%9A%8C_%EB%8C%80%ED%95%99%EC%83%9D%EB%85%BC%EB%AC%B8%EA%B2%BD%EC%A7%84%EB%8C%80%ED%9A%8C_%EB%85%BC%EB%AC%B8_%EC%86%A1%EC%A3%BC%EB%B0%95%ED%8C%80.pdf"],["발표 자료","https://docs.google.com/presentation/d/1Pq6C9Gpwqa5nS4xreTDfaa-qO3nPzDRG/edit?usp=sharing&ouid=116307840021041251052&rtpof=true&sd=true"]]
    },
    game:{
      index:"02", name:"GAMEHUB", category:"JAVA WEB · COMMUNITY · ACCESS CONTROL",
      title:"게시판 CRUD를 넘어 리소스 단위 권한을 설계하다",
      lead:"게임 카테고리별 게시판에서 회원이 글과 댓글로 소통하고, 회원 등급·역할·카테고리 관리자 권한에 따라 작업을 허용하는 Java Servlet 기반 커뮤니티 웹 애플리케이션입니다.",
      problem:"게시판 기능은 글 작성·수정·삭제 자체보다 누가 어떤 리소스를 변경할 수 있는지 결정하는 일이 중요합니다. 로그인 여부만 확인하면 다른 사용자의 글을 수정하거나 삭제하는 요청을 막을 수 없습니다.",
      approach:"Servlet이 HTTP 요청과 세션을 처리하고 DTO로 데이터를 전달하며 DAO가 JDBC를 통해 Oracle에 접근합니다. 삭제 요청에서는 로그인 회원, 대상 게시글, 시스템 관리자, 카테고리 관리자, 작성자 본인을 확인한 뒤 허용된 요청만 논리 삭제합니다.",
      stack:["Java","Jakarta Servlet","Apache Tomcat 10.1","Oracle Database","JDBC","HTML/CSS/JavaScript","Maven"],
      features:[
        ["회원·계정","회원가입, 로그인·로그아웃, 마이페이지, 회원 정보와 계정 상태, 회원 레벨을 관리합니다.","LoginServlet · MemberDAO"],
        ["계층형 게임 카테고리","카테고리를 계층 구조로 구성하고 카테고리별 게시판을 제공하며, 활성·비활성 상태와 관리자 권한을 관리합니다.","CategoryDAO"],
        ["게시글·댓글","글 목록·상세·작성·수정·삭제, 조회수, 공지, 댓글과 대댓글, 좋아요·싫어요 기능을 제공합니다.","PostServlets · CommentDAO"],
        ["역할 기반 관리","MEMBER_ROLE을 통한 역할 구조, 카테고리 관리자 신청·지정, 카테고리 이용 제한(BAN) 및 신청 상태를 관리합니다.","CategoryManagerDAO · Role"],
        ["서버 측 권한 확인","PostDeleteServlet은 기존 세션과 대상 게시글을 확인한 후 시스템 관리자·카테고리 관리자·작성자 중 하나인지 검사합니다. 미인증은 401, 권한 부족은 403, 없는 글은 404로 구분합니다.","PostDeleteServlet#doPost"],
        ["논리 삭제","권한 확인을 통과한 요청만 PostDAO의 삭제 기능으로 넘기며 실제 행 제거 대신 삭제 상태를 기록합니다.","PostDAO.delete()"]
      ],
      flow:[
        ["01","HTTP 요청","브라우저에서 게시글·댓글·회원 기능을 요청합니다."],
        ["02","Servlet","요청 파라미터와 세션을 확인하고 작업별 처리 흐름을 결정합니다."],
        ["03","DAO / DTO","DAO가 JDBC로 Oracle에 접근하고 DTO를 통해 계층 간 데이터를 전달합니다."],
        ["04","권한 검증","회원 역할, 카테고리 관리자 권한, 리소스 작성자 여부를 판정합니다."],
        ["05","DB 반영","허용된 변경만 실행하고 논리 삭제 등 상태를 데이터베이스에 반영합니다."],
        ["06","JSON 응답","HTTP 상태 코드와 JSON 메시지로 성공 또는 오류를 클라이언트에 전달합니다."]
      ],
      engineering:[
        ["인증과 인가 분리","세션이 존재하는지만 보는 데서 끝내지 않고 작업 대상과 사용자의 관계까지 확인해 리소스 단위 인가를 수행합니다."],
        ["권한 실패를 명시적으로 응답","401(로그인 필요), 400(잘못된 요청), 404(대상 없음), 403(권한 없음)을 구분해 클라이언트가 실패 원인을 처리할 수 있게 합니다."],
        ["계층 분리","Servlet의 요청 처리, DTO의 데이터 전달, DAO의 SQL 접근을 분리해 기능별 코드 책임을 구분합니다."]
      ],
      role:"팀 프로젝트입니다. README의 DAO/DTO/Servlet 기반 구조와 저장소의 게시글 삭제 Servlet을 함께 확인해 권한 판정 및 오류 처리 흐름을 중심으로 설명했습니다.",
      outcome:"단순 CRUD를 넘어 회원 역할과 리소스 소유권을 함께 확인하는 커뮤니티 권한 구조를 구현했습니다. 팀 프로젝트의 전체 기여를 개인 단독 구현으로 표현하지 않고 저장소에서 확인 가능한 구조와 흐름을 중심으로 정리했습니다.",
      repo:"https://github.com/zuzusnasna/miniproject", source:"https://github.com/zuzusnasna/miniproject/blob/main/src/main/java/com/gamecommunity/servlet/PostDeleteServlet.java", resources:[["프로젝트 보고서","https://github.com/zuzusnasna/miniproject/blob/main/GameHub%20%EB%B3%B4%EA%B3%A0%EC%84%9C.pdf"],["발표 자료","https://docs.google.com/presentation/d/1O8qmPBlW6gBzqgfcE0S12cH3KzVe9jgL/edit?usp=sharing&ouid=116307840021041251052&rtpof=true&sd=true"]]
    },
    ems:{
      index:"03", name:"EMS", category:"FULL STACK · EQUIPMENT OPERATIONS",
      title:"장비 현황과 변경 이력을 한곳에서 관리하다",
      lead:"제조 현장의 장비를 등록·조회·수정·삭제하고 장비명·유형·상태·위치로 검색하며 공장별 현황과 상태 변경 이력을 확인하는 Spring Boot + React 웹 시스템입니다.",
      problem:"장비 정보가 목록이나 별도 문서에 분산되면 현재 상태를 파악하기 어렵고, 상태가 바뀐 이유와 시점을 추적하기도 어렵습니다. 운영 화면에서는 검색과 현황 요약, 변경 내역 확인이 함께 필요합니다.",
      approach:"React 프론트엔드가 REST API를 호출하고 Spring Boot Controller가 요청을 검증한 뒤 Service와 Spring Data JPA Repository를 통해 Oracle Database를 처리합니다. 장비 상태 변경에는 변경 사유와 전·후 상태, 변경 사용자, 변경 시각을 이력으로 남기는 기능을 둡니다.",
      stack:["Java","Spring Boot","Spring Data JPA","Oracle Database","React","Vite","Jakarta Validation","Swagger / OpenAPI","JUnit","Mockito"],
      features:[
        ["장비 CRUD","장비 ID, 장비명, 유형, 상태, 위치를 관리합니다. 전체 목록과 단건 조회, 등록, 수정, 삭제 API를 제공합니다.","EquipmentController · EquipmentService"],
        ["검색·필터","상태별 조회와 장비명 포함 문자열 검색을 분리된 API로 제공합니다.","GET /equipments/search · /search/name"],
        ["상태 변경 이력","변경 전 상태와 변경 후 상태, 변경 사유, 변경 사용자, 변경 일시를 기록하고 장비별 이력을 최신 순으로 조회할 수 있도록 구성했습니다.","EquipmentHistory · History API"],
        ["현황 대시보드","공장별 장비 수와 상태별 장비 수를 요약해 전체 장비 상황을 대시보드 형태로 확인합니다.","React dashboard"],
        ["요청 검증·예외 처리","Controller에서 @Valid 요청 검증을 수행하고 조회 대상이 없으면 EquipmentNotFoundException으로 실패를 처리합니다.","EquipmentController · GlobalExceptionHandler"],
        ["API 문서·테스트","Swagger/OpenAPI 문서와 Controller·Service 단위 테스트로 API 계약 및 주요 동작을 확인할 수 있도록 구성했습니다.","OpenAPI · JUnit / Mockito"]
      ],
      flow:[
        ["01","React 화면","사용자가 장비 정보를 입력하거나 검색 조건을 선택합니다."],
        ["02","REST Controller","HTTP 메서드와 경로에 따라 목록·상세·등록·수정·삭제 요청을 받습니다."],
        ["03","Validation","@Valid로 입력값을 확인하고 잘못된 요청을 차단합니다."],
        ["04","Service / Repository","서비스 로직이 JPA Repository를 호출해 장비 데이터를 조회하거나 변경합니다."],
        ["05","Oracle DB","장비 데이터와 상태 변경 이력을 영속화합니다."],
        ["06","Response DTO","Entity를 응답 객체로 변환해 React에서 사용할 데이터로 반환합니다."]
      ],
      engineering:[
        ["REST API 책임","전체 조회, 단건 조회, 생성, 수정, 삭제를 HTTP 메서드와 경로로 구분하고 응답 모델을 별도로 둡니다."],
        ["실패 상황 표현","존재하지 않는 장비를 명시적인 예외로 처리하고 API 문서에 400·404 등 응답 조건을 기술합니다."],
        ["변경 추적","현재 상태만 덮어쓰는 데서 나아가 변경 사유와 전·후 상태를 이력으로 관리하도록 설계했습니다."]
      ],
      role:"저장소의 EquipmentController와 EquipmentService에서는 CRUD, 상태 필터, 이름 검색, 요청 검증 흐름을 확인할 수 있습니다. README에 기재된 이력·대시보드·테스트 기능도 상세 설명에 반영했습니다.",
      outcome:"장비 CRUD와 검색 API를 넘어 운영자가 현황을 요약해 보고 상태 변경의 맥락을 추적할 수 있는 관리 흐름을 구성했습니다. README의 기술 버전 표기와 실제 빌드 설정이 다를 수 있어 세부 버전보다 저장소에서 확인되는 구성 요소를 중심으로 표기했습니다.",
      repo:"https://github.com/zuzusnasna/equipment-management", source:"https://github.com/zuzusnasna/equipment-management/blob/main/src/main/java/com/example/equipmentmanagement/equipment/EquipmentController.java", resources:[["프로젝트 보고서","https://github.com/zuzusnasna/equipment-management/blob/main/EMS%20%EB%B3%B4%EA%B3%A0%EC%84%9C.pdf"],["발표 자료","https://docs.google.com/presentation/d/1KrGjSpPWXOR8gUXXhFqFXyQUNTyPWBGk/edit?usp=sharing&ouid=116307840021041251052&rtpof=true&sd=true"]]
    },
    smart:{
      index:"04", name:"SMARTTICKETING", category:"FULL STACK · CONCURRENCY · REDIS · CI/CD",
      title:"선호 기반 자동 예매와 대기열을 안정적으로 처리하다",
      lead:"선호 영화관·좌석 구역을 저장해 두면 조건에 맞는 좌석을 자동 탐색·선점하고, 매진 회차는 취소표 대기와 자동 배정으로 연결하는 영화 예매 서비스입니다.",
      problem:"인기 회차에는 동일 좌석에 요청이 몰려 중복 선점 위험이 생깁니다. 대기 순번을 매번 DB에서 다시 계산하면 요청이 늘수록 조회 비용이 커지고, 취소표 배정·결제·티켓 발급이 따로 움직이면 상태가 어긋날 수 있습니다.",
      approach:"회차·구역 단위 잠금과 좌석 상태 재확인으로 선점 경쟁을 제어합니다. Idempotency-Key로 중복 요청을 막고 Redis Sorted Set의 ZCOUNT로 앞선 대기자 수를 계산합니다. 취소 후속 처리는 Outbox와 Worker로 분리하고 조회 캐시와 접속 대기실로 트래픽을 제어합니다.",
      stack:["Java 21","Spring Boot","Spring Security","React + Vite","MySQL 8","Redis","JWT / OAuth 2.0","SSE","Docker Compose","nginx","GitHub Actions","k6"],
      features:[
        ["스마트·일반 예매","선호 영화관·좌석 순위와 날짜·시간·인원으로 후보를 탐색하거나 극장·회차·좌석 배치도에서 직접 선택해 최대 6석을 요청합니다.","booking UI · booking services"],
        ["선점과 동시성 제어","5분 선점, 사용자 요청 직렬화, 회차·구역 잠금, 좌석 상태 재검증으로 같은 좌석에 대한 경쟁 요청을 제어합니다.","BookingHoldService"],
        ["멱등성 처리","Idempotency-Key와 BookingOperation 기록으로 동일한 요청이 반복 전송되어도 중복 처리되지 않도록 합니다.","BookingIdempotency"],
        ["대기 순번·취소표 자동 배정","Redis Sorted Set의 ZCOUNT로 앞선 대기자 수를 조회합니다. 취소·만료 이벤트는 Outbox에 기록하고 Worker가 재시도 가능한 후속 배정을 처리합니다.","Waiting Queue · Outbox Worker"],
        ["인증·알림·티켓","일반 로그인과 Google·Naver·Kakao OAuth, SSE 알림, 결제 후 QR 티켓 발급 및 QR 사용 검증을 제공합니다.","auth · NotificationService · TicketService"],
        ["운영·배포","nginx와 Docker Compose로 배포 구성을 나누고 GitHub Actions에서 테스트 및 배포 흐름을 자동화합니다. k6로 조회 경로의 부하를 측정합니다.","deploy/ · .github/workflows · k6/"]
      ],
      flow:[
        ["01","조건 입력","사용자가 선호 설정과 예매 날짜·시간·인원을 입력하거나 좌석을 직접 선택합니다."],
        ["02","요청 중복 확인","멱등성 키를 확인하고 사용자별 요청과 선점 흐름을 조정합니다."],
        ["03","잠금·재검증","회차·구역 단위 경쟁을 제어하고 DB의 최신 좌석 상태를 확인합니다."],
        ["04","선점 또는 대기","가능한 좌석을 5분 동안 선점하거나 좌석 구역별 대기열에 등록합니다."],
        ["05","결제·취소 이벤트","결제 완료 시 예약을 확정하고 취소·만료 이벤트는 Outbox를 통해 후속 처리합니다."],
        ["06","티켓·알림","QR 티켓과 SSE 알림을 제공하고 입장 시 QR 검증을 통해 티켓 상태를 갱신합니다."]
      ],
      engineering:[
        ["정합성과 처리량을 구분","좌석 정합성은 DB 상태와 잠금 경계에서 보장하고, 조회 비용을 줄이는 대기 순번은 Redis 자료구조로 분리합니다."],
        ["요청 중복과 이벤트 실패","멱등성 기록과 Outbox를 통해 중복 요청 및 취소 후속 처리의 실패 가능성을 다룹니다."],
        ["관측 가능한 검증","k6로 메인·시간표·좌석 배치 조회의 부하를 측정하고 Actuator/메트릭 구성과 배포 자동화를 통해 운영 점검 기반을 마련합니다."]
      ],
      role:"팀 프로젝트에서 회원·인증, 소셜 로그인 및 계정 연동, 회원 정보 관리, SSE 알림, QR 티켓·입장 확인, 해시 라우팅과 AWS 배포·CI/CD 구성을 담당했습니다. 예매 잠금·Outbox 등은 서비스 전체 구조를 설명하기 위해 함께 소개합니다.",
      outcome:"README에 기록된 Redis 적용 전 로컬 k6 기준값은 메인·공통 조회 약 2,600 req/s, 시간표 조회 약 224 req/s, 좌석 배치 조회 약 1,280 req/s입니다. 이 값은 해당 테스트 환경의 기준값이며 개선율이나 운영 환경 성능으로 확대 해석하지 않았습니다.",
      repo:"https://github.com/zuzusnasna/SmartTicketing", source:"https://github.com/zuzusnasna/SmartTicketing/blob/main/src/main/java/smartticketing/service/TicketService.java", live:"https://smartticketing.duckdns.org", resources:[["성능 측정 결과","project-smartticketing-performance.html"],["발표 자료","https://github.com/zuzusnasna/SmartTicketing/blob/main/SmartTicketing%20%EB%B0%9C%ED%91%9C.pptx"]]
    },
    meet:{
      index:"05", name:"MEET-UP", category:"FULL STACK · MAP · GROUP PLANNING · IN PROGRESS",
      title:"여러 사람의 출발지와 모임 후보를 하나의 지도에 연결하다",
      lead:"모임방에 참여자를 초대하고 각자의 출발 위치와 장소 후보를 지도에서 비교해 투표로 최종 장소를 결정하며, 대중교통 경로·날씨·주변 정보를 함께 확인하는 모임 계획 서비스입니다.",
      problem:"여럿이 만날 장소를 정할 때는 후보 장소의 위치뿐 아니라 참여자별 출발지, 이동 시간, 환승, 주변 편의시설까지 고려해야 합니다. 정보가 채팅이나 여러 지도 검색으로 흩어지면 합리적인 결정을 내리기 어렵습니다.",
      approach:"React 화면에서 Kakao Maps SDK를 로드하고 참여자·후보 장소 데이터를 지도 마커로 표현합니다. 모임방·참여자·후보·투표 정보를 API와 연결하고, 최종 장소가 결정되면 사용자별 출발지에 대한 대중교통 귀가 경로를 일괄 요청합니다.",
      stack:["React","Vite","Spring Boot 4","Java 21","Spring Data JPA","Spring Security","OAuth2 Client","WebSocket","Redis","Oracle Database","Kakao Maps"],
      features:[
        ["모임방·초대","URL의 roomId로 초대받은 모임을 이어서 열고 현재 모임과 참여자를 관리합니다. 초대 정보를 localStorage에 보관해 진입 흐름을 이어줍니다.","App.jsx · RoomEntry"],
        ["지도·장소 후보","Kakao Maps SDK를 비동기로 로드하고 지도 위에 후보 장소와 사용자 위치를 표시합니다. 장소 검색과 위치 선택을 모임 결정 흐름에 연결합니다.","App.jsx · SearchPanel · CandidatePanel"],
        ["참여자별 출발지","참여자와 사용자별 위치 데이터를 연결해 지도 마커를 표시하고 해당 위치 정보를 확인할 수 있도록 구성합니다.","OriginPanel · map markers"],
        ["투표·최종 장소 결정","후보별 투표 수를 관리하고 동점 상황에서는 사다리 게임 UI를 통해 최종 장소를 결정하는 흐름을 제공합니다.","CandidatePanel · vote finish"],
        ["대중교통 경로 갱신","최종 장소와 참여자 출발 좌표를 묶어 /api/transit/return-routes/batch로 요청합니다. 새로고침 시 최신 경로를 가져오고 환승 경로와 예상 소요시간을 사용자별로 표시합니다.","TransitRoutePanel.jsx"],
        ["날씨·주변 정보·메모","선택 장소의 날씨와 주변 장소 정보를 확인하고 지도에 메모를 남겨 모임 관련 정보를 한 화면에 모읍니다.","WeatherPanel · FinalPlaceNearby · memo markers"]
      ],
      flow:[
        ["01","모임방 입장","로그인 사용자를 확인하고 roomId 또는 저장된 초대 정보를 바탕으로 모임방에 진입합니다."],
        ["02","참여자·위치 수집","참여자 목록, 출발 위치, 장소 후보를 API로 조회합니다."],
        ["03","지도 렌더링","Kakao Maps에 출발지와 후보 마커를 표시하고 검색·선택 상호작용을 연결합니다."],
        ["04","후보 투표","후보별 득표를 갱신하고 최다 득표 또는 동점 처리 흐름으로 최종 장소를 정합니다."],
        ["05","경로·주변 정보","확정 장소를 기준으로 대중교통 경로를 갱신하고 날씨와 주변 장소 정보를 조회합니다."],
        ["06","공유·조율","참여자들이 같은 모임 정보를 바탕으로 장소와 이동 정보를 확인하고 결정을 조율합니다."]
      ],
      engineering:[
        ["지도 SDK 비동기 로딩","Kakao Maps SDK가 이미 로드된 경우와 처음 로드하는 경우를 분기하고 Promise를 재사용해 중복 로딩을 줄입니다."],
        ["경로 요청의 명시적 새로고침","TransitRoutePanel은 확정 장소 좌표를 기준으로 참여자 출발지를 묶어 batch API에 refresh=true로 전달해 경로를 다시 계산하도록 요청합니다."],
        ["UI 상태와 데이터 요청 분리","지도, 선택 장소, 참여자, 투표, 날씨, 경로 로딩 상태를 React state로 관리하고 각 패널의 역할을 분리합니다."]
      ],
      role:"현재 진행 중인 프로젝트입니다. 확인한 프론트엔드 코드에는 Kakao Maps SDK 로딩, 모임·후보·투표 상태, 주변 정보와 대중교통 경로 batch 요청이 포함되어 있습니다. 저장소에서 README가 확인되지 않아 공개 코드와 빌드 설정을 중심으로 설명했습니다.",
      outcome:"장소 추천만 제공하는 것이 아니라 참여자별 출발 위치와 이동 경로까지 모임 결정 과정에 묶는 방향으로 개발 중입니다. 진행 중인 기능은 완성된 운영 기능으로 과장하지 않고 현재 코드에서 확인되는 범위로 표기했습니다.",
      repo:"https://github.com/zuzusnasna/Meet-Up", source:"https://github.com/zuzusnasna/Meet-Up/blob/main/frontend/src/App.jsx"
    }
  };

  const key = document.body.dataset.project;
  const p = content[key] || content.smart;
  const esc = value => String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const featureHtml = p.features.map((item, i) =>
    '<article class="detail-feature"><span class="detail-feature-index">' + String(i + 1).padStart(2,"0") + '</span><div><h3>' + esc(item[0]) + '</h3><p>' + esc(item[1]) + '</p><code>' + esc(item[2]) + '</code></div></article>'
  ).join("");
  const flowHtml = p.flow.map(item =>
    '<article class="detail-step"><span>' + esc(item[0]) + '</span><div><h3>' + esc(item[1]) + '</h3><p>' + esc(item[2]) + '</p></div></article>'
  ).join("");
  const engineeringHtml = p.engineering.map(item =>
    '<article class="engineering-card"><span>ENGINEERING NOTE</span><h3>' + esc(item[0]) + '</h3><p>' + esc(item[1]) + '</p></article>'
  ).join("");

  document.title = p.name + " — 주상혁 포트폴리오";
  document.getElementById("detailPage").innerHTML =
    '<section class="detail-hero"><div class="detail-hero-copy">' +
      '<div class="detail-eyebrow"><span>' + esc(p.index) + '</span>' + esc(p.category) + '</div>' +
      '<h1>' + esc(p.title) + '</h1><p class="detail-lead">' + esc(p.lead) + '</p>' +
      '<div class="detail-tags">' + p.stack.map(tag => '<span>' + esc(tag) + '</span>').join("") + '</div>' +
      '<div class="detail-hero-actions"><a class="detail-primary-link" href="' + esc(p.repo) + '" target="_blank" rel="noreferrer">GITHUB REPOSITORY ↗</a>' +
      (p.live ? '<a class="detail-secondary-link" href="' + esc(p.live) + '" target="_blank" rel="noreferrer">LIVE SERVICE ↗</a>' : '') + '</div>' +
      (p.resources ? '<div class="detail-resource-links">' + p.resources.map(item => '<a href="' + esc(item[1]) + '" target="_blank" rel="noreferrer">' + esc(item[0]) + ' ↗</a>').join("") + '</div>' : '') + '</div>' +
      '<aside class="detail-side-index"><span>PROJECT FILE</span><strong>' + esc(p.name) + '</strong><div class="detail-side-line"></div><small>OVERVIEW / ARCHITECTURE / IMPLEMENTATION</small><a href="' + esc(p.source) + '" target="_blank" rel="noreferrer">핵심 코드 살펴보기 ↗</a></aside></section>' +
    '<section class="detail-section detail-problem-grid"><div class="detail-section-label"><span>01</span><span>WHY THIS PROJECT</span></div><div class="detail-problem-content">' +
      '<article><span>THE PROBLEM</span><h2>무엇이 불편했고,<br>어떤 문제가 있었나</h2><p>' + esc(p.problem) + '</p></article>' +
      '<article class="detail-solution"><span>THE APPROACH</span><h2>문제를 어떤 구조로<br>풀었나</h2><p>' + esc(p.approach) + '</p></article></div></section>' +
    '<section class="detail-section"><div class="detail-section-label"><span>02</span><span>FEATURE BREAKDOWN</span></div><div class="detail-section-heading"><h2>기능을 코드와 연결해서 보기</h2><p>README와 구현 파일을 바탕으로 주요 기능과 처리 책임을 정리했습니다.</p></div><div class="detail-feature-list">' + featureHtml + '</div></section>' +
    '<section class="detail-section detail-flow-section"><div class="detail-section-label"><span>03</span><span>END-TO-END FLOW</span></div><div class="detail-section-heading"><h2>요청이 들어와 결과가 되기까지</h2><p>프로젝트의 실제 컴포넌트와 데이터 이동을 단계별로 표현했습니다.</p></div><div class="detail-steps">' + flowHtml + '</div></section>' +
    '<section class="detail-section"><div class="detail-section-label"><span>04</span><span>ENGINEERING DECISIONS</span></div><div class="detail-section-heading"><h2>기술을 선택한 이유</h2><p>기술 이름보다 구현에서 해결해야 했던 문제와 선택의 의미에 집중합니다.</p></div><div class="engineering-grid">' + engineeringHtml + '</div></section>' +
    '<section class="detail-section detail-contribution"><div class="detail-section-label"><span>05</span><span>MY CONTRIBUTION</span></div><div class="detail-contribution-content"><div><span class="detail-overline">SCOPE & RESPONSIBILITY</span><h2>프로젝트에서 맡은 역할</h2></div><p>' + esc(p.role) + '</p></div></section>' +
    '<section class="detail-outcome"><div><span>06 / RESULT & NOTES</span><h2>결과와 검증 범위</h2></div><p>' + esc(p.outcome) + '</p><div class="detail-bottom-links"><a href="' + esc(p.repo) + '" target="_blank" rel="noreferrer">저장소에서 전체 코드 보기 ↗</a><a href="index.html?project=' + encodeURIComponent(key) + '#projects">포트폴리오로 돌아가기 ↗</a></div></section>';
})();