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
      className="rounded-3xl overflow-hidden"
    >
      <Modal.Header closeButton className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-3.5">
        <Modal.Title className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400">campaign</span>
          Post Student Requirement / Wanted Item
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
          Can't find what you need on the marketplace? Post a student requirement so peers across your campus or hostel can reach out to you directly!
        </p>

        <Form onSubmit={handleSubmit}>
          {errorMsg && (
            <div className="bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs p-3 rounded-xl mb-3 font-medium">
              {errorMsg}
            </div>
          )}

          <Row className="g-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">What are you looking for? *</Form.Label>
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
                <Form.Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Category *</Form.Label>
                <Form.Select name="category" value={formData.category} onChange={handleChange}>
                  {CATEGORIES.filter(c => c !== 'All Categories').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Target Academic Department</Form.Label>
                <Form.Select name="department" value={formData.department} onChange={handleChange}>
                  {DEPARTMENTS.filter(d => d !== 'All Departments').map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Target Budget / Price Willing to Pay (₹)</Form.Label>
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
                <Form.Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Preferred Campus Meetup Spot</Form.Label>
                <Form.Select name="preferredMeetup" value={formData.preferredMeetup} onChange={handleChange}>
                  {CAMPUS_MEETUP_SPOTS.map(spot => (
                    <option key={spot} value={spot}>{spot}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={12}>
              <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
                <Form.Check
                  type="switch"
                  id="urgent-switch"
                  name="urgent"
                  label={
                    <span className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-rose-500">timer</span>
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
                <Form.Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Details & Condition Requirements *</Form.Label>
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

          <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 sticky bottom-0 bg-white dark:bg-slate-900 py-2">
            <button
              type="button"
              onClick={() => setIsPostRequestOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">send</span>
              Post Request on Bulletin
            </button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
