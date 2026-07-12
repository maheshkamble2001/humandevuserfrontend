// src/pages/admin/roles/hooks/useRoleValidation.js
import { useState, useCallback } from "react";
import { VALIDATION_RULES, VALIDATION_MESSAGES } from "../constants/roleConstants";

export const useRoleValidation = (existingRoles = []) => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Single field validation
  const validateField = useCallback((field, value, allValues = {}) => {
    const rules = VALIDATION_RULES[field];
    if (!rules) return null;

    let error = null;

    // Required validation
    if (rules.required && (!value || value.toString().trim() === "")) {
      error = VALIDATION_MESSAGES[field]?.required || `${field} is required`;
      return error;
    }

    // Min length validation
    if (rules.minLength && value && value.length < rules.minLength) {
      error = VALIDATION_MESSAGES[field]?.minLength || 
              `${field} must be at least ${rules.minLength} characters`;
      return error;
    }

    // Max length validation
    if (rules.maxLength && value && value.length > rules.maxLength) {
      error = VALIDATION_MESSAGES[field]?.maxLength || 
              `${field} cannot exceed ${rules.maxLength} characters`;
      return error;
    }

    // Pattern validation
    if (rules.pattern && value && !rules.pattern.test(value)) {
      error = VALIDATION_MESSAGES[field]?.pattern || 
              rules.patternMessage || `${field} contains invalid characters`;
      return error;
    }

    // Reserved names validation (for name field)
    if (field === "name" && value && rules.reservedNames) {
      const trimmedValue = value.trim();
      const isReserved = rules.reservedNames.some(
        (reserved) => reserved.toLowerCase() === trimmedValue.toLowerCase()
      );
      if (isReserved) {
        error = VALIDATION_MESSAGES[field]?.reserved || 
                rules.reservedMessage || `${value} is a reserved name`;
        return error;
      }
    }

    // Duplicate validation (for name field)
    if (field === "name" && value && existingRoles.length > 0) {
      const trimmedValue = value.trim();
      const isDuplicate = existingRoles.some(
        (role) => 
          role.name.toLowerCase() === trimmedValue.toLowerCase() &&
          role.id !== allValues.id // Skip current role when editing
      );
      if (isDuplicate) {
        error = VALIDATION_MESSAGES[field]?.duplicate || 
                "A role with this name already exists";
        return error;
      }
    }

    return null;
  }, [existingRoles]);

  // Full form validation
  const validateForm = useCallback((formData) => {
    const newErrors = {};
    const fields = Object.keys(VALIDATION_RULES);

    fields.forEach((field) => {
      const error = validateField(field, formData[field], formData);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [validateField]);

  // Validate single field and update errors
  const validateAndSetError = useCallback((field, value, formData = {}) => {
    const error = validateField(field, value, formData);
    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
    return !error;
  }, [validateField]);

  // Mark field as touched
  const markTouched = useCallback((field) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));
  }, []);

  // Clear field error
  const clearError = useCallback((field) => {
    setErrors((prev) => ({
      ...prev,
      [field]: null,
    }));
  }, []);

  // Clear all errors
  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  // Reset all touched fields
  const resetTouched = useCallback(() => {
    setTouched({});
  }, []);

  // Get error for a field
  const getError = useCallback((field) => {
    return errors[field];
  }, [errors]);

  // Check if field has error
  const hasError = useCallback((field) => {
    return !!errors[field];
  }, [errors]);

  // Check if field is touched
  const isTouched = useCallback((field) => {
    return !!touched[field];
  }, [touched]);

  // Check if form is valid (no errors)
  const isValid = useCallback(() => {
    return Object.keys(errors).length === 0;
  }, [errors]);

  // Check if form is dirty (has touched fields)
  const isDirty = useCallback(() => {
    return Object.keys(touched).length > 0;
  }, [touched]);

  return {
    // State
    errors,
    touched,
    
    // Validation functions
    validateField,
    validateForm,
    validateAndSetError,
    
    // Field management
    markTouched,
    clearError,
    clearAllErrors,
    resetTouched,
    
    // Check functions
    getError,
    hasError,
    isTouched,
    isValid,
    isDirty,
    
    // Set errors manually (for API errors)
    setErrors,
  };
};