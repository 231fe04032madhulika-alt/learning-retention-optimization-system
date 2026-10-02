const app = {
    state: {
        user: null,
        token: localStorage.getItem('token'),
        role: localStorage.getItem('role') || 'user'
    },

    init() {
        this.setupEventListeners();
        
        // Check for URL actions (e.g., from email reminder)
        const urlParams = new URLSearchParams(window.location.search);
        const action = urlParams.get('action');
        const id = urlParams.get('id');
        const topic = urlParams.get('topic') || "Subject Topic"; // Pass via email if possible
        
        if (action === 'mark_done' && id && this.state.token) {
            // Clean URL and handle the task
            window.history.replaceState({}, document.title, "/");
            this.navigate('dashboard');
            
            // Wait slightly for DOM to settle, then mark as done
            setTimeout(() => {
                if(window.markTaskDone) {
                    window.markTaskDone(id, topic);
                }
            }, 500);
            return;
        }

        // Auto-login or redirect
        if (this.state.token) {
            if (this.state.role === 'admin') {
                this.navigate('admin_dashboard');
            } else {
                this.navigate('dashboard');
            }
        } else {
            this.navigate('home');
        }
    },

    setupEventListeners() {
        // Navigation clicks
        document.querySelectorAll('[data-link]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigate(e.target.closest('a').dataset.link);
            });
        });

        // Logout
        document.getElementById('logoutBtn')?.addEventListener('click', () => {
            this.logout();
        });
    },

    async navigate(viewName) {
        const appContainer = document.getElementById('app');
        
        // Update Nav UI
        const publicViews = ['home', 'login', 'signup', 'about', 'contact', 'admin_login'];
        
        if(viewName === 'login' || viewName === 'signup' || viewName === 'admin_login') {
            document.getElementById('navbar').style.display = 'none';
        } else {
            document.getElementById('navbar').style.display = 'flex';
            
            // Toggle public vs private nav links
            if (this.state.token) {
                document.getElementById('nav-public-links').style.display = 'none';
                
                if (this.state.role === 'admin') {
                    // Hide dashboard and profile for admin
                    document.getElementById('nav-private-links').style.display = 'none';
                } else {
                    document.getElementById('nav-private-links').style.display = 'flex';
                }
                
                document.getElementById('logoutBtn').style.display = 'block';
                document.getElementById('loginNavBtn').style.display = 'none';
            } else {
                document.getElementById('nav-public-links').style.display = 'flex';
                document.getElementById('nav-private-links').style.display = 'none';
                document.getElementById('logoutBtn').style.display = 'none';
                document.getElementById('loginNavBtn').style.display = 'block';
            }
            
            // Verify token exists before allowing access to secure pages
            if(!this.state.token && !publicViews.includes(viewName)) {
                this.navigate('login');
                return;
            }

            // Highlight active link
            document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
            const activeLink = document.querySelector(`[data-link="${viewName}"]`);
            if(activeLink) activeLink.classList.add('active');
        }

        try {
            // Show loader
            appContainer.innerHTML = '<div class="loader-container"><div class="spinner"></div></div>';
            
            const response = await fetch(`/views/${viewName}.html`);
            if (!response.ok) throw new Error('View not found');
            const html = await response.text();
            
            appContainer.innerHTML = html;
            
            // Re-bind events for the loaded view
            if(this.viewControllers[viewName]) {
                this.viewControllers[viewName]();
            }

        } catch (err) {
            console.error(err);
            appContainer.innerHTML = `<div class="card"><h2 class="text-danger">Error Loading View</h2><p>${err.message}</p></div>`;
        }
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        this.state.token = null;
        this.state.role = 'user';
        this.state.user = null;
        this.navigate('home');
        this.showToast('Logged out successfully', 'success');
    },

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast show ${type}`;
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    },

    showForgotPasswordModal() {
        const modal = document.getElementById('forgotPasswordModal');
        if (modal) {
            modal.style.display = 'block';
            document.getElementById('forgotPasswordStep1').style.display = 'block';
            document.getElementById('forgotPasswordStep2').style.display = 'none';
            document.getElementById('forgotPasswordFormStep1').reset();
            document.getElementById('forgotPasswordFormStep2').reset();
        }
    },

    closeForgotPasswordModal() {
        const modal = document.getElementById('forgotPasswordModal');
        if (modal) modal.style.display = 'none';
    },

    async handleForgotPasswordRequest(e) {
        e.preventDefault();
        const email = document.getElementById('forgotEmail').value;
        const btn = document.getElementById('btnRequestOtp');
        const origText = btn.innerHTML;
        btn.innerHTML = 'Sending...';
        btn.disabled = true;

        try {
            await api.auth.requestPasswordReset(email);
            app.showToast('Verification code sent to your email!', 'success');
            document.getElementById('forgotPasswordStep1').style.display = 'none';
            document.getElementById('forgotPasswordStep2').style.display = 'block';
        } catch (err) {
            app.showToast(err.message || 'Failed to send code', 'error');
        } finally {
            btn.innerHTML = origText;
            btn.disabled = false;
        }
    },

    async handleForgotPasswordReset(e) {
        e.preventDefault();
        const email = document.getElementById('forgotEmail').value; // from step 1
        const otp = document.getElementById('forgotOtp').value;
        const newPassword = document.getElementById('forgotNewPassword').value;
        const btn = document.getElementById('btnResetPassword');
        const origText = btn.innerHTML;
        btn.innerHTML = 'Resetting...';
        btn.disabled = true;

        try {
            await api.auth.resetPasswordWithOtp(email, otp, newPassword);
            app.showToast('Password reset successfully! You can now log in.', 'success');
            app.closeForgotPasswordModal();
        } catch (err) {
            app.showToast(err.message || 'Failed to reset password', 'error');
        } finally {
            btn.innerHTML = origText;
            btn.disabled = false;
        }
    },

    viewControllers: {
        login: () => {
            document.getElementById('loginForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                const btn = e.target.querySelector('button');
                btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Logging in...';
                
                try {
                    const data = await api.auth.login(
                        document.getElementById('email').value,
                        document.getElementById('password').value
                    );
                    app.state.token = data.token;
                    app.state.role = data.role || 'user';
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('role', app.state.role);
                    app.showToast('Login successful!');
                    
                    if (app.state.role === 'admin') {
                        app.navigate('admin_dashboard');
                    } else {
                        app.navigate('dashboard');
                    }
                } catch (err) {
                    app.showToast(err.message, 'error');
                } finally {
                    btn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Login';
                }
            });
        },
        admin_login: () => {
            document.getElementById('adminLoginForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                const btn = e.target.querySelector('button');
                btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Logging in...';
                
                try {
                    const data = await api.auth.login(
                        document.getElementById('adminEmail').value,
                        document.getElementById('adminPassword').value
                    );
                    if (data.role !== 'admin') {
                        throw new Error('Not authorized as an administrator.');
                    }
                    app.state.token = data.token;
                    app.state.role = data.role;
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('role', app.state.role);
                    app.showToast('Admin Login successful!');
                    app.navigate('admin_dashboard');
                } catch (err) {
                    app.showToast(err.message, 'error');
                } finally {
                    btn.innerHTML = '<i class="fa-solid fa-user-shield"></i> Admin Login';
                }
            });
        },
        signup: () => {
            document.getElementById('signupForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                const btn = e.target.querySelector('button');
                btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Creating account...';
                
                try {
                    const payload = {
                        name: document.getElementById('name').value,
                        email: document.getElementById('email').value,
                        password: document.getElementById('password').value,
                        preferredStudyTimeRange: {
                            start: document.getElementById('studyStart').value,
                            end: document.getElementById('studyEnd').value
                        },
                        semesterStartDate: document.getElementById('semesterStartDate').value,
                        semesterEndDate: document.getElementById('semesterEndDate').value
                    };
                    const data = await api.auth.signup(payload);
                    app.state.token = data.token;
                    app.state.role = data.role || 'user';
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('role', app.state.role);
                    
                    app.showToast('Account created successfully!');
                    app.navigate('dashboard');
                } catch (err) {
                    app.showToast(err.message, 'error');
                } finally {
                    btn.innerHTML = '<i class="fa-solid fa-user-plus"></i> Sign Up';
                }
            });
        },
        dashboard: async () => {
            try {
                const [todaySchedule, userProfile] = await Promise.all([
                    api.schedule.getToday(),
                    api.auth.me()
                ]);
                
                const dashContent = document.getElementById('dashboard-content');
                
                // Update Topics Completed Metric
                if (userProfile && userProfile.topicProgress) {
                    const completedCount = userProfile.topicProgress.filter(p => p.highestUnlockedLevel === 'completed').length;
                    const countElem = document.getElementById('topics-completed-count');
                    if (countElem) countElem.textContent = completedCount;
                }

                let html = '';

                // Progress Section
                if (userProfile && userProfile.topicProgress && userProfile.topicProgress.length > 0) {
                    html += `<div class="card mt-4"><h3><i class="fa-solid fa-chart-line"></i> Your Progress</h3><div class="mt-3">`;
                    userProfile.topicProgress.forEach(progress => {
                        let percentage = 0;
                        if (progress.highestUnlockedLevel === 'beginner') percentage = 0;
                        else if (progress.highestUnlockedLevel === 'intermediate') percentage = 33;
                        else if (progress.highestUnlockedLevel === 'advanced') percentage = 66;
                        else if (progress.highestUnlockedLevel === 'completed') percentage = 100;
                        
                        html += `
                            <div class="mb-3">
                                <div class="progress-header">
                                    <span>${progress.topic}</span>
                                    <span>${percentage}%</span>
                                </div>
                                <div class="progress-track">
                                    <div class="progress-fill" style="width: ${percentage}%;"></div>
                                </div>
                            </div>
                        `;
                    });
                    html += `</div></div>`;
                }
                
                if(!todaySchedule || todaySchedule.length === 0) {
                     html += `
                        <div class="card mt-4">
                            <h3>Welcome!</h3>
                            <p class="text-muted mb-2">You don't have any study tasks scheduled for today.</p>
                            <button class="btn btn-primary" onclick="generateNewSchedule()"><i class="fa-solid fa-calendar-plus"></i> Generate Schedule</button>
                        </div>
                     `;
                } else {
                     html += `<div class="card mt-4"><h3><i class="fa-solid fa-list-check"></i> Today's Tasks</h3><div class="timeline">`;
                     todaySchedule.forEach((task, index) => {
                         const timeStr = new Date(task.scheduledTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                         const delay = index * 0.15; // Stagger animation
                         html += `
                            <div class="timeline-item ${task.completed ? 'completed' : ''}" style="animation-delay: ${delay}s">
                                <div class="timeline-content">
                                    <div>
                                        <h4>${task.topic}</h4>
                                        <span class="text-muted"><i class="fa-regular fa-clock"></i> ${timeStr} | ${task.subject}</span>
                                    </div>
                                    ${task.completed 
                                        ? '<span class="badge badge-success"><i class="fa-solid fa-check"></i> Completed</span>'
                                        : `<button class="btn btn-outline btn-sm" onclick="markTaskDone('${task._id}', '${task.topic.replace(/'/g, "\\'")}')">Mark Done</button>`
                                    }
                                </div>
                            </div>
                         `;
                     });
                     html += `</div></div>`;
                }
                dashContent.innerHTML = html;
            } catch (err) {
                app.showToast('Failed to load dashboard', 'error');
            }
        },
        schedule: async () => {
             // Basic view, identical call to dashboard for now
             app.viewControllers.dashboard();
        },
        tests: async () => {
            const container = document.getElementById('test-container');
            container.innerHTML = '<div class="loader-container"><div class="spinner"></div></div>';
            
            try {
                const userProfile = await api.auth.me();
                if (!userProfile.topicProgress || userProfile.topicProgress.length === 0) {
                    container.innerHTML = '<h3>Available Mock Tests</h3><p class="text-muted">You have no topics in progress. Please complete tasks in your schedule first.</p>';
                    return;
                }
                
                let html = '<h3>Available Mock Tests</h3><p class="text-muted">Select a test below to begin. New tests unlock as you progress!</p><div id="tests-list" class="mt-3">';
                
                for (let progress of userProfile.topicProgress) {
                    const topic = progress.topic;
                    const highestUnlocked = progress.highestUnlockedLevel;
                    const levels = ['beginner', 'intermediate', 'advanced'];
                    
                    const levelRank = { 'beginner': 1, 'intermediate': 2, 'advanced': 3, 'completed': 4 };
                    const userRank = levelRank[highestUnlocked] || 0;
                    
                    html += `<h4 class="mt-4" style="margin-bottom: 10px;">${topic}</h4>`;
                    
                    for (let level of levels) {
                        const testRank = levelRank[level];
                        const isUnlocked = userRank >= testRank;
                        
                        if (isUnlocked) {
                             html += `
                                <div class="list-item">
                                    <div>
                                        <h4 style="margin: 0;">${level.charAt(0).toUpperCase() + level.slice(1)} Test</h4>
                                    </div>
                                    <button class="btn btn-primary" onclick="startTest('${topic}', '${level}')">Start <i class="fa-solid fa-arrow-right"></i></button>
                                </div>
                             `;
                        } else {
                             html += `
                                <div class="list-item" style="opacity:0.6;">
                                    <div>
                                        <h4 style="margin: 0;">${level.charAt(0).toUpperCase() + level.slice(1)} Test</h4>
                                    </div>
                                    <button class="btn" disabled><i class="fa-solid fa-lock"></i> Locked</button>
                                </div>
                             `;
                        }
                    }
                }
                html += '</div>';
                container.innerHTML = html;
                
            } catch (err) {
                console.error("Test loading error:", err);
                container.innerHTML = `<p class="text-danger">Failed to load tests. Error: ${err.message}</p>`;
            }
        },
        home: () => {},
        about: () => {},
        contact: () => {},
        profile: async () => {
             const container = document.getElementById('profile-container');
             if(!container) return;
             container.innerHTML = '<div class="spinner"></div>';
             try {
                 const profile = await api.auth.me();
                 
                 let subjectsHtml = '';
                 if (profile.subjects && profile.subjects.length > 0) {
                     subjectsHtml = `<div class="mt-4"><h3><i class="fa-solid fa-book"></i> Subject Performance</h3>`;
                     profile.subjects.forEach(subj => {
                         subjectsHtml += `
                             <div class="mb-3">
                                 <div class="progress-header">
                                     <span>${subj.subjectName}</span>
                                     <span>${subj.progressPercentage}%</span>
                                 </div>
                                 <div class="progress-track">
                                     <div class="progress-fill" style="width: ${subj.progressPercentage}%;"></div>
                                 </div>
                             </div>
                         `;
                     });
                     subjectsHtml += `</div>`;
                 }

                 let topicsHtml = '';
                 if (profile.topicProgress && profile.topicProgress.length > 0) {
                     topicsHtml = `<div class="mt-4"><h3><i class="fa-solid fa-list-check"></i> Topic Progress</h3><ul style="list-style: none; padding: 0;">`;
                     profile.topicProgress.forEach(tp => {
                         let pct = 0;
                         if (tp.highestUnlockedLevel === 'intermediate') pct = 33;
                         else if (tp.highestUnlockedLevel === 'advanced') pct = 66;
                         else if (tp.highestUnlockedLevel === 'completed') pct = 100;
                         
                         topicsHtml += `<li style="padding: 10px; border-bottom: 1px solid #eee;">
                             <strong>${tp.topic}</strong> &ndash; <span class="text-muted"><span style="color: #6366f1; font-weight: 500;">${pct}%</span> completed</span>
                         </li>`;
                     });
                     topicsHtml += `</ul></div>`;
                 }

                 const academicCard = `
                    <div class="card profile-card" style="padding: 30px; margin-bottom: 20px;">
                        <h3 style="margin-bottom: 20px;"><i class="fa-solid fa-graduation-cap"></i> Academic Profile</h3>
                        <form id="academicUpdateForm">
                            <div class="mb-3">
                                <label style="font-weight: 500; display: block; margin-bottom: 5px;">Full Name</label>
                                <input type="text" id="profile-name" value="${profile.name}" class="form-control" required>
                            </div>
                            <div class="mb-3 mt-3">
                                <label style="font-weight: 500; display: block; margin-bottom: 5px;">Semester Timeline</label>
                                <div style="display: flex; gap: 10px; align-items: center;">
                                    <input type="date" id="profile-sem-start" value="${new Date(profile.semesterStartDate).toISOString().split('T')[0]}" class="form-control" style="flex: 1;" required>
                                    <span class="text-muted">to</span>
                                    <input type="date" id="profile-sem-end" value="${new Date(profile.semesterEndDate).toISOString().split('T')[0]}" class="form-control" style="flex: 1;" required>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label style="font-weight: 500; display: block; margin-bottom: 5px;">Daily Study Target</label>
                                <div style="display: flex; gap: 10px; align-items: center;">
                                    <input type="time" id="profile-study-start" value="${profile.preferredStudyTimeRange.start}" class="form-control" style="flex: 1;" required>
                                    <span class="text-muted">-</span>
                                    <input type="time" id="profile-study-end" value="${profile.preferredStudyTimeRange.end}" class="form-control" style="flex: 1;" required>
                                </div>
                            </div>
                            <button type="submit" class="btn btn-primary mt-2"><i class="fa-solid fa-save"></i> Save Academic Info</button>
                        </form>
                        <hr style="margin: 25px 0; border-top: 1px solid #eee;"/>
                        ${subjectsHtml}
                        ${topicsHtml}
                    </div>
                 `;

                 const securityCard = `
                    <div class="card profile-card" style="padding: 30px;">
                        <h3 style="margin-bottom: 20px;"><i class="fa-solid fa-shield-halved"></i> Account Settings</h3>
                        
                        <div style="background:#f9fafb; padding:20px; border-radius:8px; margin-bottom:15px; border: 1px solid #eee;">
                            <label style="font-weight: 500; margin-bottom: 5px;">Email Address</label>
                            <p style="margin-bottom: 15px; font-size:16px;">${profile.email}</p>
                            <button type="button" id="toggle-email-btn" class="btn" style="background:#e0e7ff; color:#6366f1; border:none; padding:8px 16px;"><i class="fa-solid fa-envelope"></i> Change Email</button>
                            
                            <form id="emailChangeForm" style="display:none; margin-top:20px; background:#fff; padding:20px; border:1px solid #e5e7eb; border-radius:6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                                <div id="email-step-1">
                                    <div class="mb-3">
                                        <input type="password" id="email-curr-pass" class="form-control" placeholder="Current Password" required>
                                    </div>
                                    <div class="mb-3">
                                        <input type="email" id="email-new" class="form-control" placeholder="New Email Address" required>
                                    </div>
                                    <button type="submit" class="btn btn-primary w-100">Send Verification Code</button>
                                </div>
                                <div id="email-step-2" style="display:none;">
                                    <div class="mb-3">
                                        <p class="text-muted text-sm mb-2"><i class="fa-solid fa-circle-info"></i> We sent a 6-digit code to your new email inbox.</p>
                                        <input type="text" id="email-otp" class="form-control" placeholder="Enter 6-digit OTP" required>
                                    </div>
                                    <button type="button" id="btn-verify-otp" class="btn btn-success w-100">Verify & Update Email</button>
                                </div>
                            </form>
                        </div>

                        <div style="background:#f9fafb; padding:20px; border-radius:8px; border: 1px solid #eee;">
                            <label style="font-weight: 500; margin-bottom: 5px;">Password</label>
                            <p style="margin-bottom: 15px; font-size:16px;">********</p>
                            <button type="button" id="toggle-pass-btn" class="btn" style="background:#e0e7ff; color:#6366f1; border:none; padding:8px 16px;"><i class="fa-solid fa-lock"></i> Change Password</button>
                            
                            <form id="passChangeForm" style="display:none; margin-top:20px; background:#fff; padding:20px; border:1px solid #e5e7eb; border-radius:6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                                <div class="mb-3">
                                    <input type="password" id="pass-curr" class="form-control" placeholder="Current Password" required>
                                </div>
                                <div class="mb-3">
                                    <input type="password" id="pass-new" class="form-control" placeholder="New Password" required minlength="6">
                                </div>
                                <button type="submit" class="btn btn-primary w-100">Update Password</button>
                            </form>
                        </div>
                    </div>
                 `;

                 container.innerHTML = academicCard + securityCard;

                 // Logic: Academic Profile
                 document.getElementById('academicUpdateForm').addEventListener('submit', async (e) => {
                     e.preventDefault();
                     const btn = e.target.querySelector('button');
                     const origHTML = btn.innerHTML;
                     btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';
                     btn.disabled = true;
                     try {
                         await api.auth.updateProfile({
                             name: document.getElementById('profile-name').value,
                             semesterStartDate: document.getElementById('profile-sem-start').value,
                             semesterEndDate: document.getElementById('profile-sem-end').value,
                             preferredStudyTimeRange: {
                                 start: document.getElementById('profile-study-start').value,
                                 end: document.getElementById('profile-study-end').value
                             }
                         });
                         app.showToast('Academic Profile updated successfully!', 'success');
                         app.viewControllers.profile(); // Re-render seamlessly
                     } catch (err) {
                         app.showToast(err.message, 'error');
                         btn.innerHTML = origHTML;
                         btn.disabled = false;
                     }
                 });

                 // Logic: Toggle Forms
                 document.getElementById('toggle-email-btn').addEventListener('click', () => {
                     const f = document.getElementById('emailChangeForm');
                     f.style.display = f.style.display === 'none' ? 'block' : 'none';
                 });
                 document.getElementById('toggle-pass-btn').addEventListener('click', () => {
                     const f = document.getElementById('passChangeForm');
                     f.style.display = f.style.display === 'none' ? 'block' : 'none';
                 });

                 // Logic: Password Change
                 document.getElementById('passChangeForm').addEventListener('submit', async (e) => {
                     e.preventDefault();
                     const curr = document.getElementById('pass-curr').value;
                     const target = document.getElementById('pass-new').value;
                     const btn = e.target.querySelector('button');
                     btn.innerHTML = 'Updating...'; btn.disabled = true;
                     try {
                         await api.auth.changePassword(curr, target);
                         app.showToast('Password updated securely.', 'success');
                         e.target.reset();
                         e.target.style.display = 'none';
                     } catch(err) {
                         app.showToast(err.message, 'error');
                     } finally {
                         btn.innerHTML = 'Update Password'; btn.disabled = false;
                     }
                 });

                 // Logic: Email Change (Request OTP)
                 document.getElementById('emailChangeForm').addEventListener('submit', async (e) => {
                     e.preventDefault();
                     const curr = document.getElementById('email-curr-pass').value;
                     const newEmail = document.getElementById('email-new').value;
                     const btn = e.target.querySelector('button');
                     btn.innerHTML = 'Sending OTP...'; btn.disabled = true;
                     try {
                         await api.auth.requestEmailChange(curr, newEmail);
                         app.showToast('OTP code sent to new email! Please verify below.', 'success');
                         document.getElementById('email-step-1').style.display = 'none';
                         document.getElementById('email-step-2').style.display = 'block';
                     } catch(err) {
                         app.showToast(err.message, 'error');
                         btn.innerHTML = 'Send Verification Code'; btn.disabled = false;
                     }
                 });

                 // Logic: Verify OTP
                 document.getElementById('btn-verify-otp').addEventListener('click', async () => {
                     const otp = document.getElementById('email-otp').value;
                     if(!otp) return app.showToast('Enter the OTP', 'error');
                     const btn = document.getElementById('btn-verify-otp');
                     btn.innerHTML = 'Verifying...'; btn.disabled = true;
                     try {
                         await api.auth.verifyEmailChange(otp);
                         app.showToast('Email verified and updated!', 'success');
                         app.viewControllers.profile(); // Re-render to show new email
                     } catch(err) {
                         app.showToast(err.message, 'error');
                         btn.innerHTML = 'Verify & Update Email'; btn.disabled = false;
                     }
                 });

             } catch(e) {
                 container.innerHTML = '<p class="text-danger">Failed to load profile.</p>';
             }
        },
        admin_dashboard: async () => {
             const statsContainer = document.getElementById('admin-stats-container');
             const usersTable = document.getElementById('admin-users-table');
             if(!statsContainer || !usersTable) return;
             
             try {
                 const [stats, users] = await Promise.all([
                     api.admin.getStats(),
                     api.admin.getUsers()
                 ]);
                 
                 statsContainer.innerHTML = `
                    <div class="stat-card" onclick="openAdminModal('users')" style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); border: 1px solid #e5e7eb; text-align: center; cursor: pointer; transition: transform 0.2s;">
                        <i class="fa-solid fa-users" style="font-size: 2rem; color: #6366f1; margin-bottom: 10px;"></i>
                        <h3 style="margin: 0;">${stats.users}</h3>
                        <p class="text-muted" style="margin: 0; font-size: 0.9rem;">Total Students</p>
                    </div>
                    <div class="stat-card" onclick="openAdminModal('syllabuses')" style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); border: 1px solid #e5e7eb; text-align: center; cursor: pointer; transition: transform 0.2s;">
                        <i class="fa-solid fa-file-pdf" style="font-size: 2rem; color: #10b981; margin-bottom: 10px;"></i>
                        <h3 style="margin: 0;">${stats.syllabuses}</h3>
                        <p class="text-muted" style="margin: 0; font-size: 0.9rem;">Syllabuses Processed</p>
                    </div>
                    <div class="stat-card" onclick="openAdminModal('schedules')" style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); border: 1px solid #e5e7eb; text-align: center; cursor: pointer; transition: transform 0.2s;">
                        <i class="fa-solid fa-calendar-check" style="font-size: 2rem; color: #f59e0b; margin-bottom: 10px;"></i>
                        <h3 style="margin: 0;">${stats.schedules}</h3>
                        <p class="text-muted" style="margin: 0; font-size: 0.9rem;">Daily Tasks Assigned</p>
                    </div>
                    <div class="stat-card" onclick="openAdminModal('mocktests')" style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); border: 1px solid #e5e7eb; text-align: center; cursor: pointer; transition: transform 0.2s;">
                        <i class="fa-solid fa-brain" style="font-size: 2rem; color: #ec4899; margin-bottom: 10px;"></i>
                        <h3 style="margin: 0;">${stats.mockTestGenerations}</h3>
                        <p class="text-muted" style="margin: 0; font-size: 0.9rem;">AI Mock Tests Cached</p>
                    </div>
                 `;
                 
                 let tableHtml = '';
                 users.forEach(u => {
                     tableHtml += `
                        <tr style="border-bottom: 1px solid #e5e7eb;">
                            <td style="padding: 12px; font-weight: 500;">${u.name}</td>
                            <td style="padding: 12px; color: #6b7280;">${u.email}</td>
                            <td style="padding: 12px;">${new Date(u.createdAt).toLocaleDateString()}</td>
                            <td style="padding: 12px;">
                                <span class="badge ${new Date(u.semesterEndDate) > new Date() ? 'badge-primary' : 'badge-danger'}">
                                    Ends ${new Date(u.semesterEndDate).toLocaleDateString()}
                                </span>
                            </td>
                            <td style="padding: 12px;">
                                <button onclick="deleteAdminData('users', '${u._id}')" class="btn btn-outline" style="color: #dc2626; border-color: #dc2626; padding: 4px 8px; font-size: 0.8rem;"><i class="fa-solid fa-trash"></i> Delete</button>
                            </td>
                        </tr>
                     `;
                 });
                 if(users.length === 0) {
                     tableHtml = '<tr><td colspan="5" style="text-align: center; padding: 20px; color: #6b7280;">No registered users found.</td></tr>';
                 }
                 usersTable.innerHTML = tableHtml;
                 
             } catch(e) {
                 statsContainer.innerHTML = '<p class="text-danger">Failed to load admin statistics</p>';
                 usersTable.innerHTML = '<tr><td colspan="5" class="text-danger">Failed to load users</td></tr>';
             }
        }
    }
};

// Global Admin Helpers
window.openAdminModal = async (type) => {
    const modal = document.getElementById('admin-modal');
    const title = document.getElementById('admin-modal-title');
    const content = document.getElementById('admin-modal-content');
    
    modal.style.display = 'flex';
    content.innerHTML = '<div class="loader-container"><div class="spinner"></div></div>';
    
    try {
        let data = [];
        let html = '<table style="width: 100%; border-collapse: collapse; text-align: left;">';
        
        if (type === 'users') {
            title.textContent = 'Manage Users';
            data = await api.admin.getUsers();
            html += `<thead><tr style="border-bottom: 2px solid #e5e7eb;"><th style="padding: 8px;">Email</th><th style="padding: 8px;">Name</th><th style="padding: 8px;">Action</th></tr></thead><tbody>`;
            data.forEach(item => {
                html += `<tr style="border-bottom: 1px solid #e5e7eb;">
                    <td style="padding: 8px;">${item.email}</td>
                    <td style="padding: 8px;">${item.name}</td>
                    <td style="padding: 8px;"><button onclick="deleteAdminData('${type}', '${item._id}')" class="btn btn-outline" style="color:red; border-color:red; padding: 4px 8px;"><i class="fa-solid fa-trash"></i></button></td>
                </tr>`;
            });
        } 
        else if (type === 'syllabuses') {
            title.textContent = 'Manage Syllabuses';
            data = await api.admin.getSyllabuses();
            html += `<thead><tr style="border-bottom: 2px solid #e5e7eb;"><th style="padding: 8px;">Subject</th><th style="padding: 8px;">User Email</th><th style="padding: 8px;">Topics</th><th style="padding: 8px;">Action</th></tr></thead><tbody>`;
            data.forEach(item => {
                html += `<tr style="border-bottom: 1px solid #e5e7eb;">
                    <td style="padding: 8px;">${item.subject}</td>
                    <td style="padding: 8px;">${item.userId ? item.userId.email : 'Unknown'}</td>
                    <td style="padding: 8px;">${item.topics.length}</td>
                    <td style="padding: 8px;"><button onclick="deleteAdminData('${type}', '${item._id}')" class="btn btn-outline" style="color:red; border-color:red; padding: 4px 8px;"><i class="fa-solid fa-trash"></i></button></td>
                </tr>`;
            });
        }
        else if (type === 'schedules') {
            title.textContent = 'Manage Schedules';
            data = await api.admin.getSchedules();
            html += `<thead><tr style="border-bottom: 2px solid #e5e7eb;"><th style="padding: 8px;">Time</th><th style="padding: 8px;">Topic</th><th style="padding: 8px;">User Email</th><th style="padding: 8px;">Done</th><th style="padding: 8px;">Action</th></tr></thead><tbody>`;
            data.forEach(item => {
                html += `<tr style="border-bottom: 1px solid #e5e7eb;">
                    <td style="padding: 8px;">${new Date(item.scheduledTime).toLocaleDateString()}</td>
                    <td style="padding: 8px;" title="${item.topic}">${item.topic.length > 30 ? item.topic.substring(0,30)+'...' : item.topic}</td>
                    <td style="padding: 8px;">${item.userId ? item.userId.email : 'Unknown'}</td>
                    <td style="padding: 8px;">${item.completed ? '✅' : '❌'}</td>
                    <td style="padding: 8px;"><button onclick="deleteAdminData('${type}', '${item._id}')" class="btn btn-outline" style="color:red; border-color:red; padding: 4px 8px;"><i class="fa-solid fa-trash"></i></button></td>
                </tr>`;
            });
        }
        else if (type === 'mocktests') {
            title.textContent = 'Manage Mock Tests (Cache)';
            data = await api.admin.getMockTests();
            html += `<thead><tr style="border-bottom: 2px solid #e5e7eb;"><th style="padding: 8px;">Topic</th><th style="padding: 8px;">Level</th><th style="padding: 8px;">Action</th></tr></thead><tbody>`;
            data.forEach(item => {
                html += `<tr style="border-bottom: 1px solid #e5e7eb;">
                    <td style="padding: 8px;">${item.topic}</td>
                    <td style="padding: 8px;">${item.level}</td>
                    <td style="padding: 8px;"><button onclick="deleteAdminData('${type}', '${item._id}')" class="btn btn-outline" style="color:red; border-color:red; padding: 4px 8px;"><i class="fa-solid fa-trash"></i></button></td>
                </tr>`;
            });
        }
        
        if(data.length === 0) {
            html += `<tr><td colspan="5" style="text-align: center; padding: 20px;">No records found.</td></tr>`;
        }
        
        html += `</tbody></table>`;
        content.innerHTML = html;
        
    } catch(err) {
        content.innerHTML = `<p class="text-danger">Error loading data: ${err.message}</p>`;
    }
};

window.deleteAdminData = async (type, id) => {
    if(!confirm('Are you sure you want to delete this record? This cannot be undone.')) return;
    
    try {
        if(type === 'users') await api.admin.deleteUser(id);
        else if(type === 'syllabuses') await api.admin.deleteSyllabus(id);
        else if(type === 'schedules') await api.admin.deleteSchedule(id);
        else if(type === 'mocktests') await api.admin.deleteMockTest(id);
        
        app.showToast('Record deleted successfully', 'success');
        
        // Refresh the underlying page dashboard stats
        app.viewControllers.admin_dashboard();
        
        // If the modal is open, refresh its content
        const modal = document.getElementById('admin-modal');
        if(modal && modal.style.display === 'flex') {
            window.openAdminModal(type);
        }
        
    } catch(err) {
        app.showToast(`Failed to delete: ${err.message}`, 'error');
    }
};

// Global helper functions for inline handlers
window.uploadSyllabus = async () => {
    try {
        const subject = document.getElementById('syl-subject').value;
        const fileInput = document.getElementById('syl-file');
        const textInput = document.getElementById('syl-topics').value;
        
        let rawTopicsText = "";

        if (!subject) {
            app.showToast('Please enter a Subject Name', 'error');
            return;
        }

        // Processing File Upload via backend extractor
        if (fileInput && fileInput.files.length > 0) {
            const formData = new FormData();
            formData.append('syllabusFile', fileInput.files[0]);
            
            const extractData = await api.syllabus.extract(formData);
            rawTopicsText = extractData.text;
        } else if (textInput.trim() !== "") {
            // Processing manual text area
            rawTopicsText = textInput;
        } else {
            app.showToast('Please upload a file or paste topics manually.', 'error');
            return;
        }

        // --- PREPROCESSING STEP: Fix continuous paragraph issues ---
        // 1. Normalize spacing for merged boilerplate words
        const mergedWordsMap = {
            "COURSEDESCRIPTIONANDOBJECTIVES": "COURSE DESCRIPTION AND OBJECTIVES",
            "COURSEOUTCOMES?": "COURSE OUTCOMES",
            "SUGGESTEDREADING": "SUGGESTED READING",
            "REFERENCEBOOKS": "REFERENCE BOOKS",
            "TEXTBOOKS?": "TEXT BOOKS",
            "PREREQUISITESKNOWLEDGE": "PREREQUISITES KNOWLEDGE"
        };
        for (const [key, value] of Object.entries(mergedWordsMap)) {
            const regex = new RegExp(key, 'gi');
            rawTopicsText = rawTopicsText.replace(regex, `\n${value}\n`);
        }

        // 2. Insert artificial line breaks around unit headers
        rawTopicsText = rawTopicsText.replace(/((?:UNIT|CHAPTER|MODULE|LESSON)[-\s_:]*(?:\d+|[IVX]+|ONE|TWO|THREE|FOUR|FIVE(?:TH)?))/gi, '\n$1\n');

        // 3. Insert line breaks after delimiters (Periods, Semicolons, Colons)
        // Note: Using negative lookahead (?!\d) to avoid splitting valid decimal/version numbers like 1.5 or 10:30
        rawTopicsText = rawTopicsText.replace(/([.;:])\s*(?!\d)/g, '$1\n');

        // 4. Globally remove course hour metadata (e.g. 10L+0T+10P=20 Hours or 8L+0T+8P=16 Hours)
        // This handles cases where PDF extraction merged it with the next word (e.g. "20 HoursLINUX")
        rawTopicsText = rawTopicsText.replace(/\(?\d+\s*[LTP]\s*(?:[+-]\s*\d+\s*[LTP]?)*\s*(?:=\s*\d+\s*(?:Hours|Hrs|H)?)?\)?[-\s_:]*/gi, '');

        let lines = rawTopicsText.split('\n');
        
        let hasUnits = /^(?:UNIT|CHAPTER|MODULE|LESSON)\s*(?:-|_|:)?\s*(?:\d+|[IVX]+|ONE|TWO|THREE|FOUR|FIVE)/im.test(rawTopicsText);
        let isExtractingTopics = !hasUnits;
        let currentUnit = "General Syllabus";
        let rawExtracted = [];

        console.log("[DEBUG] Document has units? ", hasUnits);
        console.log("=== RAW EXTRACTED TEXT START ===");
        console.log(rawTopicsText);
        console.log("=== RAW EXTRACTED TEXT END ===");

        lines.forEach((line, index) => {
            line = line.trim();
            if(!line) return;

            // Check for stop keywords that freeze extraction for metadata blocks
            if (/^(?:TEXTBOOKS?|REFERENCES?|COURSE OUTCOMES?|PRACTICES?|SKILLS?|EVALUATION|ASSESSMENT|SUGGESTED READING|REFERENCE BOOKS|TEXT BOOKS)/i.test(line)) {
                isExtractingTopics = false;
                return;
            }

            // Ignore common boilerplate lines anywhere in the line (Added preamble code block match)
            const ignoreKeywords = /^(?:\d+[A-Za-z]+\d*\s*-\s*|L\s*T\s*P\s*C|COURSE OBJECTIVES?|PREREQUISITES?\s*KNOWLEDGE|COURSE DESCRIPTION|COURSE CODE)/i;
            if (ignoreKeywords.test(line)) {
                return; 
            }

            // Check if line is a unit header
            const unitMatch = line.match(/^(?:UNIT|CHAPTER|MODULE|LESSON)\s*(?:-|_|:)?\s*(?:\d+|[IVX]+|ONE|TWO|THREE|FOUR|FIVE(?:TH)?)/i);
            if (unitMatch) {
                isExtractingTopics = true;
                currentUnit = unitMatch[0].toUpperCase().replace(/\s+/g, '').replace(/[-_:]/, '-');
                
                let remainder = line.substring(unitMatch[0].length).trim();
                remainder = remainder.replace(/^[-:.]\s*/, '');
                
                if (remainder.length > 2) {
                    rawExtracted.push({ unit: currentUnit, text: remainder });
                }
            } else if (isExtractingTopics) {
                // Skip lines that ONLY contain numbers or are extremely short
                if(line.replace(/[^A-Za-z]/g, '').length < 3) return;
                rawExtracted.push({ unit: currentUnit, text: line });
            }
        });

        console.log("=== RAW EXTRACTED LINES START ===");
        console.log(JSON.stringify(rawExtracted, null, 2));
        console.log("=== RAW EXTRACTED LINES END ===");

        let finalizeTopics = [];
        rawExtracted.forEach(item => {
            console.log(`[DEBUG] Processing line: "${item.text}"`);
            // Split line by inner sub-delimiters: colons, semicolons, and pipes
            let subtopics = item.text.split(/[:;|•○❖➢\t]+/);
            console.log(`[DEBUG] Topics before filtering:`, subtopics);
            
            subtopics.forEach(sub => {
                let cleaned = sub.replace(/^(\d+\.?\d*[.\)]\s+|-+\s*|\*\s*)+/, '').trim();
                if(cleaned.length < 2) {
                    console.log(`[DEBUG] Discarded (too short): "${cleaned}"`);
                    return; // Too short
                }
                if(/^(?:UNIT|CHAPTER|MODULE|LESSON)\s*-?\s*(?:\d+|[IVX]+)[:.]?$/i.test(cleaned)) {
                    console.log(`[DEBUG] Discarded (standalone header): "${cleaned}"`);
                    return; // Accidental standalone header
                }
                
                // Extra filter to drop random leftover headers if they split weirdly (only short ones)
                if (/^(?:TEXTBOOKS?|REFERENCES?|COURSE OUTCOMES?|PRACTICES?|SKILLS?|LTPC)/i.test(cleaned) && cleaned.length < 35) {
                    console.log(`[DEBUG] Discarded (keyword filter): "${cleaned}"`);
                    return;
                }

                // Relaxed string length split. Moderately sized strings are preserved.
                if (cleaned.length > 200) {
                    // It's exceptionally long, skip it to avoid huge chunks or try chunking
                    console.log(`[DEBUG] Topic very long, truncating down to 200 chars limit: "${cleaned.substring(0, 50)}..."`);
                    cleaned = cleaned.substring(0, 197) + "...";
                    finalizeTopics.push({ unit: item.unit, name: cleaned });
                } else {
                    console.log(`[DEBUG] Topic Accepted: "${cleaned}"`);
                    finalizeTopics.push({ unit: item.unit, name: cleaned });
                }
            });
        });

        console.log("=== TOPICS AFTER FILTERING START ===");
        console.log(JSON.stringify(finalizeTopics, null, 2));
        console.log("=== TOPICS AFTER FILTERING END ===");

        let topicsArray = finalizeTopics;
        console.log("[DEBUG] Final Topics Count: ", topicsArray.length);

        if (topicsArray.length === 0) {
            app.showToast('No valid topics found.', 'error');
            console.error("[DEBUG] Extraction failure. Document raw text was:\n", rawTopicsText);
            return;
        }

        const btn = document.querySelector('#syllabusForm button');
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Uploading...';
        btn.disabled = true;

        await api.syllabus.upload({ subject, topics: topicsArray });
        
        // Hide the form and hint at generating schedule
        document.getElementById('upload-syllabus-card').innerHTML = `
            <div class="text-center py-3">
                <i class="fa-solid fa-circle-check text-success" style="font-size: 3rem; margin-bottom: 15px;"></i>
                <h3>Syllabus Uploaded Successfully!</h3>
                <p class="text-muted mb-3">Your syllabus has been uploaded successfully. You will receive timely study reminder notifications in your email according to your study schedule. Please check your email.</p>
                <button class="btn btn-primary" onclick="generateNewSchedule()"><i class="fa-solid fa-calendar-plus"></i> Generate Schedule</button>
            </div>
        `;
        app.showToast('Syllabus uploaded successfully!', 'success');
        
    } catch (e) {
        app.showToast(e.message || 'Error uploading syllabus', 'error');
        const btn = document.querySelector('#syllabusForm button');
        btn.innerHTML = '<i class="fa-solid fa-upload"></i> Upload & Generate Schedule';
        btn.disabled = false;
    }
}

window.generateNewSchedule = async () => {
    try {
        await api.schedule.generate();
        app.showToast('Schedule generated successfully!', 'success');
        app.navigate('dashboard');
    } catch (e) {
        app.showToast('Failed to generate schedule. Make sure you have a syllabus.', 'error');
    }
}

window.markTaskDone = async (id, topic) => {
    try {
        await api.schedule.markDone(id);
        app.showToast('Task marked as completed! Launching Beginner Test...', 'success');
        app.navigate('tests');
        setTimeout(() => {
            if (window.startTest) {
                window.startTest(topic, 'beginner');
            }
        }, 800);
    } catch (e) {
        app.showToast(e.message || 'Error updating task', 'error');
    }
}

window.startTest = async (topic, level) => {
    let container = document.getElementById('test-container');
    // Show loader while AI generates the test
    container.innerHTML = `
        <div class="text-center py-5">
            <div class="spinner mb-3" style="margin: 0 auto;"></div>
            <h4 class="text-primary">Generating your custom AI Mock Test...</h4>
            <p class="text-muted">This may take 5-10 seconds depending on the topic.</p>
        </div>
    `;

    try {
        const testData = await api.tests.get(level, topic);
        if (!testData || !testData.questions) throw new Error("Failed to load test");
        
        let container = document.getElementById('test-container');
        let html = `<h3>${level.charAt(0).toUpperCase() + level.slice(1)} Test: ${topic}</h3>
                    <form id="activeTestForm" class="mt-4">`;
                    
        testData.questions.forEach((q, index) => {
            html += `<div class="card mb-3">
                        <p style="margin-bottom: 10px;"><strong>Q${index + 1}: ${q.questionText}</strong></p>
                        <div class="options">`;
            q.options.forEach((opt, optIndex) => {
                const optEscaped = opt.replace(/"/g, '&quot;');
                html += `
                    <div style="margin-bottom: 8px;">
                        <input type="radio" id="q${index}_opt${optIndex}" name="q${index}" value="${optEscaped}" required>
                        <label for="q${index}_opt${optIndex}" style="margin-left: 5px; cursor: pointer;">${opt}</label>
                    </div>
                `;
            });
            html += `</div></div>`;
        });
        
        html += `<div style="margin-top: 20px;">
                    <button type="submit" class="btn btn-primary">Submit Test</button>
                    <button type="button" class="btn btn-outline" style="margin-left: 10px;" onclick="app.navigate('tests')">Cancel</button>
                 </div>
                 </form>`;
        
        container.innerHTML = html;
        
        document.getElementById('activeTestForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            let answers = [];
            testData.questions.forEach((q, index) => {
                answers.push({
                    selectedOption: formData.get(`q${index}`)
                });
            });
            
            try {
                const res = await api.tests.submit(topic, level, answers);
                const score = res.result.score;
                const total = res.result.totalQuestions;
                let msg = `You scored ${score} out of ${total}.\n`;
                if(res.unlockedNextLevel) {
                    msg += "Congratulations! You unlocked the next level.";
                    app.showToast(msg, 'success');
                } else if (level === 'advanced' && score / total >= 0.7) {
                    msg += "Congratulations! You have fully completed this topic.";
                    app.showToast(msg, 'success');
                } else {
                    if (score / total >= 0.7) {
                        msg += "Great job! You passed.";
                        app.showToast(msg, 'success');
                    } else {
                        app.showToast("You did not pass this test. Please review the topic and try again.", 'error');
                    }
                }
                app.navigate('dashboard');
            } catch(submitErr) {
                app.showToast(submitErr.message || 'Error submitting test', 'error');
            }
        });
        
    } catch(err) {
        app.showToast(err.message, 'error');
    }
}

// Start app
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
