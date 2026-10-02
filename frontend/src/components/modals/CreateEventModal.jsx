import React, { useState } from 'react';
import { Modal, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useApp } from '../../context/AppContext';

export const CreateEventModal = () => {
  const { isCreateEventOpen, setIsCreateEventOpen, addNewEvent, triggerToast } = useApp();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Hackathon',
    date: '',
    time: '09:00 AM - 05:00 PM',
    venue: '',
    entryFee: '0',
    totalSlots: '150',
    gearTag: 'Microcontrollers & Sensors in High Demand',
    organizer: 'Engineering Student Council & Faculty',
    description: ''
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.date.trim() || !formData.venue.trim() || !formData.description.trim()) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      await addNewEvent({
        ...formData,
        entryFee: Number(formData.entryFee) || 0,
        totalSlots: Number(formData.totalSlots) || 100
      });
      setIsCreateEventOpen(false);
      setFormData({
        title: '',
        category: 'Hackathon',
        date: '',
        time: '09:00 AM - 05:00 PM',
        venue: '',
        entryFee: '0',
        totalSlots: '150',
        gearTag: 'Microcontrollers & Sensors in High Demand',
        organizer: 'Engineering Student Council & Faculty',
        description: ''
      });
    } catch (err) {
      setErrorMsg(err.message || 'Failed to publish event.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={isCreateEventOpen} onHide={() => setIsCreateEventOpen(false)} centered size="lg">
      <div className="bg-surface dark:bg-slate-900 border border-border-subtle dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-on-surface dark:text-slate-100">
        <Modal.Header closeButton className="border-b-0 pb-0">
          <div>
            <span className="text-[11px] font-bold text-amber-500 uppercase tracking-widest bg-amber-50 dark:bg-amber-950/50 px-2.5 py-0.5 rounded-md">
              🛡️ Admin & Faculty Portal
            </span>
            <Modal.Title className="font-display font-bold text-2xl text-vibrant-indigo mt-1">
              Publish Campus Event 🎪
            </Modal.Title>
          </div>
        </Modal.Header>

        <Modal.Body className="pt-4">
          {errorMsg && <Alert variant="danger" className="py-2 text-xs rounded-xl">{errorMsg}</Alert>}

          <Form onSubmit={handleSubmit} className="space-y-4">
            <Form.Group>
              <Form.Label className="text-xs font-bold uppercase tracking-wider">Event Title *</Form.Label>
              <Form.Control
                type="text"
                name="title"
                required
                placeholder="e.g. Annual Tech Symposium & Hackathon 2026"
                value={formData.title}
                onChange={handleChange}
                className="rounded-xl border-border-subtle bg-surface-container-low dark:bg-slate-800 py-2.5 text-sm"
              />
            </Form.Group>

            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="text-xs font-bold uppercase tracking-wider">Category *</Form.Label>
                  <Form.Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="rounded-xl border-border-subtle bg-surface-container-low dark:bg-slate-800 text-xs py-2.5"
                  >
                    <option value="Hackathon">Hackathon</option>
                    <option value="Exhibition">Exhibition / Expo</option>
                    <option value="Tech Fest">Tech Fest</option>
                    <option value="Workshop">Hands-on Workshop</option>
                    <option value="Sports">Sports Tournament</option>
                    <option value="Cultural">Cultural Fest</option>
                    <option value="Other">Other Event</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="text-xs font-bold uppercase tracking-wider">Organizer Committee</Form.Label>
                  <Form.Control
                    type="text"
                    name="organizer"
                    placeholder="e.g. IEEE / CSI / Robotics Club"
                    value={formData.organizer}
                    onChange={handleChange}
                    className="rounded-xl border-border-subtle bg-surface-container-low dark:bg-slate-800 py-2.5 text-xs"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="text-xs font-bold uppercase tracking-wider">Event Date(s) *</Form.Label>
                  <Form.Control
                    type="text"
                    name="date"
                    required
                    placeholder="e.g. Oct 24 - 26, 2026"
                    value={formData.date}
                    onChange={handleChange}
                    className="rounded-xl border-border-subtle bg-surface-container-low dark:bg-slate-800 py-2.5 text-xs"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="text-xs font-bold uppercase tracking-wider">Timings</Form.Label>
                  <Form.Control
                    type="text"
                    name="time"
                    placeholder="e.g. 09:00 AM - 05:30 PM"
                    value={formData.time}
                    onChange={handleChange}
                    className="rounded-xl border-border-subtle bg-surface-container-low dark:bg-slate-800 py-2.5 text-xs"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="text-xs font-bold uppercase tracking-wider">Campus Venue / Hall *</Form.Label>
                  <Form.Control
                    type="text"
                    name="venue"
                    required
                    placeholder="e.g. Central Auditorium & Innovation Lab"
                    value={formData.venue}
                    onChange={handleChange}
                    className="rounded-xl border-border-subtle bg-surface-container-low dark:bg-slate-800 py-2.5 text-xs"
                  />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label className="text-xs font-bold uppercase tracking-wider">Ticket Fee (₹)</Form.Label>
                  <Form.Control
                    type="number"
                    name="entryFee"
                    min="0"
                    placeholder="0 for Free"
                    value={formData.entryFee}
                    onChange={handleChange}
                    className="rounded-xl border-border-subtle bg-surface-container-low dark:bg-slate-800 py-2.5 text-xs"
                  />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label className="text-xs font-bold uppercase tracking-wider">Capacity Slots</Form.Label>
                  <Form.Control
                    type="number"
                    name="totalSlots"
                    min="10"
                    placeholder="150"
                    value={formData.totalSlots}
                    onChange={handleChange}
                    className="rounded-xl border-border-subtle bg-surface-container-low dark:bg-slate-800 py-2.5 text-xs"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group>
              <Form.Label className="text-xs font-bold uppercase tracking-wider">Marketplace Gear / Equipment Tag</Form.Label>
              <Form.Control
                type="text"
                name="gearTag"
                placeholder="e.g. Arduino Kits, Soldering Irons & Breadboards Wanted"
                value={formData.gearTag}
                onChange={handleChange}
                className="rounded-xl border-border-subtle bg-surface-container-low dark:bg-slate-800 py-2 text-xs"
              />
            </Form.Group>

            <Form.Group>
              <Form.Label className="text-xs font-bold uppercase tracking-wider">Event Details & Guidelines *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                required
                placeholder="Provide event overview, schedule highlights, rules, and eligibility..."
                value={formData.description}
                onChange={handleChange}
                className="rounded-xl border-border-subtle bg-surface-container-low dark:bg-slate-800 text-xs"
              />
            </Form.Group>

            <div className="flex justify-end gap-3 pt-3 border-t border-border-subtle">
              <Button
                variant="outline-secondary"
                onClick={() => setIsCreateEventOpen(false)}
                className="rounded-xl text-xs font-semibold px-4"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-vibrant-indigo hover:bg-primary-container text-white font-bold py-2 px-6 rounded-xl border-0 shadow-md text-xs"
              >
                {loading ? 'Saving to Database...' : 'Publish Event to Campus 🚀'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </div>
    </Modal>
  );
};
