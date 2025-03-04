# YouTube Channel Protection System

A sophisticated bot protection system for YouTube channels that guards against spam comments, fake views, and malicious bot activities.

## 🛡️ Features

- 🤖 Bot Detection & Prevention
- 👮 Spam Comment Filtering
- 📊 View Bot Detection
- ⚡ Rate Limiting
- 🔒 Channel Monitoring

## 🚀 Quick Start Guide

### For Non-Technical Users

1. **GitHub Setup**
   - Create a GitHub account at [github.com](https://github.com)
   - Navigate to this project's repository
   - Click the green "Code" button
   - Select "Codespaces" from the dropdown
   - Click "Create codespace"

2. **YouTube API Setup**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project
   - Enable YouTube Data API v3
   - Create API credentials (API Key)
   - Copy your API key

3. **Configuration**
   - In the codespace, find `example.ts`
   - Replace these values:
     ```typescript
     const API_KEY = 'YOUR_YOUTUBE_API_KEY';
     const CHANNEL_ID = 'YOUR_CHANNEL_ID';
     const VIDEO_ID = 'YOUR_VIDEO_ID';
     ```

4. **Running the Protection**
   - In the codespace terminal, run:
     ```bash
     npm install
     npm start
     ```

### For Developers

1. **Local Setup**
   ```bash
   # Clone the repository
   git clone [repository-url]
   cd bot-attack-on-live-stream

   # Install dependencies
   npm install typescript ts-node @types/node googleapis --save-dev

   # Start the protection system
   npm start
   ```

2. **Project Structure**
   ```
   bot-attack-on-live-stream/
   ├── BotProtector.ts    # Main protection logic
   ├── example.ts         # Usage example
   ├── tsconfig.json     # TypeScript configuration
   └── package.json      # Project dependencies
   ```

3. **Key Components**

   - **Rate Limiting**
     ```typescript
     RATE_LIMIT = 100        // requests per minute
     BLOCK_DURATION = 3600000 // 1 hour block duration
     ```

   - **View Bot Detection**
     ```typescript
     VIEW_THRESHOLD = 30     // suspicious views per minute
     VIEW_PATTERN_WINDOW = 300000 // 5 minute monitoring window
     ```

## 🔧 Configuration Options

| Parameter | Default | Description |
|-----------|---------|-------------|
| RATE_LIMIT | 100 | Maximum requests per minute |
| VIEW_THRESHOLD | 30 | Suspicious views trigger |
| BLOCK_DURATION | 1 hour | Duration of IP blocks |

## 📋 Features Explained

### Comment Protection
- Detects spam patterns
- Blocks sub4sub attempts
- Filters excessive links
- Auto-moderates suspicious comments

### View Protection
- Monitors view patterns
- Detects artificial traffic
- Reports suspicious activity
- Tracks viewer behavior

### Channel Monitoring
- Real-time activity tracking
- Automated response system
- Pattern recognition
- Abuse reporting

## 🚨 Common Issues & Solutions

1. **API Key Issues**
   ```bash
   Error: API key not valid
   Solution: Ensure YouTube Data API is enabled in Google Cloud Console
   ```

2. **Rate Limiting**
   ```bash
   Error: Quota exceeded
   Solution: Check your Google Cloud Console quotas
   ```

## 🔒 Security Best Practices

1. Never share your API key
2. Keep monitoring thresholds reasonable
3. Regularly update dependencies
4. Monitor system logs

## 📢 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support:
1. Check existing issues
2. Create new issue with details
3. Join our community discussions

## 🔄 Updates

Subscribe to releases for notifications about:
- Security updates
- New features
- Bug fixes
- Performance improvements
