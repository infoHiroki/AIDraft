// Gmail ラベル処理クラス
class LabelProcessor {
  
  static process() {
    console.log('Gmailラベル処理開始');
    
    // 処理対象メールを検索
    const emails = GmailService.searchEmailsByLabel(
      GMAIL_CONFIG.SOURCE_LABEL,
      GMAIL_CONFIG.TARGET_LABEL
    );
    
    if (emails.length === 0) {
      console.log('処理対象のメールが見つかりません');
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
        
        // ラベル変更（処理済み）
        GmailService.changeThreadLabel(
          email.thread,
          GMAIL_CONFIG.SOURCE_LABEL,
          GMAIL_CONFIG.TARGET_LABEL
        );
        
        // 既読にする
        GmailService.markAsRead(email.thread);
        
        console.log(`処理完了 - Draft ID: ${draftId}`);
        processedCount++;
        
      } catch (error) {
        console.error(`メール処理エラー (${email.subject}):`, error);
        
        // エラー時は元のラベルを保持
        console.log('エラーのため処理をスキップしました');
      }
    });
    
    console.log(`Gmailラベル処理完了: ${processedCount}件処理`);
    return processedCount;
  }
  
  static testSingleEmail() {
    console.log('Gmailラベル テスト実行開始');
    
    // 処理対象メールを検索（1件のみ）
    const emails = GmailService.searchEmailsByLabel(
      GMAIL_CONFIG.SOURCE_LABEL,
      GMAIL_CONFIG.TARGET_LABEL
    );
    
    if (emails.length === 0) {
      console.log('テスト対象のメールが見つかりません');
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
      
      // テスト用: ラベル変更はしない（元のラベルを保持）
      console.log('テスト実行のため、ラベル変更はスキップしました');
      
      console.log(`テスト完了 - Draft ID: ${draftId}`);
      return 1;
      
    } catch (error) {
      console.error(`テストエラー (${email.subject}):`, error);
      return 0;
    }
  }
}