import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Table, Modal } from 'react-bootstrap';
import { useApp } from '../../context/AppContext';

export const SellerHubPage = () => {
  const {
    products,
    myListingIds,
    requests = [],
    deleteRequest,
    setIsPostRequestOpen,
    currentUser,
    isAuthenticated,
    setIsAuthOpen,
    setIsAddListingOpen,
    markAsSold,
    deleteListing,
    setSelectedProduct,
    orders,
    acceptPurchaseRequest,
    rejectPurchaseRequest,
    openChatWith
  } = useApp();

  const [itemToDelete, setItemToDelete] = useState(null);

  if (!isAuthenticated) {
    return (
      <div className="pt-32 pb-16 min-h-screen flex items-center justify-center">
        <Container maxwidth="md">
          <div className="bg-surface-card p-8 sm:p-12 rounded-3xl border border-border-subtle shadow-xl text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-vibrant-indigo/15 text-vibrant-indigo flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-3xl">lock</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-on-background">Student Dashboard Locked</h2>
            <p className="text-sm text-outline max-w-md mx-auto">
              Please sign in with your college email or create an account to access your student sales dashboard, active listings, and campus transactions.
            </p>
            <div className="pt-2">
              <Button
                onClick={() => setIsAuthOpen(true)}
                className="bg-vibrant-indigo text-white font-bold px-6 py-2.5 rounded-xl border-0 shadow-md hover:bg-primary-container transition-all"
              >
                Login or Register Now
              </Button>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  const myProducts = products.filter(p => {
    if (!currentUser) return false;
    if (p.seller?.email && currentUser.email) {
      return p.seller.email.toLowerCase() === currentUser.email.toLowerCase();
    }
    if (p.seller?.name && currentUser.name) {
      return p.seller.name.toLowerCase() === currentUser.name.toLowerCase();
    }
    return false;
  });

  const myRequests = requests.filter(r => {
    if (!currentUser) return false;
    if (r.postedBy?.email && currentUser.email) {
      return r.postedBy.email.toLowerCase() === currentUser.email.toLowerCase();
    }
    if (r.postedBy?.name && currentUser.name) {
      return r.postedBy.name.toLowerCase() === currentUser.name.toLowerCase();
    }
    return false;
  });

  const incomingOrders = orders.filter(o => o.sellerEmail && currentUser?.email && o.sellerEmail.toLowerCase() === currentUser.email.toLowerCase());
  const sentOrders = orders.filter(o => o.buyerEmail && currentUser?.email && o.buyerEmail.toLowerCase() === currentUser.email.toLowerCase());

  const activeCount = myProducts.filter(p => !p.sold).length;
  const soldCount = myProducts.filter(p => p.sold).length;
  const totalRevenue = myProducts.reduce((acc, curr) => acc + (curr.sold ? curr.price : 0), 0);
  const totalViews = myProducts.reduce((acc, curr) => acc + (curr.views || 10), 0);

  const confirmDelete = () => {
    if (itemToDelete) {
      deleteListing(itemToDelete.id);
      setItemToDelete(null);
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <Container maxwidth="7xl">
        {/* Header Profile Section */}
        <div className="bg-surface-card p-6 rounded-2xl border border-border-subtle shadow-level-1 mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-vibrant-indigo shadow-sm"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-display text-2xl font-bold text-on-background mb-0">{currentUser.name}</h1>
                  <span className="material-symbols-outlined text-fresh-mint text-[20px]" title="Verified Campus Student">
                    verified
                  </span>
                  <Badge bg="success" className="bg-fresh-mint/15 text-fresh-mint text-xs px-2 py-0.5">
                    Verified Student
                  </Badge>
                  {currentUser.rollNumber && (
                    <Badge bg="secondary" className="bg-surface-container-high text-on-surface-variant text-[11px] px-2 py-0.5 font-normal">
                      ID: {currentUser.rollNumber}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-outline mb-0">
                  {currentUser.department} • {currentUser.year} • Email: {currentUser.email}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                onClick={() => setIsPostRequestOpen(true)}
                variant="outline-primary"
                className="border-vibrant-indigo text-vibrant-indigo hover:bg-vibrant-indigo hover:text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">campaign</span>
                Post Requirement
              </Button>
              <Button
                onClick={() => setIsAddListingOpen(true)}
                className="bg-vibrant-indigo hover:bg-primary-container border-0 text-white font-semibold px-4 py-2 rounded-xl shadow-sm text-xs flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">add_circle</span>
                Post Campus Listing
              </Button>
            </div>
          </div>
        </div>

        {/* Incoming Purchase Requests Section */}
        {incomingOrders.length > 0 && (
          <div className="bg-surface-card p-5 rounded-2xl border border-border-subtle shadow-level-1 mb-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h3 className="font-bold text-base text-on-background flex items-center gap-2 mb-0">
                <span className="material-symbols-outlined text-vibrant-indigo">notifications_active</span>
                Incoming Purchase Requests ({incomingOrders.filter(o => o.status === 'pending').length} Pending)
              </h3>
              <Badge className="bg-vibrant-indigo/15 text-vibrant-indigo text-xs font-semibold">
                Peer Handoff System
              </Badge>
            </div>

            <div className="space-y-3">
              {incomingOrders.map((req) => (
                <div
                  key={req.id}
                  className="bg-surface-container-low dark:bg-slate-800 p-4 rounded-xl border border-border-subtle/70 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <img src={req.buyerAvatar} alt={req.buyerName} className="w-10 h-10 rounded-full object-cover border" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-on-background">{req.buyerName}</span>
                        <Badge bg={req.status === 'accepted' ? 'success' : req.status === 'rejected' ? 'danger' : 'warning'} className="text-[10px]">
                          {req.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-xs text-outline mb-0">
                        Wants to buy: <strong className="text-on-background">{req.productTitle}</strong> (₹{req.price})
                      </p>
                      <p className="text-[11px] text-on-surface-variant italic mt-0.5 mb-0">"{req.notes}"</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-auto">
                    {req.status === 'pending' ? (
                      <>
                        <Button
                          size="sm"
                          onClick={() => acceptPurchaseRequest(req.id)}
                          className="bg-fresh-mint hover:bg-emerald-600 text-white font-bold text-xs rounded-xl border-0 px-3 py-1.5 flex items-center gap-1 shadow-sm"
                        >
                          <span className="material-symbols-outlined text-[16px]">check_circle</span>
                          Accept & Chat
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => rejectPurchaseRequest(req.id)}
                          className="text-xs rounded-xl px-3 py-1.5"
                        >
                          Decline
                        </Button>
                      </>
                    ) : req.status === 'accepted' ? (
                      <Button
                        size="sm"
                        onClick={() => openChatWith({ name: req.buyerName, avatar: req.buyerAvatar }, { title: req.productTitle })}
                        className="bg-vibrant-indigo text-white font-bold text-xs rounded-xl border-0 px-3 py-1.5 flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[16px]">chat</span>
                        Open Live Chat
                      </Button>
                    ) : (
                      <span className="text-xs text-outline italic">Request Declined</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My Sent Purchase Requests */}
        {sentOrders.length > 0 && (
          <div className="bg-surface-card p-5 rounded-2xl border border-border-subtle shadow-level-1 mb-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h3 className="font-bold text-base text-on-background flex items-center gap-2 mb-0">
                <span className="material-symbols-outlined text-vibrant-indigo">shopping_bag</span>
                My Sent Purchase Offers ({sentOrders.length})
              </h3>
            </div>

            <div className="space-y-3">
              {sentOrders.map((req) => (
                <div
                  key={req.id}
                  className="bg-surface-container-low dark:bg-slate-800 p-4 rounded-xl border border-border-subtle/70 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <img src={req.productImage} alt={req.productTitle} className="w-12 h-12 rounded-lg object-cover border" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-on-background">{req.productTitle}</span>
                        <Badge bg={req.status === 'accepted' ? 'success' : req.status === 'rejected' ? 'danger' : 'warning'} className="text-[10px]">
                          {req.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-xs text-outline mb-0">
                        Offered: <strong className="text-vibrant-indigo">₹{req.price}</strong> • Seller Email: {req.sellerEmail}
                      </p>
                    </div>
                  </div>

                  {req.status === 'accepted' && (
                    <Button
                      size="sm"
                      onClick={() => openChatWith({ name: 'Seller Peer', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' }, { title: req.productTitle })}
                      className="bg-vibrant-indigo text-white font-bold text-xs rounded-xl border-0 px-3 py-1.5 flex items-center gap-1 self-end md:self-auto"
                    >
                      <span className="material-symbols-outlined text-[16px]">chat</span>
                      Chat with Seller
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Metrics Row */}
        <Row className="g-4 mb-6">
          <Col md={3} sm={6}>
            <Card className="border-0 rounded-2xl p-4 bg-surface-card shadow-level-1 border-l-4 border-l-vibrant-indigo">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-outline uppercase tracking-wider mb-1">Total Sales</p>
                  <h2 className="font-headline-lg text-2xl font-bold text-on-background">₹{totalRevenue.toLocaleString('en-IN')}</h2>
                  <p className="text-xs text-fresh-mint mb-0">{soldCount} items sold</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-vibrant-indigo/10 flex items-center justify-center text-vibrant-indigo">
                  <span className="material-symbols-outlined">payments</span>
                </div>
              </div>
            </Card>
          </Col>

          <Col md={3} sm={6}>
            <Card className="border-0 rounded-2xl p-4 bg-surface-card shadow-level-1 border-l-4 border-l-fresh-mint">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-outline uppercase tracking-wider mb-1">Active Listings</p>
                  <h2 className="font-headline-lg text-2xl font-bold text-on-background">{activeCount}</h2>
                  <p className="text-xs text-outline mb-0">Live on marketplace</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-fresh-mint/10 flex items-center justify-center text-fresh-mint">
                  <span className="material-symbols-outlined">storefront</span>
                </div>
              </div>
            </Card>
          </Col>

          <Col md={3} sm={6}>
            <Card className="border-0 rounded-2xl p-4 bg-surface-card shadow-level-1 border-l-4 border-l-sunny-amber">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-outline uppercase tracking-wider mb-1">Listing Views</p>
                  <h2 className="font-headline-lg text-2xl font-bold text-on-background">{totalViews}</h2>
                  <p className="text-xs text-sunny-amber mb-0">Student interest</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-sunny-amber/10 flex items-center justify-center text-sunny-amber">
                  <span className="material-symbols-outlined">visibility</span>
                </div>
              </div>
            </Card>
          </Col>

          <Col md={3} sm={6}>
            <Card className="border-0 rounded-2xl p-4 bg-surface-card shadow-level-1 border-l-4 border-l-primary">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-outline uppercase tracking-wider mb-1">Peer Response Rate</p>
                  <h2 className="font-headline-lg text-2xl font-bold text-on-background">98%</h2>
                  <p className="text-xs text-fresh-mint mb-0">⚡ Fast Responder</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">chat_bubble</span>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Listings Table / Management */}
        <div className="bg-surface-card p-6 rounded-2xl border border-border-subtle shadow-level-1 mb-6">
          <div className="flex items-center justify-between mb-4 border-b border-border-subtle pb-3">
            <h3 className="font-headline-md text-lg font-bold text-on-background mb-0">My Campus Listings</h3>
            <span className="text-xs text-outline font-medium">Manage item status, sales, and listing details</span>
          </div>

          {myProducts.length === 0 ? (
            <div className="text-center py-10">
              <span className="material-symbols-outlined text-4xl text-outline mb-2">post_add</span>
              <h4 className="font-bold text-on-background">No Active Listings Yet</h4>
              <p className="text-xs text-outline max-w-sm mx-auto mb-4">
                Got old textbooks, lab coats, or electronics? List them now to earn extra cash while helping fellow students.
              </p>
              <Button
                onClick={() => setIsAddListingOpen(true)}
                className="bg-vibrant-indigo border-0 text-xs font-semibold rounded-full px-4 py-2 text-white"
              >
                Create Your First Listing
              </Button>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover align="middle" className="text-sm">
                <thead>
                  <tr className="text-xs text-outline border-b border-border-subtle">
                    <th>Item</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Views</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {myProducts.map(item => (
                    <tr key={item.id} className="align-middle">
                      <td>
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <p
                              onClick={() => setSelectedProduct(item)}
                              className="font-semibold text-on-background mb-0 hover:text-vibrant-indigo cursor-pointer"
                            >
                              {item.title}
                            </p>
                            <span className="text-xs text-outline">{item.department}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <Badge bg="light" className="text-on-surface-variant text-xs border border-border-subtle">
                          {item.category}
                        </Badge>
                      </td>
                      <td className="font-bold text-on-background">₹{item.price.toLocaleString('en-IN')}</td>
                      <td>
                        {item.sold ? (
                          <Badge bg="secondary" className="bg-surface-container-high text-on-surface-variant text-xs">
                            SOLD
                          </Badge>
                        ) : (
                          <Badge bg="success" className="bg-fresh-mint/15 text-fresh-mint text-xs">
                            Active
                          </Badge>
                        )}
                      </td>
                      <td className="text-outline text-xs">{item.views || 24} views</td>
                      <td className="text-end">
                        <div className="flex items-center justify-end gap-2">
                          {!item.sold && (
                            <Button
                              variant="outline-success"
                              size="sm"
                              onClick={() => markAsSold(item.id)}
                              className="text-xs py-1 px-2 font-semibold"
                            >
                              Mark Sold
                            </Button>
                          )}
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => setSelectedProduct(item)}
                            className="text-xs py-1 px-2"
                          >
                            View
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => setItemToDelete(item)}
                            className="text-xs py-1 px-2"
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </div>

        {/* My Student Wanted Requirements Management */}
        {myRequests.length > 0 && (
          <div className="bg-surface-card p-6 rounded-2xl border border-border-subtle shadow-level-1">
            <div className="flex items-center justify-between mb-4 border-b border-border-subtle pb-3">
              <h3 className="font-headline-md text-lg font-bold text-on-background mb-0">My Active Student Requirements</h3>
              <span className="text-xs text-outline font-medium">Remove requirements once fulfilled</span>
            </div>

            <div className="space-y-3">
              {myRequests.map(req => (
                <div
                  key={req.id}
                  className="bg-surface-container-low dark:bg-slate-800 p-3.5 rounded-xl border border-border-subtle flex items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-on-background">{req.title}</span>
                      {req.urgent && (
                        <Badge className="bg-error-container text-error text-[10px]">Urgent</Badge>
                      )}
                      <Badge className="bg-surface-card text-on-surface-variant text-[10px] border border-border-subtle">
                        {req.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-outline mb-0 mt-0.5">
                      Budget: {req.budget} • Preferred Spot: {req.preferredMeetup}
                    </p>
                  </div>

                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => deleteRequest(req.id)}
                    className="text-xs py-1 px-3 rounded-lg"
                  >
                    Remove Requirement
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <Modal show={!!itemToDelete} onHide={() => setItemToDelete(null)} centered size="sm">
          <div className="bg-surface-card p-5 rounded-2xl border border-border-subtle text-on-background">
            <h4 className="font-bold text-base mb-2">Delete Campus Listing?</h4>
            <p className="text-xs text-outline mb-4">
              Are you sure you want to permanently delete "{itemToDelete?.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="light" onClick={() => setItemToDelete(null)} className="text-xs font-semibold">
                Cancel
              </Button>
              <Button size="sm" variant="danger" onClick={confirmDelete} className="text-xs font-semibold">
                Yes, Delete
              </Button>
            </div>
          </div>
        </Modal>
      </Container>
    </div>
  );
};
