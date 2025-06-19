// Gmail 未読処理クラス
class LabelProcessor {
  
  static process() {
    console.log('Gmail自動回答処理開始');
    
    // 未読メールを検索（除外ラベル考慮）
    const emails = GmailService.searchUnreadEmails();
    
    if (emails.length === 0) {
      console.log('処理対象の未読メールが見つかりません');
      return 0;
    }
    
    console.log(`処理対象メール: ${emails.length}件`);
    let processedCount = 0;
    
    emails.forEach((email, index) => {
      try {
        console.log(`処理中 (${index + 1}/${emails.length}): ${email.subject}`);
        
        // AI回答生成
        const emailInfo = {
          subject: email.subject,
          from: email.from,
          body: email.body
        };
        
        const aiResponse = AIService.generateEmailResponse(emailInfo);
        
        // Gmail返信下書き作成
        const draftId = GmailService.createReplyDraft(
          email,
          aiResponse.subject,
          aiResponse.body
        );
        
        // 結果ラベル追加
        GmailService.addLabelToThread(email.thread, GMAIL_CONFIG.RESULT_LABEL);
        
        // 既読にする（処理済み判定）
        GmailService.markAsRead(email.thread);
        
        console.log(`処理完了 - Draft ID: ${draftId}`);
        processedCount++;
        
      } catch (error) {
        console.error(`メール処理エラー (${email.subject}):`, error);
        console.log('エラーのため処理をスキップしました');
      }
    });
    
    console.log(`Gmail自動回答処理完了: ${processedCount}件処理`);
    return processedCount;
  }
  
  static testSingleEmail() {
    console.log('Gmail自動回答 テスト実行開始');
    
    // 未読メールを検索（1件のみ）
    const emails = GmailService.searchUnreadEmails();
    
    if (emails.length === 0) {
      console.log('テスト対象の未読メールが見つかりません');
      return 0;
    }
    
    const email = emails[0]; // 最初の1件のみ
    console.log(`テスト実行: ${email.subject}`);
    
    try {
      // AI回答生成
      const emailInfo = {
        subject: email.subject,
        from: email.from,
        body: email.body
      };
      
      const aiResponse = AIService.generateEmailResponse(emailInfo);
      console.log('生成された返信:', aiResponse);
      
      // Gmail返信下書き作成
      const draftId = GmailService.createReplyDraft(
        email,
        aiResponse.subject,
        aiResponse.body
      );
      
      // テスト用: ラベル追加・既読化はしない
      console.log('テスト実行のため、ラベル変更・既読化はスキップしました');
      
      console.log(`テスト完了 - Draft ID: ${draftId}`);
      return 1;
      
    } catch (error) {
      console.error(`テストエラー (${email.subject}):`, error);
      return 0;
    }
  }
}