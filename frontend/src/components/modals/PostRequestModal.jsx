import React, { useState } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { useApp } from '../../context/AppContext';
import { CATEGORIES, DEPARTMENTS, CAMPUS_MEETUP_SPOTS } from '../../services/mockData';

export const PostRequestModal = () => {
  const { isPostRequestOpen, setIsPostRequestOpen, addNewRequest, requireAuth, triggerToast } = useApp();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Electronics',
    department: 'Computer Science',
    budget: '',
    urgent: false,
    preferredMeetup: CAMPUS_MEETUP_SPOTS[0],
    description: ''
  });

  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!requireAuth()) return;

    if (!formData.title.trim() || !formData.description.trim()) {
      setErrorMsg('Please provide a title and short description for your request.');
      return;
    }

    const newRequestPayload = {
      title: formData.title.trim(),
      category: formData.category,
      department: formData.department,
      budget: formData.budget ? `₹${formData.budget}` : 'Negotiable',
      urgent: formData.urgent,
      preferredMeetup: formData.preferredMeetup,
      description: formData.description.trim()
    };

    addNewRequest(newRequestPayload);
    setIsPostRequestOpen(false);
    setFormData({
      title: '',
      category: 'Electronics',
      department: 'Computer Science',
      budget: '',
      urgent: false,
      preferredMeetup: CAMPUS_MEETUP_SPOTS[0],
      description: ''
    });
    setErrorMsg('');
  };

  return (
    <Modal
      show={isPostRequestOpen}
      onHide={() => setIsPostRequestOpen(false)}
      size="lg"
      centered
      className="rounded-2xl overflow-hidden"
    >
      <Modal.Header closeButton className="border-b border-border-subtle bg-surface-container-low px-4 py-3">
        <Modal.Title className="text-lg font-headline-md font-bold text-on-background flex items-center gap-2">
          <span className="material-symbols-outlined text-vibrant-indigo">campaign</span>
          Post Student Requirement / Wanted Item
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4 bg-surface-card" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
        <p className="text-xs text-outline mb-3">
          Can't find what you need on the marketplace? Post a student requirement so peers across your campus or hostel can reach out to you directly!
        </p>

        <Form onSubmit={handleSubmit}>
          {errorMsg && (
            <div className="bg-error-container text-error text-xs p-3 rounded-lg mb-3 font-medium">
              {errorMsg}
            </div>
          )}

          <Row className="g-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label className="text-xs font-label-md text-on-surface">What are you looking for? *</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  placeholder="e.g. Casio FX-991EX Calculator / CS106B Textbook / Drafter Kit"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-xs font-label-md text-on-surface">Category *</Form.Label>
                <Form.Select name="category" value={formData.category} onChange={handleChange}>
                  {CATEGORIES.filter(c => c !== 'All Categories').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-xs font-label-md text-on-surface">Target Academic Department</Form.Label>
                <Form.Select name="department" value={formData.department} onChange={handleChange}>
                  {DEPARTMENTS.filter(d => d !== 'All Departments').map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-xs font-label-md text-on-surface">Target Budget / Price Willing to Pay (₹)</Form.Label>
                <Form.Control
                  type="number"
                  name="budget"
                  placeholder="e.g. 500 (Optional)"
                  value={formData.budget}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-xs font-label-md text-on-surface">Preferred Campus Meetup Spot</Form.Label>
                <Form.Select name="preferredMeetup" value={formData.preferredMeetup} onChange={handleChange}>
                  {CAMPUS_MEETUP_SPOTS.map(spot => (
                    <option key={spot} value={spot}>{spot}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={12}>
              <div className="bg-surface-container-low p-3 rounded-xl border border-border-subtle">
                <Form.Check
                  type="switch"
                  id="urgent-switch"
                  name="urgent"
                  label={
                    <span className="text-xs font-semibold text-on-background flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-error-red">timer</span>
                      Mark as Urgent Requirement (Needed within 24-48 Hours)
                    </span>
                  }
                  checked={formData.urgent}
                  onChange={handleChange}
                />
              </div>
            </Col>

            <Col md={12}>
              <Form.Group>
                <Form.Label className="text-xs font-label-md text-on-surface">Details & Condition Requirements *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  placeholder="Mention edition, required condition, course codes, or when and where you need it..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-border-subtle sticky bottom-0 bg-surface-card py-2">
            <Button variant="light" onClick={() => setIsPostRequestOpen(false)} className="text-xs font-semibold">
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-vibrant-indigo border-0 text-xs font-semibold px-4 py-2 text-white shadow-sm flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">send</span>
              Post Request on Bulletin
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
