import React from 'react';

const LowStockBadge = ({ quantity }) => {
  if (quantity > 10) return null;
  const level = quantity <= 5 ? 'low' : 'medium';
  const text = quantity === 0 ? 'Out of stock' : `${quantity} left`;
  const colorClasses = {
    low: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClasses[level]}`}>
      {text}
    </span>
  );
};

export default LowStockBadge;
