import React from "react";

function ConfirmationModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold text-white mb-4">Are you sure?</h2>
        <p className="text-gray-300 mb-6">Do you want to delete this gift?</p>
        <div className="flex justify-end space-x-4">
          <button
            className="bg-gray-700 px-6 py-2 rounded-lg hover:bg-gray-600 transition duration-200 cursor-pointer"
            onClick={onCancel}
          >
            No
          </button>
          <button
            className="bg-red-600 px-6 py-2 rounded-lg hover:bg-red-700 transition duration-200 cursor-pointer"
            onClick={onConfirm}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
