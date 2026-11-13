
const QuantitySelector = () => {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-semibold text-gray-800">
        Quantity
      </label>

      <div className="flex items-center border border-gray-300 rounded-xl w-fit overflow-hidden">
        <button className="w-12 h-12 flex items-center justify-center text-xl hover:bg-gray-100 transition">
          −
        </button>

        <span className="w-14 h-12 flex items-center justify-center border-x border-gray-300 font-semibold">
          1
        </span>

        <button className="w-12 h-12 flex items-center justify-center text-xl hover:bg-gray-100 transition">
          +
        </button>
      </div>
    </div>
  );
};

export default QuantitySelector;
