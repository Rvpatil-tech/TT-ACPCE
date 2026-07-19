/* ============================================================
   ACPCE Writeup Maker — Application Logic
   A. C. Patil College of Engineering, Kharghar
   ============================================================ */

(function () {
    'use strict';

    // -------------------- Mock Credentials --------------------
    const MOCK_USERS = [
        { username: 'rahul', password: 'rahul@2026', displayName: 'Rahul Patil' },
        { username: 'user1', password: 'user1@2026', displayName: 'User One' },
        { username: 'user2', password: 'user2@2026', displayName: 'User Two' },
        { username: 'user3', password: 'user3@2026', displayName: 'User Three' },
        { username: 'admin', password: 'admin@acpce', displayName: 'Admin' }
    ];

    // -------------------- Application State --------------------
    const state = {
        isLoggedIn: false,
        currentUser: null,
        currentStep: 1,
        writeupContent: '',
        conclusionContent: '',
        studentName: '',
        studentBatch: '',
        studentRoll: '',
        academicYear: '2025-26',
        images: [],           // { id, file, dataUrl } — output/step-3 images
        theoryImages: [],     // { id, file, dataUrl } — theory section images
        imageIdCounter: 0,
        theoryImageIdCounter: 0
    };

    // -------------------- DOM References --------------------
    const dom = {
        // Pages
        loginPage: document.getElementById('login-page'),
        appPage: document.getElementById('app-page'),

        // Login
        loginForm: document.getElementById('login-form'),
        usernameInput: document.getElementById('username'),
        passwordInput: document.getElementById('password'),
        togglePassword: document.getElementById('toggle-password'),
        loginError: document.getElementById('login-error'),
        btnLogin: document.getElementById('btn-login'),

        // Nav
        navAvatar: document.getElementById('nav-avatar'),
        navUsername: document.getElementById('nav-username'),
        btnLogout: document.getElementById('btn-logout'),

        // Stepper
        steps: document.querySelectorAll('.step'),
        stepLines: document.querySelectorAll('.step-line'),
        stepPanels: document.querySelectorAll('.step-panel'),

        // Step 1
        writeupContent: document.getElementById('writeup-content'),
        charCount: document.getElementById('char-count'),
        btnClearText: document.getElementById('btn-clear-text'),
        btnStep1Next: document.getElementById('btn-step1-next'),
        conclusionContent: document.getElementById('conclusion-content'),
        theoryUploadZone: document.getElementById('theory-upload-zone'),
        theoryImageInput: document.getElementById('theory-image-input'),
        theoryImagePreviewGrid: document.getElementById('theory-image-preview-grid'),

        // Step 2
        studentName: document.getElementById('student-name'),
        studentBatch: document.getElementById('student-batch'),
        studentRoll: document.getElementById('student-roll'),
        academicYear: document.getElementById('academic-year'),
        btnStep2Back: document.getElementById('btn-step2-back'),
        btnStep2Next: document.getElementById('btn-step2-next'),

        // Step 3
        uploadZone: document.getElementById('upload-zone'),
        imageInput: document.getElementById('image-input'),
        imagePreviewGrid: document.getElementById('image-preview-grid'),
        btnStep3Back: document.getElementById('btn-step3-back'),
        btnStep3Next: document.getElementById('btn-step3-next'),

        // Step 4
        btnStep4Back: document.getElementById('btn-step4-back'),
        btnDownloadPdf: document.getElementById('btn-download-pdf'),
        a4Page: document.getElementById('a4-page'),
        docContent: document.getElementById('doc-content'),
        docImages: document.getElementById('doc-images'),
        docOutputSection: document.getElementById('doc-output-section'),

        // Toast
        toast: document.getElementById('toast-success'),
        toastTitle: document.getElementById('toast-title'),
        toastMessage: document.getElementById('toast-message'),
        toastClose: document.getElementById('toast-close')
    };

    // -------------------- Initialization --------------------
    function init() {
        bindLoginEvents();
        bindNavigationEvents();
        bindStep1Events();
        bindStep2Events();
        bindStep3Events();
        bindStep4Events();
        bindToastEvents();
    }

    // -------------------- Login Logic --------------------
    function bindLoginEvents() {
        dom.loginForm.addEventListener('submit', handleLogin);

        dom.togglePassword.addEventListener('click', function () {
            const input = dom.passwordInput;
            const eyeOpen = this.querySelector('.eye-open');
            const eyeClosed = this.querySelector('.eye-closed');

            if (input.type === 'password') {
                input.type = 'text';
                eyeOpen.style.display = 'none';
                eyeClosed.style.display = 'block';
            } else {
                input.type = 'password';
                eyeOpen.style.display = 'block';
                eyeClosed.style.display = 'none';
            }
        });
    }

    function handleLogin(e) {
        e.preventDefault();

        const username = dom.usernameInput.value.trim().toLowerCase();
        const password = dom.passwordInput.value;

        dom.loginError.classList.remove('show');
        dom.btnLogin.classList.add('loading');

        setTimeout(function () {
            const user = MOCK_USERS.find(
                u => u.username === username && u.password === password
            );

            dom.btnLogin.classList.remove('loading');

            if (user) {
                state.isLoggedIn = true;
                state.currentUser = user;
                showApp();
            } else {
                dom.loginError.classList.add('show');
                dom.passwordInput.value = '';
                dom.passwordInput.focus();
            }
        }, 800);
    }

    function showApp() {
        dom.loginPage.classList.remove('active');
        dom.appPage.classList.add('active');

        dom.navAvatar.textContent = state.currentUser.displayName.charAt(0).toUpperCase();
        dom.navUsername.textContent = state.currentUser.displayName;

        updateStepper();
    }

    function logout() {
        // Clear all state
        state.isLoggedIn = false;
        state.currentUser = null;
        state.currentStep = 1;
        state.writeupContent = '';
        state.conclusionContent = '';
        state.studentName = '';
        state.studentBatch = '';
        state.studentRoll = '';
        state.academicYear = '2025-26';
        state.images = [];
        state.theoryImages = [];
        state.imageIdCounter = 0;
        state.theoryImageIdCounter = 0;

        // Reset forms
        dom.loginForm.reset();
        dom.writeupContent.value = '';
        dom.conclusionContent.value = '';
        dom.studentName.value = '';
        dom.studentBatch.value = '';
        dom.studentRoll.value = '';
        dom.academicYear.value = '2025-26';
        dom.imagePreviewGrid.innerHTML = '';
        dom.theoryImagePreviewGrid.innerHTML = '';
        dom.charCount.textContent = '0 characters';
        dom.loginError.classList.remove('show');

        // Switch pages
        dom.appPage.classList.remove('active');
        dom.loginPage.classList.add('active');

        updateStepper();
    }

    // -------------------- Navigation & Stepper --------------------
    function bindNavigationEvents() {
        dom.btnLogout.addEventListener('click', function () {
            if (confirm('Sign out? Any unsaved data will be cleared for privacy.')) {
                logout();
            }
        });
    }

    function updateStepper() {
        dom.steps.forEach(function (step, idx) {
            const stepNum = idx + 1;
            step.classList.remove('active', 'completed');

            if (stepNum < state.currentStep) {
                step.classList.add('completed');
            } else if (stepNum === state.currentStep) {
                step.classList.add('active');
            }
        });

        dom.stepLines.forEach(function (line, idx) {
            const lineAfterStep = idx + 1;
            line.classList.toggle('active', lineAfterStep < state.currentStep);
        });

        dom.stepPanels.forEach(function (panel, idx) {
            const panelNum = idx + 1;
            panel.classList.remove('active');
            if (panelNum === state.currentStep) {
                // Re-trigger animation
                panel.style.animation = 'none';
                panel.offsetHeight; // Force reflow
                panel.style.animation = '';
                panel.classList.add('active');
            }
        });
    }

    function goToStep(step) {
        state.currentStep = step;
        updateStepper();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // -------------------- Step 1: Write Content --------------------
    function bindStep1Events() {
        dom.writeupContent.addEventListener('input', function () {
            const len = this.value.length;
            dom.charCount.textContent = len.toLocaleString() + ' character' + (len !== 1 ? 's' : '');
        });

        dom.btnClearText.addEventListener('click', function () {
            if (dom.writeupContent.value && confirm('Clear all content?')) {
                dom.writeupContent.value = '';
                dom.charCount.textContent = '0 characters';
            }
        });

        // Theory image upload
        dom.theoryUploadZone.addEventListener('click', function () {
            dom.theoryImageInput.click();
        });

        dom.theoryImageInput.addEventListener('change', function () {
            handleTheoryFiles(this.files);
            this.value = '';
        });

        dom.theoryUploadZone.addEventListener('dragover', function (e) {
            e.preventDefault();
            this.classList.add('drag-over');
        });

        dom.theoryUploadZone.addEventListener('dragleave', function () {
            this.classList.remove('drag-over');
        });

        dom.theoryUploadZone.addEventListener('drop', function (e) {
            e.preventDefault();
            this.classList.remove('drag-over');
            handleTheoryFiles(e.dataTransfer.files);
        });

        dom.btnStep1Next.addEventListener('click', function () {
            if (!dom.writeupContent.value.trim()) {
                showToast('Content Required', 'Please enter your writeup content before continuing.', 'warning');
                dom.writeupContent.focus();
                return;
            }
            state.writeupContent = dom.writeupContent.value;
            state.conclusionContent = dom.conclusionContent.value;
            goToStep(2);
        });
    }

    function handleTheoryFiles(files) {
        Array.from(files).forEach(function (file) {
            if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
                showToast('Invalid File', file.name + ' is not a supported image format.', 'warning');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                showToast('File Too Large', file.name + ' exceeds the 5MB limit.', 'warning');
                return;
            }

            const id = ++state.theoryImageIdCounter;
            const reader = new FileReader();

            reader.onload = function (e) {
                state.theoryImages.push({
                    id: id,
                    file: file,
                    dataUrl: e.target.result
                });
                renderTheoryImagePreviews();
            };

            reader.readAsDataURL(file);
        });
    }

    function renderTheoryImagePreviews() {
        dom.theoryImagePreviewGrid.innerHTML = '';

        state.theoryImages.forEach(function (img) {
            var item = document.createElement('div');
            item.className = 'image-preview-item';

            item.innerHTML =
                '<img src="' + img.dataUrl + '" alt="Theory ' + img.id + '">' +
                '<button class="image-remove-btn" data-id="' + img.id + '" title="Remove image">' +
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
                '<line x1="18" y1="6" x2="6" y2="18"/>' +
                '<line x1="6" y1="6" x2="18" y2="18"/>' +
                '</svg></button>';

            item.querySelector('.image-remove-btn').addEventListener('click', function (e) {
                e.stopPropagation();
                var removeId = parseInt(this.getAttribute('data-id'));
                state.theoryImages = state.theoryImages.filter(function (i) { return i.id !== removeId; });
                renderTheoryImagePreviews();
            });

            dom.theoryImagePreviewGrid.appendChild(item);
        });
    }

    // -------------------- Step 2: Student Details --------------------
    function bindStep2Events() {
        dom.btnStep2Back.addEventListener('click', function () {
            goToStep(1);
        });

        dom.btnStep2Next.addEventListener('click', function () {
            const name = dom.studentName.value.trim();
            const batch = dom.studentBatch.value.trim();
            const roll = dom.studentRoll.value.trim();

            if (!name) {
                showToast('Name Required', 'Please enter your full name.', 'warning');
                dom.studentName.focus();
                return;
            }
            if (!batch) {
                showToast('Batch Required', 'Please enter your batch.', 'warning');
                dom.studentBatch.focus();
                return;
            }
            if (!roll) {
                showToast('Roll No Required', 'Please enter your roll number.', 'warning');
                dom.studentRoll.focus();
                return;
            }

            state.studentName = name;
            state.studentBatch = batch;
            state.studentRoll = roll;
            state.academicYear = dom.academicYear.value.trim() || '2025-26';

            goToStep(3);
        });
    }

    // -------------------- Step 3: Image Upload --------------------
    function bindStep3Events() {
        // Click to upload
        dom.uploadZone.addEventListener('click', function () {
            dom.imageInput.click();
        });

        // File input change
        dom.imageInput.addEventListener('change', function () {
            handleFiles(this.files);
            this.value = '';
        });

        // Drag & drop
        dom.uploadZone.addEventListener('dragover', function (e) {
            e.preventDefault();
            this.classList.add('drag-over');
        });

        dom.uploadZone.addEventListener('dragleave', function () {
            this.classList.remove('drag-over');
        });

        dom.uploadZone.addEventListener('drop', function (e) {
            e.preventDefault();
            this.classList.remove('drag-over');
            handleFiles(e.dataTransfer.files);
        });

        // Navigation
        dom.btnStep3Back.addEventListener('click', function () {
            goToStep(2);
        });

        dom.btnStep3Next.addEventListener('click', function () {
            buildPreview();
            goToStep(4);
        });
    }

    function handleFiles(files) {
        Array.from(files).forEach(function (file) {
            if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
                showToast('Invalid File', file.name + ' is not a supported image format.', 'warning');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                showToast('File Too Large', file.name + ' exceeds the 5MB limit.', 'warning');
                return;
            }

            const id = ++state.imageIdCounter;
            const reader = new FileReader();

            reader.onload = function (e) {
                state.images.push({
                    id: id,
                    file: file,
                    dataUrl: e.target.result
                });
                renderImagePreviews();
            };

            reader.readAsDataURL(file);
        });
    }

    function renderImagePreviews() {
        dom.imagePreviewGrid.innerHTML = '';

        state.images.forEach(function (img) {
            var item = document.createElement('div');
            item.className = 'image-preview-item';

            item.innerHTML =
                '<img src="' + img.dataUrl + '" alt="Upload ' + img.id + '">' +
                '<button class="image-remove-btn" data-id="' + img.id + '" title="Remove image">' +
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
                '<line x1="18" y1="6" x2="6" y2="18"/>' +
                '<line x1="6" y1="6" x2="18" y2="18"/>' +
                '</svg></button>';

            item.querySelector('.image-remove-btn').addEventListener('click', function (e) {
                e.stopPropagation();
                var removeId = parseInt(this.getAttribute('data-id'));
                state.images = state.images.filter(function (i) { return i.id !== removeId; });
                renderImagePreviews();
            });

            dom.imagePreviewGrid.appendChild(item);
        });
    }

    // -------------------- Step 4: Preview & Download --------------------
    function bindStep4Events() {
        dom.btnStep4Back.addEventListener('click', function () {
            goToStep(3);
        });

        dom.btnDownloadPdf.addEventListener('click', function () {
            downloadPDF();
        });
    }

    function buildPreview() {
        // Update content with bold text support
        var contentHtml = '';
        var paragraphs = state.writeupContent.split(/\n\s*\n|\n/);
        paragraphs.forEach(function (para) {
            var trimmed = para.trim();
            if (trimmed) {
                contentHtml += '<p>' + formatText(trimmed) + '</p>';
            }
        });

        // Append theory images after text content (in the Theory section)
        if (state.theoryImages.length > 0) {
            contentHtml += '<div class="doc-theory-images">';
            state.theoryImages.forEach(function (img) {
                contentHtml +=
                    '<div class="doc-image-item">' +
                    '<img src="' + img.dataUrl + '" alt="Theory Image">' +
                    '</div>';
            });
            contentHtml += '</div>';
        }

        dom.docContent.innerHTML = contentHtml || '<p class="doc-placeholder">No content</p>';

        // Update academic year across headers/footers
        document.querySelectorAll('.val-academic-year').forEach(function (el) {
            el.textContent = state.academicYear;
        });

        // Update footer details across screen/print footers
        document.querySelectorAll('.val-student-name').forEach(function (el) {
            el.textContent = state.studentName;
        });
        document.querySelectorAll('.val-roll-no').forEach(function (el) {
            el.textContent = state.studentRoll;
        });

        // Update images under Output section
        dom.docImages.innerHTML = '';
        if (state.images.length > 0) {
            dom.docOutputSection.style.display = 'block';
            state.images.forEach(function (img) {
                var wrapper = document.createElement('div');
                wrapper.className = 'doc-image-item';

                var imgEl = document.createElement('img');
                imgEl.src = img.dataUrl;
                imgEl.alt = 'Writeup Image';

                wrapper.appendChild(imgEl);
                dom.docImages.appendChild(wrapper);
            });
        } else {
            dom.docOutputSection.style.display = 'none';
        }

        // Update Conclusion section (after Output)
        var docConclusionSection = document.getElementById('doc-conclusion-section');
        var docConclusionText = document.getElementById('doc-conclusion-text');
        var conclusionTrimmed = state.conclusionContent.trim();
        if (conclusionTrimmed) {
            docConclusionSection.style.display = 'block';
            var conclusionHtml = '';
            conclusionTrimmed.split(/\n\s*\n|\n/).forEach(function (para) {
                var t = para.trim();
                if (t) conclusionHtml += '<p>' + formatText(t) + '</p>';
            });
            docConclusionText.innerHTML = conclusionHtml;
        } else {
            docConclusionSection.style.display = 'none';
        }
    }

    function downloadPDF() {
        var btn = dom.btnDownloadPdf;
        var originalText = btn.querySelector('span').textContent;
        btn.querySelector('span').textContent = 'Preparing...';
        btn.classList.add('downloading');

        // Use native browser print — "Save as PDF" in the print dialog
        // This works reliably with file:// protocol unlike html2pdf/html2canvas
        setTimeout(function () {
            window.print();

            btn.querySelector('span').textContent = originalText;
            btn.classList.remove('downloading');

            showToast(
                'Print Dialog Opened',
                'Select "Save as PDF" as the destination to download your writeup.',
                'success'
            );

            // Privacy: cleanup after download
            cleanupTemporaryData();
        }, 300);
    }

    function cleanupTemporaryData() {
        // Release object URLs and clear data URLs from images
        // This is the privacy cleanup step — temporary data is removed post-download
        state.images.forEach(function (img) {
            if (img.objectUrl) {
                URL.revokeObjectURL(img.objectUrl);
            }
        });
        // Note: We keep state intact so user can re-download if needed
        // Full cleanup happens on logout
    }

    // -------------------- Toast Notifications --------------------
    function bindToastEvents() {
        dom.toastClose.addEventListener('click', hideToast);
    }

    var toastTimeout = null;

    function showToast(title, message, type) {
        if (toastTimeout) clearTimeout(toastTimeout);

        dom.toastTitle.textContent = title;
        dom.toastMessage.textContent = message;

        var icon = dom.toast.querySelector('.toast-icon svg');
        if (type === 'warning') {
            icon.style.color = 'var(--clr-warning)';
        } else {
            icon.style.color = 'var(--clr-success)';
        }

        dom.toast.classList.add('show');

        toastTimeout = setTimeout(hideToast, 5000);
    }

    function hideToast() {
        dom.toast.classList.remove('show');
        if (toastTimeout) {
            clearTimeout(toastTimeout);
            toastTimeout = null;
        }
    }

    // -------------------- Utilities --------------------
    function escapeHtml(text) {
        var div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Escape HTML then parse **bold** markdown syntax.
     * Supports nested bold markers: **this is bold**
     */
    function formatText(text) {
        var escaped = escapeHtml(text);
        // Replace **text** with <strong>text</strong>
        escaped = escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        return escaped;
    }

    // -------------------- Boot --------------------
    document.addEventListener('DOMContentLoaded', init);
})();
