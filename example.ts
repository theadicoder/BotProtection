import BotProtector from './BotProtector';

// Replace with your YouTube API key
const API_KEY = 'AIzaSyBBB1Gm5z-cGJT_WuA287H6w97zAd64KQw';
const CHANNEL_ID = 'UCtgHR0fSfJfg2Flu5Wx85sw';
const VIDEO_ID = 'YOUR_VIDEO_ID';

const botProtector = new BotProtector(API_KEY);

async function protectYouTubeContent() {
    // Start monitoring the channel
    await botProtector.monitorChannel(CHANNEL_ID);

    // Example of checking a comment
    const comment = "Check out my channel! Sub4Sub!";
    const isSpam = await botProtector.checkYouTubeComment(comment);
    if (!isSpam) {
        console.log('Comment blocked - spam detected');
    }

    // Start monitoring video views
    await botProtector.monitorVideoViews(VIDEO_ID);
    console.log(`Started monitoring views for video ${VIDEO_ID}`);
}

protectYouTubeContent().catch(console.error);

