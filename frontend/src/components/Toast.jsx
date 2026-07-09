import React, { useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { CheckCircle } from 'lucide-react';

const Toast = () => {
  const { toast } = useShop();
  return (
    <div className={`toast ${toast.visible ? 'visible' : ''}`} role="status" aria-live="polite">
      <span className="toast-icon"><CheckCircle size={15} /></span>
      {toast.message}
    </div>
  );
};

export default Toast;
