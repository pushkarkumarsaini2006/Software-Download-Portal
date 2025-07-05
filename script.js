// Language data
const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'th', name: 'ไทย', flag: '🇹🇭' },
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'pl', name: 'Polski', flag: '🇵🇱' },
    { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
    { code: 'sv', name: 'Svenska', flag: '🇸🇪' }
];

// Advanced Application State
class UltraEditDownloader {
    constructor() {
        this.downloadCount = parseInt(localStorage.getItem('downloadCount')) || 1234567;
        this.currentView = localStorage.getItem('currentView') || 'grid';
        this.theme = localStorage.getItem('theme') || 'light';
        this.userPreferences = JSON.parse(localStorage.getItem('userPreferences')) || {};
        this.downloadHistory = JSON.parse(localStorage.getItem('downloadHistory')) || [];
        this.analytics = JSON.parse(localStorage.getItem('analytics')) || {
            totalDownloads: 0,
            popularLanguages: {},
            preferredArchitecture: {},
            sessionStartTime: Date.now()
        };
        
        this.init();
    }

    init() {
        this.detectOS();
        this.generateLanguageGrid();
        this.setupEventListeners();
        this.updateDownloadCounter();
        this.setupKeyboardShortcuts();
        this.loadUserPreferences();
        this.startAnalytics();
        this.setupNotificationSystem();
        this.setupThemeSystem();
        this.setupAdvancedSearch();
        this.startPerformanceMonitoring();
    }

    // Enhanced OS Detection with detailed system info
    detectOS() {
        const userAgent = navigator.userAgent.toLowerCase();
        const platform = navigator.platform.toLowerCase();
        let os = 'Windows';
        let icon = 'fab fa-windows';
        let architecture = navigator.userAgent.includes('WOW64') || navigator.userAgent.includes('Win64') ? '64-bit' : '32-bit';
        
        // Enhanced detection
        if (userAgent.includes('mac')) {
            os = 'macOS';
            icon = 'fab fa-apple';
            architecture = userAgent.includes('intel') ? 'Intel' : 'Apple Silicon';
        } else if (userAgent.includes('linux')) {
            os = 'Linux';
            icon = 'fab fa-linux';
            architecture = platform.includes('64') ? '64-bit' : '32-bit';
        } else if (userAgent.includes('android')) {
            os = 'Android';
            icon = 'fab fa-android';
            architecture = 'ARM';
        } else if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
            os = 'iOS';
            icon = 'fab fa-apple';
            architecture = 'ARM64';
        }
        
        // Get additional system info
        const systemInfo = {
            os: os,
            architecture: architecture,
            userAgent: navigator.userAgent,
            language: navigator.language,
            cookieEnabled: location.protocol !== 'file:' ? navigator.cookieEnabled : 'N/A (file://)',
            onlineStatus: navigator.onLine,
            screenResolution: `${screen.width}x${screen.height}`,
            colorDepth: screen.colorDepth,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
        
        // Safely update DOM elements
        const detectedOSElement = document.getElementById('detectedOS');
        const osMessageElement = document.getElementById('osMessage');
        
        if (detectedOSElement) {
            detectedOSElement.textContent = os.toUpperCase();
        }
        
        if (osMessageElement) {
            osMessageElement.innerHTML = `
                <i class="${icon}"></i> 
                Detected: ${os} ${architecture} | 
                Resolution: ${systemInfo.screenResolution} | 
                Language: ${systemInfo.language}
            `;
        }
        
        this.systemInfo = systemInfo;
        this.logAnalytics('system_detected', systemInfo);
    }

