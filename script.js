const scroller = document.querySelector('.horizontal-scroll');
const thumb = document.querySelector('#thumb');
const menuLinks = document.querySelectorAll('.menu-bar a');
const slides = Array.from(document.querySelectorAll('.horizontal-scroll > .slide'));

function scrollRightPage() {
  scroller.scrollBy({ left: scroller.clientWidth, behavior: 'smooth' });
}
function scrollLeftPage() {
  scroller.scrollBy({ left: -scroller.clientWidth, behavior: 'smooth' });
}
function scrollToNext() {
  scrollRightPage();
}

scroller.addEventListener('scroll', () => {
  const maxScroll = scroller.scrollWidth - scroller.clientWidth;
  const track = document.querySelector('.track');
  const maxMove = track.clientWidth - thumb.clientWidth;
  const ratio = maxScroll ? scroller.scrollLeft / maxScroll : 0;
  thumb.style.left = `${ratio * maxMove}px`;

  const pageIndex = Math.round(scroller.scrollLeft / scroller.clientWidth);
  const activeSlide = slides[pageIndex];
  if (activeSlide) {
    menuLinks.forEach(link => {
      link.classList.toggle('menu-active', link.getAttribute('href') === `#${activeSlide.id}`);
    });
  }
});

menuLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    const targetIndex = slides.indexOf(target);
    if (targetIndex < 0) return;

    scroller.scrollTo({ left: targetIndex * scroller.clientWidth, behavior: 'smooth' });
    menuLinks.forEach(item => item.classList.toggle('menu-active', item === link));
  });
});

/* ── Story 탭: 브라우저 앵커 이동 완전 차단 ── */
const storyArticle = document.querySelector('.story-article');
const storyTabs = document.querySelectorAll('.story-tab');
const storySections = document.querySelectorAll('.story-section');

storyTabs.forEach(tab => {
  tab.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();

    const targetId = tab.getAttribute('href').replace(/^#/, '');
    const target = document.getElementById(targetId);
    if (!target || !storyArticle) return;

    /* getBoundingClientRect 기반 정확한 스크롤 */
    const articleTop = storyArticle.getBoundingClientRect().top;
    const targetTop  = target.getBoundingClientRect().top;
    storyArticle.scrollBy({
      top: targetTop - articleTop - 20,
      behavior: 'smooth'
    });

    /* 활성 탭 표시 */
    storyTabs.forEach(t => t.classList.remove('is-active'));
    tab.classList.add('is-active');

    /* URL 해시 변경 차단 */
    history.replaceState(null, '', window.location.pathname + window.location.search);
  });
});

/* 스크롤 위치에 따라 활성 탭 자동 갱신 */
if (storyArticle) {
  storyArticle.addEventListener('scroll', () => {
    let activeId = storySections[0]?.id;

    storySections.forEach(section => {
      const sectionTop = section.getBoundingClientRect().top;
      const articleTop = storyArticle.getBoundingClientRect().top;
      if (sectionTop - articleTop <= 80) {
        activeId = section.id;
      }
    });

    storyTabs.forEach(tab => {
      tab.classList.toggle('is-active', tab.getAttribute('href') === `#${activeId}`);
    });
  });
}

/* URL 해시로 직접 접근 시 해시 제거 */
window.addEventListener('load', () => {
  if (window.location.hash && window.location.hash.startsWith('#story-')) {
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }
});

/* ── 프로젝트 모달 ── */
const projectModal = document.getElementById('projectModal');
const modalClose   = document.getElementById('modalClose');
const modalContent = document.getElementById('modalContent');
const modalTitle   = document.getElementById('modalTitle');

document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('click', () => {
    const tpl = document.getElementById(card.dataset.tpl);
    if (!tpl || !modalContent) return;
    modalContent.innerHTML = tpl.innerHTML;
    modalContent.scrollTop = 0;
    if (modalTitle) modalTitle.textContent = card.dataset.title || 'PROJECT';
    projectModal.classList.add('is-open');
  });
});

if (modalClose) {
  modalClose.addEventListener('click', () => projectModal.classList.remove('is-open'));
}
if (projectModal) {
  projectModal.addEventListener('click', e => {
    if (e.target === projectModal) projectModal.classList.remove('is-open');
  });
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') projectModal?.classList.remove('is-open');
});
