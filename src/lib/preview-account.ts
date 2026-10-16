export type PreviewProfile = {
  name: string;
  email: string;
  institution: string;
  role: string;
  researchFocus: string;
  notifications: boolean;
};

const PROFILE_KEY = 'curovex.preview.profile';
const SESSION_KEY = 'curovex.preview.session';

export const defaultPreviewProfile: PreviewProfile = {
  name: 'Researcher',
  email: '',
  institution: '',
  role: 'Researcher',
  researchFocus: '',
  notifications: true,
};

export function readPreviewProfile(): PreviewProfile | null {
  const value = localStorage.getItem(PROFILE_KEY);
  return value ? { ...defaultPreviewProfile, ...JSON.parse(value) } : null;
}

export function savePreviewProfile(profile: PreviewProfile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  localStorage.setItem(SESSION_KEY, 'active');
}

export function hasPreviewSession() {
  return localStorage.getItem(SESSION_KEY) === 'active';
}

export function endPreviewSession() {
  localStorage.removeItem(SESSION_KEY);
}
