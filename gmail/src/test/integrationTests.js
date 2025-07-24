// 統合テスト
class IntegrationTests {
  
  static setupTests(testFramework) {
    
    // メール処理フロー全体テスト
    testFramework.addTest('メール処理フロー全体 - 正常系', function() {
      // モック環境設定
      MockData.setupAllMocks();
      
      // メール検索から処理完了までの流れをテスト
      try {
        // 1. メール検索
        const emails = GmailService.searchUnreadEmails();
        this.assertTrue(emails.length >= 0, 'メール検索が実行される');
        
        if (emails.length > 0) {
          const email = emails[0];
          
          // 2. AI回答生成
          const emailInfo = {
            subject: email.subject,
            from: email.from,
            body: email.body
          };
          const aiResponse = AIService.generateEmailResponse(emailInfo);
          this.assertNotNull(aiResponse, 'AI回答が生成される');
          
          // 3. 下書き作成
          const draftId = GmailService.createReplyDraft(
            email,
            aiResponse.subject,
            aiResponse.body
          );
          this.assertNotNull(draftId, '下書きが作成される');
          
          // 4. ラベル追加
          GmailService.addLabelToThread(email.thread, GMAIL_CONFIG.RESULT_LABEL);
          
          // 5. 既読マーク
          GmailService.markAsRead(email.thread);
          
          this.assertTrue(true, 'メール処理フロー全体が正常に完了');
        }
        
      } catch (error) {
        this.assertTrue(false, `統合テストでエラー: ${error.message}`);
      }
    });

    // LabelProcessor.process 統合テスト
    testFramework.addTest('LabelProcessor.process - 統合テスト', function() {
      MockData.setupAllMocks();
      
      try {
        const processedCount = LabelProcessor.process();
        this.assertTrue(processedCount >= 0, '処理件数が0以上');
        this.assertTrue(Number.isInteger(processedCount), '処理件数が整数');
        
      } catch (error) {
        this.assertTrue(false, `LabelProcessor.processでエラー: ${error.message}`);
      }
    });

    // LabelProcessor.testSingleEmail 統合テスト
    testFramework.addTest('LabelProcessor.testSingleEmail - 統合テスト', function() {
      MockData.setupAllMocks();
      
      try {
        const result = LabelProcessor.testSingleEmail();
        this.assertTrue(result >= 0, 'テスト結果が0以上');
        this.assertTrue(Number.isInteger(result), 'テスト結果が整数');
        
      } catch (error) {
        this.assertTrue(false, `testSingleEmailでエラー: ${error.message}`);
      }
    });

    // 設定確認機能テスト
    testFramework.addTest('設定確認機能 - checkConfig', function() {
      MockData.setupAllMocks();
      
      try {
        // checkConfig関数が存在し、実行できることを確認
        if (typeof checkConfig === 'function') {
          checkConfig();
          this.assertTrue(true, 'checkConfig関数が正常に実行される');
        } else {
          this.assertTrue(false, 'checkConfig関数が存在しない');
        }
        
      } catch (error) {
        this.assertTrue(false, `checkConfigでエラー: ${error.message}`);
      }
    });

    // エラーハンドリング統合テスト
    testFramework.addTest('エラーハンドリング - Gmail API エラー', function() {
      // Gmail API エラーをシミュレート
      global.GmailApp = {
        search: function() {
          throw new Error('Gmail API エラー');
        }
      };
      
      try {
        GmailService.searchUnreadEmails();
        this.assertTrue(false, 'Gmail APIエラー時に例外が発生すべき');
      } catch (error) {
        this.assertTrue(true, 'Gmail APIエラーが適切にハンドリングされる');
      }
    });

    // エラーハンドリング統合テスト - OpenAI API エラー
    testFramework.addTest('エラーハンドリング - OpenAI API エラー', function() {
      MockData.setupPropertiesMock();
      
      // OpenAI API エラーをシミュレート
      global.UrlFetchApp = {
        fetch: function() {
          return {
            getResponseCode: () => 500,
            getContentText: () => 'Internal Server Error'
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
        this.assertTrue(false, 'OpenAI APIエラー時に例外が発生すべき');
      } catch (error) {
        this.assertTrue(true, 'OpenAI APIエラーが適切にハンドリングされる');
      }
    });

    // 大量メール処理テスト（制限確認）
    testFramework.addTest('大量メール処理 - 件数制限確認', function() {
      // 大量のメールを返すモック
      global.GmailApp = {
        search: function(query, start, max) {
          // MAX_EMAILS_PER_RUN の制限が適用されることを確認
          const mockEmails = [];
          const count = Math.min(max || COMMON_CONFIG.MAX_EMAILS_PER_RUN, 100);
          
          for (let i = 0; i < count; i++) {
            mockEmails.push(MockData.getMockEmail().thread);
          }
          return mockEmails;
        }
      };
      
      MockData.setupOpenAIMock();
      MockData.setupPropertiesMock();
      
      try {
        const processedCount = LabelProcessor.process();
        this.assertTrue(processedCount <= COMMON_CONFIG.MAX_EMAILS_PER_RUN, 
          `処理件数が制限値以下: ${processedCount} <= ${COMMON_CONFIG.MAX_EMAILS_PER_RUN}`);
        
      } catch (error) {
        this.assertTrue(false, `大量メール処理でエラー: ${error.message}`);
      }
    });

    // ラベル作成・管理テスト
    testFramework.addTest('ラベル作成・管理 - 統合テスト', function() {
      MockData.setupGmailMock();
      
      try {
        // 存在しないラベルの作成をテスト
        const newLabel = GmailService.getOrCreateLabel('新しいテストラベル');
        this.assertNotNull(newLabel, '新しいラベルが作成される');
        
        // 既存ラベルの取得をテスト
        const existingLabel = GmailService.getOrCreateLabel(GMAIL_CONFIG.RESULT_LABEL);
        this.assertNotNull(existingLabel, '既存ラベルが取得される');
        
      } catch (error) {
        this.assertTrue(false, `ラベル管理でエラー: ${error.message}`);
      }
    });
  }
}