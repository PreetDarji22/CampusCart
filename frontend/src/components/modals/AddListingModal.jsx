import React, { useState } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { useApp } from '../../context/AppContext';
import { CATEGORIES, DEPARTMENTS, CAMPUS_MEETUP_SPOTS } from '../../services/mockData';
import { CaptchaWidget } from '../common/CaptchaWidget';
import { createProductApi } from '../../services/api';

export const AddListingModal = () => {
  const { isAddListingOpen, setIsAddListingOpen, addNewListing, triggerToast } = useApp();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Textbooks',
    department: 'Computer Science',
    price: '',
    originalPrice: '',
    condition: 'Like New',
    meetupLocation: CAMPUS_MEETUP_SPOTS[0],
    image: '',
    description: ''
  });

  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isCaptchaVerified) {
      setErrorMsg('Please complete the CAPTCHA anti-spam verification before publishing.');
      return;
    }

    if (!formData.title || !formData.price || !formData.description) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    const defaultImages = {
      'Textbooks': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600',
      'Electronics': 'https://images.unsplash.com/photo-1611125832047-1d7ad1e8e48b?w=600',
      'Clothing': 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600',
      'Dorm Essentials': 'https://images.unsplash.com/photo-1580481072645-022f9a6d1209?w=600'
    };

    const finalImage = formData.image.trim() || defaultImages[formData.category] || defaultImages['Textbooks'];

    const newProductPayload = {
      title: formData.title,
      category: formData.category,
      department: formData.department,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
      condition: formData.condition,
      description: formData.description,
      meetupLocation: formData.meetupLocation,
      images: [finalImage],
      image: finalImage
    };

    try {
      await createProductApi(newProductPayload);
    } catch (err) {
      console.log('[API Note] Product saved locally in state.');
    }

    addNewListing(newProductPayload);

    setIsAddListingOpen(false);
    setIsCaptchaVerified(false);
    setFormData({
      title: '',
      category: 'Textbooks',
      department: 'Computer Science',
      price: '',
      originalPrice: '',
      condition: 'Like New',
      meetupLocation: 'Campus Library Lobby',
      image: '',
      description: ''
    });
    setErrorMsg('');
  };

  return (
    <Modal
      show={isAddListingOpen}
      onHide={() => setIsAddListingOpen(false)}
      size="lg"
      centered
      className="rounded-3xl overflow-hidden"
    >
      <Modal.Header closeButton className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-3.5">
        <Modal.Title className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400">storefront</span>
          Post New Campus Listing
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
        <Form onSubmit={handleSubmit}>
          {errorMsg && (
            <div className="bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs p-3 rounded-xl mb-3 font-medium">
              {errorMsg}
            </div>
          )}

          <Row className="g-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Item Title *</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  placeholder="e.g. CS106B Textbook / Boosted Electric Skateboard"
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
                <Form.Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Academic Department</Form.Label>
                <Form.Select name="department" value={formData.department} onChange={handleChange}>
                  {DEPARTMENTS.filter(d => d !== 'All Departments').map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Selling Price (₹) *</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  placeholder="250"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Original Price (₹)</Form.Label>
                <Form.Control
                  type="number"
                  name="originalPrice"
                  placeholder="600 (optional)"
                  value={formData.originalPrice}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Item Condition *</Form.Label>
                <Form.Select name="condition" value={formData.condition} onChange={handleChange}>
                  <option value="New">Brand New</option>
                  <option value="Like New">Like New</option>
                  <option value="Good">Good Condition</option>
                  <option value="Fair">Fair / Functional</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group>
                <Form.Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Safe Campus Meetup Spot</Form.Label>
                <Form.Select
                  name="meetupLocation"
                  value={formData.meetupLocation}
                  onChange={handleChange}
                >
                  {CAMPUS_MEETUP_SPOTS.map(spot => (
                    <option key={spot} value={spot}>{spot}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group>
                <Form.Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Photo URL (Optional)</Form.Label>
                <Form.Control
                  type="url"
                  name="image"
                  placeholder="https://example.com/item-photo.jpg (Leave empty for default)"
                  value={formData.image}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group>
                <Form.Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Detailed Description *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  placeholder="Provide semester details, included accessories, or reasons for selling..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={12}>
              <CaptchaWidget onVerify={(status) => setIsCaptchaVerified(status)} />
            </Col>
          </Row>

          <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 sticky bottom-0 bg-white dark:bg-slate-900 py-2">
            <button
              type="button"
              onClick={() => setIsAddListingOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isCaptchaVerified}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-indigo-500/20 cursor-pointer"
            >
              Publish Listing
            </button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
