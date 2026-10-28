const projects={
smart:{name:'SMARTTICKETING',title:'동시 예매와 대규모 대기 요청을 처리하는 예매 시스템',summary:'동일 좌석에 동시에 요청이 들어오는 상황과 대기 순번 조회의 부하를 분석하고, DB 동시성 제어와 Redis Sorted Set, Outbox 기반 비동기 구조로 처리 흐름을 설계했습니다.',tags:['Java 21','Spring Boot 4','MySQL','Redis','React','k6'],problem:'동일 좌석에 여러 사용자가 동시에 접근하면 선점 경쟁이 발생하고, 대기 순번을 조회할 때마다 많은 데이터를 다시 계산하면 조회 비용이 커질 수 있었습니다.',solution:'회차·구역 단위 Lock으로 경쟁 범위를 줄이고 좌석 상태를 다시 확인한 뒤 선점합니다. 대기 순번은 Redis Sorted Set과 ZCOUNT로 앞선 대기자 수를 계산하고, 취소 이벤트는 Outbox에 기록한 뒤 Worker가 비동기로 처리합니다.',architecture:`<div class="arch-map smart-arch">
<div class="arch-lane"><div class="arch-lane-label">CLIENT</div><div class="arch-node"><b>React UI</b><small>좌석 선택 · 대기 순번 · 티켓</small></div></div>
<div class="arch-connector"><span>HTTPS / REST API</span><i>↓</i></div>
<div class="arch-lane"><div class="arch-lane-label">APPLICATION · SPRING BOOT</div><div class="arch-node primary"><b>Controller</b><small>요청 검증 · 응답</small></div><div class="arch-link">→</div><div class="arch-node primary"><b>Service</b><small>예매 정책 · 상태 전이</small></div><div class="arch-link">→</div><div class="arch-node primary"><b>Concurrency Control</b><small>회차·구역 Lock · 좌석 재확인</small></div></div>
<div class="arch-connector"><span>상태 조회 / 예약 처리</span><i>↓</i></div>
<div class="arch-lane data-lane"><div class="arch-lane-label">DATA & ASYNC PROCESSING</div><div class="arch-node database"><b>MySQL</b><small>회차 · 좌석 · 예약 데이터</small></div><div class="arch-node cache"><b>Redis Sorted Set</b><small>대기열 순서 · ZCOUNT 조회</small></div><div class="arch-node async"><b>Outbox</b><small>이벤트 기록</small></div><div class="arch-node async"><b>Worker</b><small>비동기 후속 처리</small></div></div>
<div class="arch-note"><b>핵심 경계</b><span>좌석 정합성은 DB 상태와 잠금 흐름에서 확인하고, 대기 순번 조회는 Redis 자료구조를 사용하며, 후속 이벤트는 Outbox/Worker 흐름으로 분리</span></div></div>`,flow:[{title:'예매 요청',detail:'React에서 회차·좌석 선택 후 API 호출',type:'client'},{title:'경쟁 범위 잠금',detail:'회차·구역 단위로 동시 요청 경합 제어',type:'process'},{title:'좌석 재검증',detail:'DB의 최신 상태를 확인해 선점 가능 여부 판단',type:'process'},{title:'예약 반영',detail:'선점 및 예약 상태를 영속 데이터에 기록',type:'database'},{title:'대기 순번 조회',detail:'Redis Sorted Set에서 ZCOUNT로 앞선 대기자 수 계산',type:'cache'},{title:'후속 이벤트',detail:'Outbox 기록을 Worker가 비동기로 처리',type:'async'}],sequence:['사용자 → API : 좌석 예매 요청','API → Lock : 경쟁 범위 잠금','API → DB : 좌석 상태 확인','DB → API : 선점 가능 여부','API → DB : 예약 저장','API → 사용자 : 예매 결과'],result:'k6 로컬 테스트에서 메인/공통 조회 약 2,600 req/s, 좌석 배치 조회 약 1,280 req/s, 회차 조회 약 224 req/s의 기준값을 확인했습니다. 개선율은 임의로 산정하지 않았습니다.'},
swing:{name:'SWINGFIT',title:'모바일 AI 영상 분석의 실행 안정성과 분석 효율 개선',summary:'TensorFlow Lite 실행 환경을 GPU와 CPU로 분기하고, 전체 영상을 동일한 비용으로 탐색하지 않도록 Coarse/Fine Search와 Tracking을 결합했습니다.',tags:['Android','Kotlin','TensorFlow Lite','GPU','XNNPACK'],problem:'모바일에서 영상 전체 프레임을 동일한 방식으로 분석하면 추론 비용이 커지고, 기기마다 GPU 지원 여부가 달라 실행 환경도 달라질 수 있습니다.',solution:'640×640 입력으로 전처리하고 GPU Delegate가 가능하면 GPU를 사용하며 실패하거나 미지원이면 CPU+XNNPACK으로 fallback합니다. 임팩트 후보는 Coarse Search 후 Fine Search로 좁히고 이후 Tracking을 강화합니다.',architecture:`<div class="arch-map swing-arch">
<div class="arch-lane"><div class="arch-lane-label">INPUT</div><div class="arch-node"><b>Golf Swing Video</b><small>원본 영상 · 프레임</small></div><div class="arch-link">→</div><div class="arch-node"><b>Frame / ROI Preprocessing</b><small>관심 영역 · 640×640 입력</small></div></div>
<div class="arch-connector"><span>전처리된 프레임</span><i>↓</i></div>
<div class="arch-lane"><div class="arch-lane-label">INFERENCE RUNTIME</div><div class="arch-node primary"><b>TensorFlow Lite</b><small>모델 추론 실행</small></div></div>
<div class="arch-fork"><span>Delegate 초기화 결과에 따른 실행 경로</span></div>
<div class="arch-lane"><div class="arch-node cache"><b>GPU Delegate</b><small>지원 및 초기화 성공 시</small></div><div class="arch-node fallback"><b>CPU + XNNPACK</b><small>미지원 또는 실패 시 fallback</small></div></div>
<div class="arch-connector"><span>Detection 결과</span><i>↓</i></div>
<div class="arch-lane"><div class="arch-lane-label">ANALYSIS</div><div class="arch-node"><b>Coarse Search</b><small>임팩트 후보 구간 탐색</small></div><div class="arch-link">→</div><div class="arch-node"><b>Fine Search</b><small>후보 구간 정밀 탐색</small></div><div class="arch-link">→</div><div class="arch-node primary"><b>Tracking</b><small>프레임 간 대상 추적</small></div></div></div>`,flow:[{title:'영상 입력',detail:'원본 영상에서 분석 프레임 추출',type:'client'},{title:'전처리',detail:'ROI 설정 및 640×640 입력 구성',type:'process'},{title:'런타임 선택',detail:'GPU Delegate 초기화 시도',type:'process'},{title:'Fallback',detail:'GPU 미지원·초기화 실패 시 CPU + XNNPACK',type:'cache'},{title:'Detection',detail:'TFLite 모델에서 프레임별 검출 결과 생성',type:'process'},{title:'Coarse Search',detail:'넓은 구간에서 임팩트 후보 탐색',type:'process'},{title:'Fine Search + Tracking',detail:'후보 구간 정밀화 및 프레임 간 추적',type:'async'}],sequence:['영상 → Analyzer : 프레임 전달','Analyzer → TFLite : 640×640 추론','TFLite → Analyzer : 공 Detection','Analyzer → Search : 임팩트 후보 탐색','Search → Analyzer : 정밀 후보 반환'],result:'코드에서 GPU Delegate 지원 여부를 확인하고 실패 시 CPU/XNNPACK으로 전환하는 실행 경로와 단계적 탐색·Tracking 구조를 확인했습니다. 검증된 성능 수치는 별도로 과장하지 않았습니다.'},
game:{name:'GAMEHUB',title:'회원 역할과 리소스 단위 접근 제어 구현',summary:'로그인 세션을 확인한 뒤 시스템 관리자, 카테고리 관리자, 작성자 여부를 순차적으로 판정해 게시글 단위 접근 권한을 제어했습니다.',tags:['Servlet','DAO/DTO','Session','Oracle'],problem:'단순히 로그인 여부만 확인하면 다른 사용자의 게시글까지 수정·삭제할 수 있는 문제가 생기므로 사용자 역할과 리소스 소유권을 함께 확인해야 했습니다.',solution:'Session에서 회원을 확인하고 대상 게시글을 조회한 뒤 시스템 관리자 → 카테고리 관리자 → 작성자 순으로 권한을 판정합니다. 권한이 없으면 403으로 종료하고 허용된 경우에만 논리 삭제를 수행합니다.',architecture:`<div class="arch-map game-arch">
<div class="arch-lane"><div class="arch-lane-label">REQUEST</div><div class="arch-node"><b>Browser / User</b><small>게시글 수정·삭제 요청</small></div></div>
<div class="arch-connector"><span>Servlet request</span><i>↓</i></div>
<div class="arch-lane"><div class="arch-lane-label">AUTHENTICATION</div><div class="arch-node primary"><b>Servlet / Controller</b><small>요청 파라미터 처리</small></div><div class="arch-link">→</div><div class="arch-node"><b>HTTP Session</b><small>로그인 회원 확인</small></div></div>
<div class="arch-connector"><span>대상 리소스 조회</span><i>↓</i></div>
<div class="arch-lane"><div class="arch-lane-label">AUTHORIZATION</div><div class="arch-node"><b>DAO</b><small>게시글 · 카테고리 조회</small></div><div class="arch-link">→</div><div class="arch-node primary"><b>Role + Ownership Check</b><small>시스템 관리자 → 카테고리 관리자 → 작성자</small></div></div>
<div class="arch-fork"><span>권한 판정 결과</span></div>
<div class="arch-lane"><div class="arch-node cache"><b>Allowed</b><small>Oracle 논리 삭제 / 변경 처리</small></div><div class="arch-node fallback"><b>Denied</b><small>403 Forbidden · 변경 차단</small></div></div>
<div class="arch-note"><b>보안 경계</b><span>로그인 여부만으로 판단하지 않고 대상 게시글의 역할 및 소유권을 함께 검증한 뒤 변경을 허용</span></div></div>`,flow:[{title:'요청 수신',detail:'사용자가 게시글 수정·삭제 요청',type:'client'},{title:'세션 확인',detail:'로그인 사용자와 세션 상태 확인',type:'process'},{title:'리소스 조회',detail:'DAO를 통해 대상 게시글·카테고리 조회',type:'database'},{title:'권한 판정',detail:'시스템 관리자 → 카테고리 관리자 → 작성자 확인',type:'process'},{title:'분기 처리',detail:'권한이 없으면 403으로 종료',type:'async'},{title:'변경 실행',detail:'허용된 요청만 Oracle에 논리 삭제 반영',type:'database'},{title:'응답 반환',detail:'성공 또는 접근 거부 결과 전달',type:'client'}],sequence:['사용자 → Servlet : 삭제 요청','Servlet → Session : 로그인 확인','Servlet → DAO : 게시글 조회','Servlet : 권한 판정','Servlet → DB : 논리 삭제','Servlet → 사용자 : 결과 반환'],result:'권한이 없는 요청을 403으로 분리하고, 관리자 역할과 작성자 소유권을 함께 판단하는 리소스 단위 접근 제어 흐름을 구현했습니다.'},
ems:{name:'EMS',title:'장비 정보와 변경 이력의 데이터 정합성 보장',summary:'장비 상태 변경과 변경 이력 저장을 하나의 Transaction으로 묶어 상태 데이터와 감사 이력이 서로 다른 상태로 남지 않도록 처리했습니다.',tags:['Spring Boot','JPA','Oracle','React'],problem:'장비 정보만 수정되고 변경 이력이 저장되지 않으면 현재 상태와 이력 데이터가 서로 달라져 추적이 어려워집니다.',solution:'수정 메서드에 @Transactional을 적용하고 기존 상태를 먼저 확보한 뒤 변경 사유를 검증합니다. 장비를 수정하고 이력을 저장하는 과정 전체가 하나의 Transaction으로 처리되도록 구성했습니다.',architecture:`<div class="arch-map ems-arch">
<div class="arch-lane"><div class="arch-lane-label">PRESENTATION</div><div class="arch-node"><b>React UI</b><small>장비 정보 · 변경 사유 입력</small></div></div>
<div class="arch-connector"><span>HTTP request</span><i>↓</i></div>
<div class="arch-lane"><div class="arch-lane-label">BACKEND</div><div class="arch-node primary"><b>Spring Boot API</b><small>요청 검증 · Service 호출</small></div><div class="arch-link">→</div><div class="arch-node primary"><b>@Transactional Service</b><small>하나의 트랜잭션 경계</small></div></div>
<div class="arch-connector"><span>동일 트랜잭션 안에서 실행</span><i>↓</i></div>
<div class="arch-lane"><div class="arch-lane-label">PERSISTENCE · JPA</div><div class="arch-node"><b>1. Read Current State</b><small>기존 장비 상태 확보</small></div><div class="arch-link">→</div><div class="arch-node database"><b>2. Update Equipment</b><small>장비 상태 변경</small></div><div class="arch-link">→</div><div class="arch-node async"><b>3. Insert History</b><small>변경 이력 저장</small></div></div>
<div class="arch-connector"><span>두 작업의 성공 여부를 함께 반영</span><i>↓</i></div>
<div class="arch-lane"><div class="arch-node cache"><b>COMMIT</b><small>변경 데이터 + 이력 반영</small></div><div class="arch-node fallback"><b>ROLLBACK</b><small>예외 발생 시 전체 취소</small></div></div>
<div class="arch-note"><b>정합성 경계</b><span>장비 변경과 이력 저장을 별도 성공으로 취급하지 않고 하나의 Transaction으로 묶음</span></div></div>`,flow:[{title:'수정 요청',detail:'React에서 장비 변경값과 사유 전송',type:'client'},{title:'기존 상태 조회',detail:'Service에서 현재 장비 상태 확보',type:'database'},{title:'사유 검증',detail:'변경 사유 및 요청 데이터 검증',type:'process'},{title:'Transaction 시작',detail:'장비 변경과 이력 저장을 같은 경계로 처리',type:'process'},{title:'장비 업데이트',detail:'JPA를 통해 Equipment 변경',type:'database'},{title:'이력 INSERT',detail:'변경 내역을 History에 저장',type:'async'},{title:'Commit / Rollback',detail:'모든 작업 성공 시 반영, 예외 시 함께 취소',type:'cache'}],sequence:['사용자 → Service : 장비 수정','Service → DB : 기존 장비 조회','Service : 변경 사유 검증','Service → DB : 장비 수정','Service → DB : History 저장','Transaction → DB : Commit'],result:'장비 수정과 변경 이력 저장을 하나의 Transaction으로 묶어 두 데이터의 정합성을 보장하고 변경 추적이 가능하도록 했습니다.'},
meet:{name:'MEET-UP',title:'모임 장소 결정부터 귀가 계획과 정산까지 연결하는 서비스',summary:'모임방 생성, 장소 후보 투표, 참여자별 출발지 지도 표시와 목적에 따른 정산 기능을 구현했습니다. 귀가 경로 연동도 진행했으며, 환승 경로를 고려한 막차 시간 계산은 정확한 경로별 운행 정보 처리에 어려움이 있어 잠시 중단하고 추후 개발할 예정입니다.',tags:['React','Vite','Spring Boot','Java 21','Spring Data JPA','Spring Security','OAuth2','WebSocket','Redis','Oracle','Kakao Maps'],problem:'여러 사람이 만날 장소를 정할 때 장소 후보 투표만으로는 부족하고, 참여자별 출발지와 귀가 경로, 모임 비용 정산까지 각각 다른 서비스에서 확인해야 하는 불편이 있습니다.',solution:'모임방과 참여자·장소 후보·투표 흐름을 연결하고, 지도에서 각 참여자의 출발 위치를 확인할 수 있도록 구성했습니다. 모임 목적에 따른 정산 계산을 제공하며 귀가 경로 연동을 진행했습니다. 환승 구간별 막차 시간 계산은 정확한 운행 정보와 환승 관계를 연결하는 데 어려움이 있어 현재 개발을 잠시 중단했으며 추후 보완할 예정입니다.',architecture:`<div class="arch-map meet-arch">
<div class="arch-lane"><div class="arch-lane-label">USER INTERACTION</div><div class="arch-node"><b>Participant UI</b><small>모임 참여자 · 출발지</small></div><div class="arch-link">→</div><div class="arch-node"><b>Meeting Place Candidates</b><small>후보 장소 선택</small></div></div>
<div class="arch-connector"><span>위치 정보 요청 / 응답</span><i>↓</i></div>
<div class="arch-lane"><div class="arch-lane-label">APPLICATION</div><div class="arch-node primary"><b>Spring Boot API</b><small>사용자 · 모임 · 후보 데이터 제공</small></div><div class="arch-link">↔</div><div class="arch-node"><b>JPA Repository</b><small>영속성 계층</small></div><div class="arch-link">↔</div><div class="arch-node database"><b>Database</b><small>모임 · 참여자 · 위치 데이터</small></div></div>
<div class="arch-connector"><span>클라이언트 지도 렌더링</span><i>↓</i></div>
<div class="arch-lane"><div class="arch-node cache"><b>Map Markers</b><small>출발지 · 후보 장소</small></div><div class="arch-link">→</div><div class="arch-node"><b>Hover</b><small>마커 위 사용자 정보</small></div><div class="arch-link">→</div><div class="arch-node"><b>Click</b><small>해당 위치로 지도 이동</small></div></div>
<div class="arch-note"><b>탐색 흐름</b><span>서버 데이터 조회와 지도 상호작용을 분리해, 위치 데이터는 마커로 표현하고 상세 확인 및 위치 이동은 사용자 입력에 반응</span></div></div>`,flow:[{title:'참여자 위치',detail:'사용자별 출발지 데이터 준비',type:'client'},{title:'후보 장소',detail:'모임 장소 후보의 위치 데이터 준비',type:'client'},{title:'API 요청',detail:'클라이언트가 모임·참여자 위치 데이터 요청',type:'process'},{title:'데이터 조회',detail:'Spring Boot와 JPA를 통해 관련 데이터 조회',type:'database'},{title:'지도 응답',detail:'출발지와 후보 장소를 클라이언트로 전달',type:'async'},{title:'마커 렌더링',detail:'사용자 출발지·후보 장소를 지도에 표시',type:'cache'},{title:'Hover / Click',detail:'Hover 정보 표시, Click 시 해당 좌표로 이동',type:'process'}],sequence:['Client → API : 위치 데이터 요청','API → DB : 사용자·후보 조회','DB → API : 위치 데이터','API → Client : 지도 데이터','Client : Hover / Click 인터랙션'],result:'모임방 생성과 참여자·장소 후보 투표, 지도 기반 출발지 확인, 목적에 따른 정산 기능을 구현했습니다. 귀가 경로 연동도 진행했으며, 환승 경로를 포함한 막차 시간 계산은 경로별 운행 정보와 환승 구간을 정확히 연결하는 데 어려움이 있어 잠시 중단했습니다. 해당 기능은 추후 개발 예정입니다.'}
};

