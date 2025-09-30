// Configuration management for Lightly IoT Device
class LightlyDeviceConfig {
    constructor() {
        this.config = this.loadDefaultConfig();
        this.initializeEventListeners();
        this.simulateDeviceStatus();
    }

    loadDefaultConfig() {
        return {
            dmx: {
                universe1: {
                    ip: '192.168.1.100',
                    port: 6454,
                    direction: 'output'
                },
                universe2: {
                    ip: '192.168.1.101',
                    port: 6455,
                    direction: 'output'
                }
            },
            osc: {
                enabled: true,
                listenPort: 8000,
                targetIp: '192.168.1.50',
                targetPort: 9000
            },
            midi: {
                enabled: true,
                channel: 1,
                device: 'usb'
            },
            gpi: {
                input1: { mode: 'momentary', action: 'scene-trigger', status: 'inactive' },
                input2: { mode: 'toggle', action: 'dmx-blackout', status: 'inactive' },
                input3: { mode: 'disabled', action: 'osc-message', status: 'disabled' },
                input4: { mode: 'momentary', action: 'midi-note', status: 'inactive' }
            }
        };
    }

    initializeEventListeners() {
        // DMX Universe listeners
        ['dmx1-ip', 'dmx1-port', 'dmx1-direction', 'dmx2-ip', 'dmx2-port', 'dmx2-direction'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', () => this.updateDMXConfig(id, element.value));
            }
        });

        // OSC listeners
        ['osc-listen-port', 'osc-target-ip', 'osc-target-port', 'osc-enabled'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', () => this.updateOSCConfig(id, element.type === 'checkbox' ? element.checked : element.value));
            }
        });

        // MIDI listeners
        ['midi-channel', 'midi-device', 'midi-enabled'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', () => this.updateMIDIConfig(id, element.type === 'checkbox' ? element.checked : element.value));
            }
        });

        // GPI listeners
        for (let i = 1; i <= 4; i++) {
            const modeElement = document.getElementById(`gpi${i}-mode`);
            const actionElement = document.getElementById(`gpi${i}-action`);
            
            if (modeElement) {
                modeElement.addEventListener('change', () => this.updateGPIConfig(i, 'mode', modeElement.value));
            }
            if (actionElement) {
                actionElement.addEventListener('change', () => this.updateGPIConfig(i, 'action', actionElement.value));
            }
        }

        // Add input validation
        this.addInputValidation();
    }

    addInputValidation() {
        // IP address validation
        document.querySelectorAll('input[type="text"][id$="-ip"]').forEach(input => {
            input.addEventListener('blur', (e) => {
                if (!this.isValidIP(e.target.value)) {
                    e.target.style.borderColor = '#ef4444';
                    this.showToast('Invalid IP address format', 'error');
                } else {
                    e.target.style.borderColor = '#10b981';
                }
            });
        });

        // Port validation
        document.querySelectorAll('input[type="number"]').forEach(input => {
            input.addEventListener('blur', (e) => {
                const port = parseInt(e.target.value);
                if (port < 1 || port > 65535) {
                    e.target.style.borderColor = '#ef4444';
                    this.showToast('Port must be between 1 and 65535', 'error');
                } else {
                    e.target.style.borderColor = '#10b981';
                }
            });
        });
    }

    isValidIP(ip) {
        const ipPattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        return ipPattern.test(ip);
    }

    updateDMXConfig(elementId, value) {
        const universe = elementId.includes('dmx1') ? 'universe1' : 'universe2';
        const property = elementId.split('-')[1];
        
        if (property === 'port') {
            this.config.dmx[universe][property] = parseInt(value);
        } else {
            this.config.dmx[universe][property] = value;
        }
        
        this.showToast(`DMX ${universe} ${property} updated`, 'success');
        console.log('DMX Config updated:', this.config.dmx);
    }

    updateOSCConfig(elementId, value) {
        const property = elementId.replace('osc-', '').replace('-', '');
        
        if (property === 'listenport' || property === 'targetport') {
            this.config.osc[property === 'listenport' ? 'listenPort' : 'targetPort'] = parseInt(value);
        } else if (property === 'targetip') {
            this.config.osc.targetIp = value;
        } else if (property === 'enabled') {
            this.config.osc.enabled = value;
        }
        
        this.showToast(`OSC configuration updated`, 'success');
        console.log('OSC Config updated:', this.config.osc);
    }

    updateMIDIConfig(elementId, value) {
        const property = elementId.replace('midi-', '');
        
        if (property === 'channel') {
            this.config.midi.channel = parseInt(value);
        } else if (property === 'device') {
            this.config.midi.device = value;
        } else if (property === 'enabled') {
            this.config.midi.enabled = value;
        }
        
        this.showToast(`MIDI configuration updated`, 'success');
        console.log('MIDI Config updated:', this.config.midi);
    }

    updateGPIConfig(inputNumber, property, value) {
        const inputKey = `input${inputNumber}`;
        this.config.gpi[inputKey][property] = value;
        
        // Update status display
        const statusElement = document.querySelector(`.gpi-input:nth-child(${inputNumber}) .gpi-status span:last-child`);
        const statusDot = document.querySelector(`.gpi-input:nth-child(${inputNumber}) .status-dot`);
        
        if (value === 'disabled' && property === 'mode') {
            if (statusElement) statusElement.textContent = 'Disabled';
            if (statusDot) {
                statusDot.className = 'status-dot offline';
            }
            this.config.gpi[inputKey].status = 'disabled';
        } else if (property === 'mode' && value !== 'disabled') {
            if (statusElement) statusElement.textContent = 'Inactive';
            if (statusDot) {
                statusDot.className = 'status-dot offline';
            }
            this.config.gpi[inputKey].status = 'inactive';
        }
        
        this.showToast(`GPI Input ${inputNumber} ${property} updated`, 'success');
        console.log('GPI Config updated:', this.config.gpi);
    }

    simulateDeviceStatus() {
        let counter = 0;
        setInterval(() => {
            // Simulate occasional GPI input activity
            if (counter % 30 === 0) {
                this.simulateGPIActivity();
            }
            counter++;
        }, 1000);
    }

    simulateGPIActivity() {
        const activeInputs = [1, 2, 4]; // Inputs that are not disabled
        const randomInput = activeInputs[Math.floor(Math.random() * activeInputs.length)];
        
        const statusElement = document.querySelector(`.gpi-input:nth-child(${randomInput}) .gpi-status span:last-child`);
        const statusDot = document.querySelector(`.gpi-input:nth-child(${randomInput}) .status-dot`);
        
        if (statusElement && statusDot) {
            // Simulate activity
            statusElement.textContent = 'Active';
            statusDot.className = 'status-dot online';
            
            // Return to inactive after 2 seconds
            setTimeout(() => {
                statusElement.textContent = 'Inactive';
                statusDot.className = 'status-dot offline';
            }, 2000);
        }
    }

    showToast(message, type = 'info') {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        // Style the toast
        Object.assign(toast.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            fontSize: '14px',
            zIndex: '1000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            backgroundColor: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'
        });
        
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    exportConfiguration() {
        const configJson = JSON.stringify(this.config, null, 2);
        const blob = new Blob([configJson], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'lightly-device-config.json';
        a.click();
        
        URL.revokeObjectURL(url);
        this.showToast('Configuration exported successfully', 'success');
    }

    saveConfiguration() {
        // Simulate saving to device
        const saveButton = document.querySelector('.btn-primary');
        const originalText = saveButton.textContent;
        
        saveButton.textContent = 'Saving...';
        saveButton.classList.add('loading');
        
        setTimeout(() => {
            saveButton.textContent = originalText;
            saveButton.classList.remove('loading');
            this.showToast('Configuration saved to device', 'success');
            console.log('Full configuration saved:', this.config);
        }, 2000);
    }

    resetConfiguration() {
        if (confirm('Are you sure you want to reset all settings to defaults?')) {
            this.config = this.loadDefaultConfig();
            this.populateFormFields();
            this.showToast('Configuration reset to defaults', 'info');
        }
    }

    populateFormFields() {
        // Populate DMX fields
        document.getElementById('dmx1-ip').value = this.config.dmx.universe1.ip;
        document.getElementById('dmx1-port').value = this.config.dmx.universe1.port;
        document.getElementById('dmx1-direction').value = this.config.dmx.universe1.direction;
        document.getElementById('dmx2-ip').value = this.config.dmx.universe2.ip;
        document.getElementById('dmx2-port').value = this.config.dmx.universe2.port;
        document.getElementById('dmx2-direction').value = this.config.dmx.universe2.direction;
        
        // Populate OSC fields
        document.getElementById('osc-listen-port').value = this.config.osc.listenPort;
        document.getElementById('osc-target-ip').value = this.config.osc.targetIp;
        document.getElementById('osc-target-port').value = this.config.osc.targetPort;
        document.getElementById('osc-enabled').checked = this.config.osc.enabled;
        
        // Populate MIDI fields
        document.getElementById('midi-channel').value = this.config.midi.channel;
        document.getElementById('midi-device').value = this.config.midi.device;
        document.getElementById('midi-enabled').checked = this.config.midi.enabled;
        
        // Populate GPI fields
        for (let i = 1; i <= 4; i++) {
            const inputConfig = this.config.gpi[`input${i}`];
            document.getElementById(`gpi${i}-mode`).value = inputConfig.mode;
            document.getElementById(`gpi${i}-action`).value = inputConfig.action;
        }
    }
}

// Global functions for button clicks
function saveConfiguration() {
    deviceConfig.saveConfiguration();
}

function resetConfiguration() {
    deviceConfig.resetConfiguration();
}

function exportConfiguration() {
    deviceConfig.exportConfiguration();
}

// Initialize the device configuration when DOM is loaded
let deviceConfig;
document.addEventListener('DOMContentLoaded', () => {
    deviceConfig = new LightlyDeviceConfig();
    console.log('Lightly Device Configuration UI initialized');
});