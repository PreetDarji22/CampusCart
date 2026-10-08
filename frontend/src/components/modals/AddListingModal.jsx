import React, { useState, useRef } from 'react';
import { Modal, Form, Row, Col } from 'react-bootstrap';
import {
  UploadCloud,
  Image as ImageIcon,
  Sparkles,
  Link2,
  Trash2,
  CheckCircle2,
  Layers,
  HelpCircle,
  Store
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  CATEGORIES,
  DEPARTMENTS,
  CAMPUS_MEETUP_SPOTS,
  CATEGORY_DEFAULT_IMAGES,
  QUICK_IMAGE_PRESETS
} from '../../services/mockData';
import { CaptchaWidget } from '../common/CaptchaWidget';
import { createProductApi, uploadImageApi } from '../../services/api';

export const AddListingModal = () => {
  const { isAddListingOpen, setIsAddListingOpen, addNewListing, triggerToast, setIsAuthOpen } = useApp();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Textbooks',
    department: 'Computer Science & Engineering (CSE / CS)',
    price: '',
    originalPrice: '',
    condition: 'Like New',
    meetupLocation: CAMPUS_MEETUP_SPOTS[0],
    image: '',
    description: ''
  });

  const [rawFile, setRawFile] = useState(null);
  const [imageMode, setImageMode] = useState('upload'); // 'upload' | 'presets' | 'url'
  const [isDragging, setIsDragging] = useState(false);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  const fallbackImageForCategory = CATEGORY_DEFAULT_IMAGES[formData.category] || CATEGORY_DEFAULT_IMAGES['Textbooks'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleFileUpload = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Image file size should be less than 5MB.');
      return;
    }

    setRawFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData(prev => ({ ...prev, image: event.target.result }));
      setErrorMsg('');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleSelectPreset = (presetUrl) => {
    setFormData(prev => ({ ...prev, image: presetUrl }));
    setErrorMsg('');
  };

  const handleClearImage = () => {
    setFormData(prev => ({ ...prev, image: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!isCaptchaVerified) {
      setErrorMsg('Please complete the CAPTCHA anti-spam verification before publishing.');
      return;
    }

    if (!formData.title || !formData.price || !formData.description) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      // If user has not chosen or uploaded an image, automatically assign the category default image
      let finalImage = formData.image?.trim() || fallbackImageForCategory;

      if (rawFile && imageMode === 'upload') {
        try {
          const uploadRes = await uploadImageApi(rawFile);
          if (uploadRes?.url) {
            finalImage = uploadRes.url;
          }
        } catch (uploadErr) {
          console.log('[Upload API Note, utilizing direct image payload]:', uploadErr.message);
        }
      }

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

      // Submitting through AppContext addNewListing (creates product once in MongoDB & updates state)
      await addNewListing(newProductPayload);

      setIsAddListingOpen(false);
      setIsCaptchaVerified(false);
      setRawFile(null);
      setFormData({
        title: '',
        category: 'Textbooks',
        department: 'Computer Science & Engineering (CSE / CS)',
        price: '',
        originalPrice: '',
        condition: 'Like New',
        meetupLocation: CAMPUS_MEETUP_SPOTS[0],
        image: '',
        description: ''
      });
      setErrorMsg('');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to publish listing.');
    } finally {
      setIsSubmitting(false);
    }
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
          <Store className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span>Post New Campus Listing</span>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" style={{ maxHeight: '78vh', overflowY: 'auto' }}>
        <Form onSubmit={handleSubmit}>
          {errorMsg && (
            <div className="bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs p-3 rounded-xl mb-3 font-medium flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0"></span>
                <span>{errorMsg}</span>
              </div>
              {(errorMsg.toLowerCase().includes('token') || errorMsg.toLowerCase().includes('log in') || errorMsg.toLowerCase().includes('authorized')) && (
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem('campuscart_token');
                    setIsAuthOpen(true);
                  }}
                  className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-[11px] rounded-lg transition-all ml-auto flex-shrink-0"
                >
                  Sign In Again
                </button>
              )}
            </div>
          )}

          <Row className="g-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Item Title *</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  placeholder="e.g. CS106B Textbook / Casio FX-991EX Calculator / Study Lamp"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs rounded-xl"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Category *</Form.Label>
                <Form.Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs rounded-xl"
                >
                  {CATEGORIES.filter(c => c !== 'All Categories').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Academic Department</Form.Label>
                <Form.Select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs rounded-xl"
                >
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
                  className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs rounded-xl"
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
                  className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs rounded-xl"
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Item Condition *</Form.Label>
                <Form.Select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs rounded-xl"
                >
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
                  className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs rounded-xl"
                >
                  {CAMPUS_MEETUP_SPOTS.map(spot => (
                    <option key={spot} value={spot}>{spot}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            {/* --- Dedicated Campus Image Picker Section --- */}
            <Col md={12}>
              <div className="bg-slate-50/80 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Item Photo</span>
                    <span className="text-[11px] text-slate-500 font-normal">(Optional — auto-assigned if skipped)</span>
                  </div>

                  {/* Mode switcher tabs */}
                  <div className="flex items-center bg-slate-200/70 dark:bg-slate-700/70 p-0.5 rounded-lg text-[11px] self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setImageMode('upload')}
                      className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer flex items-center gap-1 ${
                        imageMode === 'upload'
                          ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Upload</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMode('presets')}
                      className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer flex items-center gap-1 ${
                        imageMode === 'presets'
                          ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Campus Presets</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMode('url')}
                      className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer flex items-center gap-1 ${
                        imageMode === 'url'
                          ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Link2 className="w-3.5 h-3.5" />
                      <span>Paste URL</span>
                    </button>
                  </div>
                </div>

                {/* 1. Upload Option */}
                {imageMode === 'upload' && (
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e.target.files[0])}
                      className="hidden"
                    />

                    {!formData.image ? (
                      <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                          isDragging
                            ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 scale-[0.99]'
                            : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-2">
                          <UploadCloud className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-0.5">
                          Click to browse or drag & drop photo
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-0">
                          Supports PNG, JPG, JPEG, WEBP (Max 5MB)
                        </p>
                      </div>
                    ) : null}
                  </div>
                )}

                {/* 2. Campus Preset Library Option */}
                {imageMode === 'presets' && (
                  <div className="space-y-2">
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-1.5">
                      Select a curated campus photo for quick listing:
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 max-h-48 overflow-y-auto p-1">
                      {QUICK_IMAGE_PRESETS.map((preset, idx) => {
                        const isSelected = formData.image === preset.url;
                        return (
                          <div
                            key={idx}
                            onClick={() => handleSelectPreset(preset.url)}
                            className={`relative group rounded-xl overflow-hidden border cursor-pointer transition-all ${
                              isSelected
                                ? 'border-indigo-600 ring-2 ring-indigo-500/50 scale-[0.98]'
                                : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500'
                            }`}
                          >
                            <img
                              src={preset.url}
                              alt={preset.label}
                              className="w-full h-16 object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="p-1 bg-white dark:bg-slate-900 text-center">
                              <p className="text-[10px] font-medium text-slate-700 dark:text-slate-300 truncate mb-0">
                                {preset.label}
                              </p>
                            </div>
                            {isSelected && (
                              <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                                <CheckCircle2 className="w-3 h-3" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3. URL Input Option */}
                {imageMode === 'url' && (
                  <div>
                    <Form.Control
                      type="url"
                      placeholder="https://example.com/item-photo.jpg"
                      value={formData.image}
                      onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                      className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs rounded-xl"
                    />
                  </div>
                )}

                {/* Active Photo Preview & Fallback Indicator */}
                {formData.image ? (
                  <div className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-indigo-200 dark:border-indigo-900/60">
                    <div className="flex items-center gap-3">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-14 h-14 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                      />
                      <div>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Custom Photo Selected
                        </span>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-0">
                          Will be displayed as primary cover image
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleClearImage}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-2.5 bg-indigo-50/60 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/40">
                    <img
                      src={fallbackImageForCategory}
                      alt="Category Fallback"
                      className="w-12 h-12 rounded-lg object-cover border border-indigo-200 dark:border-indigo-800 opacity-90"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold text-indigo-900 dark:text-indigo-300 mb-0 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                        <span>Auto-Category Image Fallback Active</span>
                      </p>
                      <p className="text-[10.5px] text-slate-600 dark:text-slate-400 mb-0 truncate">
                        Using curated default photo for <strong>{formData.category}</strong>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Col>

            <Col md={12}>
              <Form.Group>
                <Form.Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Detailed Description *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  placeholder="Provide semester details, included accessories, condition notes, or reason for selling..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs rounded-xl"
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
              disabled={!isCaptchaVerified || isSubmitting}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-indigo-500/20 cursor-pointer flex items-center gap-1.5 transition-all"
            >
              <Store className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Publishing...' : 'Publish Listing'}</span>
            </button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