projects.realtimechat = {
 name:'REAL-TIME CHAT',
 title:'여러 서버 인스턴스에서도 대화가 이어지는 실시간 채팅',
 summary:'Spring Boot와 React로 구현한 실시간 채팅 서비스입니다. HTTP Session 인증, 채팅방 권한 검증, MySQL 메시지 영속화, Redis Pub/Sub 기반 인스턴스 간 이벤트 전달을 구성하고 EC2 운영 환경의 지연과 자원 사용량을 확인했습니다.',
 tags:['Java 21','Spring Boot','React + Vite','WebSocket / STOMP','MySQL 8','Redis Pub/Sub','Docker','Nginx','k6'],
 problem:'WebSocket 연결이 여러 애플리케이션 인스턴스로 분산되면 한 인스턴스의 메시지가 다른 인스턴스에 연결된 사용자에게 자동으로 전달되지 않습니다. 또한 인증과 채팅방 접근을 검증하면서 메시지를 저장하고 운영 지연도 관찰해야 합니다.',
 solution:'HTTP Session과 채팅방 참여 권한을 검증하고 메시지를 MySQL에 저장합니다. Redis Pub/Sub으로 인스턴스 간 이벤트를 중계하고 Docker Compose와 Nginx로 실행 환경을 구성했습니다. 메시지 순서 보장은 미해결 과제로 분리해 기록했습니다.',
 architecture:[
 '<div class="arch-map chat-arch">',
 '<div class="arch-lane"><div class="arch-lane-label">CLIENT</div><div class="arch-node primary"><b>React + Vite</b><small>REST API · STOMP / WebSocket</small></div></div>',
 '<div class="arch-connector"><span>HTTP / WebSocket</span><i></i></div>',
 '<div class="arch-lane"><div class="arch-lane-label">EDGE</div><div class="arch-node primary"><b>Nginx</b><small>HTTP reverse proxy · WebSocket upgrade</small></div></div>',
 '<div class="arch-connector"><span>요청 라우팅</span><i></i></div>',
 '<div class="arch-lane"><div class="arch-lane-label">APPLICATION</div><div class="arch-node primary"><b>Spring Boot · App 1</b><small>Session · REST · STOMP</small></div><div class="arch-node primary"><b>Spring Boot · App 2</b><small>Session · REST · STOMP</small></div></div>',
 '<div class="arch-connector"><span>영속화 / 인스턴스 간 전달</span><i></i></div>',
 '<div class="arch-lane data-lane"><div class="arch-node database"><b>MySQL 8</b><small>회원 · 방 · 메시지 · 읽음 위치</small></div><div class="arch-node cache"><b>Redis Pub/Sub</b><small>채팅 이벤트 중계</small></div></div>',
 '<div class="arch-note"><b>설계상 한계</b><span>Redis Pub/Sub은 이벤트를 영속 보관하거나 방 단위 메시지 순서를 보장하지 않습니다. 운영 자원을 고려해 Prometheus와 Grafana는 필요할 때만 실행합니다.</span></div></div>'
 ].join(''),
 flow:[{title:'STOMP 수신',detail:'세션 인증과 채팅방 참여 권한 확인',type:'client'},{title:'메시지 저장',detail:'메시지를 MySQL에 영속화',type:'database'},{title:'이벤트 발행',detail:'Redis Pub/Sub으로 채팅 이벤트 발행',type:'cache'},{title:'인스턴스 수신',detail:'다른 앱 인스턴스가 구독 이벤트 수신',type:'async'},{title:'구독자 전달',detail:'각 인스턴스의 WebSocket 구독자에게 전달',type:'process'}],
 sequence:['사용자 A → App 1 : STOMP 메시지','App 1 → MySQL : 메시지 저장','App 1 → Redis : 이벤트 발행','Redis → App 2 : 구독 이벤트 전달','App 2 → 사용자 B : WebSocket 전달'],
 result:'k6 기능 테스트에서 HTTP 요청 실패율 0%와 WebSocket 연결 성공을 확인한 실행이 있습니다. 이후 EC2에서 자원 압박과 지연을 관측했으며, 메시지 순서 보장은 해결 완료로 표시하지 않고 후속 검증 과제로 관리합니다.'
};
const resources = {
 swing:[['프로젝트 상세','project-swingfit.html'],['GitHub','https://github.com/zuzusnasna/SwingFit'],['발표 자료','https://docs.google.com/presentation/d/1Pq6C9Gpwqa5nS4xreTDfaa-qO3nPzDRG/edit?usp=sharing&ouid=116307840021041251052&rtpof=true&sd=true']],
 game:[['프로젝트 상세','project-gamehub.html'],['GitHub','https://github.com/zuzusnasna/miniproject'],['발표 자료','https://docs.google.com/presentation/d/1O8qmPBlW6gBzqgfcE0S12cH3KzVe9jgL/edit?usp=sharing&ouid=116307840021041251052&rtpof=true&sd=true']],
 ems:[['프로젝트 상세','project-ems.html'],['GitHub','https://github.com/zuzusnasna/equipment-management'],['발표 자료','https://docs.google.com/presentation/d/1KrGjSpPWXOR8gUXXhFqFXyQUNTyPWBGk/edit?usp=sharing&ouid=116307840021041251052&rtpof=true&sd=true']],
 smart:[['프로젝트 상세','project-smartticketing.html'],['성능 측정','project-smartticketing-performance.html'],['GitHub','https://github.com/zuzusnasna/SmartTicketing'],['발표 자료','https://github.com/zuzusnasna/SmartTicketing/blob/main/SmartTicketing%20%EB%B0%9C%ED%91%9C.pptx']],
 meet:[['프로젝트 상세','project-meetup.html'],['GitHub','https://github.com/zuzusnasna/Meet-Up']],
 realtimechat:[['프로젝트 상세','project-realtimechat.html'],['성능 측정','project-realtimechat-performance.html'],['GitHub','https://github.com/zuzusnasna/RealTimeChat']]
};
const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
function renderProject(key, focusDetail=false) {
 const p=projects[key] || projects.smart;
 const root=document.querySelector('#projectDetail');
 if(!root) return;
 document.querySelectorAll('.project-tab').forEach(tab=>{
  const active=tab.dataset.project===key;
  tab.classList.toggle('active',active);
  tab.setAttribute('aria-selected',String(active));
  tab.tabIndex=active?0:-1;
 });
 const actionHtml=(resources[key]||[]).map(([label,url],i)=>'<a class="project-action '+(i===0?'project-action-primary':'')+'" href="'+esc(url)+'" '+(/^https?:/.test(url)?'target="_blank" rel="noreferrer"':'')+'>'+esc(label)+' ↗</a>').join('');
 const flowHtml=(p.flow||[]).map((step,i)=>'<article class="flow-step '+esc(step.type||'')+'"><div class="flow-step-top"><b>'+String(i+1).padStart(2,'0')+'</b><span>'+esc(step.title)+'</span></div><p>'+esc(step.detail)+'</p></article>').join('');
 const seqHtml=(p.sequence||[]).map((item,i)=>'<div class="sequence-item"><b>'+String(i+1).padStart(2,'0')+'</b><span>'+esc(item)+'</span></div>').join('');
 root.innerHTML='<article class="project-card">'+
 '<header class="project-head"><span>'+esc(p.name)+'</span><span>PROJECT '+String(Object.keys(projects).indexOf(key)+1).padStart(2,'0')+' / 06</span></header>'+
 '<h3 class="project-title">'+esc(p.title)+'</h3><div class="project-actions">'+actionHtml+'</div>'+
 '<p class="project-summary">'+esc(p.summary)+'</p><div class="tags">'+p.tags.map(tag=>'<span>'+esc(tag)+'</span>').join('')+'</div>'+
 '<div class="detail-grid"><section><span class="mini-label">01 / PROBLEM</span><p>'+esc(p.problem)+'</p></section><section><span class="mini-label">02 / APPROACH</span><p>'+esc(p.solution)+'</p></section></div>'+
 '<section class="visual-section"><div class="visual-title"><span>03 / SYSTEM ARCHITECTURE</span><small>구성 요소와 책임</small></div><div class="diagram">'+p.architecture+'</div></section>'+
 '<section class="visual-section"><div class="visual-title"><span>04 / DATA FLOW</span><small>요청부터 결과까지</small></div><div class="flow-detail">'+flowHtml+'</div></section>'+
 '<section class="visual-section"><div class="visual-title"><span>05 / SEQUENCE</span><small>처리 순서</small></div><div class="sequence">'+seqHtml+'</div></section>'+
 '<section class="project-result"><span class="mini-label">06 / RESULT & VALIDATION</span><p>'+esc(p.result)+'</p></section></article>';
 if(focusDetail && window.matchMedia('(max-width: 760px)').matches) root.scrollIntoView({behavior:'smooth',block:'start'});
}
window.renderProject=renderProject;
async function loadGitHubActivity(){
 const byId=id=>document.getElementById(id);
 const setText=(id,value)=>{const el=byId(id);if(el)el.textContent=value;};
 const formatDate=value=>new Intl.DateTimeFormat('ko-KR',{year:'numeric',month:'2-digit',day:'2-digit'}).format(value);
 const list=byId('recentCommitList');
 try{
  const headers={Accept:'application/vnd.github+json'};
  const [userResponse,repoResponse,eventResponse]=await Promise.all([
   fetch('https://api.github.com/users/zuzusnasna',{headers}),
   fetch('https://api.github.com/users/zuzusnasna/repos?per_page=100&sort=updated',{headers}),
   fetch('https://api.github.com/users/zuzusnasna/events/public?per_page=100',{headers})
  ]);
  if(!userResponse.ok||!repoResponse.ok||!eventResponse.ok)throw new Error('GitHub API unavailable');
  const [user,repos,events]=await Promise.all([userResponse.json(),repoResponse.json(),eventResponse.json()]);
  setText('githubRepoCount',user.public_repos??repos.length);
  setText('githubFollowers',user.followers??0);
  setText('githubFollowing',user.following??0);
  const pushes=events.filter(event=>event.type==='PushEvent');
  const activeRepos=new Set(pushes.map(event=>event.repo?.name).filter(Boolean));
  setText('recentPushCount',pushes.length);
  setText('activeRepoCount',activeRepos.size);
  setText('activityDate','조회 기준 '+formatDate(new Date()));
  const commits=[];
  pushes.forEach(event=>(event.payload?.commits||[]).forEach(commit=>{
   commits.push({repo:event.repo?.name||'repository',sha:commit.sha||event.payload?.head||'',message:commit.message||'커밋 메시지 없음',date:event.created_at});
  }));
  const unique=Array.from(new Map(commits.map(commit=>[commit.sha||commit.repo+commit.date+commit.message,commit])).values()).slice(0,8);
  if(list){
   if(!unique.length){
    list.innerHTML='<p class="commit-empty">최근 공개 푸시가 없습니다. <a href="https://github.com/zuzusnasna?tab=repositories" target="_blank" rel="noreferrer">저장소에서 확인 ↗</a></p>';
   }else{
    list.innerHTML=unique.map(commit=>{
     const repoPath=commit.repo.split('/');
     const repoUrl='https://github.com/'+repoPath.map(encodeURIComponent).join('/');
     const sha=commit.sha?commit.sha.slice(0,7):'commit';
     const commitUrl=commit.sha?repoUrl+'/commit/'+encodeURIComponent(commit.sha):repoUrl+'/commits';
     return '<a class="recent-commit" href="'+commitUrl+'" target="_blank" rel="noreferrer"><span class="commit-repo">'+escapeHtml(commit.repo)+'</span><strong>'+escapeHtml(commit.message.split('\\n')[0])+'</strong><span class="commit-meta"><code>'+escapeHtml(sha)+'</code><time>'+escapeHtml(formatDate(new Date(commit.date)))+'</time></span></a>';
    }).join('');
   }
  }
  setText('commitStatus','GitHub 공개 활동 · '+formatDate(new Date()));
  const graph=byId('contributionGraphImage');
  if(graph)graph.src='https://ghchart.rshah.org/zuzusnasna?v='+Date.now();
 }catch(error){
  setText('activityDate','조회 실패');
  setText('commitStatus','GitHub 활동을 불러오지 못했습니다.');
  if(list)list.innerHTML='<p class="commit-empty">GitHub API 응답이 없거나 요청 한도에 도달했습니다. <a href="https://github.com/zuzusnasna?tab=activity" target="_blank" rel="noreferrer">GitHub 활동 페이지에서 확인 ↗</a></p>';
 }
}
function escapeHtml(value){return String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));}
function initPortfolio(){
 loadGitHubActivity();
 const switcher=document.querySelector('#projectSwitcher');
 if(switcher){
  switcher.addEventListener('click',event=>{const button=event.target.closest('.project-tab');if(button)renderProject(button.dataset.project);});
  switcher.addEventListener('keydown',event=>{
   const tabs=[...switcher.querySelectorAll('.project-tab')], current=tabs.indexOf(document.activeElement);
   const delta=event.key==='ArrowDown'||event.key==='ArrowRight'?1:event.key==='ArrowUp'||event.key==='ArrowLeft'?-1:0;
   if(!delta)return;event.preventDefault();const next=tabs[(Math.max(current,0)+delta+tabs.length)%tabs.length];next.focus();renderProject(next.dataset.project);
  });
  const query=new URLSearchParams(location.search).get('project');
  renderProject(projects[query]?query:(switcher.querySelector('.project-tab.active')?.dataset.project||'smart'));
 }
 document.querySelectorAll('.contact-copy').forEach(button=>button.addEventListener('click',async()=>{
  const value=button.dataset.copy,status=document.querySelector('.copy-feedback');
  try{
   if(navigator.clipboard&&window.isSecureContext)await navigator.clipboard.writeText(value);
   else{const field=document.createElement('textarea');field.value=value;field.readOnly=true;field.style.position='fixed';field.style.opacity='0';document.body.appendChild(field);field.select();const ok=document.execCommand('copy');field.remove();if(!ok)throw new Error('copy failed');}
   button.querySelector('.copy-action').textContent='COPIED ✓';if(status)status.textContent=(value.includes('@')?'이메일':'전화번호')+'가 복사되었습니다.';
  }catch{if(status)status.textContent='복사하지 못했습니다. 연락처를 직접 선택해 복사해 주세요.';}
 }));
 document.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener('click',event=>{const target=document.querySelector(link.getAttribute('href'));if(target){event.preventDefault();target.scrollIntoView({behavior:'smooth',block:'start'});}}));
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initPortfolio);else initPortfolio();
