// src/pages/admin/roles/components/RoleSearch.jsx
import React from "react";
import { Search } from "lucide-react";
import Input from "../../../../components/common/Input";

const RoleSearch = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="glass-effect rounded-xl p-4 border border-white/20">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            icon={Search}
            placeholder="Search roles by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default RoleSearch;