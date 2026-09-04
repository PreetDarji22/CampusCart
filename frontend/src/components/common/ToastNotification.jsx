import React from 'react';
import { ToastContainer, Toast } from 'react-bootstrap';
import { useApp } from '../../context/AppContext';

export const ToastNotification = () => {
  const { toast } = useApp();

  return (
    <ToastContainer position="bottom-end" className="p-3 fixed bottom-4 right-4 z-50">
      <Toast show={toast.show} className="bg-surface-card border-0 shadow-level-3 rounded-xl overflow-hidden">
        <Toast.Header className="bg-vibrant-indigo text-white border-0 flex justify-between items-center px-3 py-2">
          <strong className="me-auto text-xs font-label-md flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">notifications_active</span>
            {toast.title || 'CampusCart'}
          </strong>
        </Toast.Header>
        <Toast.Body className="text-sm font-body-md text-on-background px-3 py-2.5">
          {toast.message}
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
};
