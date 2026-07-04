// src/utils/formatters.js
export const formatters = {
  currency: (value, currency = 'USD', locale = 'en-US') => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(value);
  },

  number: (value, locale = 'en-US') => {
    return new Intl.NumberFormat(locale).format(value);
  },

  compactNumber: (value, locale = 'en-US') => {
    return new Intl.NumberFormat(locale, {
      notation: 'compact',
      compactDisplay: 'short',
    }).format(value);
  },

  percentage: (value, locale = 'en-US') => {
    return new Intl.NumberFormat(locale, {
      style: 'percent',
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    }).format(value / 100);
  },

  fileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  timeDuration: (seconds) => {
    if (!seconds) return '0s';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    const parts = [];
    if (hours) parts.push(`${hours}h`);
    if (minutes) parts.push(`${minutes}m`);
    if (secs) parts.push(`${secs}s`);
    return parts.join(' ');
  },

  phone: (phone, format = 'international') => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (format === 'international') {
      if (cleaned.length === 10) {
        return `+${cleaned.slice(0, 1)} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
      }
      return phone;
    }
    return cleaned;
  },

  truncate: (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  },

  capitalize: (text) => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  },

  titleCase: (text) => {
    if (!text) return '';
    return text
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  },

  snakeToCamel: (str) => {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  },

  camelToSnake: (str) => {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  },

  kebabToCamel: (str) => {
    return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
  },

  camelToKebab: (str) => {
    return str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
  },
};