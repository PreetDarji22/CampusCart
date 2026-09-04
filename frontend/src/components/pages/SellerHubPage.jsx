import React from 'react';
import { Container, Row, Col, Card, Button, Badge, Table } from 'react-bootstrap';
import { useApp } from '../../context/AppContext';

export const SellerHubPage = () => {
  const {
    products,
    myListingIds,
    currentUser,
    setIsAddListingOpen,
    markAsSold,
    deleteListing,
    setSelectedProduct
  } = useApp();

  const myProducts = products.filter(p => myListingIds.includes(p.id));
  const activeCount = myProducts.filter(p => !p.sold).length;
  const soldCount = myProducts.filter(p => p.sold).length;
  const totalRevenue = myProducts.reduce((acc, curr) => acc + (curr.sold ? curr.price : 0), 0);
  const totalViews = myProducts.reduce((acc, curr) => acc + (curr.views || 10), 0);

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
                </div>
                <p className="text-sm text-outline mb-0">
                  {currentUser.department} • {currentUser.year} • Roll No: {currentUser.rollNumber}
                </p>
              </div>
            </div>

            <Button
              onClick={() => setIsAddListingOpen(true)}
              className="bg-vibrant-indigo hover:bg-primary-container border-0 text-white font-semibold px-5 py-2.5 rounded-xl shadow-level-1 hover:shadow-level-2 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined">add_circle</span>
              Post New Campus Listing
            </Button>
          </div>
        </div>

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
        <div className="bg-surface-card p-6 rounded-2xl border border-border-subtle shadow-level-1">
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
                className="bg-vibrant-indigo border-0 text-xs font-semibold rounded-full px-4 py-2"
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
                            onClick={() => deleteListing(item.id)}
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
      </Container>
    </div>
  );
};
