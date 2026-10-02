import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Form, InputGroup, ProgressBar, Badge, Button } from 'react-bootstrap';
import { useApp } from '../../context/AppContext';

export const EventsPage = () => {
  const {
    events,
    setSelectedEventForTicket,
    setIsCreateEventOpen,
    deleteEvent,
    isAdmin,
    setActiveTab,
    setSelectedCategory
  } = useApp();

  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All Events');
  const [eventSearch, setEventSearch] = useState('');

  const eventCategories = ['All Events', 'Hackathon', 'Exhibition', 'Tech Fest', 'Workshop', 'Sports', 'Cultural'];

  const filteredEvents = useMemo(() => {
    return events.filter(ev => {
      const matchCat = selectedCategoryFilter === 'All Events' || ev.category === selectedCategoryFilter;
      const matchSearch =
        ev.title.toLowerCase().includes(eventSearch.toLowerCase()) ||
        ev.venue.toLowerCase().includes(eventSearch.toLowerCase()) ||
        (ev.gearTag && ev.gearTag.toLowerCase().includes(eventSearch.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [events, selectedCategoryFilter, eventSearch]);

  return (
    <div className="pt-28 sm:pt-32 pb-16 min-h-screen bg-background text-on-background">
      <Container maxwidth="7xl" className="px-margin-mobile md:px-margin-desktop">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-surface-card p-6 sm:p-8 rounded-3xl border border-border-subtle shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-vibrant-indigo/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-vibrant-indigo/15 text-vibrant-indigo rounded-full text-xs font-bold uppercase tracking-widest">
              Official College Noticeboard
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-on-background tracking-tight">
              Campus Events & Hackathons 🚀
            </h1>
            <p className="text-xs sm:text-sm text-outline max-w-xl mb-0 leading-relaxed">
              Discover verified technical symposiums, hackathons, robotics expos, and sports tournaments. Book digital tickets or source needed project gear directly from peers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 relative z-10">
            {isAdmin && (
              <Button
                onClick={() => setIsCreateEventOpen(true)}
                className="bg-slate-900 dark:bg-indigo-700 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md py-2.5 px-4 border-0 flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                + Publish Event (Admin)
              </Button>
            )}

            <Button
              variant="outline-secondary"
              onClick={() => setActiveTab('browse')}
              className="rounded-xl text-xs font-semibold py-2.5 px-4 border-border-subtle bg-surface-container-low dark:bg-slate-800 text-on-surface hover:bg-surface-card"
            >
              Explore Gear Marketplace →
            </Button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-8">
          {/* Category Filter Chips */}
          <div className="flex overflow-x-auto pb-1 gap-2 w-full sm:w-auto hide-scrollbar">
            {eventCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategoryFilter(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-full font-label-md text-xs font-semibold transition-all border ${
                  selectedCategoryFilter === cat
                    ? 'bg-vibrant-indigo text-white border-vibrant-indigo shadow-sm'
                    : 'bg-surface-card text-on-surface-variant border-border-subtle hover:bg-surface-container-low'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="w-full sm:w-72">
            <InputGroup className="rounded-full overflow-hidden border border-border-subtle bg-surface-card focus-within:border-vibrant-indigo">
              <InputGroup.Text className="bg-transparent border-0 text-outline pl-3 pr-1">
                <span className="material-symbols-outlined text-[18px]">search</span>
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search event, venue, gear..."
                value={eventSearch}
                onChange={(e) => setEventSearch(e.target.value)}
                className="bg-transparent border-0 text-xs py-2 pr-3 shadow-none focus:shadow-none"
              />
            </InputGroup>
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="bg-surface-card p-12 rounded-3xl border border-border-subtle text-center space-y-3 max-w-md mx-auto my-8">
            <span className="material-symbols-outlined text-4xl text-outline">event_busy</span>
            <h3 className="font-bold text-lg text-on-background">No Events Found</h3>
            <p className="text-xs text-outline">Try searching for a different keyword or selecting "All Events".</p>
            <Button
              onClick={() => {
                setSelectedCategoryFilter('All Events');
                setEventSearch('');
              }}
              className="bg-vibrant-indigo text-white text-xs font-bold rounded-xl py-2 px-4 border-0"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <Row className="g-4">
            {filteredEvents.map(ev => {
              const isFree = !ev.entryFee || ev.entryFee === 0;
              const slotsLeft = (ev.totalSlots || 100) - (ev.registeredCount || 0);
              const percentFilled = Math.min(100, Math.round(((ev.registeredCount || 0) / (ev.totalSlots || 100)) * 100));

              return (
                <Col key={ev.id || ev._id} lg={4} md={6}>
                  <div className="p-6 rounded-3xl bg-surface-card border border-border-subtle shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full space-y-4 relative overflow-hidden group">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-vibrant-indigo/15 text-vibrant-indigo">
                          {ev.category}
                        </span>
                        <span className="text-xs font-semibold text-on-surface-variant font-mono bg-surface-container-low dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                          🗓️ {ev.date}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-display font-bold text-xl text-on-background group-hover:text-vibrant-indigo transition-colors leading-snug">
                          {ev.title}
                        </h3>
                        <p className="text-xs text-outline line-clamp-3 mt-1.5 leading-relaxed">{ev.description}</p>
                      </div>

                      <div className="space-y-1.5 text-xs text-outline bg-surface-container-lowest dark:bg-slate-900/60 p-3 rounded-2xl border border-border-subtle/60">
                        <p className="flex items-center gap-2 mb-0">
                          <span className="material-symbols-outlined text-[16px] text-vibrant-indigo">location_on</span>
                          <span className="font-medium text-on-surface">{ev.venue}</span>
                        </p>
                        <p className="flex items-center gap-2 mb-0">
                          <span className="material-symbols-outlined text-[16px] text-fresh-mint">schedule</span>
                          <span>{ev.time || '09:00 AM - 05:00 PM'}</span>
                        </p>
                        {ev.organizer && (
                          <p className="flex items-center gap-2 mb-0">
                            <span className="material-symbols-outlined text-[16px] text-purple-500">groups</span>
                            <span>{ev.organizer}</span>
                          </p>
                        )}
                      </div>

                      {/* Slots Capacity Bar */}
                      <div className="space-y-1 pt-1">
                        <div className="flex justify-between text-[11px] font-semibold">
                          <span className="text-outline">Live Capacity</span>
                          <span className={slotsLeft <= 20 ? 'text-amber-500 font-bold' : 'text-emerald-600 dark:text-emerald-400'}>
                            {slotsLeft > 0 ? `${slotsLeft} slots remaining` : 'Full'} ({percentFilled}% filled)
                          </span>
                        </div>
                        <ProgressBar
                          now={percentFilled}
                          variant={percentFilled > 80 ? 'warning' : 'info'}
                          className="h-2 rounded-full"
                        />
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border-subtle/80 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[10px] text-outline block">PASS PRICE</span>
                          <span className="font-bold text-base text-on-background">
                            {isFree ? 'FREE Entry 🎓' : `₹${ev.entryFee}`}
                          </span>
                        </div>

                        {ev.gearTag && (
                          <button
                            onClick={() => {
                              setSelectedCategory(ev.category === 'Hackathon' ? 'Electronics' : 'All Categories');
                              setActiveTab('browse');
                            }}
                            className="text-[11px] text-fresh-mint font-semibold bg-fresh-mint/10 hover:bg-fresh-mint/20 px-2.5 py-1 rounded-lg transition-colors"
                            title="Click to find gear in marketplace"
                          >
                            ⚡ {ev.gearTag}
                          </button>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => setSelectedEventForTicket(ev)}
                          className="flex-1 py-2.5 bg-vibrant-indigo hover:bg-primary-container text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95 border-0"
                        >
                          <span className="material-symbols-outlined text-[16px]">confirmation_number</span>
                          {isFree ? 'Register Free 🚀' : `Get Digital Ticket (₹${ev.entryFee}) 🎟️`}
                        </Button>

                        {isAdmin && (
                          <button
                            onClick={() => deleteEvent(ev.id || ev._id)}
                            className="px-3 py-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/60 transition-colors"
                            title="Delete Event (Admin)"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </Col>
              );
            })}
          </Row>
        )}
      </Container>
    </div>
  );
};
