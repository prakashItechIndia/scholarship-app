import * as React from "react";
import { DataTable, TableSkeleton, Skeleton } from "@shared/components";
import { roleManagement, Screen } from "../../../services/scholarship.service";

interface RoleScreenPermissionsProps {
  roleId?: number;
  selectedScreenIds: number[];
  onScreenSelectionChange: (screenIds: number[]) => void;
  errors?: {
    permissions?: string;
  };
}

export const RoleScreenPermissions: React.FC<RoleScreenPermissionsProps> = ({
  roleId,
  selectedScreenIds,
  onScreenSelectionChange,
  errors,
}) => {
  const [screens, setScreens] = React.useState<Screen[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedRows, setSelectedRows] = React.useState<Set<number>>(
    new Set(selectedScreenIds)
  );

  // Load screens from API
  React.useEffect(() => {
    const loadScreens = async () => {
      try {
        setLoading(true);
        const allScreens = await roleManagement.getAllScreens();
        setScreens(allScreens);
      } catch (error) {
        console.error('Failed to load screens:', error);
      } finally {
        setLoading(false);
      }
    };
    void loadScreens();
  }, []);

  // Load role permissions if editing
  React.useEffect(() => {
    const loadRolePermissions = async () => {
      if (roleId) {
        try {
          setLoading(true);
          const roleWithPermissions = await roleManagement.getRoleWithPermissions(roleId);
          const screenIds = roleWithPermissions.permissions.map(p => p.screenId);
          setSelectedRows(new Set(screenIds));
          onScreenSelectionChange(screenIds);
        } catch (error) {
          console.error('Failed to load role permissions:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    void loadRolePermissions();
  }, [roleId]);

  // Sync selectedRows with selectedScreenIds
  React.useEffect(() => {
    setSelectedRows(new Set(selectedScreenIds));
  }, [selectedScreenIds]);

  const handleRowSelect = (screenId: number, isSelected: boolean) => {
    const newSelected = new Set(selectedRows);
    if (isSelected) {
      newSelected.add(screenId);
    } else {
      newSelected.delete(screenId);
    }
    setSelectedRows(newSelected);
    onScreenSelectionChange(Array.from(newSelected));
  };

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      const allScreenIds = screens.map(s => s.id);
      setSelectedRows(new Set(allScreenIds));
      onScreenSelectionChange(allScreenIds);
    } else {
      setSelectedRows(new Set());
      onScreenSelectionChange([]);
    }
  };

  const allSelected = screens.length > 0 && selectedRows.size === screens.length;
  const someSelected = selectedRows.size > 0 && selectedRows.size < screens.length;

  const columns = [
    {
      key: "select",
      name: "",
      width: 50,
      minWidth: 50,
      maxWidth: 50,
      cellPaddingLeft: "20px",
      cellPaddingRight: "0px",
      onRenderHeader: () => (
        <div style={{ textAlign: "left", width: "100%" }}>
          <input
            type="checkbox"
            checked={allSelected}
            ref={(input) => {
              if (input) {
                input.indeterminate = someSelected;
              }
            }}
            onChange={(e) => handleSelectAll(e.target.checked)}
            style={{
              width: "16px",
              height: "16px",
              cursor: "pointer",
              accentColor: "#0f6cbd",
            }}
          />
        </div>
      ),
      onRender: (item: Screen) => (
        <div style={{ textAlign: "left", width: "100%" }}>
          <input
            type="checkbox"
            checked={selectedRows.has(item.id)}
            onChange={(e) => handleRowSelect(item.id, e.target.checked)}
            style={{
              width: "16px",
              height: "16px",
              cursor: "pointer",
              accentColor: "#0f6cbd",
            }}
          />
        </div>
      ),
    },
    {
      key: "screenName",
      name: "Screen Name",
      fieldName: "screenName",
      width: "auto",
      minWidth: 200,
      cellPaddingLeft: "8px",
      cellPaddingRight: "8px",
      onRender: (item: Screen) => (
        <span style={{
          fontSize: "13px",
          lineHeight: "20px",
          color: "#242424",
          fontFamily: "'Inter', sans-serif",
        }}>
          {item.screenName}
        </span>
      ),
    },
    {
      key: "url",
      name: "URL",
      fieldName: "url",
      width: "auto",
      minWidth: 200,
      cellPaddingLeft: "8px",
      cellPaddingRight: "8px",
      onRender: (item: Screen) => (
        <span style={{
          fontSize: "13px",
          lineHeight: "20px",
          color: "#666",
          fontFamily: "'Inter', sans-serif",
        }}>
          {item.url}
        </span>
      ),
    },
  ];

  if (loading && screens.length === 0) {
    return (
      <div>
        <div style={{ marginBottom: "8px" }}>
          <Skeleton width="150px" height={20} variant="rounded" />
        </div>
        <TableSkeleton
          columnCount={3}
          rowCount={5}
          columnWidths={[300, 200, 150]}
          showCheckbox={false}
        />
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: "8px" }}>
        <span style={{
          fontSize: "13px",
          fontWeight: 600,
          color: "#242424",
          fontFamily: "'Inter', sans-serif",
        }}>
          Screen Permissions
        </span>
        <span style={{
          fontSize: "12px",
          color: "#666",
          marginLeft: "8px",
        }}>
          ({selectedRows.size} of {screens.length} selected)
        </span>
      </div>
      {errors?.permissions && (
        <div style={{
          color: "#d13438",
          fontSize: "12px",
          marginBottom: "8px",
        }}>
          {errors.permissions}
        </div>
      )}
      <DataTable
        items={screens}
        columns={columns}
        selectionMode="none"
        styles={{
          root: {
            border: "1px solid #edebe9",
            borderRadius: "4px",
          },
        }}
      />
    </div>
  );
};

