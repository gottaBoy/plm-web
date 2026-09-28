const getThemeVar = () => {
  const n = document.documentElement;
  return n
    ? getComputedStyle(n).getPropertyValue('--ibiz-color-primary')
    : null;
};

const hasChineseAndEnglish = n =>
  /[\u4e00-\u9fa5]+.*[a-zA-Z]+|[a-zA-Z]+.*[\u4e00-\u9fa5]+/.test(n);

const isChineseCharacter = n => /[\u4E00-\u9FA5]/.test(n);

const stringToHexColor = n => {
  if (!n) return '';
  let r = 0;
  for (let u = 0; u < n.length; u++)
    if (isChineseCharacter(n))
      (r = n.charCodeAt(u) + ((r << 5) - r)), (r = r & r);
    else {
      const g = n.charCodeAt(u);
      r += g.toString(16);
    }
  const t = String(r).substring(0, 6);
  let e = parseInt(t.substring(0, 2), 16),
    a = parseInt(t.substring(2, 4), 16),
    i = parseInt(t.substring(4, 6), 16);
  e < 0 && (e = 10), a < 0 && (a = 10), i < 0 && (i = 10);
  const m = '#'
    .concat(e.toString(16).padStart(2, '0'))
    .concat(a.toString(16).padStart(2, '0'))
    .concat(i.toString(16).padStart(2, '0'))
    .replaceAll('-', '0');
  return (m === '#FFFFFF' && getThemeVar()) || m;
};

const renderTextPhoto = n => {
  if (n && n.toString().length < 2) return n;
  if (n && n.toString().length >= 2) {
    if (hasChineseAndEnglish(n)) {
      const a = n.split('').find(m => /[a-zA-Z]/.test(m)) || '',
        i = n.split('').find(m => /[\u4E00-\u9FA5]/.test(m)) || '';
      return ''.concat(a).concat(i).toLowerCase();
    }
    return /[a-zA-Z]/.test(n)
      ? n
          .split('')
          .filter(a => /[a-zA-Z]/.test(a))
          .slice(0, 2)
          .join('')
          .toUpperCase()
      : /[\u4E00-\u9FA5]/.test(n)
      ? n
          .split('')
          .filter(a => /[\u4E00-\u9FA5]/.test(a))
          .slice(-2)
          .join('')
      : n.replaceAll(' ', '').substring(0, 2);
  }
};

export {
  getThemeVar,
  hasChineseAndEnglish,
  isChineseCharacter,
  stringToHexColor,
  renderTextPhoto,
};
