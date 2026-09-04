import React, { useState } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { useApp } from '../../context/AppContext';
import { CATEGORIES, DEPARTMENTS } from '../../services/mockData';
import { CaptchaWidget } from '../common/CaptchaWidget';

export const AddListingModal = () => {
  const { isAddListingOpen, setIsAddListingOpen, addNewListing } = useApp();

  const [formData, setFormData] = useState({
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

  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
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
      'Textbooks': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjg4urMZUMU-nM6gfR_o-mNvhkXPnzEHvgoPcvIYT-JpLLqLfJGp2Bqv1i5qH5Z6E0fHgr2WWMqRvFz45y3xPE-6g3ZqWW2WemLcLMMhLCYoaOzBO3CBV8d_PaRC3q1NCAyRdPlbQObNWv54sObTi4VMLXshnQ1DJiRGIc2XANzatJH_RcCQZhnQni5Q9Y6ZrhyjQMwrDTloVntAaQntfdvz_llRntFPeyJb1Z3YRCwY7gjFCOhZ_KcQ',
      'Electronics': 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvKhPaF0lZm7ulpOk4vWNHJAS3ECKD5dl08g9tWhjGB4XqrTBQHjfW-TBbznW9LH4Pcy-0YnH7F5U7AX8peqywWQgMj3jqqTRvUOtFVcKSVb1WFoki_0p0yNK2FZnMnHiU6MFK8aMjs-eTd1-2e94w6YOdac9ZRr-eauI4pbqm2Z-o0QoMBotEWJ9e7mVi3dHiUe7V0Kzl8z04iRtc4cXpTX4qOB_y1Jz2fE6-HcHPP5dRQ-5bWMxzEQ',
      'Clothing': 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNn2ZDulh0FRgocjuiPiJkIFTQVWdWBLatmIvd5w6keQSeEZtVuyw52lAUEPPSBbF4XJnT4UaARxtuMqZ5EcAJPfQmBtluzhEUIfqb-8TU-HtCvcIW__IoBNmsulfzF6wMvhM8E4jEXs6ajkng5CQ7Hz_LMPuls8KVNAA1P7wxiYTnTo2Im-N7yVaif1-kjYE96cMdCoB61RYR6Je7JAPt3O8SKqGjhUt1R8KkzIk12HmenRQ3Qkrp7A',
      'Dorm Essentials': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAQJk9TzvUVB06wu6830YdFiJH2aAJOMyXbUH4X6ZGj1SdaAHzm0V9x3gI74KvM2FxI7X2tD44galtBuTzCvVGNq66xvwBdC1AuFXoVMhUybUS7LxVZ6cfqSyfrApauvBn15ZbM5hojSrM5dzAa3N6VRSUw96PiaXphZ1j431DjkEBo8LVPzLe7ZgK1J7AZuLKXknYYC33ZG4tTYx89mVPRnOtOkmhIyAQzKT0B0WfEghEKyvCTb_alQ'
    };

    const finalImage = formData.image.trim() || defaultImages[formData.category] || defaultImages['Textbooks'];

    addNewListing({
      title: formData.title,
      category: formData.category,
      department: formData.department,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
      condition: formData.condition,
      description: formData.description,
      meetupLocation: formData.meetupLocation,
      image: finalImage
    });

    setIsAddListingOpen(false);
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
      className="rounded-2xl overflow-hidden"
    >
      <Modal.Header closeButton className="border-b border-border-subtle bg-surface-container-low px-4 py-3">
        <Modal.Title className="text-lg font-headline-md font-bold text-on-background flex items-center gap-2">
          <span className="material-symbols-outlined text-vibrant-indigo">storefront</span>
          Post New Campus Listing
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4 bg-surface-card" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
        <Form onSubmit={handleSubmit}>
          {errorMsg && (
            <div className="bg-error-container text-error text-xs p-3 rounded-lg mb-3 font-medium">
              {errorMsg}
            </div>
          )}

          <Row className="g-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label className="text-xs font-label-md text-on-surface">Item Title *</Form.Label>
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
                <Form.Label className="text-xs font-label-md text-on-surface">Academic Department</Form.Label>
                <Form.Select name="department" value={formData.department} onChange={handleChange}>
                  {DEPARTMENTS.filter(d => d !== 'All Departments').map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label className="text-xs font-label-md text-on-surface">Selling Price (₹) *</Form.Label>
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
                <Form.Label className="text-xs font-label-md text-on-surface">Original Price (₹)</Form.Label>
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
                <Form.Label className="text-xs font-label-md text-on-surface">Item Condition *</Form.Label>
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
                <Form.Label className="text-xs font-label-md text-on-surface">Safe Campus Meetup Location</Form.Label>
                <Form.Control
                  type="text"
                  name="meetupLocation"
                  placeholder="e.g. Central Library Lobby / Student Union Lounge"
                  value={formData.meetupLocation}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group>
                <Form.Label className="text-xs font-label-md text-on-surface">Photo URL (Optional)</Form.Label>
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
                <Form.Label className="text-xs font-label-md text-on-surface">Detailed Description *</Form.Label>
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

          <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-border-subtle sticky bottom-0 bg-surface-card py-2">
            <Button variant="light" onClick={() => setIsAddListingOpen(false)} className="text-xs font-semibold">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isCaptchaVerified}
              className="bg-vibrant-indigo border-0 text-xs font-semibold px-4 py-2 text-white shadow-sm"
            >
              Publish Listing
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
