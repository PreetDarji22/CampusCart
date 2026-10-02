import React, { useState } from 'react';
import { Modal, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useApp } from '../../context/AppContext';
import { DEPARTMENTS } from '../../services/mockData';

export const EventTicketModal = () => {
  const {
    selectedEventForTicket,
    setSelectedEventForTicket,
    registerForEvent,
    currentUser,
    requireAuth,
    triggerToast
  } = useApp();

  const [ticketsCount, setTicketsCount] = useState(1);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    rollNumber: currentUser?.rollNumber || '',
    department: currentUser?.department || 'Computer Science & Engineering (CSE / CS)'
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [ticketPass, setTicketPass] = useState(null);

  if (!selectedEventForTicket) return null;

  const event = selectedEventForTicket;
  const isFree = !event.entryFee || event.entryFee === 0;
  const totalAmount = (event.entryFee || 0) * ticketsCount;
  const slotsRemaining = (event.totalSlots || 100) - (event.registeredCount || 0);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!requireAuth()) return;

    if (!formData.name || !formData.email) {
      setErrorMsg('Please provide name and college email.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const ticketResult = await registerForEvent(event.id, {
        ...formData,
        ticketsCount,
        amountPaid: totalAmount,
        eventTitle: event.title,
        venue: event.venue,
        date: event.date,
        time: event.time
      });

      setTicketPass(ticketResult);
      triggerToast(`🎉 Ticket booked for ${event.title}!`, 'Event Pass Confirmed');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Booking failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedEventForTicket(null);
    setTicketPass(null);
    setErrorMsg('');
  };

  return (
    <Modal show={Boolean(selectedEventForTicket)} onHide={handleClose} centered size="md">
      <div className="bg-surface dark:bg-slate-900 border border-border-subtle dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-on-surface dark:text-slate-100">
        <Modal.Header closeButton className="border-b-0 pb-0">
          <Modal.Title className="font-display font-bold text-xl text-vibrant-indigo">
            {ticketPass ? 'Campus Digital Ticket Pass 🎫' : 'Event Registration & Tickets 🎟️'}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="pt-3">
          {errorMsg && <Alert variant="danger" className="py-2 text-xs rounded-xl">{errorMsg}</Alert>}

          {/* ================= SUCCESS TICKET PASS VIEW ================= */}
          {ticketPass ? (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white p-5 rounded-2xl border border-indigo-500/30 shadow-xl relative overflow-hidden">
                {/* Decorative background circle */}
                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-vibrant-indigo/20 rounded-full blur-xl"></div>

                <div className="flex justify-between items-start border-b border-indigo-500/20 pb-3 mb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded">
                      VERIFIED CAMPUS PASS
                    </span>
                    <h3 className="font-bold text-lg text-white mt-1 mb-0">{ticketPass.eventTitle || event.title}</h3>
                  </div>
                  <span className="font-mono text-xs text-amber-400 font-bold bg-amber-950/60 px-2 py-1 rounded">
                    {ticketPass.ticketId}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div>
                    <span className="text-slate-400 block text-[10px]">ATTENDEE</span>
                    <span className="font-semibold text-white">{ticketPass.attendeeName || formData.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">DEPARTMENT</span>
                    <span className="font-semibold text-white truncate block">{ticketPass.department || formData.department}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">DATE & TIME</span>
                    <span className="font-semibold text-white">{event.date}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">VENUE</span>
                    <span className="font-semibold text-white">{event.venue}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-dashed border-indigo-500/30">
                  <div className="flex items-center gap-2">
                    {/* Simulated QR Code Icon */}
                    <div className="w-10 h-10 bg-white p-1 rounded-lg flex items-center justify-center">
                      <span className="material-symbols-outlined text-[26px] text-slate-900">qr_code_2</span>
                    </div>
                    <div>
                      <span className="text-[11px] font-mono text-indigo-300 block">{ticketPass.ticketId}</span>
                      <span className="text-[10px] text-slate-400">Scan at Entry Gate</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">TICKETS</span>
                    <span className="font-bold text-fresh-mint text-sm">{ticketsCount} Pass ({isFree ? 'FREE' : `₹${totalAmount}`})</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    window.print();
                  }}
                  className="flex-1 bg-surface-container-low dark:bg-slate-800 text-on-surface font-semibold text-xs py-2.5 rounded-xl border border-border-subtle hover:bg-surface-card"
                >
                  🖨️ Print / Save PDF
                </Button>
                <Button
                  onClick={handleClose}
                  className="flex-1 bg-vibrant-indigo text-white font-bold text-xs py-2.5 rounded-xl border-0"
                >
                  Done
                </Button>
              </div>
            </div>
          ) : (
            /* ================= REGISTRATION FORM VIEW ================= */
            <Form onSubmit={handleBooking} className="space-y-4">
              {/* Event Quick Info Banner */}
              <div className="p-3 bg-surface-container-low dark:bg-slate-800 rounded-2xl border border-border-subtle space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-vibrant-indigo">{event.category}</span>
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    {slotsRemaining > 0 ? `${slotsRemaining} slots left` : 'Filling fast'}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-on-background">{event.title}</h4>
                <p className="text-xs text-outline mb-0">📍 {event.venue} | 🗓️ {event.date}</p>
              </div>

              <Form.Group>
                <Form.Label className="text-xs font-bold uppercase tracking-wider">Student Name *</Form.Label>
                <Form.Control
                  type="text"
                  required
                  placeholder="e.g. Alex Chen"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="rounded-xl border-border-subtle bg-surface-container-low dark:bg-slate-800 py-2 text-xs"
                />
              </Form.Group>

              <Form.Group>
                <Form.Label className="text-xs font-bold uppercase tracking-wider">College Email *</Form.Label>
                <Form.Control
                  type="email"
                  required
                  placeholder="student@college.edu"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="rounded-xl border-border-subtle bg-surface-container-low dark:bg-slate-800 py-2 text-xs"
                />
              </Form.Group>

              <Row className="g-2">
                <Col md={7}>
                  <Form.Group>
                    <Form.Label className="text-xs font-bold uppercase tracking-wider">Department</Form.Label>
                    <Form.Select
                      value={formData.department}
                      onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                      className="rounded-xl border-border-subtle bg-surface-container-low dark:bg-slate-800 text-xs py-2"
                    >
                      {DEPARTMENTS.filter(d => d !== 'All Departments').map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={5}>
                  <Form.Group>
                    <Form.Label className="text-xs font-bold uppercase tracking-wider">Tickets Count</Form.Label>
                    <Form.Select
                      value={ticketsCount}
                      onChange={(e) => setTicketsCount(Number(e.target.value))}
                      className="rounded-xl border-border-subtle bg-surface-container-low dark:bg-slate-800 text-xs py-2"
                    >
                      <option value="1">1 Ticket</option>
                      <option value="2">2 Tickets</option>
                      <option value="3">3 Tickets</option>
                      <option value="4">4 Tickets</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <div className="p-3 bg-vibrant-indigo/5 dark:bg-indigo-950/30 rounded-xl border border-vibrant-indigo/20 flex justify-between items-center">
                <div>
                  <span className="text-xs text-outline block">Total Payable</span>
                  <span className="font-bold text-base text-on-background">
                    {isFree ? 'FREE Entry 🎓' : `₹${totalAmount.toLocaleString('en-IN')}`}
                  </span>
                </div>
                <span className="text-[11px] text-fresh-mint font-semibold bg-fresh-mint/10 px-2 py-1 rounded-md">
                  Instant Digital Pass
                </span>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-vibrant-indigo hover:bg-primary-container text-white font-bold py-2.5 rounded-xl border-0 shadow-md text-xs"
              >
                {loading ? 'Generating Ticket Pass...' : isFree ? 'Confirm Free Registration 🚀' : `Pay ₹${totalAmount} & Get Digital Ticket 🎟️`}
              </Button>
            </Form>
          )}
        </Modal.Body>
      </div>
    </Modal>
  );
};
