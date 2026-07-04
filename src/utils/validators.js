// src/utils/validators.js
export const validators = {
  required: (value, message = 'This field is required') => {
    if (!value || value.trim() === '') {
      return message;
    }
    return null;
  },

  email: (value, message = 'Please enter a valid email address') => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !re.test(value)) {
      return message;
    }
    return null;
  },

  minLength: (min, message = `Must be at least ${min} characters`) => {
    return (value) => {
      if (value && value.length < min) {
        return message;
      }
      return null;
    };
  },

  maxLength: (max, message = `Cannot exceed ${max} characters`) => {
    return (value) => {
      if (value && value.length > max) {
        return message;
      }
      return null;
    };
  },

  min: (min, message = `Must be at least ${min}`) => {
    return (value) => {
      if (value !== undefined && value !== null && value < min) {
        return message;
      }
      return null;
    };
  },

  max: (max, message = `Must be at most ${max}`) => {
    return (value) => {
      if (value !== undefined && value !== null && value > max) {
        return message;
      }
      return null;
    };
  },

  pattern: (pattern, message = 'Invalid format') => {
    return (value) => {
      if (value && !pattern.test(value)) {
        return message;
      }
      return null;
    };
  },

  confirmPassword: (password, message = 'Passwords do not match') => {
    return (value) => {
      if (value !== password) {
        return message;
      }
      return null;
    };
  },

  phone: (value, message = 'Please enter a valid phone number') => {
    const re = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/;
    if (value && !re.test(value)) {
      return message;
    }
    return null;
  },

  url: (value, message = 'Please enter a valid URL') => {
    try {
      if (value) {
        new URL(value);
      }
      return null;
    } catch {
      return message;
    }
  },

  number: (value, message = 'Please enter a valid number') => {
    if (value && isNaN(Number(value))) {
      return message;
    }
    return null;
  },

  integer: (value, message = 'Please enter a valid integer') => {
    if (value && !Number.isInteger(Number(value))) {
      return message;
    }
    return null;
  },

  alpha: (value, message = 'Only letters are allowed') => {
    const re = /^[a-zA-Z\s]*$/;
    if (value && !re.test(value)) {
      return message;
    }
    return null;
  },

  alphaNumeric: (value, message = 'Only letters and numbers are allowed') => {
    const re = /^[a-zA-Z0-9\s]*$/;
    if (value && !re.test(value)) {
      return message;
    }
    return null;
  },

  custom: (validator, message) => {
    return (value) => {
      const isValid = validator(value);
      if (!isValid) {
        return message;
      }
      return null;
    };
  },
};

export const validateForm = (values, validations) => {
  const errors = {};
  for (const [field, rules] of Object.entries(validations)) {
    for (const rule of rules) {
      const error = rule(values[field]);
      if (error) {
        errors[field] = error;
        break;
      }
    }
  }
  return errors;
};