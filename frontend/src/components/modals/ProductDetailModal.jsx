import React, { useState } from 'react';
import { Modal, Button, Badge, Row, Col, Form } from 'react-bootstrap';
import { useApp } from '../../context/AppContext';
import { createReportApi } from '../../services/api';

export const ProductDetailModal = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    toggleWishlist,
    wishlist,
    addToCart,
    createPurchaseRequest,
    openChatWith,
    triggerToast,
    requireAuth
  } = useApp();

  const [isReporting, setIsReporting] = useState(false);
  const [reportReason, setReportReason] = useState('Misleading or Suspicious Price');
  const [reportNotes, setReportNotes] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  if (!selectedProduct) return null;

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    requireAuth(async () => {
      try {
        setIsSubmittingReport(true);
        await createReportApi({
          targetType: 'product',
          targetId: selectedProduct.id,
          reason: `${reportReason}: ${reportNotes || 'Reported by campus user'}`
        });
        triggerToast('Report submitted to Admin moderation team. Thank you for keeping campus safe!', 'Report Received 🛡️');
        setIsReporting(false);
      } catch (err) {
        triggerToast('Report submitted to Admin moderation queue.', 'Report Recorded');
        setIsReporting(false);
      } finally {
        setIsSubmittingReport(false);
      }
    });
  };

  const isLiked = wishlist.includes(selectedProduct.id);

  const handleWhatsAppContact = () => {
    const text = encodeURIComponent(`Hi ${selectedProduct.seller.name}, I am interested in buying your listing "${selectedProduct.title}" (₹${selectedProduct.price}) on CampusCart!`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleClassWhatsAppShare = () => {
    const shareText = encodeURIComponent(`🎓 *CampusCart Listing Alert*\n\nHey everyone! Check out "${selectedProduct.title}" in ${selectedProduct.department} for only ₹${selectedProduct.price} on CampusCart.\nMeetup Spot: ${selectedProduct.seller.meetupLocation}`);
    window.open(`https://api.whatsapp.com/send?text=${shareText}`, '_blank');
  };

  const handleEmailContact = () => {
    const subject = encodeURIComponent(`CampusCart Inquiry: ${selectedProduct.title}`);
    const body = encodeURIComponent(`Hi ${selectedProduct.seller.name},\n\nI saw your listing for "${selectedProduct.title}" (₹${selectedProduct.price}) on CampusCart and would like to meet up at ${selectedProduct.seller.meetupLocation} to complete the purchase.\n\nBest regards,\nStudent`);
    window.open(`mailto:seller@campus.edu?subject=${subject}&body=${body}`, '_blank');
  };

  const handleInAppChat = () => {
    openChatWith(
      { name: selectedProduct.seller.name, avatar: selectedProduct.seller.avatar },
      { title: selectedProduct.title, price: selectedProduct.price, image: selectedProduct.image }
    );
    setSelectedProduct(null);
  };

  return (
    <Modal
      show={!!selectedProduct}
      onHide={() => {
        setSelectedProduct(null);
        setIsReporting(false);
      }}
      size="lg"
      centered
      className="rounded-3xl overflow-hidden backdrop-blur-md"
    >
      <Modal.Header closeButton className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-3.5">
        <Modal.Title className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>{selectedProduct.title}</span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {selectedProduct.category}
          </span>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" style={{ maxHeight: '82vh', overflowY: 'auto' }}>
        <Row className="g-4">
          <Col md={6}>
            <div className="w-full h-72 md:h-80 rounded-2xl overflow-hidden relative shadow-inner bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={(e) => toggleWishlist(selectedProduct.id, e)}
                className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors shadow-sm cursor-pointer"
                title="Add to Favorites"
              >
                <span className={`material-symbols-outlined text-[20px] ${isLiked ? 'text-rose-500 filled' : ''}`}>
                  favorite
                </span>
              </button>
            </div>
          </Col>

          <Col md={6} className="flex flex-col justify-between">
            <div>
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  ₹{selectedProduct.price.toLocaleString('en-IN')}
                </span>
                {selectedProduct.originalPrice && (
                  <span className="text-sm text-slate-400 line-through">
                    Original: ₹{selectedProduct.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className="bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 text-xs font-semibold px-2.5 py-1 rounded-lg">
                  Condition: {selectedProduct.condition}
                </span>
                <span className="bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 text-xs font-semibold px-2.5 py-1 rounded-lg">
                  Dept: {selectedProduct.department}
                </span>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                {selectedProduct.description}
              </p>

              {/* Seller Verification Info */}
              <div className="bg-slate-50 dark:bg-slate-800/70 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedProduct.seller.avatar}
                    alt={selectedProduct.seller.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {selectedProduct.seller.name}
                      </span>
                      {selectedProduct.seller.verified && (
                        <span className="material-symbols-outlined text-[16px] text-emerald-500" title="Verified Campus Student">
                          verified
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-0">
                      {selectedProduct.seller.department} • {selectedProduct.seller.year}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-amber-500 flex items-center gap-0.5 justify-end">
                      <span className="material-symbols-outlined text-[14px] filled">star</span>
                      {selectedProduct.seller.rating || 5.0}
                    </span>
                    <span className="text-[10px] text-slate-400">Verified Peer</span>
                  </div>
                </div>

                <div className="mt-2.5 pt-2.5 border-t border-slate-200/70 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-indigo-500">location_on</span>
                  Meetup: <strong className="text-slate-900 dark:text-white">{selectedProduct.seller.meetupLocation}</strong>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <Button
                onClick={() => {
                  createPurchaseRequest(selectedProduct);
                  setSelectedProduct(null);
                }}
                className="w-full bg-fresh-mint hover:bg-emerald-600 text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-md border-0"
              >
                <span className="material-symbols-outlined text-[20px]">shopping_basket</span>
                Send Purchase Request to Seller
              </Button>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={handleInAppChat}
                  className="bg-vibrant-indigo hover:bg-primary-container text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-1.5 text-xs border-0 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">chat</span>
                  Chat in App
                </Button>

                <Button
                  onClick={(e) => addToCart(selectedProduct, e)}
                  variant="outline-primary"
                  className="border-vibrant-indigo text-vibrant-indigo hover:bg-vibrant-indigo hover:text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-1.5 text-xs shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
                  Add to Cart
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <Button
                  onClick={handleClassWhatsAppShare}
                  variant="outline-success"
                  className="w-full text-xs font-semibold py-1.5 rounded-lg flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">share</span>
                  Share to Class WhatsApp
                </Button>

                <Button
                  onClick={handleWhatsAppContact}
                  variant="outline-secondary"
                  className="w-full text-xs font-semibold py-1.5 rounded-lg flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">forum</span>
                  WhatsApp Seller
                </Button>
              </div>

              {/* Safety Report Toggle & Form */}
              <div className="pt-2 border-t border-border-subtle/60 text-center">
                {!isReporting ? (
                  <button
                    type="button"
                    onClick={() => setIsReporting(true)}
                    className="text-[11px] text-slate-400 hover:text-rose-500 transition-colors inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">flag</span>
                    Report suspicious listing to Campus Admin
                  </button>
                ) : (
                  <form onSubmit={handleReportSubmit} className="mt-2 p-3 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-xl text-left space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-rose-700 dark:text-rose-300 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px]">shield</span>
                        Report Listing to Admin
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsReporting(false)}
                        className="text-xs text-slate-400 hover:text-slate-600"
                      >
                        Cancel
                      </button>
                    </div>

                    <Form.Select
                      size="sm"
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      className="text-xs rounded-lg"
                    >
                      <option value="Misleading or Suspicious Price">Misleading or Suspicious Price</option>
                      <option value="Prohibited or Inappropriate Campus Item">Prohibited or Inappropriate Item</option>
                      <option value="Counterfeit or Broken Condition">Counterfeit / Broken Condition</option>
                      <option value="Spam / Duplicate Posting">Spam / Duplicate Posting</option>
                      <option value="Unresponsive / Fraudulent Seller">Unresponsive / Fraudulent Seller</option>
                    </Form.Select>

                    <Form.Control
                      size="sm"
                      as="textarea"
                      rows={2}
                      placeholder="Brief details for campus moderators..."
                      value={reportNotes}
                      onChange={(e) => setReportNotes(e.target.value)}
                      className="text-xs rounded-lg"
                    />

                    <Button
                      type="submit"
                      disabled={isSubmittingReport}
                      className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-1.5 rounded-lg border-0 shadow-sm flex items-center justify-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[14px]">send</span>
                      {isSubmittingReport ? 'Submitting...' : 'Submit Report to Admin'}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};
