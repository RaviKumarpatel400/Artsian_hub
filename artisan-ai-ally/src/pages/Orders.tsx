import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";

const Orders = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };
    fetchOrders();
  }, [token]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-600">No orders placed yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="p-4 border rounded-lg shadow-sm">
              <p className="text-gray-600 text-sm">
                Order ID: {order._id} | {new Date(order.createdAt).toLocaleString()}
              </p>
              <p className="font-semibold">Status: {order.status}</p>
              <p className="font-bold">Total: ${order.totalAmount.toFixed(2)}</p>
              <div className="mt-2 space-y-1">
                {order.items.map((item: any) => (
                  <div key={item.product._id} className="flex items-center justify-between">
                    <Link to={`/product/${item.product._id}`} className="text-orange-600 hover:underline">
                      {item.product.name}
                    </Link>
                    <span>Qty: {item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
