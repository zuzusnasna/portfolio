/* Adds the Real-Time Chat project without changing the existing project-detail renderer. */
(function () {
  const switcher = document.querySelector('#projectSwitcher');
  const detail = document.querySelector('#projectDetail');
  if (!switcher || !detail || switcher.querySelector('[data-project="realtimechat"]')) return;

  const tab = document.createElement('button');
  tab.className = 'project-tab';
  tab.dataset.index = '06';
  tab.dataset.project = 'realtimechat';
  tab.type = 'button';
  tab.setAttribute('role', 'tab');
  tab.setAttribute('aria-controls', 'projectDetail');
  tab.textContent = '06 · REAL-TIME CHAT';
  switcher.appendChild(tab);

  const architecture = `
    <div class="arch-map chat-arch">
      <div class="arch-lane"><div class="arch-lane-label">CLIENT</div>
        <div class="arch-node primary"><b>React + Vite</b><small>채팅 UI · STOMP/WebSocket 연결</small></div>
      </div>
      <div class="arch-connector"><span>HTTP API / WebSocket</span></div>
      <div class="arch-lane"><div class="arch-lane-label">APPLICATION · SPRING BOOT</div>
        <div class="arch-node primary"><b>App Instance 1</b><small>HTTP · WebSocket · STOMP</small></div>
        
        <div class="arch-node primary"><b>App Instance 2</b><small>HTTP · WebSocket · STOMP</small></div>
      </div>
      <div class="arch-connector"><span>인스턴스 간 이벤트 중계</span></div>
      <div class="arch-lane data-lane">
        <div class="arch-node cache"><b>Redis Pub/Sub</b><small>인스턴스 간 채팅 이벤트 전달</small></div>
        <div class="arch-node database"><b>MySQL</b><small>회원 · 채팅방 · 영속 데이터</small></div>
      </div>
      <div class="arch-connector"><span>운영 메트릭 수집</span></div>
      <div class="arch-lane">
        <div class="arch-node async"><b>Prometheus</b><small>Actuator / Micrometer 메트릭</small></div>
        <div class="arch-link">METRICS</div>
        <div class="arch-node async"><b>Grafana</b><small>요청량 · p95 · JVM · CPU</small></div>
      </div>
      <div class="arch-note"><b>설계상 주의점</b><span>Redis Pub/Sub은 채팅 메시지 전달을 공유하지만 HTTP 세션 자체를 공유하지는 않습니다. 인스턴스 간 로그인 상태 공유는 별도의 세션 전략이 필요합니다.</span></div>
    </div>`;

  const flow = [
    ['01','사용자 인증','로그인 및 채팅방 접근을 HTTP API로 처리','client'],
    ['02','WebSocket 연결','클라이언트가 STOMP endpoint로 연결','process'],
    ['03','메시지 발행','채팅 메시지를 해당 인스턴스의 메시지 처리 흐름으로 전달','process'],
    ['04','Redis Pub/Sub','다른 애플리케이션 인스턴스에도 메시지 이벤트 전달','cache'],
    ['05','구독자 전달','각 인스턴스에 연결된 참여자에게 메시지 전달','async'],
    ['06','메트릭 관측','Prometheus가 지표를 수집하고 Grafana에서 시각화','database']
  ];
  const sequence = [
    '사용자 A → App-1 : STOMP 채팅 메시지 발행',
    'App-1 → Redis Pub/Sub : 메시지 이벤트 publish',
    'Redis → App-2 : 구독 중인 인스턴스에 이벤트 전달',
    'App-2 → 사용자 B : 해당 WebSocket 구독자에게 메시지 전달',
    'Prometheus → App-1 / App-2 : Actuator 메트릭 scrape',
    'Grafana → Prometheus : 대시보드 쿼리 및 시각화'
  ];

  function render() {
    document.querySelectorAll('.project-tab').forEach(button => {
      const active = button.dataset.project === 'realtimechat';
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', String(active));
    });
    detail.innerHTML = `
      <div class="project featured chat-project-detail">
        <div class="project-head"><span>REAL-TIME CHAT</span><span>PROJECT DETAIL</span></div>
        <h2>여러 서버 인스턴스에서도 메시지가 전달되는 실시간 채팅 서비스</h2>
        <div class="project-actions">
          <a class="project-action detail-link" href="project-realtimechat.html">프로젝트 상세 ↗</a>
          <a class="project-action" href="project-realtimechat-performance.html">성능 측정 결과 ↗</a>
          <a class="project-action" href="https://github.com/zuzusnasna/RealTimeChat" target="_blank" rel="noreferrer">Repository ↗</a>
        </div>
        <p class="project-summary">WebSocket/STOMP 기반 실시간 채팅에 Redis Pub/Sub을 연결해 서로 다른 Spring Boot 인스턴스에 접속한 사용자 간 메시지 전달을 구성했습니다. Prometheus와 Grafana로 운영 지표를 관찰하고 k6로 HTTP 및 WebSocket 흐름을 검증했습니다.</p>
        <div class="tags"><span>Java 21</span><span>Spring Boot 4.1.1</span><span>WebSocket / STOMP</span><span>Redis Pub/Sub</span><span>MySQL 8</span><span>Docker Compose</span><span>Prometheus</span><span>Grafana</span><span>k6</span></div>
        <div class="detail-grid">
          <section><h3>01 · PROBLEM</h3><p>WebSocket 연결이 서로 다른 애플리케이션 인스턴스에 분산되면 한 인스턴스에서 발행한 채팅 이벤트가 다른 인스턴스에 연결된 사용자에게 자동으로 전달되지 않습니다. 또한 동작 여부뿐 아니라 HTTP 응답, JVM, CPU와 인스턴스 간 전달 지연을 관찰할 필요가 있습니다.</p></section>
          <section><h3>02 · SOLUTION</h3><p>Redis Pub/Sub을 이용해 인스턴스 간 메시지 이벤트를 전달하고, Docker Compose로 앱 인스턴스 두 개와 MySQL·Redis를 구성했습니다. Actuator/Micrometer 메트릭을 Prometheus로 수집하고 Grafana에서 시각화했으며, k6로 교차 인스턴스 전달을 검증했습니다.</p></section>
        </div>
        <section class="visual-section"><div class="visual-title"><span>03 · ARCHITECTURE</span><small>애플리케이션 · 메시지 브로커 · 모니터링</small></div><div class="diagram">${architecture}</div></section>
        <section class="visual-section"><div class="visual-title"><span>04 · DATA FLOW</span><small>메시지 전달 및 관측 흐름</small></div><div class="flow-detail">${flow.map((step, index) => '<article class="flow-step ' + step[3] + '"><div class="flow-step-top"><b>' + step[0] + '</b><span>' + step[1] + '</span></div><p>' + step[2] + '</p></article>' + (index < flow.length - 1 ? '<div class="flow-arrow" aria-hidden="true">→</div>' : '')).join('')}</div></section>
        <section class="visual-section"><div class="visual-title"><span>05 · SEQUENCE</span><small>교차 인스턴스 메시지 전달</small></div><div class="sequence">${sequence.map((item, index) => '<div><b>' + String(index + 1).padStart(2, '0') + '</b><span>' + item + '</span></div>').join('')}</div></section>
        <section class="visual-section chat-performance-preview"><div class="visual-title"><span>06 · LOW-LOAD TEST</span><small>k6 · 5 VUs · 80초 단계 실행</small></div>
          <div class="chat-metric-grid">
            <article><span>HTTP REQUEST FAILURE</span><strong>0%</strong><small>0 / 28 requests failed</small></article>
            <article><span>WEBSOCKET CONNECTED</span><strong>100%</strong><small>23 / 23 sessions</small></article>
            <article><span>HTTP RESPONSE P95</span><strong>432.69 ms</strong><small>평균 105.09 ms</small></article>
            <article><span>CROSS-INSTANCE DELIVERY P95</span><strong>27 ms</strong><small>평균 20.81 ms · 360 deliveries</small></article>
          </div>
          <p class="chat-test-caveat">초기 저부하 테스트 결과입니다. 최대 5 VU 조건의 짧은 실행이므로 대규모 동시 접속 처리 용량을 의미하지 않습니다. HTTP p95는 평균보다 높은 지연 구간이 관찰되어 더 높은 부하와 반복 테스트로 확인할 필요가 있습니다.</p>
          <a class="project-performance-link" href="project-realtimechat-performance.html">테스트 조건과 전체 측정값 보기 ↗</a>
        </section>
        <section class="result"><h3>07 · RESULT</h3><p>최대 5 VU, 약 80초의 저부하 시나리오에서 checks 51/51 성공, HTTP 요청 실패율 0%, WebSocket 연결 성공률 100%를 확인했습니다. 교차 인스턴스 메시지 전달은 360건 측정되었으며 평균 20.81ms, p95 27ms였습니다. 이 결과는 초기 기능 검증이며, 더 높은 부하에서의 용량과 안정성은 별도 측정이 필요합니다.</p></section>
      </div>`;
    detail.scrollIntoView({behavior:'smooth', block:'start'});
  }

  tab.addEventListener('click', function (event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    render();
  }, true);

  document.querySelectorAll('.project-tab').forEach(button => {
    button.setAttribute('aria-selected', String(button.classList.contains('active')));
  });
  if (new URLSearchParams(window.location.search).get('project') === 'realtimechat') render();
})();
