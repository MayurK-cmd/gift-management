import React from "react";

function DeleteConfirmModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-md sm:max-w-sm">
        <h2 className="text-xl font-semibold text-white mb-4 text-center">Are you sure?</h2>
        <p className="text-gray-300 mb-6 text-center">Do you want to delete this gift?</p>
        <div className="flex flex-col sm:flex-row justify-center sm:justify-end gap-4">
          <button
            className="bg-gray-700 px-6 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
            onClick={onCancel}
          >
            No
          </button>
          <button
            className="bg-red-600 px-6 py-2 rounded-lg hover:bg-red-700 transition duration-200"
            onClick={onConfirm}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal;
