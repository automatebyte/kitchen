import React from 'react';
import OrdersList from '../components/Orders/OrdersList';
import CreateOrder from '../components/Orders/CreateOrder';

function OrdersPage() {
  return (
    <div>
      <CreateOrder />
      <OrdersList />
    </div>
  );
}

export default OrdersPage;