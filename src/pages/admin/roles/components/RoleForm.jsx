// src/pages/admin/roles/components/RoleForm.jsx
import React from "react";
import Input from "../../../../components/common/Input";

const RoleForm = ({
  formData,
  formErrors,
  onChange,
  isSubmitting = false,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Input
          label="Role Name"
          name="name"
          value={formData.name}
          onChange={onChange}
          error={formErrors.name}
          placeholder="Enter role name"
          required
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={onChange}
          rows="3"
          className="w-full bg-white/5 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Describe the role..."
          disabled={isSubmitting}
        />
      </div>

      {/* <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={onChange}
            className="w-4 h-4 bg-white/5 border border-white/20 rounded focus:ring-primary-500"
            disabled={isSubmitting}
          />
          <span className="text-sm text-gray-300">Active</span>
        </label>
      </div> */}
    </div>
  );
};

export default RoleForm;