export const normalizeUrl = (url: string): string => {
    const urlObj = new URL(url);
    return `${urlObj.origin}${urlObj.pathname}`;
};

export const findUnsubscribeLink = (body: string | undefined): string | null => {
    if (!body) return null;
    const decodedBody = atob(body.replace(/-/g, '+').replace(/_/g, '/'));
    const unsubscribeLinkMatch = decodedBody.match(/<a\s+[^>]*href="([^"]+)"[^>]*>[^<]*unsubscribe[^<]*<\/a>/i);
    return unsubscribeLinkMatch ? unsubscribeLinkMatch[1] : null;
};

export const cleanUnsubscribeLink = (link: string | undefined): string | null => {
    if (!link) return null;
    return link.replace(/[<>]/g, '').trim();
};

export const determineUnsubscribeType = (link: string): { type: string, link: string } => {
    const links = link.split(',').map(l => l.trim());
    const httpLink = links.find(l => l.startsWith('http'));
    if (httpLink) {
        return { type: 'link', link: httpLink };
    }
    const mailtoLink = links.find(l => l.startsWith('mailto:'));
    if (mailtoLink) {
        return { type: 'email', link: mailtoLink };
    }
    return { type: 'unknown', link: '' };
};
