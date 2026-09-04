import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useApp } from '../../context/AppContext';

export const AppFooter = () => {
  const { setActiveTab } = useApp();

  return (
    <footer className="w-full bg-on-background text-surface-variant/80 pt-12 pb-8 mt-16 border-t border-border-subtle/20">
      <Container maxwidth="7xl" className="px-margin-mobile md:px-margin-desktop">
        <Row className="gy-4">
          <Col lg={4} md={6}>
            <h2 className="font-display text-2xl font-bold text-white mb-3">CampusCart</h2>
            <p className="font-body-md text-sm text-surface-variant/70 max-w-sm mb-4">
              The secure, peer-to-peer campus marketplace designed specifically for university students. Trade textbooks, lab gear, tech, and dorm decor safely.
            </p>
            <p className="text-xs text-outline-variant">
              © {new Date().getFullYear()} CampusCart. Built for students, by students. GTU WAD Project.
            </p>
          </Col>

          <Col lg={2} md={3} sm={6}>
            <h5 className="font-label-md text-white font-semibold mb-3">Marketplace</h5>
            <ul className="list-unstyled space-y-2 text-sm">
              <li>
                <button onClick={() => setActiveTab('discover')} className="hover:text-white transition-colors">
                  Discover
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('browse')} className="hover:text-white transition-colors">
                  Browse Catalog
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('seller')} className="hover:text-white transition-colors">
                  Seller Hub
                </button>
              </li>
            </ul>
          </Col>

          <Col lg={3} md={3} sm={6}>
            <h5 className="font-label-md text-white font-semibold mb-3">Categories</h5>
            <ul className="list-unstyled space-y-2 text-sm">
              <li>Textbooks & Notes</li>
              <li>Laptops & Electronics</li>
              <li>Dorm Essentials & Decor</li>
              <li>Lab Equipment & Gear</li>
            </ul>
          </Col>

          <Col lg={3} md={12}>
            <h5 className="font-label-md text-white font-semibold mb-3">Campus Safety & Trust</h5>
            <div className="bg-surface-card/10 p-3 rounded-lg border border-white/10 text-xs text-surface-variant space-y-2">
              <div className="flex items-center gap-2 text-fresh-mint font-semibold">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                Verified Student Identity
              </div>
              <p className="leading-relaxed">
                All sellers are authenticated via university college credentials. Safe meetups at campus library lobby or student center.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};
