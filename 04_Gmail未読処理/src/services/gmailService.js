// Gmail サービス
class GmailService {
  
  // 未読メールを検索（除外ラベル考慮）
  static searchUnreadEmails() {
    try {
      // シンプル検索: 未読 - 除外ラベル
      const query = `is:unread -label:"${GMAIL_CONFIG.EXCLUDE_LABEL}"`;
      
      const threads = GmailApp.search(query, 0, COMMON_CONFIG.MAX_EMAILS_PER_RUN);
      const emails = [];
      
      threads.forEach(thread => {
        const messages = thread.getMessages();
        // 各スレッドの最新メッセージを対象とする
        const latestMessage = messages[messages.length - 1];
        
        emails.push({
          thread: thread,
          message: latestMessage,
          id: latestMessage.getId(),
          subject: latestMessage.getSubject(),
          from: latestMessage.getFrom(),
          body: latestMessage.getPlainBody(),
          date: latestMessage.getDate()
        });
      });
      
      return emails;
    } catch (error) {
      console.error('未読メール検索エラー:', error);
      throw error;
    }
  }
  
  // Gmail下書きを作成
  static createReplyDraft(originalEmail, replySubject, replyBody) {
    try {
      // 返信下書きを作成
      const draft = originalEmail.message.createDraftReply(replyBody, {
        htmlBody: replyBody.replace(/\n/g, '<br>'),
        subject: replySubject
      });
      
      return draft.getId();
    } catch (error) {
      console.error('下書き作成エラー:', error);
      throw new Error(`${COMMON_CONFIG.ERROR_MESSAGES.DRAFT_CREATION_FAILED}: ${error.message}`);
    }
  }
  
  // ラベルを取得または作成
  static getOrCreateLabel(labelName) {
    try {
      let label = GmailApp.getUserLabelByName(labelName);
      if (!label) {
        label = GmailApp.createLabel(labelName);
        console.log(`ラベル作成: ${labelName}`);
      }
      return label;
    } catch (error) {
      console.error(`ラベル取得/作成エラー (${labelName}):`, error);
      throw error;
    }
  }
  
  // スレッドにラベルを追加
  static addLabelToThread(thread, labelName) {
    try {
      const label = this.getOrCreateLabel(labelName);
      thread.addLabel(label);
      console.log(`ラベル追加: ${labelName}`);
    } catch (error) {
      console.error(`ラベル追加エラー (${labelName}):`, error);
      throw error;
    }
  }
  
  // メールを既読にする
  static markAsRead(thread) {
    try {
      thread.markRead();
    } catch (error) {
      console.error('既読マークエラー:', error);
    }
  }
}