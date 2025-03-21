import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface ActivityLogFiltersProps {
  filters: {
    userId: string;
    entityType: string;
    action: string;
    startDate: Date | null;
    endDate: Date | null;
  };
  setFilters: (filters: any) => void;
}

const ActivityLogFilters = ({ filters, setFilters }: ActivityLogFiltersProps) => {
  return (
    <div className="mt-8 flex flex-wrap gap-4">
      <DatePicker
        selected={filters.startDate}
        onChange={date => setFilters(prev => ({ ...prev, startDate: date }))}
        placeholderText="Từ ngày"
        className="rounded-md border-gray-300"
      />
      <DatePicker
        selected={filters.endDate}
        onChange={date => setFilters(prev => ({ ...prev, endDate: date }))}
        placeholderText="Đến ngày"
        className="rounded-md border-gray-300"
      />
      <select
        value={filters.action}
        onChange={e => setFilters(prev => ({ ...prev, action: e.target.value }))}
        className="rounded-md border-gray-300"
      >
        <option value="">Tất cả hành động</option>
        <option value="create">Thêm mới</option>
        <option value="update">Cập nhật</option>
        <option value="delete">Xóa</option>
      </select>
      <select
        value={filters.entityType}
        onChange={e => setFilters(prev => ({ ...prev, entityType: e.target.value }))}
        className="rounded-md border-gray-300"
      >
        <option value="">Tất cả đối tượng</option>
        <option value="employee">Nhân viên</option>
        <option value="department">Phòng ban</option>
        <option value="attendance">Chấm công</option>
        <option value="salary">Lương</option>
      </select>
    </div>
  );
};

export default ActivityLogFilters; 