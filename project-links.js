/* Project resource links for the selected project detail. */
(function () {
  const links = {
    smart: [
      ['프로젝트 상세 ↗', 'https://zuzusnasna.github.io/jusanghyeok.github.io/project-smartticketing.html'],
      ['Repository ↗', 'https://github.com/zuzusnasna/SmartTicketing'],
      ['Performance Result ↗', 'https://zuzusnasna.github.io/jusanghyeok.github.io/performance.html'],
      ['PPT ↗', 'https://github.com/zuzusnasna/SmartTicketing/blob/main/SmartTicketing%20%EB%B0%9C%ED%91%9C.pptx']
    ],
    swing: [
      ['프로젝트 상세 ↗', 'https://zuzusnasna.github.io/jusanghyeok.github.io/project-swingfit.html'],
      ['Repository ↗', 'https://github.com/zuzusnasna/SwingFit'],
      ['Report ↗', 'https://github.com/zuzusnasna/SwingFit/blob/main/DCS_2025_%ED%95%98%EA%B3%84%EC%A2%85%ED%95%A9%ED%95%99%EC%88%A0%EB%8C%80%ED%9A%8C_%EB%8C%80%ED%95%99%EC%83%9D%EB%85%BC%EB%AC%B8%EA%B2%BD%EC%A7%84%EB%8C%80%ED%9A%8C_%EB%85%BC%EB%AC%B8_%EC%86%A1%EC%A3%BC%EB%B0%95%ED%8C%80.pdf'],
      ['PPT ↗', 'https://docs.google.com/presentation/d/1Pq6C9Gpwqa5nS4xreTDfaa-qO3nPzDRG/edit?usp=sharing&ouid=116307840021041251052&rtpof=true&sd=true']
    ],
    game: [
      ['프로젝트 상세 ↗', 'https://zuzusnasna.github.io/jusanghyeok.github.io/project-game-community.html'],
      ['Repository ↗', 'https://github.com/zuzusnasna/miniproject'],
      ['Report ↗', 'https://github.com/zuzusnasna/miniproject/blob/main/GameHub%20%EB%B3%B4%EA%B3%A0%EC%84%9C.pdf'],
      ['PPT ↗', 'https://docs.google.com/presentation/d/1O8qmPBlW6gBzqgfcE0S12cH3KzVe9jgL/edit?usp=sharing&ouid=116307840021041251052&rtpof=true&sd=true']
    ],
    ems: [
      ['프로젝트 상세 ↗', 'https://zuzusnasna.github.io/jusanghyeok.github.io/project-ems.html'],
      ['Repository ↗', 'https://github.com/zuzusnasna/equipment-management'],
      ['Report ↗', 'https://github.com/zuzusnasna/equipment-management/blob/main/EMS%20%EB%B3%B4%EA%B3%A0%EC%84%9C.pdf'],
      ['PPT ↗', 'https://docs.google.com/presentation/d/1KrGjSpPWXOR8gUXXhFqFXyQUNTyPWBGk/edit?usp=sharing&ouid=116307840021041251052&rtpof=true&sd=true']
    ],
    meet: [
      ['Repository ↗', 'https://github.com/zuzusnasna/Meet-Up']
    ]
  };

  function projectActions(key) {
    return (links[key] || []).map(([label, url]) =>
      '<a class="project-action" href="' + url + '" target="_blank" rel="noreferrer">' + label + '</a>'
    ).join('');
  }

  window.projectActions = projectActions;
  if (typeof window.renderProject === 'function') {
    const active = document.querySelector('.project-tab.active');
    window.renderProject(active?.dataset.project || 'smart');
  }
})();
