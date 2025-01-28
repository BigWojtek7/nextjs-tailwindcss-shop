interface OrderStatusProps {
  status: 'COMPLETED' | 'CANCELLED' | 'PENDING';
}

export function OrderStatus({ status }: OrderStatusProps) {
  const statusConfig = {
    COMPLETED: { color: 'text-green-600', label: 'Completed' },
    CANCELLED: { color: 'text-red-600', label: 'Cancelled' },
    PENDING: { color: 'text-yellow-600', label: 'In Progress' },
  };

  const config = statusConfig[status] || statusConfig.PENDING;

  return (
    <p className={`text-sm font-medium ${config.color}`}>{config.label}</p>
  );
}
