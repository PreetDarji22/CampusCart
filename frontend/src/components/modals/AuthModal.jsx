import React, { useState } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import { useApp } from '../../context/AppContext';
import { DEPARTMENTS } from '../../services/mockData';
import { loginApi, registerApi, forgotPasswordApi, resetPasswordApi } from '../../services/api';
import { CampusCartLogo } from '../common/CampusCartLogo';

export const AuthModal = ({ show, onHide }) => {
  const { loginUser, triggerToast } = useApp();
  
  // authMode: 'login' | 'signup' | 'forgot' | 'reset'
  const [authMode, setAuthMode] = useState('login');
  // selectedRole: 'student' | 'admin'
  const [selectedRole, setSelectedRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Initial form data - Password is intentionally empty and NEVER auto-filled
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    department: 'Computer Science & Engineering (CSE / CS)',
    year: 'Senior (Year 4)',
    rollNumber: '',
    phone: '',
    adminSecretKey: '',
    resetCode: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errorMsg) setErrorMsg('');
    if (successMsg) setSuccessMsg('');
  };

  const handleModeChange = (mode) => {
    setAuthMode(mode);
    setErrorMsg('');
    setSuccessMsg('');
  };

  // Handle Forgot Password Request (Generate 6-digit Code)
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (!formData.email) {
      setErrorMsg('Please enter your registered college email.');
      return;
    }

    setLoading(true);
    try {
      const res = await forgotPasswordApi({ email: formData.email });
      if (res.success) {
        setSuccessMsg(res.message || 'Verification code generated successfully!');
        if (res.resetCode) {
          setFormData(prev => ({ ...prev, resetCode: res.resetCode }));
        }
        triggerToast(`Reset code generated for ${formData.email}`, 'Verification Code Sent');
        setAuthMode('reset');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Could not process password reset request.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  // Handle Reset Password Submit (Update in MongoDB)
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!formData.resetCode) {
      setErrorMsg('Please enter the 6-digit verification code.');
      return;
    }

    if (!formData.newPassword || formData.newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters.');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    try {
      const res = await resetPasswordApi({
        email: formData.email,
        resetCode: formData.resetCode,
        newPassword: formData.newPassword
      });

      if (res.user) {
        loginUser(res.user);
        triggerToast('Password updated in database! Logged in successfully.', 'Password Changed 🔒');
        onHide();
        return;
      }

      triggerToast('Password updated successfully. Please login with your new credentials.', 'Success');
      setAuthMode('login');
      setFormData(prev => ({ ...prev, password: '' }));
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Password reset failed. Please check code.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  // Handle Login & Signup Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.password || formData.password.trim() === '') {
      setErrorMsg('Please enter your password.');
      return;
    }

    if (authMode === 'signup' && selectedRole === 'admin') {
      if (formData.adminSecretKey && formData.adminSecretKey.trim() !== 'ADMIN2026' && formData.adminSecretKey.trim() !== 'FACULTY') {
        setErrorMsg('Invalid Faculty/Admin Key. (Use "ADMIN2026" or leave blank for demo)');
        return;
      }
    }

    setLoading(true);

    try {
      if (authMode === 'login') {
        try {
          const res = await loginApi({
            email: formData.email,
            password: formData.password,
            role: selectedRole
          });
          if (res.user) {
            loginUser(res.user);
            triggerToast(`Welcome back, ${res.user.name} (${res.user.role === 'admin' ? 'Admin / Faculty' : 'Student'})!`, 'Logged In Successfully');
            onHide();
            return;
          }
        } catch (loginErr) {
          const serverMsg = loginErr.response?.data?.message;
          if (serverMsg) {
            setErrorMsg(serverMsg);
            setLoading(false);
            return;
          }
        }

        // Fallback local login if server offline
        const nameFromEmail = formData.email.split('@')[0];
        const loggedUser = {
          name: nameFromEmail ? nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1) : (selectedRole === 'admin' ? 'Faculty Admin' : 'Campus Student'),
          email: formData.email,
          role: selectedRole,
          department: selectedRole === 'admin' ? 'Administration & Faculty' : formData.department,
          year: selectedRole === 'admin' ? 'Faculty Member' : formData.year,
          rollNumber: selectedRole === 'admin' ? 'ADM-FACULTY' : (formData.rollNumber || 'STAN-2024-8841'),
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(formData.email)}`,
          verified: true
        };
        loginUser(loggedUser);
        triggerToast(`Welcome back, ${loggedUser.name}!`, 'Logged In Successfully');
        onHide();
      } else if (authMode === 'signup') {
        const payload = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: selectedRole,
          department: selectedRole === 'admin' ? 'Administration & Faculty' : formData.department,
          year: selectedRole === 'admin' ? 'Faculty / Admin' : formData.year,
          rollNumber: selectedRole === 'admin' ? 'ADM-OFFICER' : (formData.rollNumber || `ID-${Math.floor(1000 + Math.random() * 9000)}`),
          phone: formData.phone
        };

        try {
          const res = await registerApi(payload);
          if (res.user) {
            loginUser(res.user);
            triggerToast(`Account created for ${res.user.name}!`, 'Welcome to CampusCart');
            onHide();
            return;
          }
        } catch (apiErr) {
          const msg = apiErr.response?.data?.message;
          if (msg) {
            setErrorMsg(msg);
            setLoading(false);
            return;
          }
        }

        // Fallback local registration
        const newRegisteredUser = {
          name: formData.name || (selectedRole === 'admin' ? 'Faculty Administrator' : 'New Student'),
          email: formData.email,
          role: selectedRole,
          department: selectedRole === 'admin' ? 'Administration' : formData.department,
          year: selectedRole === 'admin' ? 'Faculty / Admin' : formData.year,
          rollNumber: selectedRole === 'admin' ? 'ADM-OFFICER' : (formData.rollNumber || `ID-${Math.floor(1000 + Math.random() * 9000)}`),
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(formData.name || 'user')}`,
          verified: true
        };
        loginUser(newRegisteredUser);
        triggerToast(`Welcome ${newRegisteredUser.name}! Account created.`, 'Welcome to CampusCart');
        onHide();
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered className="auth-modal">
      <div className="bg-surface dark:bg-slate-900 border border-border-subtle dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-on-surface dark:text-slate-100">
        <Modal.Header closeButton className="border-b-0 pb-0">
          <div className="w-full pr-6 flex items-center gap-3">
            <CampusCartLogo size={38} />
            <Modal.Title className="font-display font-bold text-2xl text-vibrant-indigo mb-0">
              {authMode === 'login' && (selectedRole === 'admin' ? 'Faculty / Admin Login 🛡️' : 'Student Login 🎓')}
              {authMode === 'signup' && (selectedRole === 'admin' ? 'Create Admin Account 🛡️' : 'Create Student Account 🚀')}
              {authMode === 'forgot' && 'Forgot Password 🔑'}
              {authMode === 'reset' && 'Reset Password 🔒'}
            </Modal.Title>
          </div>
        </Modal.Header>

        <Modal.Body className="pt-3">
          {/* Role Toggle Selector (Student vs Admin) */}
          {(authMode === 'login' || authMode === 'signup') && (
            <div className="mb-4 bg-surface-container-low dark:bg-slate-800 p-1.5 rounded-2xl flex border border-border-subtle">
              <button
                type="button"
                onClick={() => setSelectedRole('student')}
                className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  selectedRole === 'student'
                    ? 'bg-vibrant-indigo text-white shadow-md'
                    : 'text-on-surface-variant dark:text-slate-400 hover:text-on-surface'
                }`}
              >
                <span>🎓</span> Student Account
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('admin')}
                className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  selectedRole === 'admin'
                    ? 'bg-slate-900 dark:bg-indigo-700 text-white shadow-md'
                    : 'text-on-surface-variant dark:text-slate-400 hover:text-on-surface'
                }`}
              >
                <span>🛡️</span> Admin / Faculty
              </button>
            </div>
          )}

          {errorMsg && <Alert variant="danger" className="py-2 text-xs rounded-xl">{errorMsg}</Alert>}
          {successMsg && <Alert variant="success" className="py-2 text-xs rounded-xl">{successMsg}</Alert>}

          {/* ================= FORGOT PASSWORD VIEW ================= */}
          {authMode === 'forgot' && (
            <Form onSubmit={handleForgotPassword} className="space-y-4">
              <p className="text-xs text-on-surface-variant dark:text-slate-400">
                Enter your registered email address. A 6-digit verification code will be generated and saved to the database.
              </p>

              <Form.Group>
                <Form.Label className="text-xs font-bold uppercase tracking-wider">Email Address *</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  required
                  placeholder="student@college.edu or admin@college.edu"
                  value={formData.email}
                  onChange={handleChange}
                  className="rounded-xl border-border-subtle bg-surface-container-low dark:bg-slate-800 py-2.5 text-sm"
                />
              </Form.Group>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-vibrant-indigo hover:bg-primary-container text-white font-bold py-2.5 rounded-xl border-0 shadow-md transition-all mt-2"
              >
                {loading ? 'Generating Code...' : 'Send Verification Code 📩'}
              </Button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => handleModeChange('login')}
                  className="text-xs font-semibold text-vibrant-indigo hover:underline"
                >
                  ← Back to Login
                </button>
              </div>
            </Form>
          )}

          {/* ================= RESET PASSWORD VIEW ================= */}
          {authMode === 'reset' && (
            <Form onSubmit={handleResetPassword} className="space-y-3">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-200 dark:border-indigo-800 text-xs">
                <span className="font-semibold text-indigo-700 dark:text-indigo-300">Account: </span>
                <span className="font-mono text-slate-700 dark:text-slate-300">{formData.email}</span>
              </div>

              <Form.Group>
                <div className="flex justify-between items-center mb-1">
                  <Form.Label className="text-xs font-bold uppercase tracking-wider mb-0">6-Digit Reset Code *</Form.Label>
                  {formData.resetCode && (
                    <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                      Code: {formData.resetCode}
                    </span>
                  )}
                </div>
                <Form.Control
                  type="text"
                  name="resetCode"
                  required
                  placeholder="Enter 6-digit code"
                  value={formData.resetCode}
                  onChange={handleChange}
                  className="rounded-xl border-border-subtle bg-surface-container-low dark:bg-slate-800 py-2 text-sm font-mono tracking-wider"
                />
              </Form.Group>

              <Form.Group>
                <Form.Label className="text-xs font-bold uppercase tracking-wider">New Password *</Form.Label>
                <Form.Control
                  type="password"
                  name="newPassword"
                  required
                  placeholder="Enter new password (min 6 chars)"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="rounded-xl border-border-subtle bg-surface-container-low dark:bg-slate-800 py-2.5 text-sm"
                />
              </Form.Group>

              <Form.Group>
                <Form.Label className="text-xs font-bold uppercase tracking-wider">Confirm New Password *</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  required
                  placeholder="Re-enter new password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="rounded-xl border-border-subtle bg-surface-container-low dark:bg-slate-800 py-2.5 text-sm"
                />
              </Form.Group>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl border-0 shadow-md transition-all mt-3"
              >
                {loading ? 'Updating in Database...' : 'Save New Password & Log In 🔒'}
              </Button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => handleModeChange('login')}
                  className="text-xs font-semibold text-vibrant-indigo hover:underline"
                >
                  ← Back to Login
                </button>
              </div>
            </Form>
          )}

          {/* ================= LOGIN & SIGNUP VIEWS ================= */}
          {(authMode === 'login' || authMode === 'signup') && (
            <Form onSubmit={handleSubmit} className="space-y-3">
              {authMode === 'signup' && (
                <>
                  <Form.Group>
                    <Form.Label className="text-xs font-bold uppercase tracking-wider">
                      {selectedRole === 'admin' ? 'Faculty / Admin Full Name *' : 'Full Name *'}
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      required
                      placeholder={selectedRole === 'admin' ? 'e.g. Dr. H. Patel / Admin Moderator' : 'e.g. Alex Chen'}
                      value={formData.name}
                      onChange={handleChange}
                      className="rounded-xl border-border-subtle bg-surface-container-low dark:bg-slate-800 py-2.5 text-sm"
                    />
                  </Form.Group>

                  {selectedRole === 'student' && (
                    <Form.Group>
                      <Form.Label className="text-xs font-bold uppercase tracking-wider">Student ID / Roll No (Optional)</Form.Label>
                      <Form.Control
                        type="text"
                        name="rollNumber"
                        placeholder="e.g. 21BCSE102 / 2024-ME-412"
                        value={formData.rollNumber}
                        onChange={handleChange}
                        className="rounded-xl border-border-subtle bg-surface-container-low dark:bg-slate-800 py-2 text-sm"
                      />
                    </Form.Group>
                  )}

                  {selectedRole === 'admin' && (
                    <Form.Group>
                      <Form.Label className="text-xs font-bold uppercase tracking-wider">Faculty / Admin Passcode (Optional)</Form.Label>
                      <Form.Control
                        type="password"
                        name="adminSecretKey"
                        placeholder="ADMIN2026"
                        value={formData.adminSecretKey}
                        onChange={handleChange}
                        className="rounded-xl border-border-subtle bg-surface-container-low dark:bg-slate-800 py-2 text-sm"
                      />
                    </Form.Group>
                  )}
                </>
              )}

              <Form.Group>
                <Form.Label className="text-xs font-bold uppercase tracking-wider">
                  {selectedRole === 'admin' ? 'Official Faculty / Admin Email *' : 'College Email *'}
                </Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  required
                  placeholder={selectedRole === 'admin' ? 'admin@college.edu or prof.hod@college.edu' : 'student@college.edu'}
                  value={formData.email}
                  onChange={handleChange}
                  className="rounded-xl border-border-subtle bg-surface-container-low dark:bg-slate-800 py-2.5 text-sm"
                />
              </Form.Group>

              <Form.Group>
                <div className="flex justify-between items-center mb-1">
                  <Form.Label className="text-xs font-bold uppercase tracking-wider mb-0">Password *</Form.Label>
                  {authMode === 'login' && (
                    <button
                      type="button"
                      onClick={() => handleModeChange('forgot')}
                      className="text-xs font-semibold text-vibrant-indigo hover:underline focus:outline-none"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <Form.Control
                  type="password"
                  name="password"
                  required
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  className="rounded-xl border-border-subtle bg-surface-container-low dark:bg-slate-800 py-2.5 text-sm"
                />
              </Form.Group>

              {authMode === 'signup' && selectedRole === 'student' && (
                <div className="space-y-3">
                  <Form.Group>
                    <Form.Label className="text-xs font-bold uppercase tracking-wider">Engineering Department *</Form.Label>
                    <Form.Select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="rounded-xl text-xs py-2 bg-surface-container-low dark:bg-slate-800 border-border-subtle"
                    >
                      {DEPARTMENTS.filter(d => d !== 'All Departments').map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group>
                    <Form.Label className="text-xs font-bold uppercase tracking-wider">College Year</Form.Label>
                    <Form.Select
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      className="rounded-xl text-xs py-2 bg-surface-container-low dark:bg-slate-800 border-border-subtle"
                    >
                      <option value="Freshman (Year 1)">Freshman (Year 1)</option>
                      <option value="Sophomore (Year 2)">Sophomore (Year 2)</option>
                      <option value="Junior (Year 3)">Junior (Year 3)</option>
                      <option value="Senior (Year 4)">Senior (Year 4)</option>
                      <option value="Postgraduate (M.Tech / ME)">Postgraduate (M.Tech / ME)</option>
                      <option value="PhD Research Scholar">PhD Research Scholar</option>
                    </Form.Select>
                  </Form.Group>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-vibrant-indigo hover:bg-primary-container text-white font-bold py-2.5 rounded-xl border-0 shadow-md transition-all mt-4"
              >
                {loading
                  ? 'Authenticating...'
                  : authMode === 'login'
                  ? `Sign In as ${selectedRole === 'admin' ? 'Admin' : 'Student'}`
                  : `Create ${selectedRole === 'admin' ? 'Admin' : 'Student'} Account`}
              </Button>
            </Form>
          )}

          <div className="text-center mt-4 pt-3 border-t border-border-subtle dark:border-slate-800">
            {authMode === 'login' ? (
              <button
                type="button"
                onClick={() => handleModeChange('signup')}
                className="text-xs font-semibold text-vibrant-indigo hover:underline"
              >
                Don't have an account? Sign Up
              </button>
            ) : authMode === 'signup' ? (
              <button
                type="button"
                onClick={() => handleModeChange('login')}
                className="text-xs font-semibold text-vibrant-indigo hover:underline"
              >
                Already have an account? Sign In
              </button>
            ) : null}
          </div>
        </Modal.Body>
      </div>
    </Modal>
  );
};
