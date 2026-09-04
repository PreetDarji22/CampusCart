import React from 'react';
import { Modal, Button, Badge, Row, Col } from 'react-bootstrap';
import { useApp } from '../../context/AppContext';

export const ProductDetailModal = () => {
  const { selectedProduct, setSelectedProduct, toggleWishlist, wishlist, addToCart } = useApp();

  if (!selectedProduct) return null;

  const isLiked = wishlist.includes(selectedProduct.id);

  const handleWhatsAppContact = () => {
    const text = encodeURIComponent(`Hi ${selectedProduct.seller.name}, I am interested in buying your listing "${selectedProduct.title}" (₹${selectedProduct.price}) on CampusCart!`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleEmailContact = () => {
    const subject = encodeURIComponent(`CampusCart Inquiry: ${selectedProduct.title}`);
    const body = encodeURIComponent(`Hi ${selectedProduct.seller.name},\n\nI saw your listing for "${selectedProduct.title}" (₹${selectedProduct.price}) on CampusCart and would like to meet up at ${selectedProduct.seller.meetupLocation} to complete the purchase.\n\nBest regards,\nStudent`);
    window.open(`mailto:seller@campus.edu?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <Modal
      show={!!selectedProduct}
      onHide={() => setSelectedProduct(null)}
      size="lg"
      centered
      className="rounded-2xl overflow-hidden backdrop-blur-md"
    >
      <Modal.Header closeButton className="border-b border-border-subtle bg-surface-container-low px-4 py-3">
        <Modal.Title className="text-lg font-headline-md font-bold text-on-background flex items-center gap-2">
          <span>{selectedProduct.title}</span>
          <Badge bg="secondary" className="bg-surface-container-high text-on-surface-variant text-xs font-normal">
            {selectedProduct.category}
          </Badge>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4 bg-surface-card" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
        <Row className="g-4">
          <Col md={6}>
            <div className="w-full h-72 md:h-80 rounded-xl overflow-hidden relative shadow-inner bg-surface-container-low">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={(e) => toggleWishlist(selectedProduct.id, e)}
                className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-outline hover:text-error-red transition-colors shadow-sm"
              >
                <span className={`material-symbols-outlined text-[20px] ${isLiked ? 'text-error-red filled' : ''}`}>
                  favorite
                </span>
              </button>
            </div>
          </Col>

          <Col md={6} className="flex flex-col justify-between">
            <div>
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-3xl font-bold font-headline-lg text-on-background">
                  ₹{selectedProduct.price.toLocaleString('en-IN')}
                </span>
                {selectedProduct.originalPrice && (
                  <span className="text-sm text-outline line-through">
                    Original: ₹{selectedProduct.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-vibrant-indigo/15 text-vibrant-indigo text-xs font-semibold px-2.5 py-1 rounded-md">
                  Condition: {selectedProduct.condition}
                </Badge>
                <Badge className="bg-fresh-mint/15 text-fresh-mint text-xs font-semibold px-2.5 py-1 rounded-md">
                  Dept: {selectedProduct.department}
                </Badge>
              </div>

              <p className="text-sm font-body-md text-on-surface-variant mb-4 leading-relaxed">
                {selectedProduct.description}
              </p>

              {/* Seller Verification Info */}
              <div className="bg-surface-container-low p-3 rounded-xl border border-border-subtle mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedProduct.seller.avatar}
                    alt={selectedProduct.seller.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-sm text-on-background">
                        {selectedProduct.seller.name}
                      </span>
                      {selectedProduct.seller.verified && (
                        <span className="material-symbols-outlined text-[16px] text-fresh-mint" title="Verified Campus Student">
                          verified
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-outline mb-0">
                      {selectedProduct.seller.department} • {selectedProduct.seller.year}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-sunny-amber flex items-center gap-0.5 justify-end">
                      <span className="material-symbols-outlined text-[14px] filled">star</span>
                      {selectedProduct.seller.rating || 5.0}
                    </span>
                    <span className="text-[10px] text-outline">Verified Peer</span>
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-border-subtle/50 text-xs text-on-surface-variant flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-vibrant-indigo">location_on</span>
                  Meetup: <strong className="text-on-background">{selectedProduct.seller.meetupLocation}</strong>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <Button
                onClick={(e) => addToCart(selectedProduct, e)}
                className="w-full bg-vibrant-indigo hover:bg-primary-container text-white border-0 font-label-md py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
                Add to Campus Cart
              </Button>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={handleWhatsAppContact}
                  variant="outline-success"
                  className="w-full text-xs font-semibold py-2 rounded-lg flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">chat</span>
                  WhatsApp Seller
                </Button>

                <Button
                  onClick={handleEmailContact}
                  variant="outline-secondary"
                  className="w-full text-xs font-semibold py-2 rounded-lg flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">mail</span>
                  Email Student
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};
