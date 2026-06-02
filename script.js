const scroller = document.querySelector('.horizontal-scroll');
const thumb = document.querySelector('#thumb');
const menuLinks = document.querySelectorAll('.menu-bar a');
const slides = Array.from(document.querySelectorAll('.horizontal-scroll > .slide'));

function scrollRightPage() {
  scroller.scrollBy({ left: scroller.clientWidth, behavior: 'auto' });
}
function scrollLeftPage() {
  scroller.scrollBy({ left: -scroller.clientWidth, behavior: 'auto' });
}
function scrollToNext() {
  scrollRightPage();
}

function setActiveMenu(targetId) {
  menuLinks.forEach(link => {
    link.classList.toggle('menu-active', link.getAttribute('href') === `#${targetId}`);
  });
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
    setActiveMenu(activeSlide.id);
  }
});

menuLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    const targetIndex = slides.indexOf(target);
    if (targetIndex < 0) return;

    scroller.scrollTo({ left: targetIndex * scroller.clientWidth, behavior: 'auto' });
    setActiveMenu(target?.id || 'home');
  });
});

/* ── Story 탭: 브라우저 앵커 이동 완전 차단 ── */
const storyArticle = document.querySelector('.story-article');
const storyButtons = document.querySelectorAll('.story-menu-item');
const storySections = document.querySelectorAll('.story-section');
const storyScrollContainer = storyArticle?.closest('.slide');
const storyScrollSource = storyScrollContainer || storyArticle;
let storyClickActiveId = null;

function setActiveStoryButton(activeId) {
  storyButtons.forEach(button => {
    button.classList.toggle('is-active', button.dataset.target === activeId);
  });
}

function getPageTop(element) {
  let top = 0;
  let node = element;

  while (node) {
    top += node.offsetTop;
    node = node.offsetParent;
  }

  return top;
}

function getStoryTargetTop(target) {
  return Math.max(getPageTop(target) - getPageTop(storyScrollSource) - 18, 0);
}

storyButtons.forEach(button => {
  button.addEventListener('click', () => {
    const targetId = button.dataset.target;
    const target = document.getElementById(targetId);
    if (!target || !storyScrollSource) return;

    storyClickActiveId = targetId;
    setActiveStoryButton(targetId);
    storyScrollSource.scrollTo({ top: getStoryTargetTop(target), behavior: 'auto' });

    requestAnimationFrame(() => {
      setActiveStoryButton(targetId);
      storyClickActiveId = null;
    });
  });
});

if (storyScrollSource) {
  storyScrollSource.addEventListener('scroll', () => {
    if (storyClickActiveId) {
      setActiveStoryButton(storyClickActiveId);
      return;
    }

    let activeId = storySections[0]?.id;
    const currentTop = storyScrollSource.scrollTop + 100;

    storySections.forEach(section => {
      if (getStoryTargetTop(section) <= currentTop) {
        activeId = section.id;
      }
    });

    setActiveStoryButton(activeId);
  });
}

/* URL 해시로 직접 접근 시 해시 제거 */
window.addEventListener('load', () => {
  setActiveMenu('home');
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