    // Advanced Search with Fuzzy Matching
    setupAdvancedSearch() {
        const searchInput = document.getElementById('languageSearch');
        let searchTimeout;
        
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.fuzzySearch(e.target.value);
            }, 150);
        });
        
        // Add search suggestions
        const suggestionsContainer = document.createElement('div');
        suggestionsContainer.className = 'search-suggestions';
        searchInput.parentNode.appendChild(suggestionsContainer);
    }

    fuzzySearch(query) {
        if (!query) {
            this.showAllLanguages();
            return;
        }
        
        const results = languages.filter(lang => {
            const similarity = this.calculateSimilarity(query.toLowerCase(), lang.name.toLowerCase());
            return similarity > 0.3; // Threshold for fuzzy matching
        }).sort((a, b) => {
            const scoreA = this.calculateSimilarity(query.toLowerCase(), a.name.toLowerCase());
            const scoreB = this.calculateSimilarity(query.toLowerCase(), b.name.toLowerCase());
            return scoreB - scoreA;
        });
        
        this.displaySearchResults(results, query);
        this.logAnalytics('search_performed', { query, resultsCount: results.length });
    }

    calculateSimilarity(str1, str2) {
        // Simple Levenshtein distance algorithm
        const matrix = [];
        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }
        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }
        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        return 1 - matrix[str2.length][str1.length] / Math.max(str1.length, str2.length);
    }

    // Theme System
    setupThemeSystem() {
        // Add theme toggle button
        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.innerHTML = `<i class="fas fa-${this.theme === 'dark' ? 'sun' : 'moon'}"></i>`;
        themeToggle.onclick = () => this.toggleTheme();
        
        document.querySelector('.language-selector').after(themeToggle);
        this.applyTheme();
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.theme);
        this.applyTheme();
        this.showNotification(`Switched to ${this.theme} theme`, 'success');
    }

    applyTheme() {
        document.body.setAttribute('data-theme', this.theme);
        const themeToggle = document.querySelector('.theme-toggle i');
        if (themeToggle) {
            themeToggle.className = `fas fa-${this.theme === 'dark' ? 'sun' : 'moon'}`;
        }
    }

    // Notification System
    setupNotificationSystem() {
        // Only create if it doesn't already exist
        if (!document.querySelector('.notification-container')) {
            const notificationContainer = document.createElement('div');
            notificationContainer.className = 'notification-container';
            document.body.appendChild(notificationContainer);
        }
    }

    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentNode.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Ensure notification container exists
        let container = document.querySelector('.notification-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
        
        container.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        if (duration > 0) {
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, duration);
        }
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    // Keyboard Shortcuts
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + D: Start main download
            if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
                e.preventDefault();
                document.getElementById('mainDownloadBtn').click();
            }
            
            // Ctrl/Cmd + F: Focus search
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                e.preventDefault();
                document.getElementById('languageSearch').focus();
            }
            
            // Ctrl/Cmd + T: Toggle theme
            if ((e.ctrlKey || e.metaKey) && e.key === 't') {
                e.preventDefault();
                this.toggleTheme();
            }
            
            // Ctrl/Cmd + G: Toggle view
            if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
                e.preventDefault();
                this.setView(this.currentView === 'grid' ? 'list' : 'grid');
            }
            
            // Escape: Close modals
            if (e.key === 'Escape') {
                this.closeModal();
                document.querySelectorAll('.dropdown').forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            }
            
            // Show shortcuts help with ?
            if (e.key === '?' && !e.target.matches('input')) {
                this.showKeyboardShortcuts();
            }
        });
        
        this.showNotification('Keyboard shortcuts: Ctrl+D (Download), Ctrl+F (Search), Ctrl+T (Theme), ? (Help)', 'info', 5000);
    }

    showKeyboardShortcuts() {
        const shortcuts = [
            { key: 'Ctrl+D', description: 'Start main download' },
            { key: 'Ctrl+F', description: 'Focus search box' },
            { key: 'Ctrl+T', description: 'Toggle dark/light theme' },
            { key: 'Ctrl+G', description: 'Toggle grid/list view' },
            { key: 'Escape', description: 'Close modals and dropdowns' },
            { key: '?', description: 'Show this help' }
        ];
        
        const helpModal = document.createElement('div');
        helpModal.className = 'modal';
        helpModal.innerHTML = `
            <div class="modal-content">
                <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
                <h3><i class="fas fa-keyboard"></i> Keyboard Shortcuts</h3>
                <div class="shortcuts-list">
                    ${shortcuts.map(shortcut => `
                        <div class="shortcut-item">
                            <kbd>${shortcut.key}</kbd>
                            <span>${shortcut.description}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        document.body.appendChild(helpModal);
        helpModal.style.display = 'block';
    }

    // Performance Monitoring
    startPerformanceMonitoring() {
        // Monitor page load performance
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType("navigation")[0];
            const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
            
            this.logAnalytics('page_performance', {
                loadTime: loadTime,
                domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                firstPaint: performance.getEntriesByType('paint')[0]?.startTime || 0
            });
            
            if (loadTime > 3000) {
                this.showNotification('Page loaded slowly. Consider checking your connection.', 'warning');
            }
        });
        
        // Monitor memory usage (if available)
        if ('memory' in performance) {
            setInterval(() => {
                const memInfo = performance.memory;
                if (memInfo.usedJSHeapSize > memInfo.jsHeapSizeLimit * 0.9) {
                    this.showNotification('High memory usage detected', 'warning');
                }
            }, 30000);
        }
    }

    // Enhanced Analytics
    logAnalytics(event, data = {}) {
        const analyticsEntry = {
            event: event,
            timestamp: Date.now(),
            data: data,
            sessionId: this.analytics.sessionId || this.generateSessionId(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        this.analytics.events = this.analytics.events || [];
        this.analytics.events.push(analyticsEntry);
        
        // Update counters
        if (event === 'download_started') {
            this.analytics.totalDownloads++;
            this.analytics.popularLanguages[data.language] = (this.analytics.popularLanguages[data.language] || 0) + 1;
            this.analytics.preferredArchitecture[data.architecture] = (this.analytics.preferredArchitecture[data.architecture] || 0) + 1;
        }
        
        localStorage.setItem('analytics', JSON.stringify(this.analytics));
        
        // Send to analytics service (simulated)
        this.sendAnalytics(analyticsEntry);
    }

    generateSessionId() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    sendAnalytics(data) {
        // Only log analytics in development mode
        if (location.protocol === 'file:' || location.hostname === 'localhost') {
            console.log('Analytics (dev mode):', data.event, data.timestamp);
        }
        
        // In a real application, you would send this to your analytics service
        // fetch('/analytics', { method: 'POST', body: JSON.stringify(data) });
    }

    // Enhanced Download System with better error handling
    startDownload(langCode, architecture) {
        const language = languages.find(lang => lang.code === langCode);
        const downloadInfo = {
            language: langCode,
            languageName: language?.name || 'Unknown',
            architecture: architecture,
            timestamp: Date.now(),
            fileSize: Math.floor(Math.random() * 50 + 25), // MB
            downloadId: this.generateDownloadId()
        };
        
        this.logAnalytics('download_started', downloadInfo);
        this.showNotification(`Starting download: ${downloadInfo.languageName} (${architecture}-bit)`, 'info');
        
        const modal = document.getElementById('downloadModal');
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        const downloadStatus = document.getElementById('downloadStatus');
        
        modal.style.display = 'block';
        
        // Enhanced progress simulation with realistic network behavior
        let progress = 0;
        let speed = Math.random() * 10 + 5; // MB/s
        let pauseChance = 0.05; // 5% chance of temporary pause
        
        const interval = setInterval(() => {
            // Simulate network variations
            if (Math.random() < pauseChance) {
                speed = Math.max(1, speed * 0.5); // Slow down
                downloadStatus.textContent = 'Network congestion detected...';
            } else {
                speed = Math.min(15, speed * 1.1); // Speed up
            }
            
            progress += (speed / downloadInfo.fileSize) * 2;
            if (progress > 100) progress = 100;
            
            progressFill.style.width = progress + '%';
            progressText.textContent = Math.round(progress) + '%';
            
            // Update status messages
            if (progress < 10) {
                downloadStatus.textContent = 'Connecting to server...';
            } else if (progress < 25) {
                downloadStatus.textContent = `Downloading at ${speed.toFixed(1)} MB/s...`;
            } else if (progress < 75) {
                downloadStatus.textContent = `Downloaded ${Math.round(progress)}% - ${speed.toFixed(1)} MB/s`;
            } else if (progress < 95) {
                downloadStatus.textContent = 'Finalizing download...';
            } else if (progress >= 100) {
                downloadStatus.textContent = 'Download completed successfully!';
                clearInterval(interval);
                
                // Update counters and history
                this.downloadCount++;
                this.downloadHistory.push(downloadInfo);
                this.updateDownloadCounter();
                this.saveUserPreferences();
                
                this.logAnalytics('download_completed', downloadInfo);
                this.showNotification(`Download completed: ${downloadInfo.languageName}`, 'success');
                
                // Actually trigger download with error handling
                this.initiateFileDownload(langCode, architecture);
                
                setTimeout(() => {
                    this.closeModal();
                }, 1000);
            }
        }, 100);
    }

    // New method to handle actual file download with error handling
    initiateFileDownload(langCode, architecture) {
        try {
            // Create download link
            const link = document.createElement('a');
            link.href = 'ue_english.exe'; // Direct filename without path
            link.download = `ultraedit_${langCode}_${architecture}bit.exe`;
            
            // Append to body temporarily
            document.body.appendChild(link);
            
            // Trigger download
            link.click();
            
            // Clean up
            document.body.removeChild(link);
            
            console.log('✅ Download initiated successfully');
            this.showNotification('Download started!', 'success');
            
        } catch (error) {
            console.error('Download error:', error);
            
            // Fallback method 1: Direct window.open
            try {
                const newWindow = window.open('ue_english.exe', '_blank');
                if (!newWindow) {
                    throw new Error('Popup blocked');
                }
                this.showNotification('Download opened in new window', 'info');
            } catch (fallbackError1) {
                
                // Fallback method 2: Direct link navigation
                try {
                    window.location.href = 'ue_english.exe';
                    this.showNotification('Download initiated via navigation', 'info');
                } catch (fallbackError2) {
                    console.error('All download methods failed:', fallbackError2);
                    this.showNotification('Download failed. Please try manually accessing the file.', 'error');
                }
            }
        }
    }

    // User Preferences Management
    loadUserPreferences() {
        if (this.userPreferences.defaultView) {
            this.setView(this.userPreferences.defaultView);
        }
        if (this.userPreferences.preferredLanguage) {
            document.getElementById('languageSelect').value = this.userPreferences.preferredLanguage;
        }
    }

    saveUserPreferences() {
        this.userPreferences.lastVisit = Date.now();
        this.userPreferences.defaultView = this.currentView;
        this.userPreferences.downloadCount = this.downloadCount;
        this.userPreferences.theme = this.theme;
        
        localStorage.setItem('userPreferences', JSON.stringify(this.userPreferences));
        localStorage.setItem('downloadCount', this.downloadCount.toString());
        localStorage.setItem('downloadHistory', JSON.stringify(this.downloadHistory));
    }

    // Enhanced UI Methods
    generateLanguageGrid() {
        const grid = document.getElementById('downloadGrid');
        grid.innerHTML = '';
        
        languages.forEach((lang, index) => {
            const downloadCount = this.analytics.popularLanguages[lang.code] || 0;
            const isPopular = downloadCount > 10;
            const isRecommended = index < 3;
            
            const item = document.createElement('div');
            item.className = `item ${isRecommended ? 'recommended' : ''} ${isPopular ? 'popular' : ''}`;
            item.setAttribute('data-language', lang.name.toLowerCase());
            item.setAttribute('data-popularity', downloadCount);
            
            item.innerHTML = `
                <div class="item-header">
                    <span class="flag">${lang.flag}</span>
                    <div class="item-lang">${lang.name}</div>
                    ${isRecommended ? '<span class="recommended-badge"><i class="fas fa-star"></i> Recommended</span>' : ''}
                    ${isPopular ? '<span class="popular-badge"><i class="fas fa-fire"></i> Popular</span>' : ''}
                </div>
                <div class="download-buttons">
                    <a href="ue_english.exe" download="UltraEdit_${lang.name}_32bit.exe" class="btn blue download-btn">
                        <i class="fas fa-download"></i> Download 32-bit
                        <span class="download-info">~${Math.floor(Math.random() * 20 + 25)}MB</span>
                    </a>
                    <a href="ue_english.exe" download="UltraEdit_${lang.name}_64bit.exe" class="btn blue download-btn">
                        <i class="fas fa-download"></i> Download 64-bit
                        <span class="download-info">~${Math.floor(Math.random() * 20 + 30)}MB</span>
                    </a>
                </div>
                <div class="download-buttons">
                    <button class="btn secondary download-btn" onclick="app.startDownload('${lang.code}', '32')" 
                            data-lang="${lang.code}" data-arch="32">
                        <i class="fas fa-chart-line"></i> Download 32-bit (with progress)
                    </button>
                    <button class="btn secondary download-btn" onclick="app.startDownload('${lang.code}', '64')" 
                            data-lang="${lang.code}" data-arch="64">
                        <i class="fas fa-chart-line"></i> Download 64-bit (with progress)
                    </button>
                </div>
                <div class="file-info">
                    <small><i class="fas fa-calendar"></i> Updated: ${this.getRandomDate()}</small>
                    <small><i class="fas fa-download"></i> ${downloadCount} downloads</small>
                </div>
                ${downloadCount > 0 ? `<div class="popularity-bar"><div class="popularity-fill" style="width: ${Math.min(100, downloadCount * 10)}%"></div></div>` : ''}
            `;
            
            grid.appendChild(item);
        });
        
        // Add intersection observer for scroll animations
        this.setupScrollAnimations();
    }

    setupScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-view');
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('.item').forEach(item => {
            observer.observe(item);
        });
    }

    // Additional utility methods
    displaySearchResults(results, query) {
        const grid = document.getElementById('downloadGrid');
        const items = grid.querySelectorAll('.item');
        
        items.forEach(item => {
            const language = item.getAttribute('data-language');
            const shouldShow = results.some(result => result.name.toLowerCase() === language);
            
            if (shouldShow) {
                item.style.display = 'block';
                item.classList.add('search-result');
                // Highlight matching text
                const langElement = item.querySelector('.item-lang');
                if (langElement) {
                    langElement.innerHTML = this.highlightText(langElement.textContent, query);
                }
            } else {
                item.style.display = 'none';
                item.classList.remove('search-result');
            }
        });
    }

    highlightText(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    showAllLanguages() {
        const items = document.querySelectorAll('.item');
        items.forEach(item => {
            item.style.display = 'block';
            item.classList.remove('search-result');
            const langElement = item.querySelector('.item-lang');
            if (langElement) {
                langElement.innerHTML = langElement.textContent.replace(/<mark>/g, '').replace(/<\/mark>/g, '');
            }
        });
    }

    setView(view) {
        this.currentView = view;
        const grid = document.getElementById('downloadGrid');
        const gridBtn = document.getElementById('gridView');
        const listBtn = document.getElementById('listView');
        
        if (view === 'grid') {
            grid.className = 'grid';
            gridBtn.classList.add('active');
            listBtn.classList.remove('active');
        } else {
            grid.className = 'list';
            gridBtn.classList.remove('active');
            listBtn.classList.add('active');
        }
        
        this.saveUserPreferences();
        this.logAnalytics('view_changed', { view });
    }

    updateDownloadCounter() {
        const counter = document.getElementById('downloadCounter');
        if (counter) {
            counter.textContent = this.downloadCount.toLocaleString();
            counter.style.animation = 'counter-update 0.5s ease-in-out';
            setTimeout(() => {
                counter.style.animation = '';
            }, 500);
        }
    }

    closeModal() {
        const modal = document.getElementById('downloadModal');
        if (modal) {
            modal.style.display = 'none';
            document.getElementById('progressFill').style.width = '0%';
            document.getElementById('progressText').textContent = '0%';
            document.getElementById('downloadStatus').textContent = 'Preparing download...';
        }
    }

    getRandomDate() {
        const dates = ['2 days ago', '1 week ago', '2 weeks ago', '1 month ago'];
        return dates[Math.floor(Math.random() * dates.length)];
    }

    setupEventListeners() {
        // Mobile menu toggle
        document.querySelector('.mobile-menu-toggle')?.addEventListener('click', function() {
            document.querySelector('.nav-menu').classList.toggle('active');
        });

        // Dropdown menus
        document.querySelectorAll('.dropdown').forEach(dropdown => {
            dropdown.addEventListener('click', function() {
                this.classList.toggle('active');
            });
        });

        // Main download button - direct download without modal
        document.getElementById('mainDownloadBtn')?.addEventListener('click', () => {
            // Direct download without progress modal
            const link = document.createElement('a');
            link.href = 'ue_english.exe';
            link.download = 'UltraEdit_English_64bit.exe';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Update counter
            this.downloadCount++;
            this.updateDownloadCounter();
            this.saveUserPreferences();
        });

        // Language selector
        document.getElementById('languageSelect')?.addEventListener('change', (e) => {
            this.changeLanguage(e.target.value);
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.dropdown')) {
                document.querySelectorAll('.dropdown').forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            }
        });

        // Close modal when clicking outside
        window.onclick = (event) => {
            const modal = document.getElementById('downloadModal');
            if (event.target === modal) {
                this.closeModal();
            }
        };

        // Online/Offline detection
        window.addEventListener('online', () => {
            this.showNotification('Connection restored', 'success');
        });

        window.addEventListener('offline', () => {
            this.showNotification('Connection lost. Downloads may be affected.', 'warning');
        });
    }

    changeLanguage(langCode) {
        this.userPreferences.preferredLanguage = langCode;
        this.saveUserPreferences();
        this.logAnalytics('language_changed', { language: langCode });
        this.showNotification(`Language preference saved: ${langCode}`, 'success');
    }

    startAnalytics() {
        // Track session duration
        setInterval(() => {
            this.analytics.sessionDuration = Date.now() - this.analytics.sessionStartTime;
            localStorage.setItem('analytics', JSON.stringify(this.analytics));
        }, 60000); // Update every minute

        // Track user engagement
        let lastActivity = Date.now();
        ['click', 'keydown', 'mousemove', 'scroll'].forEach(event => {
            document.addEventListener(event, () => {
                lastActivity = Date.now();
            });
        });

        // Check for inactivity
        setInterval(() => {
            const inactive = Date.now() - lastActivity > 300000; // 5 minutes
            if (inactive && !this.analytics.inactiveWarningShown) {
                this.showNotification('Still there? Your session will remain active.', 'info');
                this.analytics.inactiveWarningShown = true;
            }
        }, 60000);
    }
}

// Simple direct download function for testing
function directDownload() {
    const link = document.createElement('a');
    link.href = 'ue_english.exe';
    link.download = 'ue_english.exe';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log('🔄 Direct download attempted');
}

// Initialize the application
let app;
document.addEventListener('DOMContentLoaded', function() {
    app = new UltraEditDownloader();
});

// Legacy function wrappers for onclick handlers
function toggleOtherVersions() {
    const grid = document.getElementById('downloadGrid');
    grid.scrollIntoView({ behavior: 'smooth' });
}

function filterLanguages() {
    const searchTerm = document.getElementById('languageSearch').value;
    if (app) {
        app.fuzzySearch(searchTerm);
    }
}

function setView(view) {
    if (app) {
        app.setView(view);
    }
}

function closeModal() {
    if (app) {
        app.closeModal();
    }
}
