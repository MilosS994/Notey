const PrioritySelect = ({ value, onChange }) => (
  <select
    value={value}
    onChange={onChange}
    className={`rounded-full px-3 py-1 text-xs font-semibold outline-none border border-gray-200 shadow-sm
      ${
        value === "high"
          ? "bg-red-100 text-red-600"
          : value === "medium"
          ? "bg-yellow-100 text-yellow-700"
          : "bg-green-100 text-green-700"
      }
      transition-all duration-100 cursor-pointer`}
  >
    <option value="low">Low</option>
    <option value="medium">Medium</option>
    <option value="high">High</option>
  </select>
);

export default PrioritySelect;
