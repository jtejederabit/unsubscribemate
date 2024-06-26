export interface Email {
    id: string;
    from: string;
    subject: string;
    unsubscribeLink: string;
    unsubscribeType: string;
    selected: boolean;
    status?: 'unsubscribed' | 'error';
    deleted?: boolean;
}
