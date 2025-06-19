// テスト用モックデータ
class MockData {
  
  // モックメールデータ
  static getMockEmail() {
    return {
      thread: {
        addLabel: function(label) { console.log(`ラベル追加: ${label.getName()}`); },
        removeLabel: function(label) { console.log(`ラベル削除: ${label.getName()}`); },
        markRead: function() { console.log('既読マーク'); }
      },
      message: {
        getId: () => 'mock-message-id-001',
        getSubject: () => 'テストメール件名',
        getFrom: () => 'test@example.com',
        getPlainBody: () => 'これはテスト用のメール本文です。\n質問があります。',
        getDate: () => new Date('2024-01-01T10:00:00Z'),
        createDraftReply: function(body, options) {
          console.log('下書き作成:', { body, options });
          return { getId: () => 'mock-draft-id-001' };
        }
      },
      id: 'mock-message-id-001',
      subject: 'テストメール件名',
      from: 'test@example.com',
      body: 'これはテスト用のメール本文です。\n質問があります。',
      date: new Date('2024-01-01T10:00:00Z')
    };
  }

  // 複数のモックメール
  static getMockEmails(count = 3) {
    const emails = [];
    for (let i = 1; i <= count; i++) {
      const email = this.getMockEmail();
      email.id = `mock-message-id-00${i}`;
      email.subject = `テストメール件名 ${i}`;
      email.body = `これはテスト用のメール本文です ${i}。\n質問があります。`;
      emails.push(email);
    }
    return emails;
  }

  // モックAI応答
  static getMockAIResponse() {
    return {
      subject: 'Re: テストメール件名',
      body: 'お問い合わせありがとうございます。\n\nご質問にお答えいたします。\n\n何かご不明な点がございましたら、お気軽にお聞かせください。\n\nよろしくお願いいたします。'
    };
  }

  // モックラベル
  static getMockLabel(name) {
    return {
      getName: () => name,
      addToThread: function(thread) { console.log(`スレッドにラベル追加: ${name}`); },
      removeFromThread: function(thread) { console.log(`スレッドからラベル削除: ${name}`); }
    };
  }

  // Gmail API モック設定
  static setupGmailMock() {
    // GmailApp のモック
    if (typeof GmailApp === 'undefined') {
      global.GmailApp = {
        search: function(query, start, max) {
          console.log(`Gmail検索: ${query} (start: ${start}, max: ${max})`);
          return MockData.getMockEmails(2).map(email => email.thread);
        },
        getUserLabelByName: function(name) {
          console.log(`ラベル取得: ${name}`);
          return MockData.getMockLabel(name);
        },
        createLabel: function(name) {
          console.log(`ラベル作成: ${name}`);
          return MockData.getMockLabel(name);
        },
        getUserLabels: function() {
          return [
            MockData.getMockLabel('ai処理不要'),
            MockData.getMockLabel('AI自動回答_Gmail')
          ];
        }
      };
    }
  }

  // OpenAI API モック設定
  static setupOpenAIMock() {
    // UrlFetchApp のモック
    if (typeof UrlFetchApp === 'undefined') {
      global.UrlFetchApp = {
        fetch: function(url, options) {
          console.log('OpenAI API呼び出し:', { url, options });
          
          // モック応答
          const mockResponse = {
            choices: [{
              message: {
                content: JSON.stringify(MockData.getMockAIResponse())
              }
            }]
          };
          
          return {
            getContentText: () => JSON.stringify(mockResponse),
            getResponseCode: () => 200
          };
        }
      };
    }
  }

  // PropertiesService モック設定
  static setupPropertiesMock() {
    if (typeof PropertiesService === 'undefined') {
      global.PropertiesService = {
        getScriptProperties: function() {
          return {
            getProperty: function(key) {
              console.log(`プロパティ取得: ${key}`);
              if (key === 'OPENAI_API_KEY') {
                return 'mock-api-key-for-testing';
              }
              return null;
            }
          };
        }
      };
    }
  }

  // 全モック設定
  static setupAllMocks() {
    this.setupGmailMock();
    this.setupOpenAIMock();
    this.setupPropertiesMock();
    console.log('モック設定完了');
  }
}