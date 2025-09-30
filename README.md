# Lightly Device Configuration UI

A sleek, minimal-resource IoT web interface for configuring Lightly devices with support for DMX, OSC, MIDI, and GPI inputs.

![Desktop UI](https://github.com/user-attachments/assets/b66e534e-44ad-4b59-9c48-930cbe171840)

## Features

### DMX Configuration
- **2 DMX Universes** - Configure IP addresses, ports, and direction (input/output) for each universe
- **Real-time validation** - IP address and port validation with visual feedback
- **Flexible setup** - Support for different network configurations

### OSC (Open Sound Control) Configuration
- **Network settings** - Configure listen port, target IP, and target port
- **Enable/disable toggle** - Easy on/off control with visual toggle switches
- **Standard OSC ports** - Default configuration for common OSC setups

### MIDI Configuration
- **16 MIDI channels** - Full MIDI channel selection (1-16)
- **Device selection** - Support for USB MIDI, DIN MIDI, or no device
- **Enable/disable control** - Toggle MIDI functionality as needed

### GPI (General Purpose Input) Configuration
- **4 GPI inputs** - Complete configuration for all 4 inputs
- **Multiple modes** - Toggle, Momentary, or Disabled for each input
- **Action mapping** - DMX Blackout, Scene Trigger, OSC Message, or MIDI Note
- **Status indicators** - Real-time visual feedback for input activity
- **Live simulation** - Demonstrates input activity with animated status indicators

## User Interface Design

### Design Philosophy
- **Minimal resource usage** - Optimized for IoT devices with limited resources
- **Sleek aesthetic** - Modern glass-morphism design with gradients and blur effects
- **Professional appearance** - Clean typography and consistent spacing
- **Intuitive layout** - Logical grouping of related configuration options

### Visual Features
- **Glass-morphism cards** - Semi-transparent sections with backdrop blur
- **Animated toggles** - Smooth toggle switches for boolean settings
- **Status indicators** - Pulsing dots to show connection and activity status
- **Toast notifications** - Non-intrusive feedback for user actions
- **Loading states** - Visual feedback during save operations

### Responsive Design
- **Mobile-first approach** - Optimized for both desktop and mobile devices
- **Flexible grid layout** - Adapts to different screen sizes automatically
- **Touch-friendly controls** - Appropriately sized buttons and inputs for touch devices

![Mobile UI](https://github.com/user-attachments/assets/665d500a-d11d-46d7-8227-078de95b0002)

## Technical Implementation

### Technology Stack
- **Pure HTML5** - Semantic markup for accessibility
- **Modern CSS3** - Advanced features like backdrop-filter, CSS Grid, and Flexbox
- **Vanilla JavaScript** - No external dependencies for minimal resource usage
- **Inter font** - Clean, professional typography via Google Fonts

### Key Features
- **Configuration management** - Complete state management for all device settings
- **Input validation** - Real-time validation for IP addresses and port numbers
- **Export functionality** - Download configuration as JSON file
- **Reset functionality** - Restore all settings to factory defaults
- **Auto-save simulation** - Simulates saving configuration to device
- **Activity simulation** - Demonstrates GPI input activity for testing

### File Structure
```
├── index.html          # Main HTML interface
├── styles.css          # Complete CSS styling with responsive design
├── script.js           # JavaScript functionality and configuration management
├── README.md           # This documentation
└── .gitignore         # Git ignore patterns
```

## Usage

### Running the Interface
1. Serve the files using any HTTP server:
   ```bash
   python3 -m http.server 8080
   ```
2. Open `http://localhost:8080` in your web browser

### Configuration Management
- **Modify settings** - Change any configuration value using the form controls
- **Save configuration** - Click "Save Configuration" to apply settings to device
- **Reset settings** - Use "Reset to Defaults" to restore factory settings
- **Export config** - Download current configuration as `lightly-device-config.json`

### Default Configuration
```json
{
  "dmx": {
    "universe1": { "ip": "192.168.1.100", "port": 6454, "direction": "output" },
    "universe2": { "ip": "192.168.1.101", "port": 6455, "direction": "output" }
  },
  "osc": {
    "enabled": true,
    "listenPort": 8000,
    "targetIp": "192.168.1.50",
    "targetPort": 9000
  },
  "midi": {
    "enabled": true,
    "channel": 1,
    "device": "usb"
  },
  "gpi": {
    "input1": { "mode": "momentary", "action": "scene-trigger", "status": "inactive" },
    "input2": { "mode": "toggle", "action": "dmx-blackout", "status": "inactive" },
    "input3": { "mode": "disabled", "action": "osc-message", "status": "disabled" },
    "input4": { "mode": "momentary", "action": "midi-note", "status": "inactive" }
  }
}
```

## Browser Compatibility
- **Modern browsers** - Chrome 88+, Firefox 78+, Safari 14+, Edge 88+
- **Mobile browsers** - iOS Safari 14+, Chrome Mobile 88+
- **Feature requirements** - CSS Grid, Flexbox, backdrop-filter support

## Development Notes
- No build process required - ready to deploy
- Minimal external dependencies (only Google Fonts)
- Optimized for low-bandwidth environments
- Follows accessibility best practices
- Progressive enhancement approach