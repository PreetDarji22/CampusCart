import React from 'react';
import { Modal, ListGroup, Button } from 'react-bootstrap';
import { useApp } from '../../context/AppContext';

export const WishlistModal = ({ show, onHide }) => {
  const { wishlist, products, toggleWishlist, setSelectedProduct, addToCart } = useApp();

  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <Modal show={show} onHide={onHide} size="lg" centered className="wishlist-modal">
      <div className="bg-surface dark:bg-slate-900 border border-border-subtle dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-on-surface dark:text-slate-100">
        <Modal.Header closeButton className="border-b-0 pb-2">
          <Modal.Title className="font-display font-bold text-2xl text-error-red flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl filled text-error-red">favorite</span>
            Saved Wishlist ({wishlistedProducts.length} items)
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="py-4">
          {wishlistedProducts.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <span className="material-symbols-outlined text-5xl text-outline">favorite_border</span>
              <h3 className="font-bold text-lg">No Favorites Saved Yet</h3>
              <p className="text-xs text-outline max-w-xs mx-auto">Click the heart icon on any campus listing to bookmark items you are interested in.</p>
            </div>
          ) : (
            <ListGroup variant="flush" className="space-y-3">
              {wishlistedProducts.map((item) => (
                <ListGroup.Item
                  key={item.id}
                  className="bg-surface-container-low dark:bg-slate-800 rounded-2xl border border-border-subtle/60 dark:border-slate-700 p-3 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 cursor-pointer flex-1" onClick={() => { setSelectedProduct(item); onHide(); }}>
                    <img src={item.image} alt={item.title} className="w-14 h-14 rounded-xl object-cover" />
                    <div>
                      <h4 className="font-bold text-sm text-on-background line-clamp-1 mb-0">{item.title}</h4>
                      <p className="text-xs text-outline mb-0">{item.condition} • {item.department || item.seller?.department || 'General'}</p>
                      <span className="font-bold text-sm text-vibrant-indigo">₹{item.price?.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={(e) => { addToCart(item, e); onHide(); }}
                      className="bg-vibrant-indigo border-0 text-xs font-bold rounded-xl px-3 py-1.5 text-white"
                    >
                      + Add to Cart
                    </Button>
                    <button
                      onClick={(e) => toggleWishlist(item.id, e)}
                      className="p-2 text-outline hover:text-error-red transition-colors"
                      title="Remove from wishlist"
                    >
                      <span className="material-symbols-outlined text-[20px] text-error-red filled">favorite</span>
                    </button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Modal.Body>
      </div>
    </Modal>
  );
};
