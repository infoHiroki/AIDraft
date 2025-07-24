// 単体テスト
class UnitTests {
  
  static setupTests(testFramework) {
    // Gmail設定テスト
    testFramework.addTest('Gmail設定が正しく読み込まれる', function() {
      this.assertNotNull(GMAIL_CONFIG, 'GMAIL_CONFIGが存在する');
      this.assertEqual(GMAIL_CONFIG.EXCLUDE_LABEL, 'ai処理不要', '除外ラベルが正しい');
      this.assertEqual(GMAIL_CONFIG.RESULT_LABEL, 'AI自動回答_Gmail', '結果ラベルが正しい');
      this.assertEqual(GMAIL_CONFIG.SUBJECT_PREFIX, 'Re: ', '件名プレフィックスが正しい');
    });

    // 共通設定テスト
    testFramework.addTest('共通設定が正しく読み込まれる', function() {
      this.assertNotNull(COMMON_CONFIG, 'COMMON_CONFIGが存在する');
      this.assertTrue(COMMON_CONFIG.MAX_EMAILS_PER_RUN > 0, 'メール処理件数が正の数');
    });

    // GmailService.searchUnreadEmails テスト
    testFramework.addTest('GmailService.searchUnreadEmails - 正常系', function() {
      MockData.setupGmailMock();
      
      const emails = GmailService.searchUnreadEmails();
      this.assertNotNull(emails, 'メール配列が返される');
      this.assertTrue(Array.isArray(emails), 'メール配列が配列型');
      
      if (emails.length > 0) {
        const email = emails[0];
        this.assertNotNull(email.thread, 'threadが存在');
        this.assertNotNull(email.message, 'messageが存在');
        this.assertNotNull(email.subject, 'subjectが存在');
        this.assertNotNull(email.from, 'fromが存在');
        this.assertNotNull(email.body, 'bodyが存在');
      }
    });

    // GmailService.createReplyDraft テスト
    testFramework.addTest('GmailService.createReplyDraft - 正常系', function() {
      const mockEmail = MockData.getMockEmail();
      const subject = 'Re: テスト件名';
      const body = 'テスト本文';
      
      const draftId = GmailService.createReplyDraft(mockEmail, subject, body);
      this.assertNotNull(draftId, '下書きIDが返される');
    });

    // GmailService.addLabelToThread テスト
    testFramework.addTest('GmailService.addLabelToThread - 正常系', function() {
      MockData.setupGmailMock();
      const mockEmail = MockData.getMockEmail();
      
      // エラーが発生しないことを確認
      try {
        GmailService.addLabelToThread(mockEmail.thread, 'テストラベル');
        this.assertTrue(true, 'ラベル追加が成功');
      } catch (error) {
        this.assertTrue(false, `ラベル追加でエラー: ${error.message}`);
      }
    });

    // GmailService.markAsRead テスト
    testFramework.addTest('GmailService.markAsRead - 正常系', function() {
      const mockEmail = MockData.getMockEmail();
      
      // エラーが発生しないことを確認
      try {
        GmailService.markAsRead(mockEmail.thread);
        this.assertTrue(true, '既読マークが成功');
      } catch (error) {
        this.assertTrue(false, `既読マークでエラー: ${error.message}`);
      }
    });

    // AIService.generateEmailResponse テスト
    testFramework.addTest('AIService.generateEmailResponse - 正常系', function() {
      MockData.setupOpenAIMock();
      MockData.setupPropertiesMock();
      
      const emailInfo = {
        subject: 'テスト件名',
        from: 'test@example.com',
        body: 'テスト本文'
      };
      
      const response = AIService.generateEmailResponse(emailInfo);
      this.assertNotNull(response, 'AI応答が返される');
      this.assertNotNull(response.subject, 'AI応答に件名がある');
      this.assertNotNull(response.body, 'AI応答に本文がある');
    });

    // AIService エラーハンドリングテスト
    testFramework.addTest('AIService.generateEmailResponse - APIキー未設定', function() {
      // PropertiesServiceでnullを返すモック
      global.PropertiesService = {
        getScriptProperties: function() {
          return {
            getProperty: function(key) {
              return null; // APIキーなし
            }
          };
        }
      };
      
      const emailInfo = {
        subject: 'テスト件名',
        from: 'test@example.com',
        body: 'テスト本文'
      };
      
      try {
        AIService.generateEmailResponse(emailInfo);
        this.assertTrue(false, 'APIキー未設定でエラーが発生すべき');
      } catch (error) {
        this.assertTrue(true, 'APIキー未設定で適切にエラーが発生');
      }
    });

    // LabelProcessor.process 基本テスト
    testFramework.addTest('LabelProcessor.process - メールなし', function() {
      // 空の結果を返すモック
      global.GmailApp = {
        search: function() { return []; }
      };
      
      const result = LabelProcessor.process();
      this.assertEqual(result, 0, 'メールがない場合は0を返す');
    });

    // 設定値検証テスト
    testFramework.addTest('設定値が適切に設定されている', function() {
      // 除外ラベルが空文字でないことを確認
      this.assertTrue(GMAIL_CONFIG.EXCLUDE_LABEL.length > 0, '除外ラベルが設定されている');
      this.assertTrue(GMAIL_CONFIG.RESULT_LABEL.length > 0, '結果ラベルが設定されている');
      
      // ラベル名に不正な文字が含まれていないことを確認
      this.assertFalse(GMAIL_CONFIG.EXCLUDE_LABEL.includes('"'), '除外ラベルに引用符が含まれていない');
      this.assertFalse(GMAIL_CONFIG.RESULT_LABEL.includes('"'), '結果ラベルに引用符が含まれていない');
    });
  }
}