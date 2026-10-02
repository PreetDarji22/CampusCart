import React from 'react';
import { Modal, Button, ListGroup, Badge } from 'react-bootstrap';
import { useApp } from '../../context/AppContext';

export const CartModal = ({ show, onHide }) => {
  const { cart, removeFromCart, setSelectedProduct, triggerToast, requireAuth, createPurchaseRequest } = useApp();

  const totalAmount = cart.reduce((sum, item) => sum + (item.price || 0), 0);

  const handleCheckout = () => {
    requireAuth(() => {
      cart.forEach(item => {
        createPurchaseRequest(item, 'Order placed via Campus Cart checkout');
      });
      triggerToast(`Purchase requests sent for ${cart.length} items to sellers!`, 'Cart Order Placed');
      onHide();
    });
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered className="cart-modal">
      <div className="bg-surface dark:bg-slate-900 border border-border-subtle dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-on-surface dark:text-slate-100">
        <Modal.Header closeButton className="border-b-0 pb-2">
          <Modal.Title className="font-display font-bold text-2xl text-vibrant-indigo flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl">shopping_bag</span>
            Campus Cart ({cart.length} items)
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="py-4">
          {cart.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <span className="material-symbols-outlined text-5xl text-outline">shopping_bag</span>
              <h3 className="font-bold text-lg">Your Cart is Empty</h3>
              <p className="text-xs text-outline max-w-xs mx-auto">Explore the marketplace and save textbooks or items you wish to purchase.</p>
            </div>
          ) : (
            <ListGroup variant="flush" className="space-y-3">
              {cart.map((item) => (
                <ListGroup.Item
                  key={item.id}
                  className="bg-surface-container-low dark:bg-slate-800 rounded-2xl border border-border-subtle/60 dark:border-slate-700 p-3 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 cursor-pointer flex-1" onClick={() => { setSelectedProduct(item); onHide(); }}>
                    <img src={item.image} alt={item.title} className="w-14 h-14 rounded-xl object-cover" />
                    <div>
                      <h4 className="font-bold text-sm text-on-background line-clamp-1 mb-0">{item.title}</h4>
                      <p className="text-xs text-outline mb-0">Seller: {item.seller?.name || 'Campus Peer'}</p>
                      <span className="font-bold text-sm text-vibrant-indigo">₹{item.price?.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-outline hover:text-error-red transition-colors"
                    title="Remove item"
                  >
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}

          {cart.length > 0 && (
            <div className="mt-6 pt-4 border-t border-border-subtle dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-outline block uppercase tracking-wider">Total Campus Order</span>
                <span className="text-2xl font-bold text-on-background">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>

              <Button
                onClick={handleCheckout}
                className="bg-vibrant-indigo hover:bg-primary-container text-white font-bold py-2.5 px-6 rounded-xl border-0 shadow-md transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
                Request Purchase from Sellers
              </Button>
            </div>
          )}
        </Modal.Body>
      </div>
    </Modal>
  );
};
