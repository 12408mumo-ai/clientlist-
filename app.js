import { signIn, signOut, initAuth } from './auth.js';

const COACH_STORAGE_KEY = '4crazz-coach-network-v1';
const LEGACY_COACH_STORAGE_KEY = 'northstar-coach-network-v1';

  const avatarPalettes = {
    gold: { bg: 'linear-gradient(145deg, #e8c873 0%, #b28632 100%)', ink: '#241805' },
    bronze: { bg: 'linear-gradient(145deg, #c99a4c 0%, #815a24 100%)', ink: '#1d1306' },
    champagne: { bg: 'linear-gradient(145deg, #f0dca3 0%, #c6a35a 100%)', ink: '#38280d' },
    copper: { bg: 'linear-gradient(145deg, #d0a15d 0%, #895b2d 100%)', ink: '#261809' },
    dark: { bg: 'linear-gradient(145deg, #201a0e 0%, #080706 100%)', ink: '#e5bc63' },
    ivory: { bg: 'linear-gradient(145deg, #f0e1bc 0%, #b48f49 100%)', ink: '#30230d' },
  };

  const seedCoaches = [
    {
      id: 'coach-amara-okafor', fullName: 'Amara Okafor', title: 'Executive & Leadership Coach',
      bio: 'Helping thoughtful leaders build the confidence, clarity, and teams to do their best work.',
      avatarUrl: '', avatarColor: 'champagne', location: 'San Francisco, CA', remote: true,
      email: 'amara@4crazz.com', yearsExperience: 14,
      skills: ['Executive coaching', 'Leadership', 'Team building', 'Founder transitions'], status: 'new',
      linkedin: 'https://www.linkedin.com/', twitter: 'https://x.com/', instagram: '', youtube: '', website: 'https://example.com/'
    },
    {
      id: 'coach-daniel-kim', fullName: 'Daniel Kim', title: 'Career Transition Coach',
      bio: 'A steady thought partner for people navigating a big professional pivot or a new chapter.',
      avatarUrl: '', avatarColor: 'gold', location: 'New York, NY', remote: false,
      email: 'daniel@4crazz.com', yearsExperience: 11,
      skills: ['Career pivots', 'Interview prep', 'Personal brand', 'Negotiation'], status: 'video-sent',
      linkedin: 'https://www.linkedin.com/', twitter: '', instagram: '', youtube: 'https://www.youtube.com/', website: ''
    },
    {
      id: 'coach-priya-nair', fullName: 'Priya Nair', title: 'Startup Operations Advisor',
      bio: 'Turns early-stage growing pains into people-first systems that give founders room to scale.',
      avatarUrl: '', avatarColor: 'gold', location: '', remote: true,
      email: 'priya@4crazz.com', yearsExperience: 9,
      skills: ['Startup operations', 'People strategy', 'Scaling teams', 'Org design'], status: 'new',
      linkedin: 'https://www.linkedin.com/', twitter: 'https://x.com/', instagram: 'https://www.instagram.com/', youtube: '', website: 'https://example.com/'
    },
    {
      id: 'coach-james-rivera', fullName: 'James Rivera', title: 'Product & Design Career Coach',
      bio: 'Brings a designer’s curiosity to career planning, portfolio storytelling, and leadership growth.',
      avatarUrl: '', avatarColor: 'copper', location: 'Austin, TX', remote: true,
      email: 'james@4crazz.com', yearsExperience: 12,
      skills: ['Product leadership', 'Design careers', 'Portfolio reviews', 'Creative direction'], status: 'video-sent',
      linkedin: 'https://www.linkedin.com/', twitter: '', instagram: 'https://www.instagram.com/', youtube: '', website: 'https://example.com/'
    },
    {
      id: 'coach-sofia-laurent', fullName: 'Sofia Laurent', title: 'Leadership & Wellbeing Coach',
      bio: 'Supports ambitious leaders in finding a sustainable rhythm without losing sight of what matters.',
      avatarUrl: '', avatarColor: 'ivory', location: 'London, UK', remote: true,
      email: 'sofia@4crazz.com', yearsExperience: 16,
      skills: ['Leadership wellbeing', 'Burnout prevention', 'Mindful leadership', 'Team coaching'], status: 'new',
      linkedin: 'https://www.linkedin.com/', twitter: '', instagram: '', youtube: 'https://www.youtube.com/', website: ''
    },
    {
      id: 'coach-marcus-johnson', fullName: 'Marcus Johnson', title: 'Engineering Leadership Coach',
      bio: 'A former engineering leader helping technical teams grow with trust, focus, and clear communication.',
      avatarUrl: '', avatarColor: 'dark', location: '', remote: true,
      email: 'marcus@4crazz.com', yearsExperience: 18,
      skills: ['Engineering leadership', 'Technical management', 'Communication', 'Org design'], status: 'video-sent',
      linkedin: 'https://www.linkedin.com/', twitter: 'https://x.com/', instagram: '', youtube: '', website: 'https://example.com/'
    },
    {
      id: 'coach-elise-chen', fullName: 'Elise Chen', title: 'Career Clarity Coach',
      bio: 'Creates space to connect your strengths and values with work that feels meaningful and yours.',
      avatarUrl: '', avatarColor: 'champagne', location: 'Seattle, WA', remote: false,
      email: 'elise@4crazz.com', yearsExperience: 8,
      skills: ['Career clarity', 'Values mapping', 'Leadership presence', 'Career pivots'], status: 'new',
      linkedin: 'https://www.linkedin.com/', twitter: '', instagram: 'https://www.instagram.com/', youtube: '', website: 'https://example.com/'
    },
    {
      id: 'coach-theo-martin', fullName: 'Theo Martin', title: 'Go-to-Market & Sales Coach',
      bio: 'Helps founders and sales leaders find a clear story, build momentum, and lead with purpose.',
      avatarUrl: '', avatarColor: 'gold', location: 'Toronto, Canada', remote: true,
      email: 'theo@4crazz.com', yearsExperience: 13,
      skills: ['Go-to-market', 'Sales leadership', 'Founder coaching', 'Storytelling'], status: 'video-sent',
      linkedin: 'https://www.linkedin.com/', twitter: 'https://x.com/', instagram: '', youtube: 'https://www.youtube.com/', website: ''
    },
  ];

  const statusDetails = {
    new: { label: 'new', className: 'status-new' },
    'video-sent': { label: 'video sent', className: 'status-video-sent' },
  };

  // Migrate coach records saved under the legacy availability system.
  const legacyStatusMap = {
    accepting: 'new',
    booked: 'video-sent',
    leave: 'new',
    'video sent': 'video-sent',
    videosent: 'video-sent',
  };

  const socialIcons = {
    linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path class="social-filled" d="M20.35 3H3.65C3.29 3 3 3.28 3 3.63v16.74c0 .35.29.63.65.63h16.7c.36 0 .65-.28.65-.63V3.63c0-.35-.29-.63-.65-.63ZM8.34 18.23H5.42V9.35h2.92v8.88ZM6.88 8.14a1.69 1.69 0 1 1 .02-3.38 1.69 1.69 0 0 1-.02 3.38Zm12.37 10.09h-2.91v-4.32c0-1.03-.02-2.35-1.43-2.35-1.44 0-1.66 1.12-1.66 2.28v4.39h-2.91V9.35h2.79v1.21h.04c.39-.74 1.34-1.52 2.75-1.52 2.94 0 3.49 1.94 3.49 4.46v4.73Z"/></svg>',
    twitter: '<svg viewBox="0 0 24 24" aria-hidden="true"><path class="social-x" d="M18.9 2H22l-6.78 7.75L23.2 22h-6.24l-4.89-7.23L5.75 22H2.62l7.25-8.29L2.16 2h6.4l4.42 6.57L18.9 2Zm-1.1 17.9h1.73L7.64 3.98H5.78L17.8 19.9Z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.1" y="3.1" width="17.8" height="17.8" rx="5"/><circle cx="12" cy="12" r="4.1"/><circle cx="17.55" cy="6.55" r=".9" class="social-filled"/></svg>',
    youtube: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.2 7.2a2.65 2.65 0 0 0-1.86-1.88C17.7 4.85 12 4.85 12 4.85s-5.7 0-7.34.47A2.65 2.65 0 0 0 2.8 7.2 27.2 27.2 0 0 0 2.33 12a27.2 27.2 0 0 0 .47 4.8 2.65 2.65 0 0 0 1.86 1.88c1.64.47 7.34.47 7.34.47s5.7 0 7.34-.47a2.65 2.65 0 0 0 1.86-1.88 27.2 27.2 0 0 0 .47-4.8 27.2 27.2 0 0 0-.47-4.8Z"/><path class="social-play" d="m9.75 15.4 5.9-3.4-5.9-3.4v6.8Z"/></svg>',
    website: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.8"/><path d="M3.35 12h17.3M12 3.2a14.2 14.2 0 0 1 0 17.6m0-17.6a14.2 14.2 0 0 0 0 17.6"/></svg>',
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const loginView = $('#login-view');
  const appShell = $('#app-shell');
  const loginForm = $('#login-form');
  const loginEmail = $('#login-email');
  const loginPassword = $('#login-password');
  const loginError = $('#login-error');
  const coachGrid = $('#coach-grid');
  const searchInput = $('#coach-search');
  const statusFilter = $('#status-filter');
  const directoryCount = $('#directory-count');
  const emptyState = $('#empty-state');
  const coachModal = $('#coach-modal');
  const coachForm = $('#coach-form');
  const coachFormError = $('#coach-form-error');
  const deleteModal = $('#delete-modal');
  const toastRegion = $('#toast-region');

  let coaches = loadCoaches();
  let editingCoachId = null;
  let selectedAvatarColor = 'gold';
  let skillValues = [];
  let pendingDeleteId = null;
  let modalReturnFocus = null;
  let deleteReturnFocus = null;
  let previousBodyOverflow = '';
  let toastTimer = null;

  function cloneSeedCoaches() {
    return seedCoaches.map((coach) => ({ ...coach, skills: [...coach.skills] }));
  }

  function loadCoaches() {
    try {
      const current = localStorage.getItem(COACH_STORAGE_KEY);
      const stored = current ?? localStorage.getItem(LEGACY_COACH_STORAGE_KEY);
      if (stored === null) {
        const initial = cloneSeedCoaches();
        localStorage.setItem(COACH_STORAGE_KEY, JSON.stringify(initial));
        return initial;
      }
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) throw new Error('Coach data should be a list.');
      const normalized = parsed.map(normalizeCoach).filter((coach) => coach.id && coach.fullName);
      if (current === null) localStorage.setItem(COACH_STORAGE_KEY, JSON.stringify(normalized));
      return normalized;
    } catch (error) {
      console.warn('Could not read saved coach profiles; using the sample directory.', error);
      return cloneSeedCoaches();
    }
  }

  function normalizeCoach(coach) {
    const id = typeof coach?.id === 'string' ? coach.id : '';
    const rawStatus = typeof coach?.status === 'string' ? coach.status.trim().toLocaleLowerCase() : '';
    const status = Object.hasOwn(statusDetails, rawStatus)
      ? rawStatus
      : (Object.hasOwn(legacyStatusMap, rawStatus) ? legacyStatusMap[rawStatus] : 'new');
    const rawExperience = Number(coach?.yearsExperience);
    return {
      id,
      fullName: typeof coach?.fullName === 'string' ? coach.fullName : '',
      title: typeof coach?.title === 'string' ? coach.title : '',
      bio: typeof coach?.bio === 'string' ? coach.bio : '',
      avatarUrl: safeUrl(coach?.avatarUrl),
      avatarColor: Object.hasOwn(avatarPalettes, coach?.avatarColor) ? coach.avatarColor : 'gold',
      location: typeof coach?.location === 'string' ? coach.location : '',
      remote: Boolean(coach?.remote),
      email: typeof coach?.email === 'string' ? coach.email : '',
      yearsExperience: Number.isFinite(rawExperience) && rawExperience >= 0 ? Math.floor(rawExperience) : null,
      skills: Array.isArray(coach?.skills) ? coach.skills.filter((skill) => typeof skill === 'string').map((skill) => skill.trim()).filter(Boolean) : [],
      status,
      linkedin: safeUrl(coach?.linkedin),
      twitter: safeUrl(coach?.twitter),
      instagram: safeUrl(coach?.instagram),
      youtube: safeUrl(coach?.youtube),
      website: safeUrl(coach?.website),
    };
  }

  function persistCoaches() {
    try {
      localStorage.setItem(COACH_STORAGE_KEY, JSON.stringify(coaches));
      return true;
    } catch (error) {
      console.warn('Could not save coach profiles to local storage.', error);
      showToast('Changes are visible, but could not be saved in this browser.', 'error');
      return false;
    }
  }

  function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, (character) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[character]);
  }

  function safeUrl(value) {
    const raw = String(value ?? '').trim();
    if (!raw) return '';
    if (/^[a-z][a-z\d+.-]*:/i.test(raw) && !/^https?:\/\//i.test(raw)) return '';
    try {
      const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
      if (!['http:', 'https:'].includes(url.protocol) || !url.hostname) return '';
      return url.href;
    } catch (_error) {
      return '';
    }
  }

  function initials(name) {
    const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return 'CC';
    return parts.length === 1 ? parts[0].slice(0, 2).toUpperCase() : `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }

  function paletteFor(color) {
    return avatarPalettes[color] || avatarPalettes.gold;
  }

  function avatarMarkup(coach, extraClass = '') {
    const palette = paletteFor(coach.avatarColor);
    const photo = safeUrl(coach.avatarUrl);
    return `<div class="avatar ${extraClass}" style="--avatar-bg:${palette.bg};--avatar-ink:${palette.ink}" aria-hidden="true"><span>${escapeHTML(initials(coach.fullName))}</span>${photo ? `<img src="${escapeHTML(photo)}" alt="" loading="lazy" />` : ''}</div>`;
  }

  function attachAvatarFallbacks(root = document) {
    $$('img', root).filter((image) => image.closest('.avatar')).forEach((image) => {
      image.addEventListener('error', () => image.remove(), { once: true });
    });
  }

  function statusInfo(status) {
    return statusDetails[status] || statusDetails.new;
  }

  function pluralize(count, singular, plural = `${singular}s`) {
    return `${count} ${count === 1 ? singular : plural}`;
  }

  function renderStats() {
    const newCoaches = coaches.filter((coach) => coach.status === 'new').length;
    const videoSent = coaches.filter((coach) => coach.status === 'video-sent').length;
    const uniqueSkills = new Set(coaches.flatMap((coach) => coach.skills.map((skill) => skill.trim().toLocaleLowerCase())).filter(Boolean));
    $('#stat-total').textContent = coaches.length;
    $('#stat-new').textContent = newCoaches;
    $('#stat-video-sent').textContent = videoSent;
    $('#stat-specialties').textContent = uniqueSkills.size;
    $('#nav-coach-count').textContent = coaches.length;
  }

  function matchingCoaches() {
    const query = searchInput.value.trim().toLocaleLowerCase();
    const status = statusFilter.value;
    return coaches.filter((coach) => {
      if (status !== 'all' && coach.status !== status) return false;
      if (!query) return true;
      const searchable = [coach.fullName, coach.title, coach.location, coach.remote ? 'remote' : '', ...coach.skills].join(' ').toLocaleLowerCase();
      return searchable.includes(query);
    });
  }

  function socialLinkMarkup(coach, key, label) {
    const url = safeUrl(coach[key]);
    if (!url) return '';
    return `<a class="social-link" href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHTML(label)} profile for ${escapeHTML(coach.fullName)}" title="${escapeHTML(label)}">${socialIcons[key]}</a>`;
  }

  function locationLabel(coach) {
    const location = coach.location.trim();
    if (coach.remote && location) return `Remote · ${location}`;
    if (coach.remote) return 'Remote';
    return location || 'Location not added';
  }

  function coachCardMarkup(coach) {
    const status = statusInfo(coach.status);
    const experience = Number.isFinite(coach.yearsExperience) ? `<span class="coach-meta-item"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5v5l3 1.75"/></svg><span>${coach.yearsExperience} ${coach.yearsExperience === 1 ? 'year' : 'years'} experience</span></span>` : '';
    const email = escapeHTML(coach.email);
    const skillLimit = 4;
    const shownSkills = coach.skills.slice(0, skillLimit);
    const hiddenSkills = Math.max(0, coach.skills.length - shownSkills.length);
    const skillsMarkup = shownSkills.map((skill) => `<span class="skill-badge">${escapeHTML(skill)}</span>`).join('') + (hiddenSkills ? `<span class="skill-badge skill-more">+${hiddenSkills}</span>` : '');
    const socialMarkup = [
      socialLinkMarkup(coach, 'linkedin', 'LinkedIn'),
      socialLinkMarkup(coach, 'twitter', 'X / Twitter'),
      socialLinkMarkup(coach, 'instagram', 'Instagram'),
      socialLinkMarkup(coach, 'youtube', 'YouTube'),
      socialLinkMarkup(coach, 'website', 'Website'),
    ].join('');
    const bio = coach.bio.trim() || 'A trusted guide for the next step in a meaningful career.';

    return `<article class="coach-card" data-id="${escapeHTML(coach.id)}">
      <div class="coach-card-top">
        ${avatarMarkup(coach)}
        <div class="coach-identity"><h3 title="${escapeHTML(coach.fullName)}">${escapeHTML(coach.fullName)}</h3><p>${escapeHTML(coach.title)}</p></div>
        <span class="status-badge ${status.className}">${escapeHTML(status.label)}</span>
      </div>
      <div class="coach-meta">
        <span class="coach-meta-item"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.25 10.15c0 5.15-7.25 10.1-7.25 10.1s-7.25-4.95-7.25-10.1a7.25 7.25 0 1 1 14.5 0Z"/><circle cx="12" cy="10" r="2.25"/></svg><span title="${escapeHTML(locationLabel(coach))}">${escapeHTML(locationLabel(coach))}</span></span>
        ${experience}
        <a class="coach-meta-item coach-email" href="mailto:${email}" title="Email ${email}"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.25" y="5.25" width="17.5" height="13.5" rx="2.5"/><path d="m4.5 7 7.5 5.5L19.5 7"/></svg><span>${email}</span></a>
      </div>
      <p class="coach-bio">${escapeHTML(bio)}</p>
      <div class="coach-skills" aria-label="Specialties">${skillsMarkup || '<span class="skill-badge">Specialties not added</span>'}</div>
      <div class="coach-card-bottom">
        <div class="social-links" aria-label="Social and web profiles">${socialMarkup || '<span class="social-empty">No links yet</span>'}</div>
        <div class="card-actions"><button class="card-action" type="button" data-action="edit" data-id="${escapeHTML(coach.id)}" aria-label="Edit ${escapeHTML(coach.fullName)} profile"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 5 5 5M4 20l4.2-.8L19.1 8.3a2.12 2.12 0 0 0-3-3L5.2 16.2 4 20Z"/></svg><span>Edit</span></button><button class="card-action delete-action" type="button" data-action="delete" data-id="${escapeHTML(coach.id)}" aria-label="Delete ${escapeHTML(coach.fullName)} profile"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16m-10 4v6m4-6v6M6.5 7l.8 13h9.4l.8-13M9 7V4h6v3"/></svg><span>Delete</span></button></div>
      </div>
    </article>`;
  }

  function renderCoaches() {
    const visibleCoaches = matchingCoaches();
    coachGrid.innerHTML = visibleCoaches.map(coachCardMarkup).join('');
    coachGrid.hidden = visibleCoaches.length === 0;
    emptyState.hidden = visibleCoaches.length !== 0;
    attachAvatarFallbacks(coachGrid);
    const hasFilters = Boolean(searchInput.value.trim()) || statusFilter.value !== 'all';
    directoryCount.textContent = hasFilters
      ? `${visibleCoaches.length} of ${coaches.length} ${coaches.length === 1 ? 'coach' : 'coaches'}`
      : pluralize(coaches.length, 'coach', 'coaches');
  }

  function renderDashboard() {
    renderStats();
    renderCoaches();
  }

  function setAvatarElement(element, color, name, imageUrl = '') {
    const palette = paletteFor(color);
    element.style.setProperty('--avatar-bg', palette.bg);
    element.style.setProperty('--avatar-ink', palette.ink);
    element.replaceChildren();
    const letters = document.createElement('span');
    letters.textContent = initials(name);
    element.append(letters);
    const safeImage = safeUrl(imageUrl);
    if (safeImage) {
      const image = document.createElement('img');
      image.src = safeImage;
      image.alt = '';
      image.addEventListener('error', () => image.remove(), { once: true });
      element.append(image);
    }
  }

  function populateSkillChips() {
    const container = $('#skill-chips');
    container.replaceChildren();
    skillValues.forEach((skill, index) => {
      const chip = document.createElement('span');
      chip.className = 'skill-chip-editor';
      const label = document.createElement('span');
      label.textContent = skill;
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.textContent = '×';
      remove.setAttribute('aria-label', `Remove ${skill}`);
      remove.addEventListener('click', () => {
        skillValues.splice(index, 1);
        populateSkillChips();
      });
      chip.append(label, remove);
      container.append(chip);
    });
  }

  function addSkillText(value) {
    const candidates = String(value).split(/[\n,]/).map((skill) => skill.trim()).filter(Boolean);
    candidates.forEach((candidate) => {
      if (candidate.length > 48 || skillValues.length >= 24) return;
      const duplicate = skillValues.some((skill) => skill.toLocaleLowerCase() === candidate.toLocaleLowerCase());
      if (!duplicate) skillValues.push(candidate);
    });
    populateSkillChips();
  }

  function showCoachFormError(message, target) {
    coachFormError.textContent = message;
    coachFormError.hidden = false;
    if (target) target.focus();
  }

  function clearCoachFormError() {
    coachFormError.textContent = '';
    coachFormError.hidden = true;
  }

  function lockPageScroll() {
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }

  function unlockPageScroll() {
    document.body.style.overflow = previousBodyOverflow;
  }

  function openCoachModal(coach = null, returnFocus = document.activeElement) {
    editingCoachId = coach ? coach.id : null;
    modalReturnFocus = returnFocus;
    coachForm.reset();
    clearCoachFormError();
    skillValues = coach ? [...coach.skills] : [];
    populateSkillChips();
    selectedAvatarColor = coach ? (Object.hasOwn(avatarPalettes, coach.avatarColor) ? coach.avatarColor : 'gold') : 'gold';

    $('#modal-eyebrow').textContent = coach ? 'UPDATE 4CRAZZ PROFILE' : '4CRAZZ NETWORK';
    $('#modal-title').textContent = coach ? 'Edit career coach' : 'Add a career coach';
    $('#modal-description').textContent = coach ? 'Keep their details current for a thoughtful introduction.' : 'Capture the details that make a great introduction.';
    $('#save-button-label').textContent = coach ? 'Save changes' : 'Save coach';
    $('#coach-name').value = coach?.fullName || '';
    $('#coach-title').value = coach?.title || '';
    $('#coach-email').value = coach?.email || '';
    $('#coach-location').value = coach?.location || '';
    $('#coach-bio').value = coach?.bio || '';
    $('#coach-remote').checked = Boolean(coach?.remote);
    $('#coach-experience').value = coach && Number.isFinite(coach.yearsExperience) ? coach.yearsExperience : '';
    $('#coach-status').value = coach && Object.hasOwn(statusDetails, coach.status) ? coach.status : 'new';
    $('#coach-avatar-url').value = coach?.avatarUrl || '';
    $('#coach-linkedin').value = coach?.linkedin || '';
    $('#coach-twitter').value = coach?.twitter || '';
    $('#coach-instagram').value = coach?.instagram || '';
    $('#coach-youtube').value = coach?.youtube || '';
    $('#coach-website').value = coach?.website || '';
    $$('.avatar-preset').forEach((button) => button.classList.toggle('is-selected', button.dataset.color === selectedAvatarColor));
    updateAvatarPreview();

    lockPageScroll();
    coachModal.setAttribute('aria-hidden', 'false');
    coachModal.classList.add('is-open');
    window.setTimeout(() => $('#coach-name').focus(), 80);
  }

  function closeCoachModal() {
    if (!coachModal.classList.contains('is-open')) return;
    coachModal.classList.remove('is-open');
    coachModal.setAttribute('aria-hidden', 'true');
    unlockPageScroll();
    if (modalReturnFocus && typeof modalReturnFocus.focus === 'function') modalReturnFocus.focus();
  }

  function updateAvatarPreview() {
    const name = $('#coach-name').value.trim() || 'Career Coach';
    const url = $('#coach-avatar-url').value.trim();
    setAvatarElement($('#avatar-preview'), selectedAvatarColor, name, url);
  }

  function createCoachId() {
    if (globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function') return `coach-${globalThis.crypto.randomUUID()}`;
    return `coach-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function readCoachForm() {
    const experienceText = $('#coach-experience').value.trim();
    const experience = experienceText === '' ? null : Number(experienceText);
    const linkFields = ['avatarUrl', 'linkedin', 'twitter', 'instagram', 'youtube', 'website'];
    const links = {};
    for (const name of linkFields) {
      const raw = coachForm.elements.namedItem(name).value.trim();
      const normalized = safeUrl(raw);
      if (raw && !normalized) {
        const input = coachForm.elements.namedItem(name);
        showCoachFormError('Please enter valid web addresses that begin with https:// or a domain name.', input);
        return null;
      }
      links[name] = normalized;
    }

    if (!Number.isFinite(experience) && experience !== null) {
      showCoachFormError('Years of experience must be a whole number between 0 and 70.', $('#coach-experience'));
      return null;
    }
    if (experience !== null && (!Number.isInteger(experience) || experience < 0 || experience > 70)) {
      showCoachFormError('Years of experience must be a whole number between 0 and 70.', $('#coach-experience'));
      return null;
    }

    return {
      id: editingCoachId || createCoachId(),
      fullName: $('#coach-name').value.trim(),
      title: $('#coach-title').value.trim(),
      email: $('#coach-email').value.trim(),
      location: $('#coach-location').value.trim(),
      bio: $('#coach-bio').value.trim(),
      remote: $('#coach-remote').checked,
      yearsExperience: experience,
      skills: [...skillValues],
      status: Object.hasOwn(statusDetails, $('#coach-status').value) ? $('#coach-status').value : 'new',
      avatarColor: selectedAvatarColor,
      ...links,
    };
  }

  function onCoachFormSubmit(event) {
    event.preventDefault();
    clearCoachFormError();
    const nameInput = $('#coach-name');
    const titleInput = $('#coach-title');
    const emailInput = $('#coach-email');
    if (!nameInput.value.trim()) return showCoachFormError('Please add the coach’s full name.', nameInput);
    if (!titleInput.value.trim()) return showCoachFormError('Please add a job title or specialization.', titleInput);
    if (!emailInput.value.trim()) return showCoachFormError('Please add an email address.', emailInput);
    if (!emailInput.validity.valid) return showCoachFormError('Please enter a valid email address.', emailInput);

    const updatedCoach = readCoachForm();
    if (!updatedCoach) return;
    const message = editingCoachId
      ? `${updatedCoach.fullName}’s profile has been updated.`
      : `${updatedCoach.fullName} has been added to your network.`;
    if (editingCoachId) {
      const index = coaches.findIndex((coach) => coach.id === editingCoachId);
      if (index >= 0) coaches[index] = updatedCoach;
    } else {
      coaches.unshift(updatedCoach);
    }
    const saved = persistCoaches();
    renderDashboard();
    closeCoachModal();
    if (saved) showToast(message);
  }

  function openDeleteModal(coach, returnFocus) {
    pendingDeleteId = coach.id;
    deleteReturnFocus = returnFocus;
    $('#delete-coach-name').textContent = coach.fullName;
    lockPageScroll();
    deleteModal.setAttribute('aria-hidden', 'false');
    deleteModal.classList.add('is-open');
    window.setTimeout(() => $('#cancel-delete').focus(), 60);
  }

  function closeDeleteModal() {
    if (!deleteModal.classList.contains('is-open')) return;
    deleteModal.classList.remove('is-open');
    deleteModal.setAttribute('aria-hidden', 'true');
    pendingDeleteId = null;
    unlockPageScroll();
    if (deleteReturnFocus && typeof deleteReturnFocus.focus === 'function') deleteReturnFocus.focus();
  }

  function removePendingCoach() {
    const coach = coaches.find((item) => item.id === pendingDeleteId);
    if (!coach) return closeDeleteModal();
    coaches = coaches.filter((item) => item.id !== pendingDeleteId);
    const saved = persistCoaches();
    renderDashboard();
    const name = coach.fullName;
    deleteModal.classList.remove('is-open');
    deleteModal.setAttribute('aria-hidden', 'true');
    pendingDeleteId = null;
    unlockPageScroll();
    $('#coach-search').focus();
    if (saved) showToast(`${name} has been removed from your network.`);
  }

  function showToast(message, type = 'success') {
    if (!toastRegion) return;
    const toast = document.createElement('div');
    toast.className = `toast${type === 'error' ? ' is-error' : ''}`;
    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('viewBox', '0 0 24 24');
    icon.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', type === 'error' ? 'M12 3.5 21 20H3L12 3.5Zm0 6v4.5m0 3h.01' : 'm5 12.5 4.25 4.25L19.5 6.5');
    icon.append(path);
    const text = document.createElement('span');
    text.textContent = message;
    toast.append(icon, text);
    toastRegion.replaceChildren(toast);
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.remove(), 3600);
  }

  function updateUserProfile(user) {
    if (!user) return;
    const profileCopy = $('.founder-copy');
    const avatar = $('.founder-avatar');
    if (!profileCopy) return;

    const email = user.email || '';
    const metaName = user.user_metadata?.full_name || user.user_metadata?.name;
    const displayName = metaName || (email ? email.split('@')[0] : 'Founder');

    const strongEl = profileCopy.querySelector('strong');
    const smallEl = profileCopy.querySelector('small');
    if (strongEl) strongEl.textContent = displayName;
    if (smallEl) smallEl.textContent = email ? `${email}` : 'Founder · Admin';

    if (avatar) {
      if (metaName) {
        const parts = metaName.trim().split(/\s+/);
        avatar.textContent = parts.length > 1
          ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
          : metaName.slice(0, 2).toUpperCase();
      } else if (email) {
        avatar.textContent = email.slice(0, 2).toUpperCase();
      }
    }
  }

  function setAuthenticated(isAuthenticated, session = null) {
    loginView.hidden = isAuthenticated;
    appShell.hidden = !isAuthenticated;
    document.body.classList.toggle('is-authenticated', isAuthenticated);

    if (isAuthenticated) {
      loginError.hidden = true;
      loginPassword.value = '';
      if (session?.user) {
        updateUserProfile(session.user);
      }
      renderDashboard();
      updateTodayDate();
      window.setTimeout(() => window.scrollTo({ top: 0, behavior: 'instant' }), 0);
    } else {
      loginForm.reset();
      loginPassword.type = 'password';
      const toggleBtn = $('#toggle-password');
      if (toggleBtn) toggleBtn.setAttribute('aria-label', 'Show password');
    }
  }

  async function handleLogin(event) {
    event.preventDefault();
    const email = loginEmail.value.trim();
    const password = loginPassword.value;

    if (!email || !password) {
      loginError.textContent = 'Please enter both your email address and password.';
      loginError.hidden = false;
      return;
    }

    const submitBtn = loginForm.querySelector('button[type="submit"]');
    const submitText = submitBtn?.querySelector('span');
    const originalText = submitText ? submitText.textContent : 'Log in';

    if (submitBtn) {
      submitBtn.disabled = true;
      if (submitText) submitText.textContent = 'Signing in...';
    }
    loginError.hidden = true;

    try {
      const { data, error } = await signIn({ email, password });
      if (error) {
        loginError.textContent = error.message || 'Invalid login credentials.';
        loginError.hidden = false;
        loginPassword.focus();
      } else if (data?.session) {
        loginError.hidden = true;
        setAuthenticated(true, data.session);
        showToast('Welcome back to 4CRAZZ.');
      } else if (data?.user && !data?.session) {
        loginError.textContent = 'Please verify your email address before logging in.';
        loginError.hidden = false;
      }
    } catch (err) {
      loginError.textContent = err.message || 'Authentication failed. Please check your credentials and try again.';
      loginError.hidden = false;
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        if (submitText) submitText.textContent = originalText;
      }
    }
  }

  async function handleLogout() {
    try {
      await signOut();
    } catch (err) {
      console.warn('Sign out error:', err);
    }
    setAuthenticated(false);
    showToast('Signed out of 4CRAZZ.');
  }

  function updateTodayDate() {
    const now = new Date();
    const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(now).toUpperCase();
    const monthDay = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric' }).format(now).toUpperCase();
    const dateLabel = $('#today-date');
    if (dateLabel) dateLabel.textContent = `${weekday} · ${monthDay}`;
  }

  function handleModalKeydown(event, modal, closeHandler) {
    if (!modal.classList.contains('is-open')) return false;
    if (event.key === 'Escape') {
      event.preventDefault();
      closeHandler();
      return true;
    }
    if (event.key === 'Tab') {
      const focusable = $$('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])', modal)
        .filter((element) => element.getClientRects().length > 0);
      if (!focusable.length) return false;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    return false;
  }

  // Supabase authentication event listeners
  loginForm.addEventListener('submit', handleLogin);
  loginEmail.addEventListener('input', () => { loginError.hidden = true; });
  loginPassword.addEventListener('input', () => { loginError.hidden = true; });

  $('#toggle-password').addEventListener('click', (event) => {
    const button = event.currentTarget;
    const show = loginPassword.type === 'password';
    loginPassword.type = show ? 'text' : 'password';
    button.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
  });
  $('#logout-button')?.addEventListener('click', handleLogout);
  $('#mobile-logout')?.addEventListener('click', handleLogout);

  // Directory controls.
  searchInput.addEventListener('input', renderCoaches);
  statusFilter.addEventListener('change', renderCoaches);
  $('#clear-filters').addEventListener('click', () => {
    searchInput.value = '';
    statusFilter.value = 'all';
    renderCoaches();
    searchInput.focus();
  });
  $$('.nav-item').forEach((button) => button.addEventListener('click', () => {
    const target = document.getElementById(button.dataset.navTarget);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: button.dataset.navTarget === 'overview' ? 'start' : 'start' });
    $$('.nav-item').forEach((item) => item.classList.toggle('is-active', item === button));
  }));
  document.addEventListener('keydown', (event) => {
    if (event.key === '/' && !event.metaKey && !event.ctrlKey && !event.altKey && !appShell.hidden) {
      const target = event.target;
      const isTyping = target instanceof HTMLElement && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));
      if (!isTyping && !coachModal.classList.contains('is-open') && !deleteModal.classList.contains('is-open')) {
        event.preventDefault();
        searchInput.focus();
      }
    }
    if (handleModalKeydown(event, deleteModal, closeDeleteModal)) return;
    handleModalKeydown(event, coachModal, closeCoachModal);
  });

  // Add / edit form.
  const openAddCoach = (event) => openCoachModal(null, event.currentTarget);
  $('#add-coach-button').addEventListener('click', openAddCoach);
  $('#mobile-add-coach').addEventListener('click', openAddCoach);
  $('#sidebar-add-coach').addEventListener('click', openAddCoach);
  $('#close-modal').addEventListener('click', closeCoachModal);
  $('#cancel-modal').addEventListener('click', closeCoachModal);
  coachModal.addEventListener('click', (event) => {
    if (event.target === coachModal) closeCoachModal();
  });
  coachForm.addEventListener('submit', onCoachFormSubmit);
  $('#coach-name').addEventListener('input', updateAvatarPreview);
  $('#coach-avatar-url').addEventListener('input', updateAvatarPreview);
  $$('.avatar-preset').forEach((button) => button.addEventListener('click', () => {
    selectedAvatarColor = button.dataset.color;
    $('#coach-avatar-url').value = '';
    $$('.avatar-preset').forEach((preset) => preset.classList.toggle('is-selected', preset === button));
    updateAvatarPreview();
  }));
  const skillInput = $('#skill-input');
  skillInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      addSkillText(skillInput.value);
      skillInput.value = '';
    } else if (event.key === 'Backspace' && !skillInput.value && skillValues.length) {
      skillValues.pop();
      populateSkillChips();
    }
  });
  skillInput.addEventListener('input', () => {
    if (skillInput.value.includes(',')) {
      addSkillText(skillInput.value);
      skillInput.value = '';
    }
  });
  coachForm.addEventListener('input', clearCoachFormError);
  coachForm.addEventListener('change', clearCoachFormError);

  coachGrid.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const coach = coaches.find((item) => item.id === button.dataset.id);
    if (!coach) return;
    if (button.dataset.action === 'edit') openCoachModal(coach, button);
    if (button.dataset.action === 'delete') openDeleteModal(coach, button);
  });

  // Deletion confirmation.
  $('#close-delete-modal').addEventListener('click', closeDeleteModal);
  $('#cancel-delete').addEventListener('click', closeDeleteModal);
  $('#confirm-delete').addEventListener('click', removePendingCoach);
  deleteModal.addEventListener('click', (event) => {
    if (event.target === deleteModal) closeDeleteModal();
  });

  updateTodayDate();

  // Listen to Supabase auth state and restore active sessions
  initAuth({
    onAuthenticated: (session) => {
      setAuthenticated(true, session);
    },
    onUnauthenticated: () => {
      setAuthenticated(false);
    },
  });
