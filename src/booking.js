// Booking System Logic (Legit Persistence)

export function initBooking() {
    const modalRoot = document.getElementById('booking-modal-root');

    // Attach to specialized buttons
    const bookButtons = document.querySelectorAll('#header-book-btn, .service-card .btn-outline, .hero-actions .btn-primary, .btn-book-sm');

    // Open Modal Logic
    const openModal = (e) => {
        e.preventDefault();

        // Render modal structure first
        renderModal(modalRoot);

        // Trigger Slide-In animation after small delay for CSS transition
        setTimeout(() => {
            const content = modalRoot.querySelector('.modal-content');
            if (content) content.classList.add('visible');
        }, 10);
    };

    bookButtons.forEach(btn => {
        btn.addEventListener('click', openModal);
    });
}

function renderModal(root) {
    let step = 1;
    let bookingData = {
        service: null,
        date: null,
        time: null,
        tech: 'Any'
    };

    // Load Booked Slots from LocalStorage (Simulating Backend)
    const getBookedSlots = (date) => {
        const stored = localStorage.getItem('kylee_bookings');
        const allBookings = stored ? JSON.parse(stored) : [];
        // Return array of times booked for this date
        return allBookings.filter(b => b.date === date).map(b => b.time);
    };

    const saveBooking = (data) => {
        const stored = localStorage.getItem('kylee_bookings');
        const allBookings = stored ? JSON.parse(stored) : [];
        allBookings.push(data);
        localStorage.setItem('kylee_bookings', JSON.stringify(allBookings));
    };

    const closeModal = () => {
        const content = root.querySelector('.modal-content');
        if (content) {
            content.classList.remove('visible');
            // Wait for transition to finish before removing DOM
            setTimeout(() => {
                root.innerHTML = '';
                document.body.style.overflow = '';
            }, 400);
        }
    };

    document.body.style.overflow = 'hidden';

    const render = () => {
        // Dynamic HTML based on step
        const contentHTML = getStepContent(step, bookingData, getBookedSlots);

        // If Root is empty, build the shell. If not, just replace the inner content container?
        // For simplicity, we rebuild inner content but keep shell for transitions if possible.
        // But since we wipe root on close, we can just rebuild.

        // Check if modal already exists to preserve transition state
        let modalOverlay = root.querySelector('.modal-overlay');

        if (!modalOverlay) {
            root.innerHTML = `
                <div class="modal-overlay">
                    <div class="modal-content">
                        <button class="modal-close">&times;</button>
                        <div id="modal-step-container">${contentHTML}</div>
                    </div>
                </div>
            `;
            modalOverlay = root.querySelector('.modal-overlay');

            // Listeners
            root.querySelector('.modal-close').addEventListener('click', closeModal);
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) closeModal();
            });
        } else {
            // Update content only
            document.getElementById('modal-step-container').innerHTML = contentHTML;
        }

        // Re-attach Step Listeners every render
        setupStepListeners(step, (newStep, dataUpdate) => {
            step = newStep;
            if (dataUpdate) bookingData = { ...bookingData, ...dataUpdate };
            render();
        }, closeModal, saveBooking, bookingData);
    };

    render();
}

function getStepContent(step, data, getBookedSlots) {
    if (step === 1) {
        return `
            <h2>Select Service</h2>
            <div class="step-options">
                <button class="step-btn" data-value="Manicure">Manicure</button>
                <button class="step-btn" data-value="Pedicure">Pedicure</button>
                <button class="step-btn" data-value="Gel Nails">Gel Nails</button>
                <button class="step-btn" data-value="Full Set">Full Set</button>
            </div>
        `;
    }
    if (step === 2) {
        // Date Check
        const selectedDate = data.date || new Date().toISOString().split('T')[0];
        const bookedTimes = getBookedSlots(selectedDate);
        const times = ["10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];

        const timeButtons = times.map(t => {
            const isBooked = bookedTimes.includes(t);
            return `<button class="time-btn" data-value="${t}" ${isBooked ? 'disabled' : ''}>${t}</button>`;
        }).join('');

        return `
            <h2>Select Date & Time</h2>
            <div class="step-form">
                <input type="date" id="booking-date" min="${new Date().toISOString().split('T')[0]}" value="${selectedDate}"/>
                <div class="time-slots">
                    ${timeButtons}
                </div>
            </div>
            <div class="step-actions">
                <button class="btn-back">Back</button>
            </div>
        `;
    }
    if (step === 3) {
        return `
            <h2>Technician</h2>
            <p>Optional Preference</p>
            <div class="step-options">
                <button class="step-btn" data-value="Any">Any Available</button>
                <button class="step-btn" data-value="Kylee">Kylee (Senior)</button>
                <button class="step-btn" data-value="Sarah">Sarah</button>
            </div>
             <div class="step-actions">
                <button class="btn-back">Back</button>
            </div>
        `;
    }
    if (step === 4) {
        return `
            <h2>Confirm Reservation</h2>
            <div class="confirmation-details">
                <p><strong>Service:</strong> ${data.service}</p>
                <p><strong>Date:</strong> ${data.date}</p>
                <p><strong>Time:</strong> ${data.time}</p>
                <p><strong>Tech:</strong> ${data.tech}</p>
            </div>
            <p class="microcopy">No payment required now. 24h cancellation policy.</p>
            <button class="btn btn-primary" id="confirm-booking" style="width:100%; margin-top:20px;">Confirm Booking</button>
             <div class="step-actions">
                <button class="btn-back">Back</button>
            </div>
        `;
    }
    if (step === 5) {
        return `
            <div class="success-message">
                <h2>You're Booked!</h2>
                <p>We've reserved your spot for ${data.service}.</p>
                <p>See you on ${data.date} at ${data.time}.</p>
                <button class="btn btn-primary modal-close-btn" style="margin-top:20px;">Done</button>
            </div>
        `;
    }
}

function setupStepListeners(step, setStep, close, saveBooking, currentData) {
    const root = document.getElementById('booking-modal-root');

    // Back button
    const backBtn = root.querySelector('.btn-back');
    if (backBtn) {
        backBtn.addEventListener('click', () => setStep(step - 1));
    }

    if (step === 1) {
        root.querySelectorAll('.step-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                setStep(2, { service: btn.dataset.value });
            });
        });
    }

    if (step === 2) {
        const dateInput = root.querySelector('#booking-date');

        // Date Change - updates state (re-renders to show correct booked slots)
        dateInput.addEventListener('change', (e) => {
            setStep(2, { date: e.target.value });
        });

        root.querySelectorAll('.time-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const date = dateInput.value;
                setStep(3, { date: date, time: btn.dataset.value });
            });
        });
    }

    if (step === 3) {
        root.querySelectorAll('.step-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                setStep(4, { tech: btn.dataset.value });
            });
        });
    }

    if (step === 4) {
        root.querySelector('#confirm-booking').addEventListener('click', () => {
            // Save to LocalStorage
            saveBooking(currentData);
            setStep(5);
        });
    }

    if (step === 5) {
        root.querySelector('.modal-close-btn').addEventListener('click', close);
    }
}
