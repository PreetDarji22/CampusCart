import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { useApp } from '../../context/AppContext';
import { CAMPUS_MEETUP_SPOTS } from '../../services/mockData';

export const ChatModal = ({ show, onHide, chatPartner, productContext }) => {
  const { currentUser } = useApp();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: chatPartner?.name || 'Seller',
      text: `Hi! Thanks for reaching out regarding "${productContext?.title || 'this item'}". Where on campus would you like to meet up?`,
      time: 'Just now',
      isMe: false
    }
  ]);

  const [inputMsg, setInputMsg] = useState('');

  // Reset initial conversation context when partner/product changes
  useEffect(() => {
    if (chatPartner) {
      setMessages([
        {
          id: 1,
          sender: chatPartner?.name || 'Peer',
          text: `Hi! Thanks for connecting about "${productContext?.title || 'our campus exchange'}". Where would you like to meet up?`,
          time: 'Just now',
          isMe: false
        }
      ]);
    }
  }, [chatPartner, productContext]);

  const handleSend = (e) => {
    if (e) e.preventDefault();
    if (!inputMsg.trim()) return;

    const userText = inputMsg.trim();
    const newMsg = {
      id: Date.now(),
      sender: currentUser?.name || 'Me',
      text: userText,
      time: 'Just now',
      isMe: true
    };

    setMessages(prev => [...prev, newMsg]);
    setInputMsg('');

    // Simulate smart auto-reply from peer after 1.5s
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: chatPartner?.name || 'Campus Peer',
          text: userText.toLowerCase().includes('library') || userText.toLowerCase().includes('canteen')
            ? `That meetup spot works perfectly for me! See you there.`
            : `Sounds good! I can meet you at Central Library Lobby today after classes.`,
          time: 'Just now',
          isMe: false
        }
      ]);
    }, 1200);
  };

  const handleQuickMeetupClick = (spot) => {
    setInputMsg(`Can we meet at ${spot}?`);
  };

  return (
    <Modal show={show} onHide={onHide} size="md" centered className="chat-modal">
      <div className="bg-surface dark:bg-slate-900 border border-border-subtle dark:border-slate-800 rounded-3xl p-4 shadow-2xl text-on-surface dark:text-slate-100">
        <Modal.Header closeButton className="border-b border-border-subtle dark:border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <img
              src={chatPartner?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={chatPartner?.name || 'Peer'}
              className="w-10 h-10 rounded-full object-cover border-2 border-vibrant-indigo"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-base text-on-background mb-0">{chatPartner?.name || 'Campus Peer'}</h4>
                <span className="material-symbols-outlined text-[15px] text-fresh-mint" title="Verified Campus Student">
                  verified
                </span>
              </div>
              <p className="text-xs text-fresh-mint font-medium mb-0 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-fresh-mint animate-pulse"></span>
                Active on Campus • {productContext?.title ? productContext.title : 'Marketplace Exchange'}
              </p>
            </div>
          </div>
        </Modal.Header>

        <Modal.Body className="py-3">
          {/* Item Context Tag */}
          {productContext && (
            <div className="mb-3 p-2.5 rounded-xl bg-surface-container-low dark:bg-slate-800 border border-border-subtle flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-vibrant-indigo text-[18px]">shopping_bag</span>
                <span className="font-semibold text-on-background">{productContext.title}</span>
              </div>
              {productContext.price && (
                <strong className="text-vibrant-indigo font-bold">₹{productContext.price.toLocaleString('en-IN')}</strong>
              )}
            </div>
          )}

          {/* Messages Scroll Area */}
          <div className="h-64 overflow-y-auto space-y-3 pr-1 hide-scrollbar">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-xs font-medium ${
                    msg.isMe
                      ? 'bg-vibrant-indigo text-white rounded-br-none'
                      : 'bg-surface-container-low dark:bg-slate-800 border border-border-subtle dark:border-slate-700 text-on-background rounded-bl-none'
                  }`}
                >
                  <p className="mb-0 leading-relaxed">{msg.text}</p>
                </div>
                <span className="text-[10px] text-outline mt-1 px-1">{msg.time}</span>
              </div>
            ))}
          </div>

          {/* Quick Meetup Spot Chips */}
          <div className="mt-2 pt-2 border-t border-border-subtle/60">
            <span className="text-[11px] font-bold text-outline block mb-1.5 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-vibrant-indigo">location_on</span>
              Suggest Safe Meetup Spot:
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-16 overflow-y-auto hide-scrollbar">
              {CAMPUS_MEETUP_SPOTS.slice(0, 4).map(spot => (
                <button
                  key={spot}
                  type="button"
                  onClick={() => handleQuickMeetupClick(spot)}
                  className="text-[10px] font-medium px-2 py-1 rounded-lg bg-surface-container-low hover:bg-vibrant-indigo hover:text-white border border-border-subtle transition-colors text-on-surface-variant"
                >
                  📍 {spot}
                </button>
              ))}
            </div>
          </div>

          {/* Message Input Form */}
          <Form onSubmit={handleSend} className="mt-3 pt-2 border-t border-border-subtle dark:border-slate-800 flex gap-2">
            <Form.Control
              type="text"
              placeholder="Type your message or tap a meetup spot..."
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              className="rounded-xl border-border-subtle bg-surface-container-low dark:bg-slate-800 text-xs py-2"
            />
            <Button
              type="submit"
              className="bg-vibrant-indigo border-0 text-white font-bold rounded-xl px-4 py-2 text-xs flex items-center gap-1 shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">send</span>
              Send
            </Button>
          </Form>
        </Modal.Body>
      </div>
    </Modal>
  );
};
