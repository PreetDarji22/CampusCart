import React, { useState, useEffect } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';

export const CaptchaWidget = ({ onVerify }) => {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const generateChallenge = () => {
    const n1 = Math.floor(Math.random() * 9) + 1;
    const n2 = Math.floor(Math.random() * 9) + 1;
    setNum1(n1);
    setNum2(n2);
    setUserAnswer('');
    setIsVerified(false);
    setErrorMsg('');
    if (onVerify) onVerify(false);
  };

  useEffect(() => {
    generateChallenge();
  }, []);

  const handleCheck = (e) => {
    e.preventDefault();
    if (parseInt(userAnswer.trim(), 10) === num1 + num2) {
      setIsVerified(true);
      setErrorMsg('');
      if (onVerify) onVerify(true);
    } else {
      setErrorMsg('Incorrect sum. Please try again.');
      setIsVerified(false);
      if (onVerify) onVerify(false);
    }
  };

  return (
    <div className="bg-surface-container-low p-3 rounded-lg border border-border-subtle my-3">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-label-md text-on-surface flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px] text-vibrant-indigo">security</span>
          Anti-Spam Verification (Module 7 CAPTCHA)
        </label>
        <button
          type="button"
          onClick={generateChallenge}
          className="text-xs text-vibrant-indigo hover:underline flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[14px]">refresh</span>
          Refresh
        </button>
      </div>

      {isVerified ? (
        <div className="bg-fresh-mint/15 text-fresh-mint p-2 rounded text-xs font-semibold flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">verified</span>
          Verified Human! You can now publish your listing.
        </div>
      ) : (
        <Form onSubmit={handleCheck}>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 bg-surface-card rounded border font-mono font-bold text-sm text-on-background shadow-sm">
              {num1} + {num2} = ?
            </span>
            <InputGroup className="flex-1">
              <Form.Control
                type="number"
                placeholder="Enter answer"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="text-sm py-1"
                required
              />
              <Button type="submit" variant="primary" size="sm" className="bg-vibrant-indigo border-0">
                Verify
              </Button>
            </InputGroup>
          </div>
          {errorMsg && <p className="text-xs text-error-red mt-1 mb-0 font-medium">{errorMsg}</p>}
        </Form>
      )}
    </div>
  );
};
