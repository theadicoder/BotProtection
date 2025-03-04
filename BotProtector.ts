import { google } from 'googleapis';

class BotProtector {
    private requestLog: Map<string, number[]> = new Map();
    private blockedIPs: Set<string> = new Set();
    private readonly RATE_LIMIT = 100; // requests per minute
    private readonly BLOCK_DURATION = 3600000; // 1 hour in milliseconds
    private youtube: any;
    private viewPatterns: Map<string, any> = new Map();
    private readonly VIEW_THRESHOLD = 30; // suspicious views per minute
    private readonly VIEW_PATTERN_WINDOW = 300000; // 5 minutes

    constructor(apiKey: string) {
        this.youtube = google.youtube({
            version: 'v3',
            auth: apiKey
        });
        this.startViewMonitoring();
    }

    public checkRequest(ip: string): boolean {
        if (this.blockedIPs.has(ip)) {
            return false;
        }

        const now = Date.now();
        const userRequests = this.requestLog.get(ip) || [];
        
        // Remove old requests
        const recentRequests = userRequests.filter(time => now - time < 60000);
        
        if (recentRequests.length >= this.RATE_LIMIT) {
            this.blockIP(ip);
            return false;
        }

        recentRequests.push(now);
        this.requestLog.set(ip, recentRequests);
        return true;
    }

    private blockIP(ip: string): void {
        this.blockedIPs.add(ip);
        setTimeout(() => {
            this.blockedIPs.delete(ip);
        }, this.BLOCK_DURATION);
    }

    public isPatternSuspicious(behavior: string[]): boolean {
        // Check for repeated identical actions
        const uniqueActions = new Set(behavior);
        if (uniqueActions.size === 1 && behavior.length > 10) {
            return true;
        }

        // Check for rapid succession of actions
        const timeThreshold = behavior.length > 5 && 
            (parseInt(behavior[behavior.length - 1]) - parseInt(behavior[0])) < 1000;
        
        return timeThreshold;
    }

    public async checkYouTubeComment(comment: string): Promise<boolean> {
        const spamPatterns = [
            /check.+my.+channel/i,
            /subscribe.+back/i,
            /sub4sub/i,
            /follow.+me/i,
            /want.+free.+subscribers/i
        ];

        // Check for spam patterns
        if (spamPatterns.some(pattern => pattern.test(comment))) {
            return false;
        }

        // Check for excessive links
        const linkCount = (comment.match(/http[s]?:\/\//g) || []).length;
        if (linkCount > 2) {
            return false;
        }

        return true;
    }

    public async monitorChannel(channelId: string): Promise<void> {
        try {
            setInterval(async () => {
                const response = await this.youtube.activities.list({
                    part: 'snippet',
                    channelId: channelId,
                    maxResults: 50
                });

                for (const activity of response.data.items) {
                    if (this.isSpamActivity(activity)) {
                        await this.handleSpamActivity(activity);
                    }
                }
            }, 60000); // Check every minute
        } catch (error) {
            console.error('Error monitoring channel:', error);
        }
    }

    private isSpamActivity(activity: any): boolean {
        // Add specific checks for suspicious activity
        const suspiciousPatterns = [
            activity.snippet.publishedAt < Date.now() - 1000, // Too rapid actions
            activity.snippet.type === 'comment' && this.isPatternSuspicious([activity.snippet.description])
        ];

        return suspiciousPatterns.some(pattern => pattern);
    }

    private async handleSpamActivity(activity: any): Promise<void> {
        try {
            if (activity.snippet.type === 'comment') {
                await this.youtube.comments.setModerationStatus({
                    id: activity.id,
                    moderationStatus: 'rejected'
                });
            }
            console.log(`Blocked suspicious activity: ${activity.id}`);
        } catch (error) {
            console.error('Error handling spam activity:', error);
        }
    }

    private startViewMonitoring(): void {
        setInterval(() => this.cleanupViewPatterns(), 300000); // Cleanup every 5 minutes
    }

    private async detectViewBot(videoId: string, viewerData: any): Promise<boolean> {
        const now = Date.now();
        const key = `${videoId}_${viewerData.ip}`;
        
        if (!this.viewPatterns.has(key)) {
            this.viewPatterns.set(key, {
                timestamps: [],
                watchDuration: [],
                sessionCount: 0
            });
        }

        const pattern = this.viewPatterns.get(key);
        pattern.timestamps.push(now);
        pattern.sessionCount++;

        // Check for suspicious patterns
        const isBot = this.analyzeViewPattern(pattern);
        
        // Clean old timestamps
        pattern.timestamps = pattern.timestamps.filter(t => now - t < this.VIEW_PATTERN_WINDOW);
        
        return isBot;
    }

    private analyzeViewPattern(pattern: any): boolean {
        const recentTimestamps = pattern.timestamps;
        
        // Check for rapid view switching
        if (recentTimestamps.length > this.VIEW_THRESHOLD) {
            return true;
        }

        // Check for unnaturally consistent intervals
        if (recentTimestamps.length > 5) {
            const intervals = [];
            for (let i = 1; i < recentTimestamps.length; i++) {
                intervals.push(recentTimestamps[i] - recentTimestamps[i-1]);
            }
            
            // If intervals are too consistent (bot-like behavior)
            const avgInterval = intervals.reduce((a, b) => a + b) / intervals.length;
            const allSimilar = intervals.every(interval => 
                Math.abs(interval - avgInterval) < 100 // 100ms variance threshold
            );
            
            if (allSimilar) return true;
        }

        return false;
    }

    public async monitorVideoViews(videoId: string): Promise<void> {
        try {
            const response = await this.youtube.videos.list({
                part: 'statistics',
                id: videoId
            });

            const video = response.data.items[0];
            const currentViews = parseInt(video.statistics.viewCount);

            setInterval(async () => {
                const newResponse = await this.youtube.videos.list({
                    part: 'statistics',
                    id: videoId
                });

                const newVideo = newResponse.data.items[0];
                const newViews = parseInt(newVideo.statistics.viewCount);
                
                // Check for suspicious view spike
                if (newViews - currentViews > this.VIEW_THRESHOLD) {
                    console.log(`Suspicious view activity detected on video ${videoId}`);
                    await this.reportSuspiciousViews(videoId);
                }
            }, 60000); // Check every minute

        } catch (error) {
            console.error('Error monitoring video views:', error);
        }
    }

    private async reportSuspiciousViews(videoId: string): Promise<void> {
        try {
            await this.youtube.videos.reportAbuse({
                videoId: videoId,
                requestBody: {
                    reasonId: 'botting',
                    secondaryReasonId: 'artificial_traffic_spam',
                    comments: 'Suspicious view bot activity detected'
                }
            });
            console.log(`Reported suspicious views for video ${videoId}`);
        } catch (error) {
            console.error('Error reporting suspicious views:', error);
        }
    }
}

export default BotProtector;
